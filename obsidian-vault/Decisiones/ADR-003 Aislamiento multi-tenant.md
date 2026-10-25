---
tipo: adr
estado: aceptada
fecha: 2026-10-25
tags: [adr, seguridad, multi-tenant, datos]
---
# ADR-003 — Aislamiento multi-tenant

## Contexto
Una misma instancia atiende varios consorcios. Un administrador puede gestionar varios y un usuario puede tener roles distintos en cada uno. Que se filtren datos entre consorcios es el riesgo más grave del producto.

## Decisión
Se usan **un esquema compartido y una columna `consortiumId`**, con tres capas de defensa:

1. **Base de datos:** las tablas hijas de un consorcio se relacionan con FKs compuestas `(consortiumId, id)`. PostgreSQL rechaza, por ejemplo, asignar la unidad de un consorcio a la membresía de otro, aunque falle el código.
2. **DAL (`src/server/`, `server-only`):** toda operación sobre datos de un consorcio recibe un `TenantContext` resuelto en el servidor (`resolveTenantContext`) a partir de las membresías **activas** del usuario autenticado, y filtra por `consortiumId`. El `consortiumId` que llega del cliente es solo una solicitud: se valida contra las membresías.
3. **Permisos:** `assertCan(ctx, permiso)` aplica la matriz de [[Roles y permisos]]. Las reglas que dependen del recurso (si es su unidad, si el reclamo le fue asignado) se suman en cada módulo.

## Respuestas
- Sin sesión → **401**.
- Miembro del consorcio sin el permiso necesario → **403**.
- Consorcio o recurso ajeno o inexistente → **404**, con el mismo mensaje en los dos casos, para no revelar qué existe.

## Alternativas
- **Una base o un esquema por consorcio:** aísla más, pero complica las migraciones, los backups y el administrador con varios consorcios. Se descartó para el MVP.
- **Row-Level Security de PostgreSQL:** es una capa extra valiosa, pero con Prisma exige fijar `set_config` en cada transacción. Queda **propuesta para evaluar** antes de producción ([[Seguridad y privacidad]]).

## Consecuencias
- Cada módulo nuevo tiene que tener `consortiumId`, FKs compuestas hacia sus pares y tests negativos de acceso cruzado ([[Plan QA]]).
- Hay reglas que la base no puede verificar y quedan en la aplicación. Por ejemplo, que una `UnitAssignment` solo use membresías OWNER o TENANT.

## Evidencia
- `tests/integration/tenancy.test.ts`: acceso a un consorcio ajeno, membresía suspendida, consorcio inexistente y roles que no se trasladan de un consorcio a otro.
- `tests/integration/schema-constraints.test.ts`: las FKs compuestas.

Enlaces: [[Modelo de datos inicial]], [[Roles y permisos]], [[ADR-002 Entornos y secretos]]
