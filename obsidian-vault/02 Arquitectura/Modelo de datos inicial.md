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
- Las reglas que Prisma no expresa (CHECK, trigger, EXCLUDE) van en el SQL de la migración y se testean.
- Migraciones revisadas (`--create-only`) y nunca un reset sin autorización.

Enlaces: [[Roles y permisos]], [[Arquitectura objetivo]], [[Seguridad y privacidad]], [[Criterios de aceptación MVP]]
