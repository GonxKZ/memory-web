import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LoopOptimizationTechniqueProps {
  technique: "loopInterchange" | "loopTiling" | "dataPacking" | "prefetching"
  name: string
  description: string
  whenToUse: string
  example: string
  benefit: string
  technicalDetails: string
  examples: string[]
}

export function LoopOptimizationTechnique({ 
  technique,
  name,
  description,
  whenToUse,
  example,
  benefit,
  technicalDetails,
  examples
}: LoopOptimizationTechniqueProps) {
  // Technique icons and colors
  const techniqueInfo = {
    "loopInterchange": {
      icon: "🔄",
      color: "#3b82f6"
    },
    "loopTiling": {
      icon: "🧱",
      color: "#10b981"
    },
    "dataPacking": {
      icon: "📦",
      color: "#8b5cf6"
    },
    "prefetching": {
      icon: "🔮",
      color: "#f59e0b"
    }
  }

  const currentTechnique = techniqueInfo[technique]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTechnique.color }}
        >
          <span className="mr-2 text-2xl">{currentTechnique.icon}</span>
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
              <span className="mr-2 text-green-800">🎯</span>
              <span className="text-green-800">Cuándo usar</span>
            </div>
            <div className="text-green-700">
              {whenToUse}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Ejemplo:</div>
            <div className="font-mono text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
              {example}
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <div className="font-semibold mb-2 flex items-center">
              <span className="mr-2 text-yellow-800">⚡</span>
              <span className="text-yellow-800">Beneficio</span>
            </div>
            <div className="text-yellow-700">
              {benefit}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Ejemplos de aplicación:</div>
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

interface MemoryOptimizationConceptsProps {
  techniques: {
    technique: "loopInterchange" | "loopTiling" | "dataPacking" | "prefetching"
    name: string
    description: string
    whenToUse: string
    example: string
    benefit: string
    technicalDetails: string
    examples: string[]
  }[]
}

export function MemoryOptimizationConcepts({ techniques }: MemoryOptimizationConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Optimización de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          La optimización de memoria se enfoca en hacer que los programas usen la memoria de forma 
          más eficiente, reduciendo tiempos de espera y mejorando el rendimiento. Es como organizar 
          tu escritorio para encontrar cosas más rápido. Estas técnicas son fundamentales en 
          aplicaciones científicas donde se pasan la mayor parte del tiempo en bucles anidados 
          realizando operaciones intensivas en memoria.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((technique, index) => (
          <LoopOptimizationTechnique
            key={index}
            technique={technique.technique}
            name={technique.name}
            description={technique.description}
            whenToUse={technique.whenToUse}
            example={technique.example}
            benefit={technique.benefit}
            technicalDetails={technique.technicalDetails}
            examples={technique.examples}
          />
        ))}
      </div>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧠</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Principios de optimización</h3>
              <p className="text-blue-700 mb-3">
                La optimización de memoria se basa en dos principios fundamentales:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">Localidad espacial:</span>
                    <span> Acceder a datos que están cerca entre sí en memoria. Es como leer un libro página por página en lugar de saltar aleatoriamente.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Localidad temporal:</span>
                    <span> Reusar datos recientemente accedidos. Es como mantener las herramientas que usas frecuentemente cerca de tu mano mientras trabajas.</span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-700 mt-3">
                Estas técnicas ayudan a que los datos estén disponibles en las cachés rápidas en lugar 
                de tener que ir siempre a la memoria principal más lenta. Los mejoras pueden variar 
                desde un 20-30% hasta múltiples veces el rendimiento original, dependiendo de la 
                técnica aplicada y el patrón de acceso específico.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización de localidad:</div>
                <div className="font-mono text-sm">
                  <div>// Buena localidad espacial:</div>
                  <div>for (int i = 0; i &lt; N; i++) &#123;</div>
                  <div className="ml-4">array[i] = array[i] * 2; // Acceso secuencial</div>
                  <div>&#125;</div>
                  <div className="my-2 text-center text-red-500">// ↓ Mala localidad espacial ↓</div>
                  <div>for (int i = 0; i &lt; N; i++) &#123;</div>
                  <div className="ml-4">matrix[i][0] = matrix[i][0] * 2; // Acceso por columnas en matriz</div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}