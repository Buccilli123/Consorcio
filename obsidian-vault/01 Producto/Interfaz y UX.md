---
tipo: producto
estado: vigente-parcial
tags: [producto, interfaz, ux]
---
# Interfaz y UX

Solo decisiones verificadas. Todavía no hay pantallas funcionales: la única página es un placeholder.

| Decisión | Estado | Evidencia |
|---|---|---|
| Estilos con **Tailwind CSS 4** | Verificada | `package.json` (`tailwindcss ^4`), `src/app/globals.css` (`@import "tailwindcss"`), [[ADR-001 Stack base y versiones]] |
| Idioma y región **`es-AR`** | Verificada | `src/app/layout.tsx` (`<html lang="es-AR">`) |
| **Fuentes del sistema**, sin `next/font/google` (el build no depende de servicios externos) | Verificada | `src/app/globals.css` (`--font-sans: system-ui, …`); no hay `next/font` en `src/` |
| Usable con un **ancho mínimo de 360 px** | **Pendiente de verificación** | Es el criterio G4 de [[Criterios de aceptación MVP]]. No hay pantallas que probar todavía; se verifica en cada módulo con interfaz |

Sin decidir: sistema de componentes, paleta, modo oscuro (el placeholder solo hereda `prefers-color-scheme`), navegación y accesibilidad. Se documentan acá cuando se decidan.

Enlaces: [[Criterios de aceptación MVP]], [[Visión y MVP]]
