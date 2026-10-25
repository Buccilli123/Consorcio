---
tipo: adr
estado: aceptada
fecha: 2026-10-25
tags: [adr, arquitectura, stack]
---
# ADR-001 — Stack base y versiones

## Contexto
El repositorio estaba vacío. La documentación proponía Next.js/React/TypeScript + PostgreSQL + Prisma "a validar". Hay PostgreSQL 17 instalado localmente.

## Decisión
- **Next.js 16.4.3** (App Router, `src/`, alias `@/*`), **React 19.3**, **TypeScript 5** en modo `strict`.
- **Tailwind CSS 4** para estilos: rápido para UI móvil, sin componentes pesados.
- **Prisma 7.10.1** (última estable) con el adapter `@prisma/adapter-pg` + `pg`. El cliente se genera en `src/generated/prisma` (no versionado).
- **PostgreSQL 17** local para desarrollo y tests.
- **Zod 4** para validar entradas y variables de entorno en el servidor.
- **Node.js ≥ 24** (`engines` en `package.json`).
- Fuentes del sistema en lugar de `next/font/google`: el build no depende de servicios externos.

## Alternativas descartadas
- Prisma 8: en npm, el tag `latest` apunta a una release candidate (`8.0.0-rc.27`). No se usan RC.
- Supabase, Render o hosting gratuito: prohibidos por restricción del proyecto.
- Docker para la base: no está instalado y PostgreSQL nativo ya existe. Se puede reconsiderar en [[Infraestructura pendiente]].

## Consecuencias
- Next 16 tiene APIs nuevas: antes de escribir código hay que leer `node_modules/next/dist/docs/` (lo indica `AGENTS.md`).
- `cacheComponents` y `partialPrefetching` vienen activados: los datos son dinámicos por defecto.
- Prisma 7 no lee `.env` solo: lo carga `prisma.config.ts` con `dotenv`.
- Prisma 7.9+ bloquea `migrate reset` y `db push --accept-data-loss` cuando los ejecuta un agente sin consentimiento explícito.

## Evidencia
Al crear el ADR pasaron `db:validate`, lint, typecheck, los tests unitarios y el build. Ver [[Registro de cambios]].

Enlaces: [[Decisiones arquitectónicas]], [[Arquitectura objetivo]], [[ADR-002 Entornos y secretos]]
