# Reglas del repositorio Consorcio

## Documentación (`obsidian-vault/`)
- Antes de cada tarea: abrir `obsidian-vault/00 Inicio.md` → "Rutas por tarea", declarar qué notas vas a leer y abrir solo esas.
- No releer notas que ya están en contexto y no cambiaron. No leer `Registro de cambios` salvo que haga falta el historial.
- Los ADR aceptados (`obsidian-vault/Decisiones/`) son decisiones vigentes. Si el código, una nota o el pedido los contradicen, señalarlo antes de cambiar código.
- Al terminar: actualizar solo las notas afectadas por cambios reales en requisitos, decisiones, contratos API, pruebas o riesgos. Registro de cambios: solo decisiones, 5 líneas como máximo.
- `PROMPT_MAESTRO_CLAUDE.md` es el brief histórico: no leerlo salvo que se pida.

## Restricciones
- Sin Supabase, Render ni hosting gratuito. La infraestructura del servidor propio se decide al final.
- Nunca sin autorización: deploy, push, publicar integraciones, operaciones destructivas ni migraciones con pérdida de datos. Nunca secretos en código, Git, ejemplos, logs o la bóveda.
- Aislamiento por consorcio y autorización en el servidor en toda operación (ADR-003).

## Trabajo
- Inspeccionar Git, el código y los tests relevantes antes de editar.
- Next.js 16: antes de escribir código de Next, leer `AGENTS.md` y solo las páginas de `node_modules/next/dist/docs/` pertinentes a la funcionalidad que se modifica; nunca toda la carpeta por defecto.
- Agregar o actualizar tests con cada cambio de comportamiento. Verificar con `npm run check`. No afirmar éxito sin ejecutar.
- Skills: `qa` para cambios de comportamiento; `api-testing` para Route Handlers o Server Actions; `consorcio-security` para auth, permisos, tenancy, archivos, pagos, secretos o roles de la base. No usarlas en tareas que son solo de documentación.
- Cierre: cambios, comandos y resultados reales, riesgos y documentación actualizada.
