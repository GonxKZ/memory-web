---
name: "Cleanup: ESLint warnings"
about: Plan para reducir avisos de ESLint a cero
title: "chore(lint): reducir avisos ESLint a 0"
labels: ["lint", "tech-debt"]
assignees: []
---

Contexto
Actualmente el proyecto genera avisos de ESLint (no bloqueantes). Este issue centraliza el plan para dejarlos en 0.

Objetivo
- [ ] Dejar `npm run lint` sin avisos en `src/`.

Checklist por categorías
- Imports sin usar
  - [ ] Eliminar imports no usados en `features/*` (especialmente Badge, Input, Button, gráficos)
  - [ ] Sustituir por `_` variables intencionalmente no usadas
- Hooks
  - [ ] Completar dependencias de `useEffect` donde aplique o justificar con comentario
- Regex / escapes
  - [ ] Revisar escapes innecesarios (`no-useless-escape`) en `components/lesson-template.tsx`

Acciones de tooling
- [ ] Añadir comprobación estricta opcional: `npm run lint:strict`
- [ ] Activar CI para ejecutar `lint` + `typecheck` en PRs

Notas
- No cambiar comportamiento de las visualizaciones; limitarse a limpieza de código.
- Si un aviso requiere refactor, separarlo en PR propio.

