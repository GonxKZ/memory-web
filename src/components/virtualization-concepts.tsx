import { AnimatedConceptCard } from "@/components/animated-concept-card"
import { Card, CardContent } from "@/components/ui/card"

interface VirtualizationTechniqueProps {
  technique: "paging" | "segmentation" | "translation" | "protection"
  name: string
  description: string
  benefits: string[]
  challenges: string[]
  technicalDetails: string
  examples: string[]
}

export function VirtualizationTechnique({ 
  technique,
  name,
  description,
  benefits,
  challenges,
  technicalDetails,
  examples
}: VirtualizationTechniqueProps) {
  // Technique icons and colors
  const techniqueInfo = {
    "paging": {
      icon: "📚",
      color: "#3b82f6"
    },
    "segmentation": {
      icon: "📐",
      color: "#10b981"
    },
    "translation": {
      icon: "🗺️",
      color: "#8b5cf6"
    },
    "protection": {
      icon: "🛡️",
      color: "#f59e0b"
    }
  }

  const currentTechnique = techniqueInfo[technique]

  return (
    <AnimatedConceptCard
      icon={currentTechnique.icon}
      color={currentTechnique.color}
      name={name}
      description={description}
      technicalDetails={technicalDetails}
      benefits={benefits}
      challenges={challenges}
      examples={examples}
    />
  )
}

interface VirtualizationConceptsProps {
  concepts: {
    technique: "paging" | "segmentation" | "translation" | "protection"
    name: string
    description: string
    benefits: string[]
    challenges: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function VirtualizationConcepts({ concepts }: VirtualizationConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Virtualización de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          La virtualización de memoria es una técnica fundamental que permite desacoplar los recursos de memoria RAM volátil de los sistemas individuales en un centro de datos, y luego agrupar esos recursos en un pool de memoria virtualizada disponible para cualquier computadora del clúster. Esto significa que la memoria puede ser utilizada de manera más eficiente y flexible, superando las limitaciones físicas de la memoria local de cada máquina.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <VirtualizationTechnique
            key={index}
            technique={concept.technique}
            name={concept.name}
            description={concept.description}
            benefits={concept.benefits}
            challenges={concept.challenges}
            technicalDetails={concept.technicalDetails}
            examples={concept.examples}
          />
        ))}
      </div>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧠</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Diferencia entre Memoria Virtual y Física</h3>
              <p className="text-blue-700 mb-3">
                Es fundamental entender la diferencia entre estos dos conceptos:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Memoria física (RAM):</span>
                    <span> Es la memoria real instalada en una computadora, limitada por el hardware. Como las estanterías reales de una biblioteca.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Memoria virtual:</span>
                    <span> Es una abstracción que permite a los programas usar más memoria de la disponible físicamente. Utiliza una combinación de RAM y almacenamiento en disco (como swap) para simular una memoria más grande. Como tener un catálogo virtual que puede incluir libros almacenados en el sótano.</span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-700 mt-3">
                La Unidad de Gestión de Memoria (MMU) es el componente del hardware que traduce 
                direcciones virtuales en direcciones físicas, actuando como el bibliotecario 
                que convierte las referencias del catálogo virtual en ubicaciones reales de estanterías.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧱</span>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Visualización del proceso de virtualización</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="font-semibold text-gray-800">Programa</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Usa direcciones virtuales<br/>
                    <span className="font-mono">0x1000, 0x1004, 0x1008...</span>
                  </div>
                  <div className="mt-3 text-2xl">🧠</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="font-semibold text-gray-800">MMU</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Traduce direcciones<br/>
                    <span className="font-mono">Tabla de páginas</span>
                  </div>
                  <div className="mt-3 text-2xl">⚙️</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="font-semibold text-gray-800">Memoria Física</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Direcciones reales<br/>
                    <span className="font-mono">0x200000, 0x201000...</span>
                  </div>
                  <div className="mt-3 text-2xl">💾</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg font-mono text-sm">
                  Dirección Virtual [Página | Desplazamiento] → MMU → Dirección Física [Marco | Desplazamiento]
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}