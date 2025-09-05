import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConsistencyModelProps {
  model: "SC" | "TSO" | "RC" | "PC"
  name: string
  description: string
  characteristics: string[]
  color: string
  technicalDetails: string
  examples: string[]
}

export function ConsistencyModel({ 
  name, 
  description, 
  characteristics,
  color,
  technicalDetails,
  examples
}: ConsistencyModelProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle 
          className="text-center"
          style={{ color }}
        >
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
          
          <div className="space-y-3">
            {characteristics.map((char, index) => (
              <div key={index} className="flex items-start">
                <div 
                  className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0"
                  style={{ backgroundColor: color }}
                ></div>
                <div className="text-gray-700">{char}</div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-semibold mb-2">💡 Ejemplos:</div>
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

interface ConsistencyModelsProps {
  models: {
    model: "SC" | "TSO" | "RC" | "PC"
    name: string
    description: string
    characteristics: string[]
    color: string
    technicalDetails: string
    examples: string[]
  }[]
}

export function ConsistencyModels({ models }: ConsistencyModelsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Modelos de Consistencia de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          En sistemas con múltiples procesadores o núcleos, los modelos de consistencia definen 
          cómo se ven las operaciones de memoria entre diferentes partes del sistema. Estos modelos 
          establecen un contrato entre el programador y el sistema, asegurando que si se siguen 
          ciertas reglas, los resultados serán predecibles. Es fundamental para entender cómo 
          funcionan los sistemas multiprocesador modernos.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model, index) => (
          <ConsistencyModel
            key={index}
            model={model.model}
            name={model.name}
            description={model.description}
            characteristics={model.characteristics}
            color={model.color}
            technicalDetails={model.technicalDetails}
            examples={model.examples}
          />
        ))}
      </div>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔄</span>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">¿Por qué necesitamos modelos de consistencia?</h3>
              <p className="text-purple-700 mb-3">
                Imagina que estás organizando una fiesta con amigos en diferentes habitaciones:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">Consistencia Secuencial (SC):</span>
                    <span> Como tener un anfitrión que coordina todo y todos los invitados ven los eventos en el mismo orden</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Ordenamiento Total de Almacenamiento (TSO):</span>
                    <span> Como permitir que algunas personas vean ciertos eventos en diferente orden, pero mantener el orden de eventos importantes</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">Consistencia de Liberación (RC):</span>
                    <span> Como requerir que ciertos eventos importantes se anuncien a todos antes de continuar</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">4.</span>
                  <div>
                    <span className="font-semibold">Consistencia de Procesador (PC):</span>
                    <span> Como permitir que cada habitación tenga su propia versión de los eventos</span>
                  </div>
                </li>
              </ul>
              <p className="text-purple-700 mt-3">
                Cada modelo ofrece un equilibrio diferente entre facilidad de programación y rendimiento del sistema.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del orden de operaciones:</div>
                <div className="font-mono text-sm">
                  <div className="mb-2">
                    <div className="font-semibold">Procesador 1:</div>
                    <div>x = 1;</div>
                    <div>y = 2;</div>
                  </div>
                  <div>
                    <div className="font-semibold">Procesador 2:</div>
                    <div>r1 = y;</div>
                    <div>r2 = x;</div>
                  </div>
                  <div className="mt-2">
                    <div className="font-semibold">Posibles resultados:</div>
                    <div>SC: r1=2, r2=1 (solo este orden es válido)</div>
                    <div>TSO: r1=2, r2=1 o r1=0, r2=1 (lecturas pueden reordenarse antes de escrituras)</div>
                    <div>RC: Requiere primitivas de sincronización explícitas</div>
                    <div>PC: Cualquier combinación posible (r1=0/2, r2=0/1)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}