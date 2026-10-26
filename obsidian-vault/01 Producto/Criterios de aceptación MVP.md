---
tipo: producto
estado: borrador
tags: [producto, qa, mvp]
---
# Criterios de aceptación del MVP

Cada módulo se da por terminado solo si se cumplen sus criterios y los generales, con tests que pasan en `npm run check` ([[Plan QA]]). El orden sigue el [[Backlog inicial]].

## Generales (aplican a todos los módulos)
- G1. Sin sesión → 401. Miembro sin permiso → 403. Recurso de otro consorcio → 404 (test negativo obligatorio).
- G2. Las entradas se validan en el servidor con Zod, con mensajes claros en español.
- G3. Las escrituras críticas son transaccionales y las acciones sensibles generan un `AuditEvent`.
- G4. Se puede usar en un celular de 360 px de ancho.
- G5. Ni los logs ni las respuestas exponen contraseñas, tokens ni datos de otros consorcios.

## 1. Autenticación ([[ADR-004 Autenticación propia]])
- Login con email y contraseña. El email no distingue mayúsculas.
- Ante un error responde "credenciales inválidas", sin revelar si el email existe.
- Se limitan los intentos fallidos por email y por IP.
- Logout revoca la sesión en la base. Una sesión vencida o revocada da 401.
- Contraseña de 10 caracteres como mínimo. Al cambiarla se revocan las demás sesiones.

## 2. Consorcios, unidades y membresías
- Un usuario crea un consorcio y queda como ADMIN.
- El ADMIN da de alta unidades con código único y coeficiente válido (0 < x ≤ 100).
- Se ve un aviso si la suma de los coeficientes no da 100 (es bloqueante recién al cerrar expensas).
- El ADMIN invita o da de alta miembros con su rol y asigna unidades a OWNER y TENANT.
- Suspender una membresía corta el acceso al instante.

## 3. Avisos
- El ADMIN publica; todos los miembros activos leen solo los de su consorcio.

## 4. Reclamos
- OWNER y TENANT crean reclamos asociados a su unidad y ven solo los suyos.
- El ADMIN asigna al STAFF y cambia el estado siguiendo transiciones válidas (abierto → en curso → resuelto → cerrado, o reabierto).
- Los miembros con acceso al reclamo pueden comentarlo. Se cierra al final del flujo.
- Cada cambio (estado, asignación, comentario) queda en un historial que no se puede modificar, con autor y fecha.

## 5. Reservas
- Flujo: consultar disponibilidad → solicitar → validar reglas y conflictos → confirmar o cancelar.
- No hay dos reservas activas solapadas en el mismo espacio, **ni siquiera con solicitudes simultáneas** (lo garantiza la base y lo verifica un test concurrente).
- Zona horaria: America/Argentina/Buenos_Aires.

## 6. Documentos
- Se validan el tipo y el tamaño. El archivo se guarda en almacenamiento privado y la descarga se autoriza en el servidor.
- Las subidas, descargas y eliminaciones quedan en la auditoría.

## 7. Expensas
- Cargos = gastos comunes × coeficiente + gastos particulares de cada unidad.
- El redondeo a centavos se documenta, y la suma de los cargos coincide exactamente con el total del período.
- Un período cerrado no se modifica: las correcciones se hacen con ajustes en un período posterior.
- Flujo: consultar período y unidad → ver conceptos y saldo → registrar el pago según las reglas aprobadas → emitir el comprobante si corresponde.
- Los pagos se registran a mano, sin asumir integración bancaria ni proveedores de pago. El saldo de una unidad = cargos − pagos, auditable.
- **Autorización** (tests obligatorios del módulo):
  - OWNER y TENANT ven importes, vencimientos y estado de pago solo de las unidades asignadas a su membresía.
  - Pedir otra unidad del mismo consorcio → 404. Pedir una unidad de otro consorcio → 404.
  - OWNER y TENANT no pueden crear, editar ni cerrar períodos, ni registrar pagos → 403.
  - Si la membresía está suspendida, no hay acceso. Si se quita la asignación de la unidad, se deja de ver.
  - El ADMIN gestiona solo en los consorcios donde tiene una membresía activa.

## Abierto
- Reglas de cada reserva (anticipación, duración máxima, cupos): se definen con el módulo.
- Política de redondeo de las expensas: propuesta en el módulo 7, a validar.

Enlaces: [[Visión y MVP]], [[Modelo de datos inicial]], [[Roles y permisos]], [[Interfaz y UX]]
