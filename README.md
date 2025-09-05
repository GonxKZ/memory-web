# Memoria Low‑Level

Aplicación web didáctica e interactiva para entender la memoria a bajo nivel.

## Descripción

Memoria Low-Level es una plataforma educativa interactiva diseñada para enseñar conceptos avanzados de gestión de memoria en sistemas informáticos. La plataforma ofrece visualizaciones interactivas, laboratorios prácticos y explicaciones detalladas de temas como:

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

### 🎓 Aprendizaje Interactivo
- Lecciones cortas con experimentos interactivos ("toca y aprende")
- Glosario incremental siempre visible
- Analogías tipo Feynman y quizzes de refuerzo

### 🖥️ Visualizaciones Avanzadas
- Simulaciones de caché con diferentes políticas de reemplazo
- Visualización de TLB walks y traducción de direcciones
- Demostraciones de coherencia de caché (MESI, MOESI)
- Análisis de patrones de acceso y localidad
- Comparación de asignadores de memoria (Buddy, Slab, etc.)

### 🧪 Laboratorios Prácticos
- Laboratorio de Stride para entender patrones de acceso
- Simulador de False Sharing para optimización de rendimiento
- Demostración de prefetching y sus efectos
- Visualización de técnicas de empaquetado de datos
- Análisis de modelos de consistencia de memoria

### 📚 Contenido Completo
- Más de 20 módulos educativos
- Más de 50 componentes interactivos
- Más de 100 términos técnicos en el glosario
- Contenido bilingüe (español/inglés)

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

Hay dos formas de diagnóstico sin bloquear el flujo de trabajo:

- Script simple (sin `npm install`):
  ```bash
  bash scripts/diagnose.sh
  # ejecuta: build + typecheck
  ```

- Informe breve (logs en `logs/`):
  ```bash
  npm run diags
  # Lanza ESLint y TypeScript a fichero y registra 12s de logs del dev server
  ```

Notas:
- El script de diagnóstico no ejecuta `npm install` por diseño.
- Los diagnósticos están limitados en tiempo para evitar bucles (>2 min).

## Uso

La plataforma está diseñada para ser utilizada por estudiantes, desarrolladores y profesionales que quieran entender cómo funciona la memoria a bajo nivel. Puedes:

- Navegar por los módulos de aprendizaje
- Interactuar con las visualizaciones
- Realizar experimentos en los laboratorios
- Consultar el glosario técnico
- Realizar quizzes para reforzar el aprendizaje

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
