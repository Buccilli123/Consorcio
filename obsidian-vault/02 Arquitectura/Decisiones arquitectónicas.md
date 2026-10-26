---
tipo: decision-log
estado: vigente
tags: [adr, arquitectura]
---
# Decisiones arquitectónicas

Índice de los ADR (archivos en `Decisiones/`). Leer el resumen y abrir solo el ADR que afecta la tarea. Estados posibles: propuesta, aceptada o reemplazada. Las restricciones generales del proyecto están en `CLAUDE.md` y en [[Infraestructura pendiente]].

| ADR | Estado | Resumen |
|---|---|---|
| [[ADR-001 Stack base y versiones]] | aceptada | Next 16, React 19, TS estricto, Tailwind 4, Prisma 7.10 estable (no la RC 8) con adapter `pg`, PostgreSQL 17 nativo, Zod 4, Node ≥ 24, fuentes del sistema |
| [[ADR-002 Entornos y secretos]] | aceptada | `.env` local sin versionar, solo `.env.example` con valores ficticios; base de tests obligatoriamente `_test`; errores de entorno sin valores |
| [[ADR-003 Aislamiento multi-tenant]] | aceptada | Esquema compartido con `consortiumId`; FKs compuestas, DAL con `TenantContext` y matriz de permisos; 401/403/404 (lo ajeno es 404); RLS por evaluar |
| [[ADR-004 Autenticación propia]] | aceptada (diseño; se implementa en la Etapa 3) | scrypt N=2^17 con `maxmem` y máx. 2 hashes simultáneos; sesiones en la base (SHA-256), 7 días deslizantes y 30 absolutos; cookie `__Host-`; chequeo de Origin; rate limiting |
| [[ADR-005 Roles de base de datos]] | aceptada | `consorcio_app` solo DML y `consorcio_migrator` dueño del esquema; `pg_hba` limita cada rol a sus bases; scripts en `scripts/db/` |

## Plantilla ADR
- Resumen (opcional si el ADR supera las ~400 palabras):
- Contexto:
- Decisión:
- Alternativas:
- Consecuencias:
- Evidencia:
- Estado:
- Fecha:

Enlaces: [[Arquitectura objetivo]], [[00 Inicio]]
