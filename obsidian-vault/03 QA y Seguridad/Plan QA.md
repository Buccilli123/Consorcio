---
tipo: qa
estado: vigente
tags: [qa, testing]
---
# Plan QA

## Pirámide sugerida
- Unit: cálculos, validaciones, reglas de estado y permisos puros.
- Integración: repositorio, DB, transacciones, aislamiento de tenants.
- API: contratos, status codes, validación, auth, permisos y errores.
- E2E: flujos críticos del usuario, solo cuando la infraestructura esté lista.

## Por feature
El procedimiento está en la skill `qa` (`.claude/skills/qa/SKILL.md`): criterios, matriz de casos (feliz, inválidos, 401/403, acceso cruzado, límites, concurrencia), ejecución e informe. Los criterios del proyecto están en [[Criterios de aceptación MVP]] (G1–G5 y la sección del módulo).

## Herramientas y comandos
| Comando | Qué hace |
|---|---|
| `npm run db:validate` | Valida el esquema de Prisma |
| `npm run lint` | ESLint (configuración de Next.js) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm test` | Tests unitarios (Vitest, proyecto `unit`, archivos `src/**/*.test.ts`) |
| `npm run test:integration` | Tests de integración contra `consorcio_test` (proyecto `integration`) |
| `npm run build` | Build de producción |
| `npm run check` | Corre todo lo anterior en orden y falla ante el primer error |

Todavía no están instalados: Playwright para E2E (se agrega cuando haya flujos) y Testing Library (cuando haya componentes con lógica).
Los tests de integración se niegan a correr si la base no termina en `_test` ([[ADR-002 Entornos y secretos]]). Antes de empezar aplican las migraciones (`migrate deploy`) y vacían las tablas entre tests (`resetDatabase`, que reconfirma el nombre de la base).

Los tests de integración corren con el rol `consorcio_app` (los mismos permisos que la app); la limpieza y las migraciones usan `consorcio_migrator` ([[ADR-005 Roles de base de datos]]).

Cobertura actual: matriz de permisos (unitarios), contexto de tenant, restricciones del esquema y privilegios del rol de la app (integración). Ver [[ADR-003 Aislamiento multi-tenant]].

## Gates de calidad
No considerar lista una feature si:
- falla una comprobación relevante sin explicación;
- existe una brecha de autorización conocida;
- el contrato/API está desactualizado;
- la documentación de uso o decisión quedó obsoleta.

Enlaces: [[Estrategia de API testing]], [[Seguridad y privacidad]], [[Backlog inicial]]
