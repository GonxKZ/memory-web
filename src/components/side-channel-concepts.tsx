import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SideChannelConceptProps {
  concept: "cache" | "timing" | "power" | "electromagnetic"
  name: string
  description: string
  examples: string[]
  mitigation: string[]
  technicalDetails: string
  realWorldExamples: string[]
}

export function SideChannelConcept({ 
  concept,
  name,
  description,
  examples,
  mitigation,
  technicalDetails,
  realWorldExamples
}: SideChannelConceptProps) {
  // Concept information
  const conceptInfo = {
    "cache": {
      icon: "キャッシング",
      color: "#3b82f6"
    },
    "timing": {
      icon: "⏱️",
      color: "#10b981"
    },
    "power": {
      icon: "🔋",
      color: "#f59e0b"
    },
    "electromagnetic": {
      icon: "📡",
      color: "#8b5cf6"
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
              <div className="font-semibold mb-2 flex items-center">
                <span className="mr-2 text-green-800">🎯</span>
                <span className="text-green-800">Ejemplos</span>
              </div>
              <ul className="space-y-2">
                {examples.map((example, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-600">•</span>
                    <span className="text-gray-700">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <div className="font-semibold mb-2 flex items-center">
                <span className="mr-2 text-red-800">🛡️</span>
                <span className="text-red-800">Mitigaciones</span>
              </div>
              <ul className="space-y-2">
                {mitigation.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-600">✓</span>
                    <span className="text-red-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
            <div className="font-semibold mb-2 text-gray-800 flex items-center">
              <span className="mr-2">🌍</span>
              Ejemplos del mundo real
            </div>
            <ul className="space-y-2">
              {realWorldExamples.map((example, index) => (
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

interface SideChannelConceptsProps {
  concepts: {
    concept: "cache" | "timing" | "power" | "electromagnetic"
    name: string
    description: string
    examples: string[]
    mitigation: string[]
    technicalDetails: string
    realWorldExamples: string[]
  }[]
}

export function SideChannelConcepts({ concepts }: SideChannelConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ataques de Canal Lateral</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Los ataques de canal lateral no atacan directamente el sistema, sino que obtienen 
          información observando características indirectas como tiempos, consumo de energía 
          o emisiones electromagnéticas. Es como deducir la combinación de una caja fuerte 
          escuchando el sonido de los mecanismos internos, en lugar de intentar romperla. 
          Estos ataques son particularmente peligrosos porque explotan características físicas 
          del hardware, no errores de software, lo que los hace difíciles de mitigar completamente.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <SideChannelConcept
            key={index}
            concept={concept.concept}
            name={concept.name}
            description={concept.description}
            examples={concept.examples}
            mitigation={concept.mitigation}
            technicalDetails={concept.technicalDetails}
            realWorldExamples={concept.realWorldExamples}
          />
        ))}
      </div>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧱</span>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Analogía de ataques de canal lateral</h3>
              <p className="text-purple-700 mb-3">
                Imagina una casa con múltiples sistemas de seguridad:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Ataques directos:</span>
                    <span> Intentar romper la cerradura de la puerta principal (difícil y ruidoso)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Ataques de canal lateral:</span>
                    <span> Escuchar el sonido de la cerradura, medir cuánto tiempo tarda alguien en entrar, o analizar el consumo de electricidad cuando se usan ciertos dispositivos (silencioso y efectivo)</span>
                  </div>
                </li>
              </ul>
              <p className="text-purple-700 mt-3">
                Los ataques de canal lateral son silenciosos porque no dejan rastros obvios de intrusión, 
                pero pueden ser igualmente efectivos para obtener información sensible.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización de un ataque de canal lateral por caché:</div>
                <div className="font-mono text-sm">
                  <div>// Proceso víctima:</div>
                  <div>if (password[i] == input[i]) &#123;</div>
                  <div className="ml-4">// Acceso lento a array secreto</div>
                  <div className="ml-4">secret_array[password[i] * 256] += 1;</div>
                  <div>&#125;</div>
                  <div className="my-2 text-center text-red-500">// ↓ Atacante mide tiempos de acceso ↓</div>
                  <div>// Tiempo alto = carácter correcto (en caché)</div>
                  <div>// Tiempo bajo = carácter incorrecto (no en caché)</div>
                  <div>// Deduce password carácter por carácter</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}