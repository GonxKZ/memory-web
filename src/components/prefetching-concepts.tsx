import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PrefetchingConceptProps {
  concept: "hardware" | "software" | "stream" | "stride"
  name: string
  description: string
  advantages: string[]
  disadvantages: string[]
  technicalDetails: string
  examples: string[]
}

export function PrefetchingConcept({ 
  concept,
  name,
  description,
  advantages,
  disadvantages,
  technicalDetails,
  examples
}: PrefetchingConceptProps) {
  // Concept icons and colors
  const conceptInfo = {
    "hardware": {
      icon: "⚙️",
      color: "#3b82f6"
    },
    "software": {
      icon: "💻",
      color: "#10b981"
    },
    "stream": {
      icon: "🌊",
      color: "#8b5cf6"
    },
    "stride": {
      icon: "🔢",
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

interface PrefetchingConceptsProps {
  concepts: {
    concept: "hardware" | "software" | "stream" | "stride"
    name: string
    description: string
    advantages: string[]
    disadvantages: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function PrefetchingConcepts({ concepts }: PrefetchingConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Prefetching (Precarga)</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          El prefetching anticipa qué datos se necesitarán en el futuro y los carga en caché 
          antes de que se soliciten. Es como preparar ropa para mañana por la noche, o poner 
          agua a calentar antes de que te quieras hacer café. Esta técnica puede mejorar 
          significativamente el rendimiento al ocultar la latencia de acceso a memoria.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <PrefetchingConcept
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
            <span className="text-2xl mr-3">🔮</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona el prefetching?</h3>
              <p className="text-blue-700 mb-3">
                El prefetching se basa en reconocer patrones de acceso a memoria:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">Detección de patrones:</span>
                    <span> El sistema observa cómo se accede a la memoria para identificar secuencias</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Predicción:</span>
                    <span> Basándose en los patrones, predice qué datos se necesitarán próximamente</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">Precarga:</span>
                    <span> Carga los datos predichos en caché antes de que se soliciten</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">4.</span>
                  <div>
                    <span className="font-semibold">Uso:</span>
                    <span> Cuando el programa realmente necesita los datos, ya están en la caché rápida</span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-700 mt-3">
                El éxito del prefetching depende de la precisión de las predicciones: 
                cargar datos correctos mejora el rendimiento, pero cargar datos innecesarios 
                puede empeorarlo.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de prefetching:</div>
                <div className="font-mono text-sm">
                  <div>// Sin prefetching:</div>
                  <div>for (int i = 0; i &lt; n; i++) &#123;</div>
                  <div className="ml-4">process(data[i]); // Espera acceso a memoria</div>
                  <div>&#125;</div>
                  <div className="my-2 text-center text-red-500">// ↓ Con prefetching ↓</div>
                  <div>// Con prefetching:</div>
                  <div>for (int i = 0; i &lt; n; i++) &#123;</div>
                  <div className="ml-4">__builtin_prefetch(&amp;data[i+10]); // Cargar datos futuros</div>
                  <div className="ml-4">process(data[i]); // Datos ya en caché</div>
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