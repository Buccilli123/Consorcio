---
name: consorcio-security
description: Revisa cambios con impacto en autenticación, autorización, datos personales, archivos, sesiones, pagos, aislamiento multi-tenant o configuración.
---

# Skill: revisión de seguridad

1. Delimitar activos, actores, límites de confianza y datos afectados.
2. Revisar autorización en servidor para cada operación y aislamiento por consorcio en lectura/escritura.
3. Revisar validación, SQL/ORM, XSS, CSRF, SSRF, carga/descarga de archivos, path traversal, rate limiting y manejo de errores según corresponda.
4. Buscar secretos accidentales en diff, logs, ejemplos, pruebas y documentación.
5. Revisar exposición de datos en respuestas, errores, logs y exportaciones.
6. Agregar tests de regresión para los riesgos relevantes.
7. Clasificar hallazgos por severidad, evidencia, impacto y remediación.
8. No declarar la aplicación “segura” ni “cumplidora” en términos absolutos.
9. No ejecutar escaneos invasivos, pruebas sobre servicios externos ni operaciones destructivas sin permiso.
