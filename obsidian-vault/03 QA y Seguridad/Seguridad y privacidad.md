---
tipo: seguridad
estado: vigente
tags: [seguridad, privacidad]
---
# Seguridad y privacidad

## Riesgos prioritarios
- Acceso cruzado a datos de otro consorcio.
- Autorización aplicada solo en frontend.
- Exposición de documentos privados.
- Filtración de secretos o datos personales en logs.
- Validación insuficiente, inyección, XSS/CSRF/SSRF según contexto.
- Abuso de endpoints y carga de archivos.
- Cambios de saldos/pagos sin trazabilidad.

## Controles
- Autorización server-side y pruebas negativas.
- Validación de entrada en límites de confianza.
- Principio de mínimo privilegio.
- No registrar secretos ni datos personales innecesarios.
- Auditoría de operaciones críticas.
- Límites de tamaño/tipo de archivo y almacenamiento privado.
- Revisión humana de cambios sensibles.

Esta nota no equivale a auditoría formal ni certificación. Enlaces: [[Roles y permisos]], [[Plan QA]], [[Estrategia de API testing]]
