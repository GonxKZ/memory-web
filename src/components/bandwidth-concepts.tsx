import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BandwidthConceptProps {
  concept: "peak" | "sustained" | "sequential" | "random"
  name: string
  description: string
  factors: string[]
  optimization: string[]
  technicalDetails: string
  examples: string[]
}

export function BandwidthConcept({ 
  concept,
  name,
  description,
  factors,
  optimization,
  technicalDetails,
  examples
}: BandwidthConceptProps) {
  // Concept icons and colors
  const conceptInfo = {
    "peak": {
      icon: "🏔️",
      color: "#3b82f6"
    },
    "sustained": {
      icon: "⏳",
      color: "#10b981"
    },
    "sequential": {
      icon: "➡️",
      color: "#8b5cf6"
    },
    "random": {
      icon: "🔀",
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="font-semibold mb-2 text-green-700 flex items-center">
                <span className="mr-2">⚙️</span>
                Factores que influyen
              </div>
              <ul className="space-y-2">
                {factors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="font-semibold mb-2 text-purple-700 flex items-center">
                <span className="mr-2">⚡</span>
                Técnicas de optimización
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

interface MemoryBandwidthConceptsProps {
  concepts: {
    concept: "peak" | "sustained" | "sequential" | "random"
    name: string
    description: string
    factors: string[]
    optimization: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function MemoryBandwidthConcepts({ concepts }: MemoryBandwidthConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ancho de Banda de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          El ancho de banda de memoria mide cuántos datos pueden transferirse entre la memoria 
          y el procesador en un período de tiempo. Es como medir cuántos litros de agua pueden 
          pasar por una tubería en un minuto. Esta métrica es clave en el rendimiento de sistemas 
          informáticos, ya que limita la velocidad a la que el procesador puede acceder a los 
          datos almacenados en la memoria.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <BandwidthConcept
            key={index}
            concept={concept.concept}
            name={concept.name}
            description={concept.description}
            factors={concept.factors}
            optimization={concept.optimization}
            technicalDetails={concept.technicalDetails}
            examples={concept.examples}
          />
        ))}
      </div>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🚰</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Analogía del ancho de banda</h3>
              <p className="text-blue-700 mb-3">
                Imagina que la memoria es un sistema de tuberías que lleva agua (datos) a una casa (procesador):
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Ancho de banda pico:</span>
                    <span> La cantidad máxima de agua que puede pasar en un momento ideal (como abrir todas las llaves a la vez)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Ancho de banda sostenido:</span>
                    <span> La cantidad de agua que puede mantenerse constantemente (más realista a largo plazo)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Acceso secuencial:</span>
                    <span> Como llenar una piscina poco profunda: se llena rápido porque el agua fluye directamente</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Acceso aleatorio:</span>
                    <span> Como regar plantas en diferentes lugares del jardín: se mueve el riego constantemente, reduciendo eficiencia</span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-700 mt-3">
                El objetivo es maximizar el ancho de banda sostenido mediante acceso secuencial 
                y patrones predecibles. Esto permite que los datos estén disponibles en las cachés 
                rápidas en lugar de tener que ir siempre a la memoria principal más lenta.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del flujo de datos:</div>
                <div className="font-mono text-sm">
                  <div>// Ancho de banda pico: 51.2 GB/s (teórico máximo)</div>
                  <div>// Ancho de banda sostenido: 35.7 GB/s (real promedio)</div>
                  <div className="my-2 text-center">↓</div>
                  <div>// Acceso secuencial: 90% eficiencia</div>
                  <div>// Acceso aleatorio: 30% eficiencia</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}