import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConsistencyModelProps {
  model: "sc" | "tso" | "pso" | "rmo" | "pc"
  name: string
  description: string
  ordering: string
  example: string
  useCases: string[]
}

export function ConsistencyModel({ 
  model,
  name,
  description,
  ordering,
  example,
  useCases
}: ConsistencyModelProps) {
  // Model icons and colors
  const modelInfo = {
    "sc": {
      icon: "🔒",
      color: "#3b82f6"
    },
    "tso": {
      icon: "🔄",
      color: "#10b981"
    },
    "pso": {
      icon: "🔁",
      color: "#f59e0b"
    },
    "rmo": {
      icon: "🔀",
      color: "#8b5cf6"
    },
    "pc": {
      icon: "🔓",
      color: "#ef4444"
    }
  }

  const currentModel = modelInfo[model]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentModel.color }}
        >
          <span className="mr-2 text-xl">{currentModel.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-semibold mb-1">Ordenamiento:</div>
            <div className="text-sm">{ordering}</div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Ejemplo:</div>
            <div className="font-mono text-sm bg-gray-800 text-white p-2 rounded">
              {example}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Casos de uso:</div>
            <ul className="space-y-1">
              {useCases.map((useCase, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="mr-1">•</span>
                  <span>{useCase}</span>
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
    model: "sc" | "tso" | "pso" | "rmo" | "pc"
    name: string
    description: string
    ordering: string
    example: string
    useCases: string[]
  }[]
}

export function ConsistencyModels({ models }: ConsistencyModelsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modelos de Consistencia de Memoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la consistencia de memoria?</div>
          <div className="text-sm text-blue-700 mt-1">
            Los modelos de consistencia definen las garantías sobre el orden en que 
            las operaciones de memoria se ven por diferentes procesadores.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model, index) => (
            <ConsistencyModel
              key={index}
              model={model.model}
              name={model.name}
              description={model.description}
              ordering={model.ordering}
              example={model.example}
              useCases={model.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryOperationProps {
  id: number
  coreId: number
  operation: "Load" | "Store"
  address: number
  value: number
  timestamp: number
  executed: boolean
  visible: boolean
}

interface ConsistencyVisualizationProps {
  operations: MemoryOperationProps[]
  model: "sc" | "tso" | "pso" | "rmo" | "pc"
  currentTime: number
  onTimeChange: (time: number) => void
}

export function ConsistencyVisualization({ 
  operations, 
  model,
  currentTime,
  onTimeChange
}: ConsistencyVisualizationProps) {
  // Model names
  const modelNames = {
    "sc": "Consistencia Secuencial",
    "tso": "Orden Total de Almacenamiento",
    "pso": "Orden de Almacenamiento Parcial",
    "rmo": "Orden de Memoria Relajada",
    "pc": "Coherencia de Publicación"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualización de Consistencia: {modelNames[model]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="font-semibold mb-2">Línea de tiempo de operaciones:</div>
          <div className="flex flex-wrap gap-1">
            {operations.map((op, index) => (
              <div
                key={op.id}
                className={`
                  px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200
                  ${index <= currentTime 
                    ? op.executed 
                      ? "bg-green-500 text-white" 
                      : "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700"}
                `}
                onClick={() => onTimeChange(index)}
              >
                Core {op.coreId}: {op.operation} {op.address}
              </div>
            ))}
          </div>
          
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max={operations.length - 1}
              value={currentTime}
              onChange={(e) => onTimeChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-500 mt-1">
              Tiempo: {currentTime + 1} / {operations.length}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {operations.slice(0, currentTime + 1).map((op) => (
            <div 
              key={op.id}
              className={`
                p-3 rounded border
                ${op.executed 
                  ? op.visible 
                    ? "bg-green-50 border-green-200" 
                    : "bg-yellow-50 border-yellow-200"
                  : "bg-gray-50 border-gray-200"}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="font-mono">
                  Core {op.coreId}: {op.operation} dirección {op.address}
                  {op.operation === "Store" && ` = ${op.value}`}
                </div>
                <div className="text-xs text-gray-500">
                  t={op.timestamp}
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <div className={`px-2 py-1 rounded text-xs ${op.executed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {op.executed ? "Ejecutado" : "Pendiente"}
                </div>
                {op.executed && (
                  <div className={`px-2 py-1 rounded text-xs ${op.visible ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {op.visible ? "Visible" : "No visible"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface FenceOperationProps {
  type: "mfence" | "lfence" | "sfence"
  name: string
  description: string
  effect: string
  example: string
}

export function FenceOperation({ 
  type,
  name,
  description,
  effect,
  example
}: FenceOperationProps) {
  // Fence icons and colors
  const fenceInfo = {
    "mfence": {
      icon: "🔒",
      color: "#3b82f6"
    },
    "lfence": {
      icon: "⬇️",
      color: "#10b981"
    },
    "sfence": {
      icon: "⬆️",
      color: "#f59e0b"
    }
  }

  const currentFence = fenceInfo[type]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentFence.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentFence.color }}
      >
        <span className="mr-2 text-xl">{currentFence.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="p-2 bg-gray-50 rounded">
          <div className="font-semibold text-sm mb-1">Efecto:</div>
          <div className="text-sm">{effect}</div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Ejemplo:</div>
          <div className="font-mono text-xs bg-gray-800 text-white p-2 rounded">
            {example}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MemoryFencesProps {
  fences: {
    type: "mfence" | "lfence" | "sfence"
    name: string
    description: string
    effect: string
    example: string
  }[]
}

export function MemoryFences({ fences }: MemoryFencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Barreras de Memoria (Fences)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Qué son las barreras de memoria?</div>
          <div className="text-sm text-green-700 mt-1">
            Las barreras de memoria son instrucciones que fuerzan el orden de ejecución 
            de operaciones de memoria, previniendo reordenamientos no deseados.
          </div>
        </div>
        
        <div className="space-y-3">
          {fences.map((fence, index) => (
            <FenceOperation
              key={index}
              type={fence.type}
              name={fence.name}
              description={fence.description}
              effect={fence.effect}
              example={fence.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}