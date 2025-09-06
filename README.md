# Memoria Low‑Level

Plataforma didáctica e interactiva para entender memoria a bajo nivel (cachés, TLB, DRAM, NUMA, consistencia, seguridad…).

## Descripción

Memoria Low‑Level combina visualizaciones interactivas, pasos guiados y contenidos MDX en una ruta de aprendizaje progresiva (de básico a avanzado). Todo está optimizado para navegación de teclado, tema oscuro/claro, búsqueda global y uso como PWA offline. La plataforma cubre:

- Jerarquía de memoria y cachés
- Traducción de direcciones y TLB
- Memoria virtual y paginación
- Coherencia y consistencia de memoria
- Asignadores de memoria
- Optimización de acceso a memoria
- Arquitecturas NUMA
- Virtualización de memoria
- Seguridad de memoria
- Y mucho más...

## Características

### 🎓 Aprendizaje Deductivo
- ExplainPanel + GuidedFlow (paso a paso) en cada lección.
- Temario con ruta sugerida (básico → avanzado) y progreso por módulo.
- Progreso global (N/M) y botón “Continuar” a la última lección.

### 🖥️ Visualizaciones Avanzadas
- Cachés, TLB, DRAM, NUMA, coherencia/consistencia, asignadores, interleaving, etc.
- Contenidos MDX ampliados que conectan teoría y práctica.

### 🔎 Búsqueda y Accesibilidad
- Búsqueda global (Ctrl/⌘+K) de lecciones y contenidos.
- Teclado en GuidedFlow (←/→) y deep‑links (?step=N).
- Tema oscuro/claro y enlace “Saltar al contenido”.

### 📱 PWA
- Botón “Instalar” en navegadores compatibles, experiencia offline básica.

## Tecnologías

- **Frontend**: React 19 + TypeScript
- **Build**: Vite 7
- **Estilo/UI**: Tailwind CSS 4, componentes locales (shadcn‑like)
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **Contenido**: MDX
- **Tipado**: Zod
- **Estado**: Zustand y XState
- **Formularios**: React Hook Form + Zod
- **Matemáticas**: KaTeX
- **i18n**: i18next
- **Persistencia**: IndexedDB (Dexie)

## Estructura del Proyecto

```
memoria-lowlevel/
├─ public/
├─ src/
│  ├─ app/                 # Shell, layout, rutas
│  ├─ components/          # UI genérica
│  ├─ features/            # Componentes específicos por tema
│  │   ├─ cache/           # Visualizaciones de caché
│  │   ├─ tlb/             # Visualizaciones de TLB
│  │   ├─ dram/            # Visualizaciones de DRAM
│  │   ├─ coherence/       # Visualizaciones de coherencia
│  │   ├─ allocators/      # Visualizaciones de asignadores
│  │   ├─ consistency/     # Visualizaciones de consistencia
│  │   ├─ numa/            # Visualizaciones de NUMA
│  │   ├─ virtualization/  # Visualizaciones de virtualización
│  │   ├─ security/        # Visualizaciones de seguridad
│  │   ├─ gpu/             # Visualizaciones de memoria GPU
│  │   ├─ optimization/    # Visualizaciones de optimización
│  │   └─ ...
│  ├─ content/             # Contenido MDX por módulos
│  ├─ lib/                 # Utilidades y librerías
│  └─ types/               # Definiciones de tipos
├─ TODO.md                 # Lista de tareas pendientes
└─ README.md               # Este archivo
```

## Rutas y atajos

- Rutas: `/`, `/lessons`, `/lesson/:slug`, `/temario`, `/docs`.
- Atajos: `Ctrl/⌘+K` (búsqueda), `←/→` (siguiente/anterior paso en GuidedFlow).

## Instalación y ejecución

Requisitos: Node.js ≥ 18 y npm.

- Instalar dependencias (solo la primera vez):
  ```bash
  npm install
  ```
- Desarrollar (Vite):
  ```bash
  npm run dev
  ```
- Compilar producción:
  ```bash
  npm run build
  ```
- Previsualizar `dist/`:
  ```bash
  npm run preview
  ```

## Diagnóstico rápido

- Script simple (sin `npm install`):
  ```bash
  bash scripts/diagnose.sh
  # ejecuta: build + typecheck
  ```
- Informe breve (logs en `logs/`):
  ```bash
  npm run diags
  # Lanza ESLint y TypeScript a fichero, registra logs y ejecuta tests
  ```

## Calidad de código

- Lint:
  ```bash
  npm run lint        # avisos permitidos
  npm run lint:fix    # aplica arreglos automáticos
  ```
- Tipos:
  ```bash
  npm run typecheck
  ```
- Opcional (estricto, sin avisos):
  ```bash
  npm run lint:strict
  ```

## Scripts útiles

```bash
# limpieza rápida
npm run clean

# chequeos y logs (incluye tests)
npm run diags

# diagnóstico simple (build+tsc)
bash scripts/diagnose.sh

# podar/normalizar imports en features
node scripts/prune-imports.mjs
node scripts/repair-recharts-imports.mjs
node scripts/fix-import-newlines.mjs
```

## Tests y CI

- Tests unitarios con Vitest + Testing Library: `npm run test` / `npm run test:run`.
- CI en GitHub Actions: typecheck, lint, tests y build en cada PR.

## Contribución

1. Crea una rama (`git checkout -b feat/mi-cambio`).
2. Ejecuta build y typecheck antes de subir.
3. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para preguntas, sugerencias o reporte de errores, abre un issue en el repositorio.

---

Desarrollado con ❤️ para la comunidad educativa
