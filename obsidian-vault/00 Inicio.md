---
tipo: indice
estado: vigente
tags: [proyecto, indice]
---
# Inicio — Plataforma de consorcios

## Propósito
Memoria técnica compacta para producto, arquitectura, QA y decisiones. Leer esta nota primero y luego solo las notas vinculadas a la tarea.

## Mapa
- Producto: [[Visión y MVP]], [[Roles y permisos]], [[Flujos críticos]], [[Criterios de aceptación MVP]]
- Arquitectura: [[Arquitectura objetivo]], [[Modelo de datos inicial]], [[Decisiones arquitectónicas]]
- ADRs: [[ADR-001 Stack base y versiones]], [[ADR-002 Entornos y secretos]], [[ADR-003 Aislamiento multi-tenant]], [[ADR-004 Autenticación propia]], [[ADR-005 Roles de base de datos]]
- Calidad: [[Plan QA]], [[Seguridad y privacidad]], [[Estrategia de API testing]]
- Operación: [[Infraestructura pendiente]], [[Observabilidad y backups]]
- Investigación: [[Competencia y diferenciación]]
- Trabajo: [[Backlog inicial]], [[Registro de cambios]]

## Reglas rápidas
- No usar Supabase ni Render/hosting gratuito.
- Existe servidor propio, pero infraestructura final se decide en última etapa.
- Stack vigente: Next.js 16 + React 19 + TypeScript + PostgreSQL 17 + Prisma 7 ([[ADR-001 Stack base y versiones]]).
- Verificación integral: `npm run check`.
- Proteger datos por consorcio y aplicar autorización en servidor.
- No marcar como verificado lo que no se probó.
- Consultar [[Decisiones arquitectónicas]] antes de cambiar una decisión vigente.

## Protocolo para Claude
1. Buscar por tema.
2. Leer esta nota y solo notas relevantes.
3. Confirmar hechos contra código/tests.
4. Actualizar notas afectadas, no reescribir toda la bóveda.
