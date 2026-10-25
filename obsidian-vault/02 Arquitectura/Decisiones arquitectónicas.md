---
tipo: decision-log
estado: vigente
tags: [adr, arquitectura]
---
# Decisiones arquitectónicas

Registrar cada decisión importante en un archivo ADR separado con estado: propuesta, aceptada, reemplazada.

## Decisiones actuales / restricciones
1. No usar Supabase.
2. No usar Render ni hosting gratuito como plataforma de producción.
3. Hay un servidor propio; los detalles de infraestructura se difieren hasta la última etapa.
4. Stack base validado y fijado en [[ADR-001 Stack base y versiones]].
5. Obsidian mantiene documentación enlazada; el repositorio y las pruebas son la fuente ejecutable.
6. Separación de entornos y manejo de secretos: [[ADR-002 Entornos y secretos]].

## ADRs
Los archivos viven en `Decisiones/`.
- [[ADR-001 Stack base y versiones]] — aceptada
- [[ADR-002 Entornos y secretos]] — aceptada
- [[ADR-003 Aislamiento multi-tenant]] — aceptada
- [[ADR-004 Autenticación propia]] — aceptada (diseño final; se implementa en la Etapa 3)
- [[ADR-005 Roles de base de datos]] — aceptada

## Plantilla ADR
- Contexto:
- Decisión:
- Alternativas:
- Consecuencias:
- Evidencia:
- Estado:
- Fecha:

Enlaces: [[Arquitectura objetivo]], [[Infraestructura pendiente]]
