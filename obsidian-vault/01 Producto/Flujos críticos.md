---
tipo: producto
estado: por-validar
tags: [producto, flujos]
---
# Flujos críticos

## Reclamos
Crear → asignar/gestionar → cambiar estado → comentar → cerrar, manteniendo historial y permisos.

## Reservas
Consultar disponibilidad → solicitar reserva → validar reglas y conflictos → confirmar/cancelar. Considerar concurrencia y zona horaria si aplica.

## Documentos
Subir/registrar → validar tipo/tamaño → almacenar de forma privada → autorizar descarga → registrar acciones relevantes.

## Expensas y pagos
Consultar período y unidad → mostrar conceptos y saldo → registrar pago según reglas aprobadas → emitir comprobante si corresponde. No asumir integración bancaria.

Cada flujo necesita criterios de aceptación, pruebas negativas y trazabilidad. Enlaces: [[Plan QA]], [[Modelo de datos inicial]]
