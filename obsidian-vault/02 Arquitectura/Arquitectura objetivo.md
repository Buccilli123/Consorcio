---
tipo: arquitectura
estado: inicial
tags: [arquitectura, stack]
---
# Arquitectura objetivo

## Stack vigente
Ver [[ADR-001 Stack base y versiones]]: Next.js 16, React 19, TypeScript, Tailwind 4, PostgreSQL 17 (nativo en desarrollo), Prisma 7 con adapter `pg` y Zod.

## Estructura del código
- `src/app/`: rutas y UI (App Router).
- `src/lib/`: utilidades del servidor (`env.ts` valida el entorno, `db.ts` crea el cliente Prisma).
- `prisma/`: esquema y migraciones.
- `src/server/`: DAL `server-only`. `tenancy.ts` (contexto y permisos por consorcio), `authz/permissions.ts` (matriz de roles), `errors.ts` (401/403/404).
- `tests/integration/`: tests contra PostgreSQL real.
- Las reglas de negocio irán en módulos de dominio separados de la UI; se definen en la Etapa 2.

## Límites
- UI no sustituye autorización de servidor.
- Separar presentación, lógica de negocio, persistencia e integraciones.
- Validar entradas en límites de confianza.
- Usar transacciones para operaciones críticas.
- Mantener contratos API documentados y probados.

## No decidido aún
- Sistema operativo del servidor.
- CPU, RAM, disco y topología.
- Proxy, TLS, despliegue y estrategia final de backups.
- Proveedor de correo/notificaciones.
Estas decisiones se toman al final, luego de conocer requisitos operativos y cargas.

Enlaces: [[Modelo de datos inicial]], [[Decisiones arquitectónicas]], [[Infraestructura pendiente]]
