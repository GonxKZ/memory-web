import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemoryMappingConceptProps {
  concept: "virtual" | "physical" | "paging" | "segmentation"
  name: string
  description: string
  advantages: string[]
  disadvantages: string[]
  technicalDetails: string
  examples: string[]
}

export function MemoryMappingConcept({ 
  concept,
  name,
  description,
  advantages,
  disadvantages,
  technicalDetails,
  examples
}: MemoryMappingConceptProps) {
  // Concept icons and colors
  const conceptInfo = {
    "virtual": {
      icon: "🧠",
      color: "#3b82f6"
    },
    "physical": {
      icon: "💾",
      color: "#10b981"
    },
    "paging": {
      icon: "📚",
      color: "#8b5cf6"
    },
    "segmentation": {
      icon: "📐",
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

interface MemoryMappingConceptsProps {
  concepts: {
    concept: "virtual" | "physical" | "paging" | "segmentation"
    name: string
    description: string
    advantages: string[]
    disadvantages: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function MemoryMappingConcepts({ concepts }: MemoryMappingConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Mapeo de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          El mapeo de memoria define cómo las direcciones virtuales (usadas por los programas) 
          se traducen a direcciones físicas (reales en la memoria). Es fundamental para que 
          múltiples programas puedan ejecutarse simultáneamente sin interferir entre sí. 
          Es como tener un sistema de direcciones postales donde cada casa tiene una dirección 
          única, pero los residentes pueden tener direcciones diferentes según su perspectiva.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <MemoryMappingConcept
            key={index}
            concept={concept.concept}
            name={concept.name}
            description={concept.description}
            advantages={concept.advantages}
            disadvantages={concept.disadvantages}
            technicalDetails={concept.technicalDetails}
            examples={concept.examples}
          />
        ))}
      </div>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🗺️</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona el mapeo de memoria?</h3>
              <p className="text-blue-700 mb-3">
                El proceso de mapeo de memoria involucra varios componentes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">MMU (Unidad de Gestión de Memoria):</span>
                    <span> Hardware que traduce direcciones virtuales a físicas</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Tablas de páginas:</span>
                    <span> Estructuras de datos que mantienen el mapeo entre direcciones virtuales y físicas</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">TLB (Translation Lookaside Buffer):</span>
                    <span> Caché especializada que almacena traducciones recientes para acelerar el acceso</span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-700 mt-3">
                Este proceso permite que cada proceso tenga su propio espacio de direcciones 
                virtuales mientras comparten la memoria física del sistema. La traducción 
                de direcciones es transparente para los programas, que solo ven direcciones 
                virtuales, mientras el hardware se encarga de la traducción a direcciones 
                físicas reales.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de traducción:</div>
                <div className="font-mono text-sm">
                  <div>Dirección virtual: [Número de página | Desplazamiento]</div>
                  <div className="my-1 text-center">↓ MMU</div>
                  <div>Consulta tabla de páginas</div>
                  <div className="my-1 text-center">↓</div>
                  <div>Dirección física: [Marco de página | Desplazamiento]</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}