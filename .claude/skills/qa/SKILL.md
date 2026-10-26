---
name: qa
description: Planifica y ejecuta el control de calidad de una funcionalidad o corrección que cambia el comportamiento (casos positivos, negativos, regresión y evidencias). Usar antes de dar por terminado ese tipo de cambio. No usar en tareas que son solo de documentación, configuración del entorno o investigación.
---

# Skill: QA de funcionalidad

1. Delimitar la funcionalidad y leer solo las notas relevantes de `obsidian-vault/03 QA y Seguridad/Plan QA.md` y el módulo afectado.
2. Identificar criterios de aceptación, riesgos, límites y permisos.
3. Crear una matriz breve: caso, precondiciones, acción, resultado esperado, tipo de prueba.
4. Priorizar:
   - Camino feliz.
   - Validaciones y datos inválidos.
   - Sin autenticación y sin permisos.
   - Acceso cruzado entre consorcios.
   - Valores límite, duplicados, concurrencia y errores de dependencia.
   - Regresión del comportamiento relacionado.
5. Elegir el nivel correcto: unit, integración, API, E2E. No convertir cada caso en E2E si una prueba inferior da evidencia suficiente.
6. Implementar o actualizar pruebas en el framework ya presente. No agregar otro framework sin justificarlo.
7. Ejecutar pruebas específicas y después las comprobaciones proporcionadas por el proyecto (lint, typecheck, build, suite pertinente).
8. Para fallas, encontrar causa raíz; no ocultarlas con skips, aserciones débiles o mocks excesivos.
9. Informar comando exacto, resultado observado, cobertura de riesgos y limitaciones.
10. Actualizar la documentación de QA si cambian criterios o riesgos.

No afirmar cobertura porcentual sin un reporte real. No modificar datos productivos ni llamar servicios externos reales sin autorización.
