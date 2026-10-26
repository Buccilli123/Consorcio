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
El procedimiento general está en la skill `api-testing`. Lo propio de este proyecto:
- Códigos según [[ADR-003 Aislamiento multi-tenant]]: sin sesión → 401; miembro sin permiso → 403; recurso de otro consorcio o inexistente → 404, con el mismo mensaje.
- Route Handlers que cambian estado: Origin no permitido → 403 ([[ADR-004 Autenticación propia]]).
- Además: camino feliz autenticado, body o query inválidos, duplicados, límites y concurrencia cuando aplique, error de dependencia y formato de error consistente.

## Seguridad operativa
- Usar solo datos sintéticos y entornos local o de staging autorizado.
- Las demás reglas (sin tokens ni API keys versionados, sin producción ni publicación sin autorización) están en la skill `api-testing`.
- Postman todavía no está configurado (ver `SETUP.md`).

Enlaces: [[Plan QA]], [[Seguridad y privacidad]]
