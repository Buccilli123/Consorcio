---
tipo: producto
estado: vigente-parcial
tags: [producto, seguridad, permisos]
---
# Roles y permisos

Decidido (2026-10-25): el MVP tiene cuatro roles **por consorcio**. Un usuario puede pertenecer a varios consorcios y tener varios roles en cada uno; un administrador puede gestionar varios consorcios con la misma cuenta.

La matriz vive en el código (`src/server/authz/permissions.ts`) y la cubren tests unitarios. Esta tabla la resume:

| Permiso | ADMIN | OWNER | TENANT | STAFF |
|---|:-:|:-:|:-:|:-:|
| Ver consorcio y avisos | ✅ | ✅ | ✅ | ✅ |
| Gestionar consorcio, unidades y miembros | ✅ | | | |
| Publicar avisos | ✅ | | | |
| Crear reclamos / ver los propios | ✅ | ✅ | ✅ | |
| Ver y actualizar reclamos asignados | ✅ | | | ✅ |
| Ver y gestionar todos los reclamos | ✅ | | | |
| Crear reservas | ✅ | ✅ | ✅ | |
| Gestionar reservas | ✅ | | | |
| Ver documentos | ✅ | ✅ | ✅ | |
| Gestionar documentos | ✅ | | | |
| Ver las expensas de su unidad | ✅ | ✅ | ✅ | |
| Gestionar expensas y pagos | ✅ | | | |
| Ver la auditoría | ✅ | | | |

**Decisión 2026-10-25 sobre expensas:**
- El **inquilino** puede consultar las expensas de **su unidad**: importes, vencimientos y estado de pago.
- El **propietario** puede consultar las de **sus unidades**.
- Ninguno de los dos ve información de otras unidades ni hace acciones administrativas.
- El **administrador** gestiona las expensas de los consorcios donde tiene una membresía **activa**.
- "Su unidad" = las unidades vinculadas a su membresía por `UnitAssignment`. Lo verifica el módulo de expensas, con tests de autorización (ver [[Criterios de aceptación MVP]]).

## No incluido en el MVP
- Administrador de la plataforma (superadmin). Por ahora, quien crea un consorcio pasa a ser su ADMIN.
- Permisos personalizados por usuario.

## Reglas
- No se infiere ningún permiso por ocultar un botón: se autoriza en el servidor ([[ADR-003 Aislamiento multi-tenant]]).
- Toda consulta se limita al consorcio autorizado y se verifica con tests negativos.
- Las membresías suspendidas no dan acceso.
- Se auditan los cambios sensibles y los accesos administrativos.

Enlaces: [[Seguridad y privacidad]], [[Modelo de datos inicial]], [[Plan QA]], [[Criterios de aceptación MVP]]
