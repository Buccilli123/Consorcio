---
tipo: indice
estado: vigente
tags: [proyecto, indice]
---
# Inicio — Plataforma de consorcios

Memoria técnica del proyecto. El código, los tests y las migraciones son la fuente de verdad ejecutable; los ADR aceptados, las decisiones vigentes.
Stack: Next.js 16, React 19, TypeScript, Tailwind 4, PostgreSQL 17 y Prisma 7 ([[ADR-001 Stack base y versiones]]). Verificación: `npm run check`.

## Rutas por tarea
Abrir solo las notas de la fila que corresponde. Si la tarea cruza dos filas, se suman.

| Tarea | Notas que abrir |
|---|---|
| Autenticación / sesiones | [[ADR-004 Autenticación propia]], [[ADR-003 Aislamiento multi-tenant]], [[Roles y permisos]], [[Seguridad y privacidad]] |
| Base de datos / migraciones | [[Modelo de datos inicial]] (§ Migraciones), [[ADR-003 Aislamiento multi-tenant]], [[ADR-005 Roles de base de datos]] |
| Permisos / módulo del MVP | [[Roles y permisos]], [[Criterios de aceptación MVP]] (sección del módulo), [[ADR-003 Aislamiento multi-tenant]] |
| Interfaz | [[Interfaz y UX]], [[Criterios de aceptación MVP]] (G4 y el módulo) |
| QA / tests | [[Plan QA]]; para APIs, también [[Estrategia de API testing]] |
| Seguridad | [[Seguridad y privacidad]] y, solo según el caso: acceso cruzado o RLS → [[ADR-003 Aislamiento multi-tenant]]; sesiones, CSRF o rate limiting → [[ADR-004 Autenticación propia]]; privilegios de la base o rol migrador → [[ADR-005 Roles de base de datos]]; secretos o logs → [[ADR-002 Entornos y secretos]]; auditoría → [[Modelo de datos inicial]] (§ Implementado) |
| Entornos / secretos | [[ADR-002 Entornos y secretos]], [[ADR-005 Roles de base de datos]] |
| Infraestructura / despliegue | [[Infraestructura pendiente]], [[Observabilidad y backups]], [[ADR-005 Roles de base de datos]] |
| Prioridades / qué sigue | [[Backlog inicial]] |
| Producto / alcance | [[Visión y MVP]], [[Criterios de aceptación MVP]] |
| Competencia | [[Competencia y diferenciación]] |
| Cambiar una decisión vigente | [[Decisiones arquitectónicas]] (índice con resúmenes) → el ADR afectado |

No se leen por defecto: [[Registro de cambios]] (solo si hace falta el historial), `PROMPT_MAESTRO_CLAUDE.md` (brief histórico) y `obsidian-vault/README.md` (referencia para abrir la bóveda en Obsidian).

## Mapa completo
- Producto: [[Visión y MVP]], [[Roles y permisos]], [[Criterios de aceptación MVP]], [[Interfaz y UX]], [[Flujos críticos]] (referencia)
- Arquitectura: [[Arquitectura objetivo]], [[Modelo de datos inicial]], [[Decisiones arquitectónicas]]
- Calidad: [[Plan QA]], [[Seguridad y privacidad]], [[Estrategia de API testing]]
- Operación: [[Infraestructura pendiente]], [[Observabilidad y backups]]
- Investigación: [[Competencia y diferenciación]]
- Trabajo: [[Backlog inicial]], [[Registro de cambios]]
