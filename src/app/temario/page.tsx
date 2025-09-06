import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { listLessons, groupByModule, getExplainAndGuided } from "@/lessons/registry"
import { getVisited } from "@/lib/progress"
import { useNavigate } from "react-router-dom"

const moduleIntro: Record<string, { intro: string; sequence: string[] }> = {
  Cachés: {
    intro: "Partimos de localidad; definimos línea, conjunto y política para razonar misses.",
    sequence: ["Localidad → línea", "Índice → conjunto", "Asociatividad", "Política de reemplazo", "Medir hit/miss"],
  },
  Tlb: {
    intro: "De dirección virtual a física: primero TLB, si no, page walk.",
    sequence: ["Dividir VA", "Consultar TLB", "Page‑walk", "Insertar en TLB", "Coste efectivo"],
  },
  Dram: {
    intro: "Banco/fila/columna: activación, lecturas y conflictos de banco.",
    sequence: ["Fila activa", "Lectura/Escritura", "Política de fila", "Conflictos", "Throughput"],
  },
  Numa: {
    intro: "Acerca cómputo a datos para minimizar latencia remota.",
    sequence: ["Mapa actual", "Afinidad", "Migración", "Balance", "Medición"],
  },
  Security: {
    intro: "Defensa por capas: ECC, permisos, ASLR, cifrado.",
    sequence: ["Detectar", "Bloquear/Corregir", "Verificar", "Ajustar riesgos"],
  },
  Optimization: {
    intro: "Datos juntos que se usan juntos; elegir AoS/SoA y tiling.",
    sequence: ["Perfilado", "Localidad", "Estructuras de datos", "Prefetch", "Evaluación"],
  },
}

export default function TemarioPage() {
  const navigate = useNavigate()
  const lessons = useMemo(() => listLessons(), [])
  const visited = useMemo(() => new Set(getVisited()), [])
  const grouped = groupByModule(lessons)

  // Ruta sugerida (de básico a avanzado)
  const orderedModules = [
    'Memory',
    'Cache',
    'Tlb',
    'Prefetching',
    'Optimization',
    'Consistency',
    'Synchronization',
    'Coherence',
    'Numa',
    'Dram',
    'Compression',
    'Allocators',
    'Security',
    'Virtualization',
    'Gpu',
    'Persistence',
    'Profiling',
    'Design',
    'Cpu',
  ]

  const level: Record<string, 'Básico' | 'Intermedio' | 'Avanzado'> = {
    Memory: 'Básico',
    Cache: 'Básico',
    Tlb: 'Básico',
    Prefetching: 'Intermedio',
    Optimization: 'Intermedio',
    Consistency: 'Intermedio',
    Synchronization: 'Intermedio',
    Coherence: 'Intermedio',
    Numa: 'Intermedio',
    Dram: 'Avanzado',
    Compression: 'Avanzado',
    Allocators: 'Avanzado',
    Security: 'Avanzado',
    Virtualization: 'Avanzado',
    Gpu: 'Avanzado',
    Persistence: 'Avanzado',
    Profiling: 'Avanzado',
    Design: 'Avanzado',
    Cpu: 'Avanzado',
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Temario Deductivo</h1>
        <p className="text-gray-600 mt-2">Recorrido de lo general a lo particular, con pasos guiados.</p>
      </div>

      {/* Ruta sugerida (de básico a avanzado) */}
      <div className="mb-10">
        <Card>
          <CardHeader>
            <CardTitle role="heading" aria-level={2}>Ruta sugerida (básico → avanzado)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {orderedModules.filter(m => grouped[m]?.length).map((m, i) => {
                const first = grouped[m][0]
                const lvl = level[m] || 'Intermedio'
                return (
                  <li key={m} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">{i+1}</div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{m}</div>
                        <div className="text-xs text-gray-500 truncate">Primera lección: {first.title}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded border ${lvl==='Básico'?'border-green-300 text-green-700 bg-green-50':lvl==='Intermedio'?'border-amber-300 text-amber-700 bg-amber-50':'border-purple-300 text-purple-700 bg-purple-50'}`}>{lvl}</span>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/lesson/${first.slug}`)}>Ir al módulo</Button>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([moduleName, items]) => {
          const key = Object.keys(moduleIntro).find(k => moduleName.toLowerCase().includes(k.toLowerCase()))
          const intro = key ? moduleIntro[key] : { intro: "", sequence: [] }
          const eg = getExplainAndGuided((items[0]?.slug ?? '').toLowerCase())
          return (
          <Card key={moduleName}>
              <CardHeader>
                <CardTitle role="heading" aria-level={2} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {moduleName}
                    {items.every(l => visited.has(l.slug)) && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-300">Completado</span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {items.filter(l => visited.has(l.slug)).length}/{items.length}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const next = items.find(l => !visited.has(l.slug)) || items[0]
                        navigate(`/lesson/${next.slug}`)
                      }}
                    >
                      {items.some(l => visited.has(l.slug)) && !items.every(l => visited.has(l.slug)) ? 'Continuar' : 'Comenzar'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="text-xs uppercase text-gray-500">Idea Clave</div>
                    <div className="text-sm text-gray-800">{eg.explain.idea || intro.intro}</div>
                    {intro.sequence.length > 0 && (
                      <div>
                        <div className="text-xs uppercase text-gray-500 mb-1">Secuencia Deductiva</div>
                        <ol className="list-decimal list-inside text-sm space-y-1">
                          {intro.sequence.map((s, i) => (<li key={i}>{s}</li>))}
                        </ol>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500 mb-2">Lecciones</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {items.map((l) => {
                        const done = visited.has(l.slug)
                        return (
                          <Button key={l.slug} variant="ghost" className={`justify-start ${done ? 'text-green-700' : ''}`} onClick={() => navigate(`/lesson/${l.slug}`)}>
                            <span className="flex items-center gap-2">
                              {l.title}
                              {done && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-300">Visto</span>}
                            </span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
