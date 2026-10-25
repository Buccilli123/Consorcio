# Instalación y configuración sugerida

## 1. Claude Code
Instalá Claude Code y abrilo desde la raíz del repositorio. Verificá que detecte `CLAUDE.md`. Los skills de proyecto viven en `.claude/skills/`.

Comandos útiles dentro de Claude Code:
- `/skills` para revisar habilidades disponibles (según versión).
- `/mcp` para comprobar servidores MCP.
- Pedile que ejecute `/qa` o `/api-testing` después de revisar los skills disponibles.

Consultá documentación oficial de Claude Code antes de copiar comandos si tu versión difiere:
https://code.claude.com/docs/en/skills
https://code.claude.com/docs/en/mcp

## 2. Postman para Claude Code
Opción recomendada: plugin oficial de Postman para coding agents. Requiere versiones compatibles de Claude Code y Node.js; verificá requisitos actuales.

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install postman@claude-plugins-official
```

Documentación:
https://learning.postman.com/docs/postman-plugin/install/overview
https://www.postman.com/product/integrations/

Después, inicializá el vínculo con el repositorio usando el flujo que indique el plugin/skill de Postman. No pegues API keys en prompts ni las guardes en Git. Para pruebas, preferí entorno local o staging autorizado. Postman CLI/MCP puede requerir cuenta, API key o configuración adicional.

## 3. Obsidian como bóveda documental
1. Abrí Obsidian.
2. Elegí “Open folder as vault” y seleccioná la carpeta `obsidian-vault`.
3. Activá el panel Graph View para ver las relaciones entre notas.
4. La bóveda ya usa enlaces internos `[[Nombre de nota]]`; Obsidian generará el grafo al indexarlas.

### Conectar Obsidian MCP
Una opción es el plugin comunitario “Local REST API with MCP”, que incorpora un servidor MCP autenticado para la bóveda. Instalalo desde Community Plugins y habilitalo. En sus ajustes obtené la API key; no la compartas ni la subas a Git.

Documentación y configuración actual:
https://community.obsidian.md/plugins/obsidian-local-rest-api

Para Claude Code, la documentación del plugin muestra un comando del tipo:

```bash
claude mcp add --transport http --scope user obsidian https://127.0.0.1:27124/mcp/ --header "Authorization: Bearer TU_API_KEY"
```

Usá la URL y el puerto que indique tu propia instalación. El ejemplo es ilustrativo; no guardes el token literal en documentación o archivos versionados. Si elegís HTTP local, habilitalo solo si entendés la implicación de seguridad y mantenelo ligado a localhost.

Verificá con `/mcp`. Si el certificado HTTPS local genera problemas, seguí las instrucciones oficiales del plugin; no desactives verificaciones de TLS de manera global.

## 4. Uso de contexto eficiente
- `CLAUDE.md` debe mantenerse breve.
- Antes de trabajar en una función, buscar en Obsidian solo el dominio relevante.
- Abrir índice + 1–3 notas relevantes, no toda la bóveda.
- Mantener decisiones en ADRs pequeños y actualizar solo notas afectadas.
- No copiar el código entero a la documentación.
- No guardar logs extensos, secretos ni datos reales de residentes.
- La bóveda es memoria documental; el código, tests y migraciones son la fuente de verdad ejecutable.
