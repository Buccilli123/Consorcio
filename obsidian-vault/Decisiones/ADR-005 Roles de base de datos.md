---
tipo: adr
estado: aceptada
fecha: 2026-10-25
tags: [adr, seguridad, postgres]
---
# ADR-005 — Roles de base de datos con mínimo privilegio

> **Resumen.** La app nunca usa `postgres`.
> - **`consorcio_app`** (app y tests): solo `SELECT/INSERT/UPDATE/DELETE`, sin DDL ni `TRUNCATE`.
> - **`consorcio_migrator`** (Prisma CLI): dueño del esquema en dev y test, y de `consorcio_shadow`.
> - **Aislamiento:** `pg_hba.conf` limita cada rol a sus bases (rechaza `postgres` y `planificador`).
> - **Scripts sin contraseñas:** `scripts/db/01-roles.sql` y `02-schema-grants.sql`.
> - **Variables:** `DATABASE_URL`, `MIGRATE_DATABASE_URL`, `SHADOW_DATABASE_URL`, `TEST_DATABASE_URL` y `TEST_MIGRATE_DATABASE_URL`.

## Contexto
La app se conectaba como `postgres`, que es superusuario. En el mismo servidor hay otra base ajena al proyecto (`planificador`) que no se debe tocar.

## Decisión
Se separan dos roles, sin superusuario, `CREATEDB`, `CREATEROLE`, replicación ni `BYPASSRLS`:

| Rol | Uso | Permisos |
|---|---|---|
| `consorcio_migrator` | Prisma CLI (`migrate dev/deploy`) | Dueño del esquema `public` y de sus objetos en `consorcio_dev` y `consorcio_test`. Dueño de `consorcio_shadow`, la base auxiliar de `migrate dev` |
| `consorcio_app` | Aplicación y tests | `CONNECT` a dev y test, `USAGE` en el esquema, `SELECT/INSERT/UPDATE/DELETE` en tablas. **Sin** DDL, `TRUNCATE`, `REFERENCES`, `TRIGGER` ni acceso a `_prisma_migrations` |

- **Bases:** se quitó `CONNECT/TEMPORARY` a `PUBLIC` en las tres bases del proyecto.
- **`pg_hba.conf`:** un bloque "Proyecto Consorcio", antes de las reglas generales, deja entrar a cada rol solo a sus bases y **rechaza cualquier otra** (incluidas `postgres` y `planificador`). No modifica las reglas existentes ni el acceso de `postgres`. Se guardó un respaldo como `pg_hba.conf.bak-consorcio`.
- **Scripts versionados, sin contraseñas:** `scripts/db/01-roles.sql` (roles, base shadow y CONNECT) y `scripts/db/02-schema-grants.sql` (dueño y permisos en cada base; hay que volver a correrlo después de la primera migración en una base nueva).
- **Contraseñas:** son aleatorias, de 192 bits. Se aplicaron por stdin de `psql`, así que no aparecen en argumentos, consola ni archivos versionados, y solo viven en `.env`. El servidor tiene `log_statement = none`.
- **Variables:** `DATABASE_URL` (app), `MIGRATE_DATABASE_URL` y `SHADOW_DATABASE_URL` (migrador), `TEST_DATABASE_URL` y `TEST_MIGRATE_DATABASE_URL`. Ver `.env.example`.

## Por qué
- Si se compromete la app, no se pueden alterar el esquema, desactivar el trigger de auditoría (hace falta ser dueño) ni vaciar tablas con `TRUNCATE`, que esquivaría ese trigger. Esto resuelve el hallazgo "TRUNCATE evita la auditoría" para el rol de la app.
- Los tests de integración corren con `consorcio_app`, así que prueban los mismos permisos que tendrá producción. La limpieza entre tests usa el migrador.

## Consecuencias
- Las migraciones nuevas crean tablas cuyo dueño es el migrador, y los privilegios por defecto le dan DML a la app. Si hiciera falta un permiso distinto (por ejemplo, solo `INSERT`), se ajusta en `02-schema-grants.sql`.
- El migrador puede borrar objetos de su esquema, así que en producción se usa solo durante el despliegue.
- Producción va a tener sus propios roles y contraseñas, que se definen en la etapa de infraestructura ([[Infraestructura pendiente]]).

## Evidencia (2026-10-25)
- Matriz de conexiones verificada:
  - `consorcio_app` entra a dev y test, y se le rechaza shadow, `postgres` y `planificador`.
  - `consorcio_migrator` entra a dev, test y shadow, y se le rechaza `postgres` y `planificador`.
  - `postgres` sigue entrando a todas.
- `tests/integration/db-roles.test.ts` verifica que el rol de la app no es superusuario, no puede hacer `CREATE TABLE`, `TRUNCATE` ni `ALTER TABLE ... DISABLE TRIGGER`, y no puede leer `_prisma_migrations`.
- `prisma migrate status` y `migrate dev --create-only` corren con el migrador. El resultado fue una migración vacía (sin desvíos), que se borró.

Enlaces: [[ADR-002 Entornos y secretos]], [[ADR-003 Aislamiento multi-tenant]], [[Seguridad y privacidad]]
