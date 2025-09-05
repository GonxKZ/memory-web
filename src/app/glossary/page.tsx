import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon, BookOpenIcon } from "lucide-react"

// Sample glossary data
const glossaryTerms = [
  {
    id: "cache",
    term: "Caché",
    definition: "Memoria rápida y pequeña que almacena copias de datos frecuentemente accedidos desde la memoria principal.",
    category: "Memoria"
  },
  {
    id: "tlb",
    term: "TLB",
    definition: "Translation Lookaside Buffer - Caché especializado que almacena las traducciones más recientes de direcciones virtuales a físicas.",
    category: "Memoria Virtual"
  },
  {
    id: "dram",
    term: "DRAM",
    definition: "Dynamic Random Access Memory - Tipo de memoria principal utilizada en la mayoría de sistemas modernos.",
    category: "Memoria"
  },
  {
    id: "latency",
    term: "Latencia",
    definition: "Tiempo que tarda en completarse una operación, desde que se solicita hasta que se obtiene el resultado.",
    category: "Rendimiento"
  },
  {
    id: "bandwidth",
    term: "Ancho de banda",
    definition: "Cantidad de datos que pueden transferirse por unidad de tiempo entre dos puntos del sistema.",
    category: "Rendimiento"
  },
  {
    id: "coherence",
    term: "Coherencia de caché",
    definition: "Propiedad que asegura que todas las copias de un dato en diferentes cachés sean consistentes entre sí.",
    category: "Multiprocesador"
  },
  {
    id: "consistency",
    term: "Consistencia de memoria",
    definition: "Modelo que define el orden en que las operaciones de memoria se ven por diferentes procesadores.",
    category: "Multiprocesador"
  },
  {
    id: "numa",
    term: "NUMA",
    definition: "Non-Uniform Memory Access - Arquitectura donde cada procesador tiene acceso a su propia memoria local con menor latencia.",
    category: "Arquitectura"
  },
  {
    id: "prefetching",
    term: "Prefetching",
    definition: "Técnica utilizada por las cachés para anticipar y cargar datos antes de que sean solicitados por el procesador.",
    category: "Optimización"
  },
  {
    id: "false-sharing",
    term: "False Sharing",
    definition: "Situación en programación paralela donde diferentes hilos modifican variables que residen en la misma línea de caché.",
    category: "Multiprocesador"
  }
]

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(glossaryTerms.map(term => term.category))]
    return ["Todas", ...cats]
  }, [])

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "Todas" || term.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Glosario Técnico</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Encuentra definiciones claras de términos técnicos relacionados con la memoria a bajo nivel.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar término..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
              `}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map(term => (
            <Card key={term.id} className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                  {term.term}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {term.category}
                  </span>
                </div>
                <p className="text-gray-600">{term.definition}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <SearchIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron términos</h3>
          <p className="text-gray-600">
            Intenta con otra búsqueda o selecciona una categoría diferente.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 pt-8 border-t text-center">
        <p className="text-gray-600">
          Mostrando {filteredTerms.length} de {glossaryTerms.length} términos
        </p>
      </div>
    </div>
  )
}