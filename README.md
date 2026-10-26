# Consorcio — plataforma de gestión de consorcios

## Desarrollo local
Requisitos: Node.js 24 o superior y PostgreSQL 17 local.

1. `npm install`. También genera el cliente de Prisma.
2. Copiar `.env.example` a `.env` y completar los valores locales. Nunca versionar `.env`.
3. Crear las bases `consorcio_dev` y `consorcio_test`. Después, como superusuario, correr `scripts/db/01-roles.sql` (sobre `postgres`) y `scripts/db/02-schema-grants.sql` (sobre cada base), y asignar las contraseñas de los roles sin versionarlas. Ver `obsidian-vault/Decisiones/ADR-005 Roles de base de datos.md`.
   Para aplicar las migraciones: `npm run db:migrate`.
4. `npm run dev` levanta la app en http://localhost:3000.
5. `npm run check` corre la verificación integral: esquema, lint, tipos, tests unitarios y de integración, y build.

## Documentación y reglas para agentes
- `CLAUDE.md`: reglas globales que Claude Code carga en cada sesión.
- `obsidian-vault/`: documentación del proyecto. Abrir como bóveda en Obsidian y empezar por `00 Inicio.md` (tabla "Rutas por tarea").
- `.claude/skills/`: skills de proyecto `qa`, `api-testing` y `consorcio-security`.
- `SETUP.md`: configuración opcional de Postman MCP y Obsidian MCP (no instalada).
- `PROMPT_MAESTRO_CLAUDE.md`: brief inicial del proyecto, solo como referencia histórica.

No guardar claves, tokens ni datos reales en Git, en la bóveda ni en la documentación.
