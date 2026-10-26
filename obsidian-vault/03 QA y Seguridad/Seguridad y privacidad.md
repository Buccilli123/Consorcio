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

## Controles implementados
- Aislamiento por consorcio: FKs compuestas, DAL con `TenantContext`, respuesta 404 para lo ajeno → [[ADR-003 Aislamiento multi-tenant]].
- Mínimo privilegio en la base: `consorcio_app` sin DDL ni `TRUNCATE`; `pg_hba` limita cada rol a sus bases → [[ADR-005 Roles de base de datos]].
- Auditoría de solo inserción (trigger) que la app no puede desactivar → [[Modelo de datos inicial]].
- Secretos solo en `.env`; errores de entorno sin valores → [[ADR-002 Entornos y secretos]].
- Diseño de autenticación (hash, sesiones, CSRF, rate limiting, logs) → [[ADR-004 Autenticación propia]]. Todavía no está implementado.

## Riesgos abiertos (revisión del 2026-10-25)
| Severidad | Riesgo | Plan |
|---|---|---|
| Media | Sin Row-Level Security: el aislamiento depende del DAL y de las FKs | Evaluar RLS antes de producción (ADR-003) |
| Media | El módulo de autenticación todavía no existe | Etapa 3, con las pruebas de [[Criterios de aceptación MVP]] |
| Baja | Que solo OWNER y TENANT tengan unidades asignadas se valida en la app, no en la base | Tests en el módulo de membresías |
| Baja | El rol migrador puede borrar objetos y hacer `TRUNCATE` (esquiva el trigger) | Usarlo solo en despliegues; roles propios en producción (ADR-005) |
| Baja | Con un proxy inverso hay que configurar `serverActions.allowedOrigins` | Etapa de infraestructura (ADR-004) |
| Baja | La memoria de `scrypt` (~128 MiB por hash) está fijada sin conocer la RAM del servidor | Ajustarla en la etapa de infraestructura (ADR-004) |
| Info | La contraseña del superusuario local se compartió en una sesión de chat | Cambiarla si se usa en otro lado; la app no la usa |

Esta nota no equivale a auditoría formal ni certificación. Enlaces: [[Roles y permisos]], [[Plan QA]], [[Estrategia de API testing]]
