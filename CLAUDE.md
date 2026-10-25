# Reglas del repositorio

- Antes de editar, inspeccionar el estado de Git, el código y las pruebas relevantes.
- Seguir `PROMPT_MAESTRO_CLAUDE.md` como guía del proyecto y consultar `obsidian-vault/00 Inicio.md` para orientarse.
- No leer toda la bóveda por defecto: buscar por tema y abrir solo notas necesarias.
- No usar Supabase ni Render/hosting gratuito. El servidor propio existe; definir SO, recursos y despliegue al final.
- Stack base a validar: Next.js, React, TypeScript, PostgreSQL y Prisma. No reescribir decisiones existentes sin justificación.
- Tests y validaciones junto con cada cambio; no afirmar éxito sin ejecutar comandos y revisar resultados.
- Nunca hacer despliegues, operaciones destructivas, migraciones de pérdida de datos ni publicar integraciones sin autorización.
- Nunca guardar secretos en código, Git, ejemplos, logs o la bóveda.
- Aislamiento por consorcio y autorización server-side son requisitos críticos.
- Actualizar las notas Obsidian afectadas cuando cambien requisitos, decisiones, contratos API, pruebas o riesgos.
- Al terminar, informar cambios, pruebas ejecutadas, resultados, riesgos y documentación actualizada.
- Next.js 16 cambió APIs: antes de escribir código de Next, leer `AGENTS.md` y la guía correspondiente en `node_modules/next/dist/docs/`.
- Verificación integral: `npm run check`. Los tests de integración usan solo bases terminadas en `_test`.
