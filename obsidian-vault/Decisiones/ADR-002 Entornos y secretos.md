---
tipo: adr
estado: aceptada
fecha: 2026-10-25
tags: [adr, seguridad, entornos]
---
# ADR-002 — Entornos y secretos

## Contexto
Hay que separar desarrollo, pruebas y producción, y evitar que las credenciales lleguen a Git, a los logs o a esta bóveda.

## Decisión
- **Desarrollo:** la base `consorcio_dev`, apuntada por `DATABASE_URL` en `.env`.
- **Pruebas:** la base `consorcio_test`, apuntada por `TEST_DATABASE_URL` en `.env`. El setup de integración se niega a correr si el nombre de la base no termina en `_test`.
- **Producción:** se define en la etapa de despliegue, en el servidor. Nunca reutiliza credenciales de desarrollo.
- Solo se versiona `.env.example`, con valores ficticios. `.gitignore` excluye `.env*`, claves, dumps y backups.
- `src/lib/env.ts` valida las variables con Zod. Los mensajes de error nombran la variable pero **nunca muestran su valor**; hay un test que lo verifica.

## Alternativas
- Usar un archivo `.env.test` separado: se descartó para tener una sola plantilla.

## Consecuencias
- Para correr los tests de integración hace falta crear `consorcio_test`.
- La verificación integral (`npm run check`) falla si no hay acceso a PostgreSQL. Es intencional: no se saltean tests en silencio.

Enlaces: [[Seguridad y privacidad]], [[Plan QA]], [[ADR-001 Stack base y versiones]]
