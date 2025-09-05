import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BarrierTypeProps {
  type: "memory" | "compiler" | "cpu"
  name: string
  description: string
  purpose: string
  implementation: string
  useCases: string[]
}

export function BarrierType({ 
  type,
  name,
  description,
  purpose,
  implementation,
  useCases
}: BarrierTypeProps) {
  // Type icons and colors
  const typeInfo = {
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
    }
  }

  const currentType = typeInfo[type]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentType.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentType.color }}
      >
        <span className="mr-2 text-xl">{currentType.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="p-2 bg-gray-50 rounded">
          <div className="font-semibold text-sm mb-1">Propósito:</div>
          <div className="text-sm">{purpose}</div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Implementación:</div>
          <div className="font-mono text-xs bg-gray-800 text-white p-2 rounded">
            {implementation}
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Casos de uso:</div>
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
    </div>
  )
}

interface MemoryBarriersProps {
  barrierTypes: {
    type: "memory" | "compiler" | "cpu"
    name: string
    description: string
    purpose: string
    implementation: string
    useCases: string[]
  }[]
}

export function MemoryBarriers({ barrierTypes }: MemoryBarriersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🚧</span>
          Barreras de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué son las barreras de memoria?</div>
          <div className="text-sm text-blue-700 mt-1">
            Las barreras de memoria son instrucciones que aseguran el orden 
            de ejecución de operaciones de memoria, previniendo reordenamientos 
            por compilador o procesador.
          </div>
        </div>
        
        <div className="space-y-3">
          {barrierTypes.map((barrierType, index) => (
            <BarrierType
              key={index}
              type={barrierType.type}
              name={barrierType.name}
              description={barrierType.description}
              purpose={barrierType.purpose}
              implementation={barrierType.implementation}
              useCases={barrierType.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SynchronizationPrimitiveProps {
  primitive: "mutex" | "semaphore" | "condition" | "barrier"
  name: string
  description: string
  states: string[]
  operations: string[]
  useCases: string[]
}

export function SynchronizationPrimitive({ 
  primitive,
  name,
  description,
  states,
  operations,
  useCases
}: SynchronizationPrimitiveProps) {
  // Primitive icons and colors
  const primitiveInfo = {
    "mutex": {
      icon: "🔒",
      color: "#3b82f6"
    },
    "semaphore": {
      icon: "🚦",
      color: "#10b981"
    },
    "condition": {
      icon: "⏸️",
      color: "#8b5cf6"
    },
    "barrier": {
      icon: "🚧",
      color: "#f59e0b"
    }
  }

  const currentPrimitive = primitiveInfo[primitive]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentPrimitive.color }}
        >
          <span className="mr-2 text-xl">{currentPrimitive.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-2 text-green-600">Estados:</div>
              <ul className="space-y-1">
                {states.map((state, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-1 text-green-500">•</span>
                    <span>{state}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-blue-600">Operaciones:</div>
              <ul className="space-y-1">
                {operations.map((operation, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-1 text-blue-500">•</span>
                    <span>{operation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2 text-purple-600">Casos de uso:</div>
            <ul className="space-y-1">
              {useCases.map((useCase, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="mr-1 text-purple-500">•</span>
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

interface SynchronizationPrimitivesProps {
  primitives: {
    primitive: "mutex" | "semaphore" | "condition" | "barrier"
    name: string
    description: string
    states: string[]
    operations: string[]
    useCases: string[]
  }[]
}

export function SynchronizationPrimitives({ primitives }: SynchronizationPrimitivesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">🔗</span>
          Primitivas de Sincronización
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Qué son las primitivas de sincronización?</div>
          <div className="text-sm text-green-700 mt-1">
            Las primitivas de sincronización son mecanismos de bajo nivel 
            que permiten coordinar el acceso concurrente a recursos compartidos.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {primitives.map((primitive, index) => (
            <SynchronizationPrimitive
              key={index}
              primitive={primitive.primitive}
              name={primitive.name}
              description={primitive.description}
              states={primitive.states}
              operations={primitive.operations}
              useCases={primitive.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface BarrierVisualizationProps {
  threads: {
    id: number
    name: string
    state: "running" | "waiting" | "passed"
    progress: number
  }[]
  barrierPoint: number
  currentTime: number
  onTimeChange: (time: number) => void
}

export function BarrierVisualization({ 
  threads,
  barrierPoint,
  currentTime,
  onTimeChange
}: BarrierVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">🚧</span>
          Visualización de Barrera
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">Punto de sincronización</div>
          <div className="text-sm text-purple-700 mt-1">
            Todos los hilos deben llegar al punto de barrera antes de continuar.
          </div>
        </div>
        
        <div className="mb-6 relative h-32 bg-gray-50 rounded">
          {/* Timeline */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
          
          {/* Barrier point */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-red-500"
            style={{ left: `${barrierPoint}%` }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-red-600">
              Barrera
            </div>
          </div>
          
          {/* Threads */}
          {threads.map((thread, index) => (
            <div
              key={thread.id}
              className="absolute w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                left: `${thread.progress}%`,
                top: `${20 + index * 20}px`,
                backgroundColor: thread.state === "running" 
                  ? "#3b82f6" 
                  : thread.state === "waiting" 
                    ? "#f59e0b" 
                    : "#10b981"
              }}
            >
              T{thread.id}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="font-semibold text-blue-800 mb-1">Ejecutando</div>
            <div className="text-2xl font-bold text-blue-600">
              {threads.filter(t => t.state === "running").length}
            </div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="font-semibold text-yellow-800 mb-1">Esperando</div>
            <div className="text-2xl font-bold text-yellow-600">
              {threads.filter(t => t.state === "waiting").length}
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="font-semibold text-green-800 mb-1">Pasaron</div>
            <div className="text-2xl font-bold text-green-600">
              {threads.filter(t => t.state === "passed").length}
            </div>
          </div>
        </div>
        
        <div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentTime}
            onChange={(e) => onTimeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-500 mt-1">
            Tiempo: {currentTime}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AtomicOperationProps {
  operation: "load" | "store" | "exchange" | "compareExchange"
  name: string
  description: string
  atomicity: "sequential" | "processor" | "system"
  performance: "fast" | "medium" | "slow"
  useCases: string[]
}

export function AtomicOperation({ 
  operation,
  name,
  description,
  atomicity,
  performance,
  useCases
}: AtomicOperationProps) {
  // Operation icons and colors
  const operationInfo = {
    "load": {
      icon: "📥",
      color: "#3b82f6"
    },
    "store": {
      icon: "📤",
      color: "#10b981"
    },
    "exchange": {
      icon: "🔄",
      color: "#8b5cf6"
    },
    "compareExchange": {
      icon: "⚖️",
      color: "#f59e0b"
    }
  }

  const atomicityInfo = {
    "sequential": { label: "Secuencial", color: "#3b82f6" },
    "processor": { label: "Procesador", color: "#10b981" },
    "system": { label: "Sistema", color: "#ef4444" }
  }

  const performanceInfo = {
    "fast": { label: "Rápida", color: "#10b981" },
    "medium": { label: "Media", color: "#f59e0b" },
    "slow": { label: "Lenta", color: "#ef4444" }
  }

  const currentOperation = operationInfo[operation]
  const currentAtomicity = atomicityInfo[atomicity]
  const currentPerformance = performanceInfo[performance]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentOperation.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentOperation.color }}
      >
        <span className="mr-2 text-xl">{currentOperation.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: `${currentAtomicity.color}20` }}
          >
            <div className="text-xs text-gray-500">Atomicidad</div>
            <div 
              className="font-semibold"
              style={{ color: currentAtomicity.color }}
            >
              {currentAtomicity.label}
            </div>
          </div>
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: `${currentPerformance.color}20` }}
          >
            <div className="text-xs text-gray-500">Rendimiento</div>
            <div 
              className="font-semibold"
              style={{ color: currentPerformance.color }}
            >
              {currentPerformance.label}
            </div>
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Casos de uso:</div>
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
    </div>
  )
}

interface AtomicOperationsProps {
  operations: {
    operation: "load" | "store" | "exchange" | "compareExchange"
    name: string
    description: string
    atomicity: "sequential" | "processor" | "system"
    performance: "fast" | "medium" | "slow"
    useCases: string[]
  }[]
}

export function AtomicOperations({ operations }: AtomicOperationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <span className="mr-2">⚛️</span>
          Operaciones Atómicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <div className="font-semibold text-orange-800">¿Qué son las operaciones atómicas?</div>
          <div className="text-sm text-orange-700 mt-1">
            Las operaciones atómicas son instrucciones indivisibles que 
            garantizan la consistencia en accesos concurrentes a memoria.
          </div>
        </div>
        
        <div className="space-y-3">
          {operations.map((operation, index) => (
            <AtomicOperation
              key={index}
              operation={operation.operation}
              name={operation.name}
              description={operation.description}
              atomicity={operation.atomicity}
              performance={operation.performance}
              useCases={operation.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryOrderingProps {
  ordering: "sequential" | "acquire" | "release" | "relaxed"
  name: string
  description: string
  guarantees: string[]
  performance: "slow" | "medium" | "fast"
  example: string
}

export function MemoryOrdering({ 
  ordering,
  name,
  description,
  guarantees,
  performance,
  example
}: MemoryOrderingProps) {
  // Ordering icons and colors
  const orderingInfo = {
    "sequential": {
      icon: "🔒",
      color: "#3b82f6"
    },
    "acquire": {
      icon: "📥",
      color: "#10b981"
    },
    "release": {
      icon: "📤",
      color: "#8b5cf6"
    },
    "relaxed": {
      icon: "🔄",
      color: "#f59e0b"
    }
  }

  const performanceInfo = {
    "slow": { label: "Lenta", color: "#ef4444" },
    "medium": { label: "Media", color: "#f59e0b" },
    "fast": { label: "Rápida", color: "#10b981" }
  }

  const currentOrdering = orderingInfo[ordering]
  const currentPerformance = performanceInfo[performance]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentOrdering.color }}
        >
          <span className="mr-2 text-xl">{currentOrdering.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: `${currentPerformance.color}20` }}
          >
            <div className="font-semibold text-sm mb-1">Rendimiento</div>
            <div 
              className="font-semibold"
              style={{ color: currentPerformance.color }}
            >
              {currentPerformance.label}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2 text-green-600">Garantías:</div>
            <ul className="space-y-1">
              {guarantees.map((guarantee, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="mr-1 text-green-500">✓</span>
                  <span>{guarantee}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-semibold mb-1 text-blue-600">Ejemplo:</div>
            <div className="font-mono text-xs bg-gray-800 text-white p-2 rounded">
              {example}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryOrderingsProps {
  orderings: {
    ordering: "sequential" | "acquire" | "release" | "relaxed"
    name: string
    description: string
    guarantees: string[]
    performance: "slow" | "medium" | "fast"
    example: string
  }[]
}

export function MemoryOrderings({ orderings }: MemoryOrderingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <span className="mr-2">📐</span>
          Ordenamiento de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800">¿Qué es el ordenamiento de memoria?</div>
          <div className="text-sm text-red-700 mt-1">
            El ordenamiento de memoria define las garantías sobre el orden 
            en que las operaciones de memoria se ven por otros hilos.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderings.map((ordering, index) => (
            <MemoryOrdering
              key={index}
              ordering={ordering.ordering}
              name={ordering.name}
              description={ordering.description}
              guarantees={ordering.guarantees}
              performance={ordering.performance}
              example={ordering.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}