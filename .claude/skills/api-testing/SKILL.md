---
name: api-testing
description: Diseña, documenta y prueba contratos HTTP/API (Route Handlers y Server Actions) usando las pruebas del repositorio y, si está configurado, Postman. Usar al crear o cambiar un endpoint o una acción. No usar para lógica de dominio pura sin interfaz HTTP ni para tareas de documentación.
---

# Skill: pruebas de API

- Inspeccionar primero rutas, esquemas de validación, middleware, autenticación y formato de errores existentes.
- Documentar método, path, autenticación, permisos, parámetros, body, respuesta y errores.
- Cubrir códigos de estado, validación de entradas, tipos, campos requeridos, paginación, filtros, duplicados y límites.
- Probar 401/403, acceso entre tenants, recurso inexistente, datos inválidos y fallos esperados.
- Verificar persistencia real en integration tests; no confiar solo en mocks.
- Mantener OpenAPI/colecciones sincronizadas con el comportamiento real.
- Con Postman, usar el plugin oficial si está instalado; consultar la configuración del proyecto y usar entornos sin secretos. Preferir mocks/local/staging autorizado.
- No guardar API keys en colecciones, ejemplos, vault de Obsidian ni archivos versionados. Usar variables secretas del entorno.
- No publicar documentación, colecciones ni ejecutar pruebas de carga contra producción sin autorización explícita.
- Reportar resultados reales y guardar artefactos de prueba pequeños y reproducibles.
