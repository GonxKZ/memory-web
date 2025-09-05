# Memoria Low-Level

Una web didáctica e interactiva sobre cómo funciona la memoria a bajo nivel.

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

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Estilo/UI**: Tailwind CSS + shadcn/ui
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts + visx
- **Contenido**: MDX
- **Tipado**: Zod
- **Estado**: Zustand + XState
- **Formularios**: React Hook Form + Zod
- **Matemáticas**: KaTeX
- **Código**: Shiki
- **i18n**: i18next
- **Persistencia**: localStorage + IndexedDB (Dexie)
- **Testing**: Vitest + React Testing Library + Playwright

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

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd memoria-lowlevel
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

4. Construir para producción:
```bash
npm run build
```

## Uso

La plataforma está diseñada para ser utilizada por estudiantes, desarrolladores y profesionales que quieran entender cómo funciona la memoria a bajo nivel. Puedes:

- Navegar por los módulos de aprendizaje
- Interactuar con las visualizaciones
- Realizar experimentos en los laboratorios
- Consultar el glosario técnico
- Realizar quizzes para reforzar el aprendizaje

## Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva feature'`)
4. Haz push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para preguntas, sugerencias o reporte de errores, por favor abre un issue en el repositorio.

---

Desarrollado con ❤️ para la comunidad educativa