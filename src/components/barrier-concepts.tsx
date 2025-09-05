import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemoryBarrierConceptProps {
  barrier: "memory" | "compiler" | "cpu" | "sequential"
  name: string
  description: string
  purpose: string
  implementation: string
  useCases: string[]
  technicalDetails: string
  examples: string[]
}

export function MemoryBarrierConcept({ 
  barrier,
  name,
  description,
  purpose,
  implementation,
  useCases,
  technicalDetails,
  examples
}: MemoryBarrierConceptProps) {
  // Barrier icons and colors
  const barrierInfo = {
    "memory": {
      icon: "🛡️",
      color: "#3b82f6"
    },
    "compiler": {
      icon: "💻",
      color: "#10b981"
    },
    "cpu": {
      icon: "⚙️",
      color: "#8b5cf6"
    },
    "sequential": {
      icon: "🔒",
      color: "#f59e0b"
    }
  }

  const currentBarrier = barrierInfo[barrier]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentBarrier.color }}
        >
          <span className="mr-2 text-2xl">{currentBarrier.icon}</span>
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
              <span className="mr-2 text-green-800">🎯</span>
              <span className="text-green-800">Propósito</span>
            </div>
            <div className="text-green-700">
              {purpose}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Implementación:</div>
            <div className="font-mono text-sm bg-gray-800 text-white p-3 rounded">
              {implementation}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-2">Casos de uso:</div>
              <ul className="space-y-2">
                {useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-gray-500">•</span>
                    <span className="text-gray-700">{useCase}</span>
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
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryBarrierConceptsProps {
  barriers: {
    barrier: "memory" | "compiler" | "cpu" | "sequential"
    name: string
    description: string
    purpose: string
    implementation: string
    useCases: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function MemoryBarrierConcepts({ barriers }: MemoryBarrierConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Barreras de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Las barreras de memoria son instrucciones que aseguran el orden 
          de ejecución de operaciones de memoria, previniendo reordenamientos 
          por compilador o procesador. Son esenciales en programación concurrente 
          para garantizar la correcta sincronización entre hilos. Es como tener 
          un semáforo en una intersección complicada que asegura que los coches 
          pasen en el orden correcto.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {barriers.map((barrier, index) => (
          <MemoryBarrierConcept
            key={index}
            barrier={barrier.barrier}
            name={barrier.name}
            description={barrier.description}
            purpose={barrier.purpose}
            implementation={barrier.implementation}
            useCases={barrier.useCases}
            technicalDetails={barrier.technicalDetails}
            examples={barrier.examples}
          />
        ))}
      </div>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🚧</span>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">¿Por qué son necesarias?</h3>
              <p className="text-red-700 mb-3">
                Las barreras de memoria son necesarias porque:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Optimizaciones del compilador:</span>
                    <span> Pueden reordenar instrucciones para mejorar el rendimiento</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Optimizaciones del procesador:</span>
                    <span> Ejecutan instrucciones fuera de orden cuando es seguro hacerlo</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Sistemas multiprocesador:</span>
                    <span> Cada núcleo puede tener su propia visión del orden de las operaciones</span>
                  </div>
                </li>
              </ul>
              <p className="text-red-700 mt-3">
                Sin barreras de memoria, estos reordenamientos pueden causar 
                comportamientos inesperados en programas concurrentes, especialmente 
                en estructuras de datos compartidas y algoritmos de sincronización. 
                Las barreras actúan como puntos de sincronización que aseguran 
                que todas las operaciones anteriores se completen antes de que 
                comiencen las posteriores.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del reordenamiento:</div>
                <div className="font-mono text-sm">
                  <div>// Código original:</div>
                  <div>a = 1;</div>
                  <div>b = 2;</div>
                  <div className="my-2 text-center text-red-500">// ↓ Sin barrera, podría reordenarse a ↓</div>
                  <div>// Código reordenado (posible):</div>
                  <div>b = 2;</div>
                  <div>a = 1;</div>
                  <div className="my-2 text-center text-green-500">// ↑ Con barrera, se garantiza el orden original ↑</div>
                  <div>// Código con barrera:</div>
                  <div>a = 1;</div>
                  <div>memory_barrier();</div>
                  <div>b = 2;</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}