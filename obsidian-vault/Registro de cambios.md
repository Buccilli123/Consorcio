---
tipo: registro
tags: [cambios, decisiones]
---
# Registro de cambios

Mantener entradas breves y con fecha. Registrar solo cambios de requisitos, decisiones, contratos, riesgos o procedimientos; no cada edición de código.

## 2026-10-25 — Etapa 1: fundaciones
- Cambio: se incorporó el kit al repo, se renombró la skill `security-review` a `consorcio-security` (chocaba con el comando de Claude Code) y se armó el esqueleto de Next.js 16 + Prisma 7 + Vitest con `npm run check`.
- Motivo/evidencia: [[ADR-001 Stack base y versiones]], [[ADR-002 Entornos y secretos]].
- Notas actualizadas: [[00 Inicio]], [[Decisiones arquitectónicas]], [[Arquitectura objetivo]], [[Plan QA]], [[Backlog inicial]].
- Tests/validación: pasan `db:validate`, lint, typecheck, los tests unitarios (7/7) y el build. Los tests de integración fallan por autenticación de PostgreSQL (`28P01`).
- Actualización: con acceso a PostgreSQL 17.9 se crearon `consorcio_dev` y `consorcio_test` (UTF8). La base preexistente `planificador` no se tocó. `npm run check` completo: exit 0 (7 unitarios + 2 de integración + build).
- Pendiente: las decisiones de la Etapa 2.

## 2026-10-25 — Etapa 2: diseño funcional
- Cambio: decisiones de producto (login con email y contraseña; roles ADMIN, OWNER, TENANT y STAFF; administrador con varios consorcios; expensas por porcentaje + gastos particulares). Migración `init_identidad_y_tenancy` aplicada en dev y test. DAL de tenancy y matriz de permisos.
- Motivo/evidencia: [[ADR-003 Aislamiento multi-tenant]], [[ADR-004 Autenticación propia]] (propuesta).
- Notas actualizadas: [[Modelo de datos inicial]], [[Roles y permisos]], [[Criterios de aceptación MVP]] (nueva), [[Plan QA]], [[Arquitectura objetivo]], [[Backlog inicial]], [[00 Inicio]].
- Tests/validación: `npm run check` exit 0. 28 unitarios + 20 de integración + build.
- Pendiente: si el inquilino ve las expensas; aprobar [[ADR-004 Autenticación propia]].

## 2026-10-25 — Cierre de decisiones de las Etapas 1 y 2
- Cambio:
  - El inquilino ve las expensas de su unidad (permiso `expense.read.own`).
  - [[ADR-004 Autenticación propia]] aceptado con el diseño final: scrypt con `maxmem` y límite de concurrencia, sesiones con expiración deslizante y absoluta, chequeo de Origin en Route Handlers y rate limiting.
  - La app usa el rol `consorcio_app` y las migraciones, `consorcio_migrator`.
  - Reglas en `pg_hba` que aíslan esos roles.
- Motivo/evidencia: [[ADR-005 Roles de base de datos]], medición de scrypt (N=2^17: ~241 ms y 128 MiB; con el `maxmem` por defecto, Node lo rechaza).
- Notas actualizadas: [[Roles y permisos]], [[Criterios de aceptación MVP]], [[Plan QA]], [[Decisiones arquitectónicas]], [[Backlog inicial]], [[00 Inicio]].
- Tests/validación: ver el informe del primer commit (`npm run check`).
- Pendiente: implementar el módulo de autenticación (Etapa 3).

## 2026-10-25 — Protocolo de consulta de la documentación
- Cambio: `CLAUDE.md` exige consultar [[00 Inicio]] → "Rutas por tarea" y leer solo esas notas. `PROMPT_MAESTRO` pasa a ser histórico. Nueva nota [[Interfaz y UX]]; [[Flujos críticos]] queda unificada en [[Criterios de aceptación MVP]]; las reglas de migraciones están en [[Modelo de datos inicial]]; riesgos abiertos en [[Seguridad y privacidad]].
- Validación: enlaces verificados; no se tocó código.

## Plantilla
### AAAA-MM-DD — Tema
- Cambio:
- Motivo/evidencia:
- Notas actualizadas:
- Tests/validación:
- Pendiente:
