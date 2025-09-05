import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NUMAConceptProps {
  concept: "nodes" | "latency" | "bandwidth" | "locality"
  name: string
  description: string
  importance: string
  optimization: string[]
  technicalDetails: string
  examples: string[]
}

export function NUMAConcept({ 
  concept,
  name,
  description,
  importance,
  optimization,
  technicalDetails,
  examples
}: NUMAConceptProps) {
  // Concept information
  const conceptInfo = {
    "nodes": {
      icon: "🌐",
      color: "#3b82f6"
    },
    "latency": {
      icon: "⏱️",
      color: "#10b981"
    },
    "bandwidth": {
      icon: "📶",
      color: "#8b5cf6"
    },
    "locality": {
      icon: "🎯",
      color: "#f59e0b"
    }
  }

  const currentConcept = conceptInfo[concept]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
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
          
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="font-semibold text-blue-800 mb-2">🔬 Detalles Técnicos</div>
            <div className="text-blue-700 text-sm">
              {technicalDetails}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="font-semibold mb-2 flex items-center">
              <span className="mr-2 text-green-800">⭐</span>
              <span className="text-green-800">Importancia</span>
            </div>
            <div className="text-green-700">
              {importance}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2 text-purple-700 flex items-center">
              <span className="mr-2">⚡</span>
              <span className="text-purple-700">Técnicas de optimización</span>
            </div>
            <ul className="space-y-2">
              {optimization.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-purple-600">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
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

interface NUMAConceptsProps {
  concepts: {
    concept: "nodes" | "latency" | "bandwidth" | "locality"
    name: string
    description: string
    importance: string
    optimization: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function NUMAConcepts({ concepts }: NUMAConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Arquitectura NUMA</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          NUMA (Non-Uniform Memory Access) es una arquitectura donde cada procesador tiene 
          acceso a su propia memoria local con menor latencia que a la memoria de otros nodos. 
          Es como tener varias cocinas en una casa grande: cocinar en la cocina más cercana 
          es más rápido que ir a una lejana. Esta arquitectura permite escalar sistemas a 
          muchos núcleos manteniendo un buen rendimiento de memoria.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <NUMAConcept
            key={index}
            concept={concept.concept}
            name={concept.name}
            description={concept.description}
            importance={concept.importance}
            optimization={concept.optimization}
            technicalDetails={concept.technicalDetails}
            examples={concept.examples}
          />
        ))}
      </div>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🏢</span>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Analogía de NUMA</h3>
              <p className="text-purple-700 mb-3">
                Imagina un edificio de oficinas con múltiples pisos:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Nodos NUMA:</span>
                    <span> Cada piso tiene sus propias oficinas (procesadores) y archivo (memoria)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Memoria local:</span>
                    <span> Acceder al archivo en tu propio piso es rápido</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Memoria remota:</span>
                    <span> Acceder al archivo en otro piso requiere subir/bajar por escaleras (más lento)</span>
                  </div>
                </li>
              </ul>
              <p className="text-purple-700 mt-3">
                El objetivo es mantener a cada equipo trabajando principalmente con su archivo local 
                para maximizar la eficiencia del edificio completo. Esta arquitectura es fundamental 
                para sistemas de alto rendimiento donde se necesitan muchos núcleos de procesamiento.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del acceso NUMA:</div>
                <div className="font-mono text-sm">
                  <div>// Nodo 0 accede a su memoria local</div>
                  <div>latencia = 50 ns  // ✅ Rápido</div>
                  <div className="my-2 text-center text-red-500">// ↓ Nodo 0 accede a memoria de Nodo 1 ↓</div>
                  <div>latencia = 150 ns  // ⚠️ 3x más lento</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}