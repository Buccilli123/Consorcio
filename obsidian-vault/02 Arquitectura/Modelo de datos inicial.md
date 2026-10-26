---
tipo: arquitectura
estado: vigente-parcial
tags: [datos, postgres, prisma]
---
# Modelo de datos inicial

La fuente de verdad es `prisma/schema.prisma` y sus migraciones. Esta nota explica el porqué; no copia el esquema.

## Implementado (migración `init_identidad_y_tenancy`)
| Entidad | Rol | Reglas clave |
|---|---|---|
| `User` | Persona con cuenta | Email único en minúsculas (CHECK). Solo se guarda el hash de la contraseña |
| `Session` | Sesión de login | Se guarda el SHA-256 del token, nunca el token. Tiene vencimiento y revocación |
| `Consortium` | Tenant | Nombre no vacío. No se borra si tiene unidades ni membresías (Restrict) |
| `Unit` | Unidad funcional | `code` único por consorcio. `coefficient` es un porcentaje fiscal en `Decimal(7,4)`, con 0 < x ≤ 100 |
| `Membership` | Usuario ↔ consorcio + rol | Un rol una sola vez por consorcio; se admiten varios roles. Estado ACTIVE o SUSPENDED |
| `UnitAssignment` | Membresía OWNER/TENANT ↔ unidad | FKs compuestas `(consortiumId, …)`: no se puede cruzar de consorcio |
| `AuditEvent` | Registro de acciones | Solo inserción: un trigger rechaza UPDATE y DELETE |

IDs: UUID v7, ordenables por tiempo. Fechas: `timestamptz(3)`.
Aislamiento: ver [[ADR-003 Aislamiento multi-tenant]].

## Planificado (según el módulo de la Etapa 3)
- **Avisos:** `Notice`, con `consortiumId`.
- **Reclamos:** `Claim` y un historial de solo inserción (`ClaimEvent`: cambios de estado, comentarios y asignaciones), con estados y transiciones explícitas.
- **Reservas:** `CommonSpace` y `Booking`. Para que no haya solapamientos se propone una restricción `EXCLUDE USING gist` sobre `(spaceId, tstzrange)` para las reservas activas.
- **Documentos:** `Document` con metadatos y visibilidad. El binario se guarda fuera de la base; el almacenamiento está por definir.
- **Expensas** (decidido: porcentaje + gastos particulares):
  - `ExpensePeriod` (mes y estado: borrador, cerrado).
  - `ExpenseItem` con tipo `COMMON`, que se prorratea por `coefficient`, o `PARTICULAR`, que se asigna a unidades específicas.
  - `UnitCharge`: el cargo calculado por unidad y período, que no cambia después del cierre.
  - `Payment`: registro manual, sin integración de pagos.
  - Dinero en `Decimal(14,2)` y ARS. Al cerrar un período, la suma de los coeficientes debe dar 100.

## Reglas de diseño
- Toda entidad de un consorcio lleva `consortiumId` y FKs compuestas hacia sus pares.
- Dinero en decimal exacto, nunca en float.
- Estados y transiciones explícitos. Los historiales y la auditoría son de solo inserción.
- Las reglas que Prisma no expresa (CHECK, trigger, EXCLUDE) van en el SQL de la migración y se testean (ver § Migraciones).

## Migraciones
Esta sección es la referencia única para trabajar con migraciones. El porqué de cada regla está en los ADR enlazados.
1. **Crear:** `npx prisma migrate dev --name <nombre> --create-only`. Se revisa el SQL y se agrega a mano lo que Prisma no expresa (CHECK, triggers, EXCLUDE). Después se aplica con `npm run db:migrate`, que también corre `prisma generate`: Prisma 7 no regenera el cliente al migrar ([[ADR-001 Stack base y versiones]]).
2. **Roles:** la CLI usa `MIGRATE_DATABASE_URL` (`consorcio_migrator`) y `SHADOW_DATABASE_URL` (`consorcio_shadow`); la app, `DATABASE_URL` (`consorcio_app`). Prisma 7 no lee `.env` solo: lo carga `prisma.config.ts` ([[ADR-005 Roles de base de datos]]).
3. **Permisos:** las tablas nuevas le dan DML a la app por privilegios por defecto. Si una tabla necesita permisos distintos, se ajusta `scripts/db/02-schema-grants.sql`. En una base nueva, ese script se vuelve a correr después de la primera migración.
4. **Prohibido sin autorización explícita:** `migrate reset`, `db push --force-reset` y `db push --accept-data-loss`. Prisma 7.9+ los bloquea cuando los ejecuta un agente: nunca se fabrica ni se reutiliza un consentimiento.
5. **Tests:** el `globalSetup` aplica `migrate deploy` a `consorcio_test` con `TEST_MIGRATE_DATABASE_URL`, y solo acepta bases terminadas en `_test` ([[ADR-002 Entornos y secretos]]).
6. **Verificar:** `npm run db:status`. Si `migrate dev --create-only` no detecta desvíos, genera una migración vacía; se borra si nunca se aplicó.

Enlaces: [[Roles y permisos]], [[Arquitectura objetivo]], [[Seguridad y privacidad]], [[Criterios de aceptación MVP]]
