/* Registry and helpers to discover lessons under src/features using Vite glob */
import React from "react"

export type LessonMeta = {
  slug: string
  title: string
  module: string
  path: string
}

export type LessonExplain = {
  title: string
  metaphor: string
  idea: string
  bullets: string[]
  board?: { title: string; content: string }
}

export type LessonGuided = {
  title: string
  steps: { title: string; content: string }[]
}

const files = import.meta.glob("/src/features/**/*.tsx")

const toTitle = (s: string) =>
  s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())

export function listLessons(): LessonMeta[] {
  // Build a list of lessons from feature files
  return Object.keys(files)
    .filter((p) => !p.endsWith("/page.tsx") && !p.includes("/context"))
    .map((full) => {
      const rel = full.replace(/^\/src\/features\//, "")
      const slug = rel.replace(/\.tsx$/, "")
      const mod = slug.split("/")[0]
      const base = slug.split("/").slice(-1)[0]
      const title = toTitle(base)
      return { slug, title, module: toTitle(mod), path: full }
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function groupByModule(items: LessonMeta[]): Record<string, LessonMeta[]> {
  return items.reduce((acc, it) => {
    acc[it.module] ||= []
    acc[it.module].push(it)
    return acc
  }, {} as Record<string, LessonMeta[]>)
}

// Heuristics to provide ExplainPanel and GuidedFlow content depending on path
export function getExplainAndGuided(slug: string): { explain: LessonExplain; guided: LessonGuided } {
  const lower = slug.toLowerCase()
  const explainDefault: LessonExplain = {
    title: "Cómo pensar esta lección",
    metaphor: "Piensa en el problema con una analogía cercana antes de bajar al detalle.",
    idea: "La memoria es un sistema jerárquico; pequeñas mejoras en localidad suelen multiplicar el rendimiento.",
    bullets: ["Localidad", "Costes no lineales", "Medir y ajustar"],
    board: { title: "Regla práctica", content: "Optimiza para el caso común. Mide hit-rate y latencias." },
  }

  const guidedDefault: LessonGuided = {
    title: "Paso a paso",
    steps: [
      { title: "Explorar", content: "Observa el estado inicial y la configuración por defecto." },
      { title: "Modificar", content: "Toca uno o dos parámetros clave y observa el efecto." },
      { title: "Explicar", content: "Relaciona el cambio con localidad, paralelismo o políticas." },
      { title: "Consolidar", content: "Anota qué combinación ofrece el mejor compromiso." },
    ],
  }

  if (lower.includes("/tlb/") || lower.includes("page-table")) {
    return {
      explain: {
        title: "Atajo del TLB",
        metaphor: "Número en favoritos vs. buscar en un directorio por pisos.",
        idea: "Un hit en el TLB evita el page walk. Páginas grandes reducen entradas y fallos del TLB.",
        bullets: ["VA = índices + offset", "Hit/miss", "Páginas grandes"],
        board: { title: "Coste efectivo", content: "T ≈ Hit + Miss × (Niveles × latencia)" },
      },
      guided: {
        title: "De VA a PA",
        steps: [
          { title: "Dividir VA", content: "Extrae índices de niveles y offset." },
          { title: "Consultar TLB", content: "Si acierta, tenemos el marco físico." },
          { title: "Page walk", content: "En miss, recorre niveles hasta resolver PPN." },
          { title: "Insertar", content: "Guarda en TLB para el siguiente acceso." },
        ],
      },
    }
  }

  if (lower.includes("/numa/")) {
    return {
      explain: {
        title: "Cerca de tus datos",
        metaphor: "Sentarte cerca de tu plato ahorra viajes.",
        idea: "Local < Remoto. Mover hilos o páginas reduce latencia media.",
        bullets: ["Afinidad", "Migración", "Balance"],
        board: { title: "Latencia media", content: "L = (Lloc×nL + Lrem×nR) / (nL + nR)" },
      },
      guided: {
        title: "Reduciendo latencia",
        steps: [
          { title: "Mapa actual", content: "Cuántos accesos son remotos." },
          { title: "Afinidad", content: "Acerca hilos a su nodo." },
          { title: "Migración", content: "Acerca páginas calientes." },
          { title: "Medir", content: "Ver latencia y balance." },
        ],
      },
    }
  }

  if (lower.includes("prefetch")) {
    return {
      explain: {
        title: "Pedir por adelantado",
        metaphor: "Pedir el siguiente plato antes de terminar el actual.",
        idea: "Secuencial/stride/stream elevan el hit‑rate; distancia y cobertura importan.",
        bullets: ["Predictor", "Distancia", "Polución"],
        board: { title: "Efecto", content: "HitRate↑ ⇒ latencia media↓" },
      },
      guided: {
        title: "Cómo decide",
        steps: [
          { title: "Observar patrón", content: "Secuencial, stride, aleatorio." },
          { title: "Emitir prefetch", content: "Encola direcciones futuras." },
          { title: "Completar", content: "Convierte misses en hits." },
          { title: "Medir", content: "Aciertos prefetched vs misses y BW útil." },
        ],
      },
    }
  }

  if (lower.includes("interleav")) {
    return {
      explain: {
        title: "Repartir la carga",
        metaphor: "Repartir huevos entre varios alveolos.",
        idea: "Interleaving distribuye accesos y sube el throughput efectivo.",
        bullets: ["Dirección→módulo", "Patrón", "Balance"],
        board: { title: "Intuición", content: "Más módulos activos ⇒ más paralelismo" },
      },
      guided: {
        title: "De dirección a módulo",
        steps: [
          { title: "Bloque", content: "Número de bloque desde la dirección." },
          { title: "Mapeo", content: "Bit/Word/Page/Bank." },
          { title: "Acceso", content: "Latencia/variación según reparto." },
          { title: "Medir", content: "Ancho de banda y balance." },
        ],
      },
    }
  }

  if (lower.includes("encryption") || lower.includes("ecc") || lower.includes("protection")) {
    return {
      explain: {
        title: "Protección de memoria",
        metaphor: "Candados (R/W/X) y cajas fuertes (cifrado).",
        idea: "ECC corrige 1 bit; NX evita ejecutar datos; cifrado añade confidencialidad.",
        bullets: ["SECDED", "NX", "Modos de cifrado"],
        board: { title: "Síntesis", content: "El coste extra se compensa con seguridad e integridad." },
      },
      guided: {
        title: "De fallo a defensa",
        steps: [
          { title: "Detectar", content: "Señales de error/violación." },
          { title: "Corregir/Bloquear", content: "ECC/NX/ASLR." },
          { title: "Verificar", content: "Medir efectividad." },
          { title: "Ajustar", content: "Compromiso rendimiento/seguridad." },
        ],
      },
    }
  }

  if (lower.includes("cache") || lower.includes("replacement")) {
    return {
      explain: {
        title: "Pensar en cachés",
        metaphor: "Estanterías con huecos limitados: qué guardo y qué saco.",
        idea: "Localidad + (conjunto, asociatividad, política) determinan el hit‑rate.",
        bullets: ["Tamaño línea", "Índice→conjunto", "LRU/FIFO/RR"],
        board: { title: "Miss ratio", content: "MR ≈ f(working set, asociatividad, política)" },
      },
      guided: {
        title: "De acceso a decisión",
        steps: [
          { title: "Localidad", content: "Identifica patrón temporal/espacial." },
          { title: "Mapeo", content: "Address→(conjunto, vía)." },
          { title: "Política", content: "¿Cuál se expulsa?" },
          { title: "Medir", content: "Hits, misses y CPI." },
        ],
      },
    }
  }

  if (lower.includes("allocators") || lower.includes("allocator")) {
    return {
      explain: {
        title: "Asignadores",
        metaphor: "Cajoneras de distintos tamaños para no desperdiciar espacio.",
        idea: "Buddy/Slab/JEmalloc equilibran fragmentación vs. rapidez.",
        bullets: ["Interna/Externa", "Tallas", "Caches de objetos"],
        board: { title: "Objetivo", content: "Baja fragmentación con throughput alto." },
      },
      guided: {
        title: "De petición a bloque",
        steps: [
          { title: "Talla", content: "Redondeo/clase." },
          { title: "Reserva", content: "Lista libre/página/slab." },
          { title: "Liberación", content: "Coalescer o devolver al slab." },
          { title: "Métricas", content: "Fragmentación y latencia." },
        ],
      },
    }
  }

  if (lower.includes("consistency") || lower.includes("barriers") || lower.includes("synchronization")) {
    return {
      explain: {
        title: "Consistencia y sincronización",
        metaphor: "Semáforos y señales para cruzar sin choques.",
        idea: "Modelo (TSO/SC/etc.) y barreras ordenan efectos de memoria.",
        bullets: ["SC vs TSO", "Acquire/Release", "Fences"],
        board: { title: "Regla", content: "Sin orden explícito ⇒ reordenamientos posibles." },
      },
      guided: {
        title: "De código a orden",
        steps: [
          { title: "Detectar riesgo", content: "Races, dependencias." },
          { title: "Elegir primitiva", content: "Lock/atomic/barrier." },
          { title: "Verificar", content: "¿Se cumple el orden?" },
          { title: "Medir coste", content: "Impacto en latencia." },
        ],
      },
    }
  }

  if (lower.includes("gpu")) {
    return {
      explain: {
        title: "Memoria GPU",
        metaphor: "Carriles masivos: muchas bicis a la vez.",
        idea: "Coalescing y jerarquía distinta (LDS/Shared) condicionan el throughput.",
        bullets: ["Coalescing", "Shared/Global", "Occupancy"],
        board: { title: "Objetivo", content: "Maximo coalescing para BW alto." },
      },
      guided: {
        title: "De hilo a transacción",
        steps: [
          { title: "Patrón", content: "Stride y alineación." },
          { title: "Agrupar", content: "Coalescer accesos." },
          { title: "Compartida", content: "Evitar bank conflicts." },
          { title: "Medir", content: "BW y ocupación." },
        ],
      },
    }
  }

  if (lower.includes("dram")) {
    return {
      explain: {
        title: "DRAM práctica",
        metaphor: "Levantar y bajar una persiana (fila).",
        idea: "Fila activa reduce latencias; conflictos las aumentan.",
        bullets: ["tRAS/tRCD", "Open/Close", "Conflictos"],
        board: { title: "Coste", content: "Hit en fila ≪ Miss de fila." },
      },
      guided: {
        title: "Acceso a banco",
        steps: [
          { title: "Decodificar", content: "Banco/Fila/Col." },
          { title: "Activación", content: "Abrir fila." },
          { title: "R/W", content: "Latencias típicas." },
          { title: "Patrones", content: "Evitar conflictos." },
        ],
      },
    }
  }

  if (lower.includes("mapping") || lower.includes("bandwidth")) {
    return {
      explain: {
        title: "Mapeo y BW",
        metaphor: "Repartir cajas en varios camiones.",
        idea: "El mapeo a módulos/bancos determina paralelismo y BW.",
        bullets: ["Bloques", "Bancos", "Paralelismo"],
        board: { title: "Paralelismo", content: "Más módulos activos ⇒ más BW." },
      },
      guided: guidedDefault,
    }
  }

  if (lower.includes("optimization")) {
    return {
      explain: {
        title: "Mover datos, no punteros",
        metaphor: "Guardar juntos los cubiertos de la misma comida.",
        idea: "Localidad (AoS/SoA) y tiling cambian la eficiencia de caché.",
        bullets: ["AoS vs SoA", "Tiling", "Prefetch consciente"],
        board: { title: "Efecto", content: "Mejor localidad ⇒ menos fallos" },
      },
      guided: guidedDefault,
    }
  }

  return { explain: explainDefault, guided: guidedDefault }
}

export async function loadLessonComponent(path: string): Promise<React.ComponentType<any>> {
  const mod = (await files[path]()) as any
  return mod.default as React.ComponentType<any>
}
