# Consorcio — plataforma de gestión de consorcios

## Desarrollo local
Requisitos: Node.js 24 o superior y PostgreSQL 17 local.

1. `npm install`. También genera el cliente de Prisma.
2. Copiar `.env.example` a `.env` y completar los valores locales. Nunca versionar `.env`.
3. Crear las bases `consorcio_dev` y `consorcio_test`. Después, como superusuario, correr `scripts/db/01-roles.sql` (sobre `postgres`) y `scripts/db/02-schema-grants.sql` (sobre cada base), y asignar las contraseñas de los roles sin versionarlas. Ver `obsidian-vault/Decisiones/ADR-005 Roles de base de datos.md`.
   Para aplicar las migraciones: `npm run db:migrate`.
4. `npm run dev` levanta la app en http://localhost:3000.
5. `npm run check` corre la verificación integral: esquema, lint, tipos, tests unitarios y de integración, y build.

Las decisiones están en `obsidian-vault/Decisiones/` y el índice en `obsidian-vault/00 Inicio.md`.

---

# Kit Claude Code — Gestión de Consorcios

Este kit convierte el brief del proyecto en instrucciones operativas para Claude Code y una bóveda de Obsidian enlazada.

## Qué contiene
- `PROMPT_MAESTRO_CLAUDE.md`: prompt inicial para ejecutar en Claude Code.
- `CLAUDE.md`: reglas permanentes, compactas, para la raíz del repositorio.
- `.claude/skills/qa/SKILL.md`: flujo de QA completo.
- `.claude/skills/api-testing/SKILL.md`: diseño y prueba de APIs.
- `.claude/skills/consorcio-security/SKILL.md`: revisión de seguridad (renombrada para no chocar con el comando `/security-review` de Claude Code).
- `obsidian-vault/`: notas Markdown enlazadas y listas para abrir como bóveda.
- `SETUP.md`: instalación sugerida de Postman y Obsidian MCP.

## Importante
El kit no presupone el sistema operativo, recursos ni arquitectura final del servidor propio. Eso queda para la última etapa. No usar Supabase, Render ni hosting gratuito. No guardar claves, tokens ni secretos en Git, en Obsidian o en notas de documentación.

## Uso rápido
1. Extraé el ZIP.
2. Copiá `CLAUDE.md` y la carpeta `.claude/` a la raíz del repositorio del proyecto.
3. Abrí Claude Code desde esa raíz.
4. Pegá `PROMPT_MAESTRO_CLAUDE.md` en Claude Code. Pedile que primero inspeccione el repositorio y la documentación; que no sobrescriba trabajo existente.
5. Abrí `obsidian-vault/` como una bóveda en Obsidian.
6. Configurá Postman y Obsidian MCP siguiendo `SETUP.md`. No hace falta activar todo al mismo tiempo: usá herramientas por tarea para ahorrar contexto.

El grafo se construye automáticamente a partir de los enlaces `[[Nota]]` de Obsidian.
