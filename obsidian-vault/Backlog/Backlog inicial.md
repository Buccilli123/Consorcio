---
tipo: backlog
estado: inicial
tags: [backlog, roadmap]
---
# Backlog inicial

Orden provisional; reordenar tras auditoría del repo y validación de requisitos.

## P0 — Fundaciones
- [x] Auditar repo y documentar arquitectura real (2026-10-25: repo vacío; kit incorporado).
- [x] Definir actores, roles y aislamiento multi-tenant ([[Roles y permisos]], [[ADR-003 Aislamiento multi-tenant]]).
- [x] Establecer tests, lint, typecheck y build (`npm run check`).
- [x] Definir criterios de aceptación del MVP ([[Criterios de aceptación MVP]], en borrador).
- [x] Configurar QA base y entorno local seguro (bases `consorcio_dev` y `consorcio_test` creadas; `npm run check` en verde).

- [x] Roles de PostgreSQL con mínimo privilegio ([[ADR-005 Roles de base de datos]]).

## P1 — Flujos esenciales
- [ ] Autenticación ([[ADR-004 Autenticación propia]]). La autorización base ya está hecha (DAL + matriz).
- [ ] Consorcios, unidades y membresías (el esquema ya existe).
- [ ] Avisos.
- [ ] Reclamos con historial.
- [ ] Reservas con control de conflictos.
- [ ] Documentos privados.
- [ ] Expensas/pagos con reglas verificables.

## P2 — Preparación operativa
- [ ] Auditoría de eventos críticos.
- [ ] Backups y restauración probada.
- [ ] Observabilidad y alertas.
- [ ] Relevar servidor propio y definir despliegue.
- [ ] Revisión de seguridad previa a producción.

Enlaces: [[Plan QA]], [[Visión y MVP]], [[Infraestructura pendiente]]
