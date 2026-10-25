---
tipo: qa
estado: vigente
tags: [qa, api, postman]
---
# Estrategia de API testing

## Herramientas
- Tests automatizados en el repositorio: fuente de regresión repetible.
- Postman plugin/CLI/MCP: explorar contratos, mantener colecciones, ejecutar requests y pruebas, generar documentación y mocks cuando corresponda.
- OpenAPI: contrato compartido si el proyecto lo soporta.

## Casos mínimos por endpoint
- Correcto y autenticado.
- Sin autenticar.
- Autenticado sin permiso.
- Usuario de otro consorcio.
- Recurso inexistente.
- Body/query inválidos y campos faltantes.
- Duplicado, límites y concurrencia cuando aplique.
- Error de dependencia y formato de error consistente.

## Seguridad operativa
- No versionar tokens ni API keys.
- No apuntar a producción sin autorización.
- Usar datos sintéticos y entornos local/staging.
- No publicar colecciones ni documentación sin revisión.

Enlaces: [[Plan QA]], [[Seguridad y privacidad]]
