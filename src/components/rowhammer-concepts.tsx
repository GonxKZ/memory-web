import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RowhammerConceptProps {
  concept: "mechanism" | "exploitation" | "mitigation" | "impact"
  name: string
  description: string
  technicalDetails: string
  examples: string[]
  realWorldCases: string[]
}

export function RowhammerConcept({ 
  concept,
  name,
  description,
  technicalDetails,
  examples,
  realWorldCases
}: RowhammerConceptProps) {
  // Concept information
  const conceptInfo = {
    "mechanism": {
      icon: "🔧",
      color: "#3b82f6"
    },
    "exploitation": {
      icon: "🔓",
      color: "#ef4444"
    },
    "mitigation": {
      icon: "🛡️",
      color: "#10b981"
    },
    "impact": {
      icon: "💥",
      color: "#8b5cf6"
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
          
          <div>
            <div className="font-semibold mb-2">Casos del mundo real:</div>
            <ul className="space-y-2">
              {realWorldCases.map((caseExample, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span className="text-gray-700">{caseExample}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface RowhammerConceptsProps {
  concepts: {
    concept: "mechanism" | "exploitation" | "mitigation" | "impact"
    name: string
    description: string
    technicalDetails: string
    examples: string[]
    realWorldCases: string[]
  }[]
}

export function RowhammerConcepts({ concepts }: RowhammerConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Rowhammer</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Rowhammer es una vulnerabilidad física en la memoria DRAM que permite a atacantes 
          cambiar bits en la memoria mediante accesos repetidos a filas de memoria adyacentes. 
          Es como tocar repetidamente una cuerda de guitarra y hacer que otra cuerda cercana 
          suene sin tocarla.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <RowhammerConcept
            key={index}
            concept={concept.concept}
            name={concept.name}
            description={concept.description}
            technicalDetails={concept.technicalDetails}
            examples={concept.examples}
            realWorldCases={concept.realWorldCases}
          />
        ))}
      </div>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔬</span>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Analogía de Rowhammer</h3>
              <p className="text-red-700 mb-3">
                Imagina una biblioteca con estanterías muy cercanas entre sí:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Estructura:</span>
                    <span> Las estanterías (filas de memoria) están tan cerca que vibrar una afecta a las vecinas</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Mecanismo:</span>
                    <span> Si tocas repetidamente los libros de una estantería, las vibraciones pueden hacer caer libros de estanterías adyacentes</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Explotación:</span>
                    <span> Un atacante puede hacer que caigan libros específicos (cambiar bits) de estanterías vecinas controlando qué libros toca repetidamente</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Impacto:</span>
                    <span> Puede cambiar información crítica como permisos de acceso o direcciones de memoria</span>
                  </div>
                </li>
              </ul>
              <p className="text-red-700 mt-3">
                Esta vulnerabilidad es especialmente preocupante porque explota una 
                característica física del hardware, no un error de software, lo que 
                la hace difícil de mitigar completamente.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del efecto Rowhammer:</div>
                <div className="font-mono text-sm">
                  <div>// Filas de memoria DRAM muy cercanas</div>
                  <div>Fila 0: [0][1][0][1][0][1][0][1] // Datos objetivo</div>
                  <div>Fila 1: [1][0][1][0][1][0][1][0] // Fila agresora</div>
                  <div>Fila 2: [0][1][0][1][0][1][0][1] // Otra fila objetivo</div>
                  <div className="my-2 text-center">↓ Acceso repetido a Fila 1 ↓</div>
                  <div>// Vibraciones electromagnéticas</div>
                  <div className="my-2 text-center">↓ Flip de bits en filas vecinas ↓</div>
                  <div>Fila 0: [0][1][1][1][0][1][0][1] // Bit 2 cambiado</div>
                  <div>Fila 1: [1][0][1][0][1][0][1][0] // Sin cambios</div>
                  <div>Fila 2: [0][0][0][1][0][1][0][1] // Bits 1 y 2 cambiados</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}