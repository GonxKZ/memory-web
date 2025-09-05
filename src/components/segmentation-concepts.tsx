import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SegmentationTechniqueProps {
  technique: "baseLimit" | "shared" | "protected" | "dynamic"
  name: string
  description: string
  implementation: string
  advantages: string[]
  disadvantages: string[]
  technicalDetails: string
  examples: string[]
}

export function SegmentationTechnique({ 
  technique,
  name,
  description,
  implementation,
  advantages,
  disadvantages,
  technicalDetails,
  examples
}: SegmentationTechniqueProps) {
  // Technique icons and colors
  const techniqueInfo = {
    "baseLimit": {
      icon: "📍",
      color: "#3b82f6"
    },
    "shared": {
      icon: "🤝",
      color: "#10b981"
    },
    "protected": {
      icon: "🛡️",
      color: "#8b5cf6"
    },
    "dynamic": {
      icon: "🔄",
      color: "#f59e0b"
    }
  }

  const currentTechnique = techniqueInfo[technique]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTechnique.color }}
        >
          <span className="mr-2 text-2xl">{currentTechnique.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
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
          
          <div>
            <div className="font-semibold mb-1">Implementación:</div>
            <div className="text-sm bg-gray-50 p-3 rounded text-gray-700">
              {implementation}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
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
            
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
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
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-semibold mb-2 text-gray-800">💡 Ejemplos:</div>
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

interface SegmentationConceptsProps {
  concepts: {
    technique: "baseLimit" | "shared" | "protected" | "dynamic"
    name: string
    description: string
    implementation: string
    advantages: string[]
    disadvantages: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function SegmentationConcepts({ concepts }: SegmentationConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Segmentación de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          La segmentación de memoria es una técnica de gestión de memoria en sistemas operativos que divide la memoria principal en segmentos o secciones independientes y relocalizables. Esta técnica permite una mejor organización del código y datos de los programas, facilitando el aislamiento entre procesos y mejorando la protección de memoria. Es como organizar una biblioteca en diferentes secciones temáticas: ficción, no ficción, referencia, etc.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <SegmentationTechnique
            key={index}
            technique={concept.technique}
            name={concept.name}
            description={concept.description}
            implementation={concept.implementation}
            advantages={concept.advantages}
            disadvantages={concept.disadvantages}
            technicalDetails={concept.technicalDetails}
            examples={concept.examples}
          />
        ))}
      </div>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔍</span>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">¿Cómo funciona la segmentación?</h3>
              <p className="text-green-700 mb-3">
                La segmentación divide la memoria en segmentos de tamaño variable según su propósito:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">Direcciones lógicas:</span>
                    <span> Cada dirección consta de un selector de segmento y un desplazamiento dentro del segmento</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Descriptores de segmento:</span>
                    <span> Contienen información como dirección base, límite, tipo (código/datos), y permisos</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">Traducción de direcciones:</span>
                    <span> La MMU usa los descriptores para convertir direcciones lógicas en físicas</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">4.</span>
                  <div>
                    <span className="font-semibold">Verificación de límites:</span>
                    <span> Se verifica que el desplazamiento esté dentro del límite del segmento</span>
                  </div>
                </li>
              </ul>
              <p className="text-green-700 mt-3">
                Este proceso permite que cada proceso tenga su propio espacio de direcciones lógicas 
                mientras comparten la memoria física del sistema.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de segmentación:</div>
                <div className="font-mono text-sm">
                  <div>Dirección lógica: [Selector de Segmento | Desplazamiento]</div>
                  <div className="my-1 text-center">↓ MMU</div>
                  <div>Consulta tabla de descriptores de segmento</div>
                  <div className="my-1 text-center">↓</div>
                  <div>Verificación de límites: ¿desplazamiento &lt; límite?</div>
                  <div className="my-1 text-center">↓</div>
                  <div>Dirección física: base + desplazamiento</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}