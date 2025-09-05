import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConsistencyModelProps {
  name: string
  description: string
  characteristics: string[]
  color: string
}

export function ConsistencyModel({ 
  name, 
  description, 
  characteristics,
  color
}: ConsistencyModelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="text-center"
          style={{ color }}
        >
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          {description}
        </div>
        <div className="space-y-2">
          {characteristics.map((char, index) => (
            <div key={index} className="flex items-start">
              <div 
                className="w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0"
                style={{ backgroundColor: color }}
              ></div>
              <div className="text-sm">{char}</div>
            </div>
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
  committed: boolean
}

interface ConsistencyVisualizationProps {
  operations: MemoryOperationProps[]
  model: "SC" | "TSO" | "RC"
  onExecute: (id: number) => void
  onCommit: (id: number) => void
}

export function ConsistencyVisualization({ 
  operations, 
  model,
  onExecute,
  onCommit
}: ConsistencyVisualizationProps) {
  // Model descriptions
  const modelInfo = {
    "SC": {
      name: "Sequential Consistency",
      color: "#3b82f6",
      description: "Las operaciones parecen ejecutarse en un orden global secuencial",
      characteristics: [
        "Todas las operaciones de todos los cores parecen ejecutarse en un orden secuencial",
        "El orden de ejecución respeta el orden del programa en cada core",
        "Proporciona la ilusión de una memoria global instantánea"
      ]
    },
    "TSO": {
      name: "Total Store Ordering",
      color: "#10b981",
      description: "Las operaciones de almacenamiento se ordenan globalmente",
      characteristics: [
        "Las operaciones de carga pueden reordenarse antes de las operaciones de almacenamiento",
        "Las operaciones de almacenamiento se ven en orden global",
        "Usado en arquitecturas x86"
      ]
    },
    "RC": {
      name: "Release Consistency",
      color: "#8b5cf6",
      description: "Sincronización explícita para ordenar operaciones",
      characteristics: [
        "Requiere primitivas de sincronización explícitas (fences)",
        "Las operaciones de adquisición ven todas las operaciones de liberación anteriores",
        "Permite más reordenamiento para mejor rendimiento"
      ]
    }
  }

  const currentModel = modelInfo[model]

  return (
    <div className="space-y-6">
      <ConsistencyModel
        name={currentModel.name}
        description={currentModel.description}
        characteristics={currentModel.characteristics}
        color={currentModel.color}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Operaciones de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {operations.map(op => (
              <div 
                key={op.id}
                className={`
                  border rounded p-3 transition-all duration-200
                  ${op.committed 
                    ? "bg-green-50 border-green-200" 
                    : op.executed 
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"}
                `}
              >
                <div className="flex justify-between items-center">
                  <div className="font-mono">
                    Core {op.coreId}: {op.operation} {op.address} = {op.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    t={op.timestamp}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  {!op.executed && (
                    <button
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                      onClick={() => onExecute(op.id)}
                    >
                      Ejecutar
                    </button>
                  )}
                  {op.executed && !op.committed && (
                    <button
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                      onClick={() => onCommit(op.id)}
                    >
                      Confirmar
                    </button>
                  )}
                  {op.committed && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                      Confirmado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface FenceVisualizationProps {
  operations: {
    id: number
    coreId: number
    operation: "Load" | "Store" | "Fence"
    address?: number
    value?: number
    timestamp: number
    executed: boolean
    committed: boolean
  }[]
  onExecute: (id: number) => void
  onCommit: (id: number) => void
}

export function FenceVisualization({ 
  operations, 
  onExecute,
  onCommit
}: FenceVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Barreras de Memoria (Fences)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="font-semibold text-yellow-800">¿Qué es una barrera de memoria?</div>
          <div className="text-sm text-yellow-700 mt-1">
            Una barrera de memoria (fence) es una instrucción que fuerza el orden de ejecución de 
            operaciones de memoria. Previene que operaciones anteriores se reordenen con operaciones 
            posteriores.
          </div>
        </div>
        
        <div className="space-y-3">
          {operations.map(op => (
            <div 
              key={op.id}
              className={`
                border rounded p-3 transition-all duration-200
                ${op.operation === "Fence" 
                  ? "bg-red-50 border-red-200" 
                  : op.committed 
                    ? "bg-green-50 border-green-200" 
                    : op.executed 
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="font-mono">
                  Core {op.coreId}: {op.operation}
                  {op.operation !== "Fence" && ` ${op.address} = ${op.value}`}
                </div>
                <div className="text-xs text-gray-500">
                  t={op.timestamp}
                </div>
              </div>
              
              {op.operation !== "Fence" && (
                <div className="flex gap-2 mt-2">
                  {!op.executed && (
                    <button
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                      onClick={() => onExecute(op.id)}
                    >
                      Ejecutar
                    </button>
                  )}
                  {op.executed && !op.committed && (
                    <button
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                      onClick={() => onCommit(op.id)}
                    >
                      Confirmar
                    </button>
                  )}
                  {op.committed && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                      Confirmado
                    </span>
                  )}
                </div>
              )}
              
              {op.operation === "Fence" && (
                <div className="text-xs text-red-700 mt-1">
                  Barrera: Previene reordenamiento de operaciones
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}