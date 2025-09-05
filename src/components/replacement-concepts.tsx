import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CacheReplacementConceptProps {
  concept: "lru" | "lfu" | "fifo" | "random"
  name: string
  description: string
  howItWorks: string
  advantages: string[]
  disadvantages: string[]
  technicalDetails: string
  examples: string[]
}

export function CacheReplacementConcept({ 
  concept,
  name,
  description,
  howItWorks,
  advantages,
  disadvantages,
  technicalDetails,
  examples
}: CacheReplacementConceptProps) {
  // Concept icons and colors
  const conceptInfo = {
    "lru": {
      icon: "⏱️",
      color: "#3b82f6"
    },
    "lfu": {
      icon: "📈",
      color: "#10b981"
    },
    "fifo": {
      icon: "🔄",
      color: "#8b5cf6"
    },
    "random": {
      icon: "🎲",
      color: "#f59e0b"
    }
  }

  const currentConcept = conceptInfo[concept]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentConcept.color }}
        >
          <span className="mr-2 text-2xl">{currentConcept.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-700">
            {description}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">Detalles Técnicos</div>
            <div className="text-blue-700 text-sm">
              {technicalDetails}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="font-semibold mb-2 flex items-center">
              <span className="mr-2 text-green-800">⚙️</span>
              Cómo funciona
            </div>
            <div className="text-green-700">
              {howItWorks}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="font-semibold mb-2 text-green-800 flex items-center">
                <span className="mr-2">✅</span>
                Ventajas
              </div>
              <ul className="space-y-2">
                {advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-600">•</span>
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="font-semibold mb-2 text-red-800 flex items-center">
                <span className="mr-2">⚠️</span>
                Desventajas
              </div>
              <ul className="space-y-2">
                {disadvantages.map((disadvantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-600">•</span>
                    <span className="text-gray-700">{disadvantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Ejemplos:</div>
            <ul className="space-y-2">
              {examples.map((example, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span className="text-gray-700">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CacheReplacementConceptsProps {
  concepts: {
    concept: "lru" | "lfu" | "fifo" | "random"
    name: string
    description: string
    howItWorks: string
    advantages: string[]
    disadvantages: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function CacheReplacementConcepts({ concepts }: CacheReplacementConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Políticas de Reemplazo de Caché</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Cuando la caché está llena y se necesita espacio para nuevos datos, las políticas 
          de reemplazo deciden qué datos existentes eliminar. Es como decidir qué libros 
          sacar de una mochila llena cuando necesitas hacer espacio para nuevos libros. 
          La elección correcta puede mejorar significativamente el rendimiento del sistema.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <CacheReplacementConcept
            key={index}
            concept={concept.concept}
            name={concept.name}
            description={concept.description}
            howItWorks={concept.howItWorks}
            advantages={concept.advantages}
            disadvantages={concept.disadvantages}
            technicalDetails={concept.technicalDetails}
            examples={concept.examples}
          />
        ))}
      </div>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧱</span>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Analogía de reemplazo de caché</h3>
              <p className="text-purple-700 mb-3">
                Imagina que eres un estudiante con una mochila (caché) para llevar libros 
                entre clases:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">LRU (Least Recently Used):</span>
                    <span> Sacas el libro que usaste hace más tiempo, asumiendo que es menos probable que lo necesites pronto</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">LFU (Least Frequently Used):</span>
                    <span> Sacas el libro que has usado menos veces en total, asumiendo que es menos importante</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">FIFO (First In, First Out):</span>
                    <span> Sacas el libro que metiste primero, sin importar cuándo lo usaste por última vez</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">4.</span>
                  <div>
                    <span className="font-semibold">Aleatorio:</span>
                    <span> Cierras los ojos y sacas un libro al azar (simple pero no siempre eficiente)</span>
                  </div>
                </li>
              </ul>
              <p className="text-purple-700 mt-3">
                Cada política ofrece un equilibrio diferente entre facilidad de implementación, 
                sobrecarga de mantenimiento y efectividad en diferentes patrones de uso.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de reemplazo:</div>
                <div className="font-mono text-sm">
                  <div>// Caché de 4 entradas: [A][B][C][D]</div>
                  <div>// Nuevo acceso: E</div>
                  <div className="my-2"></div>
                  <div>LRU: Elimina A (menos reciente) → [E][B][C][D]</div>
                  <div>LFU: Elimina A (menos frecuente) → [E][B][C][D]</div>
                  <div>FIFO: Elimina A (primero en entrar) → [E][B][C][D]</div>
                  <div>Aleatorio: Elimina C (azar) → [A][B][E][D]</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}