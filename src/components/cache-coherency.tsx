import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CoherencyProtocolProps {
  protocol: "mesi" | "mosi" | "moesi" | "firefly"
  name: string
  description: string
  states: {
    state: "modified" | "exclusive" | "shared" | "invalid" | "owned"
    name: string
    description: string
  }[]
  transitions: {
    from: "modified" | "exclusive" | "shared" | "invalid" | "owned"
    to: "modified" | "exclusive" | "shared" | "invalid" | "owned"
    event: string
    description: string
  }[]
  advantages: string[]
  disadvantages: string[]
}

export function CoherencyProtocol({ 
  protocol,
  name,
  description,
  states,
  transitions,
  advantages,
  disadvantages
}: CoherencyProtocolProps) {
  // Protocol icons and colors
  const protocolInfo = {
    "mesi": {
      icon: "🔍",
      color: "#3b82f6"
    },
    "mosi": {
      icon: "👁️",
      color: "#10b981"
    },
    "moesi": {
      icon: "🔄",
      color: "#8b5cf6"
    },
    "firefly": {
      icon: "🦋",
      color: "#f59e0b"
    }
  }

  const currentState = protocolInfo[protocol]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentState.color }}
        >
          <span className="mr-2 text-xl">{currentState.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div>
            <div className="font-semibold mb-2 text-green-600">Estados:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {states.map((state, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-sm">{state.name}</div>
                  <div className="text-xs text-gray-600">{state.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2 text-blue-600">Transiciones:</div>
            <div className="space-y-2">
              {transitions.map((transition, index) => (
                <div key={index} className="p-2 bg-white border rounded">
                  <div className="font-semibold text-sm">
                    {transition.from.toUpperCase()} → {transition.to.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600">{transition.event}</div>
                  <div className="text-xs text-gray-500 mt-1">{transition.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-2 text-green-600">Ventajas:</div>
              <ul className="space-y-1">
                {advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-1 text-green-500">✓</span>
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-red-600">Desventajas:</div>
              <ul className="space-y-1">
                {disadvantages.map((disadvantage, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-1 text-red-500">✗</span>
                    <span>{disadvantage}</span>
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

interface CacheCoherencyProtocolsProps {
  protocols: {
    protocol: "mesi" | "mosi" | "moesi" | "firefly"
    name: string
    description: string
    states: {
      state: "modified" | "exclusive" | "shared" | "invalid" | "owned"
      name: string
      description: string
    }[]
    transitions: {
      from: "modified" | "exclusive" | "shared" | "invalid" | "owned"
      to: "modified" | "exclusive" | "shared" | "invalid" | "owned"
      event: string
      description: string
    }[]
    advantages: string[]
    disadvantages: string[]
  }[]
}

export function CacheCoherencyProtocols({ protocols }: CacheCoherencyProtocolsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🔄</span>
          Protocolos de Coherencia de Caché
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la coherencia de caché?</div>
          <div className="text-sm text-blue-700 mt-1">
            La coherencia de caché asegura que múltiples copias de datos 
            en diferentes cachés permanezcan consistentes entre sí.
          </div>
        </div>
        
        <div className="space-y-4">
          {protocols.map((protocol, index) => (
            <CoherencyProtocol
              key={index}
              protocol={protocol.protocol}
              name={protocol.name}
              description={protocol.description}
              states={protocol.states}
              transitions={protocol.transitions}
              advantages={protocol.advantages}
              disadvantages={protocol.disadvantages}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CacheStateProps {
  state: "modified" | "exclusive" | "shared" | "invalid" | "owned"
  name: string
  description: string
  color: string
  icon: string
}

interface CacheLineProps {
  id: number
  tag: number | null
  state: "modified" | "exclusive" | "shared" | "invalid" | "owned"
  data: number
  owner: number | null
}

interface CacheCoherencyVisualizationProps {
  cores: {
    id: number
    cacheLines: CacheLineProps[]
  }[]
  memory: {
    address: number
    value: number
  }[]
  protocolStates: CacheStateProps[]
  currentTime: number
  onTimeChange: (time: number) => void
}

export function CacheCoherencyVisualization({ 
  cores,
  memory,
  protocolStates,
  currentTime,
  onTimeChange
}: CacheCoherencyVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">🔬</span>
          Visualización de Coherencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Estados de coherencia</div>
          <div className="text-sm text-green-700 mt-1">
            Visualiza cómo los estados de caché cambian para mantener la coherencia.
          </div>
        </div>
        
        <div className="mb-6">
          <div className="font-semibold mb-2">Leyenda de estados:</div>
          <div className="flex flex-wrap gap-2">
            {protocolStates.map((state, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${state.color}20`,
                  color: state.color
                }}
              >
                <span className="mr-1">{state.icon}</span>
                <span>{state.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {cores.map((core, coreIndex) => (
            <div key={coreIndex} className="p-3 bg-gray-50 rounded">
              <div className="font-semibold mb-2">Core {core.id}</div>
              <div className="space-y-2">
                {core.cacheLines.map((line, lineIndex) => {
                  const stateInfo = protocolStates.find(s => s.state === line.state)
                  return (
                    <div
                      key={lineIndex}
                      className="p-2 rounded border flex justify-between items-center"
                      style={{ 
                        borderColor: stateInfo?.color,
                        backgroundColor: `${stateInfo?.color}10`
                      }}
                    >
                      <div>
                        <div className="font-mono text-sm">
                          Tag: {line.tag !== null ? line.tag : "Vacío"}
                        </div>
                        <div className="font-mono text-sm">
                          Data: {line.data}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs" style={{ color: stateInfo?.color }}>
                          {stateInfo?.icon} {stateInfo?.name}
                        </div>
                        {line.owner !== null && (
                          <div className="text-xs text-gray-500">
                            Owner: Core {line.owner}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-gray-50 rounded">
          <div className="font-semibold mb-2">Memoria principal:</div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {memory.map((cell, index) => (
              <div
                key={index}
                className="p-2 bg-white border rounded text-center"
              >
                <div className="text-xs text-gray-500">0x{index.toString(16)}</div>
                <div className="font-mono">{cell.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
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

interface SnoopingProtocolProps {
  protocol: "bus" | "directory"
  name: string
  description: string
  scalability: "low" | "medium" | "high"
  complexity: "low" | "medium" | "high"
  bandwidth: "low" | "medium" | "high"
  useCases: string[]
}

export function SnoopingProtocol({ 
  protocol,
  name,
  description,
  scalability,
  complexity,
  bandwidth,
  useCases
}: SnoopingProtocolProps) {
  // Protocol icons and colors
  const protocolInfo = {
    "bus": {
      icon: "🚌",
      color: "#3b82f6"
    },
    "directory": {
      icon: "📁",
      color: "#10b981"
    }
  }

  const scalabilityInfo = {
    "low": { label: "Baja", color: "#ef4444" },
    "medium": { label: "Media", color: "#f59e0b" },
    "high": { label: "Alta", color: "#10b981" }
  }

  const complexityInfo = {
    "low": { label: "Baja", color: "#10b981" },
    "medium": { label: "Media", color: "#f59e0b" },
    "high": { label: "Alta", color: "#ef4444" }
  }

  const bandwidthInfo = {
    "low": { label: "Bajo", color: "#ef4444" },
    "medium": { label: "Medio", color: "#f59e0b" },
    "high": { label: "Alto", color: "#10b981" }
  }

  const currentProtocol = protocolInfo[protocol]
  const currentScalability = scalabilityInfo[scalability]
  const currentComplexity = complexityInfo[complexity]
  const currentBandwidth = bandwidthInfo[bandwidth]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentProtocol.color }}
        >
          <span className="mr-2 text-xl">{currentProtocol.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div 
              className="p-2 rounded text-center"
              style={{ backgroundColor: `${currentScalability.color}20` }}
            >
              <div className="text-xs text-gray-500">Escalabilidad</div>
              <div 
                className="font-semibold"
                style={{ color: currentScalability.color }}
              >
                {currentScalability.label}
              </div>
            </div>
            <div 
              className="p-2 rounded text-center"
              style={{ backgroundColor: `${currentComplexity.color}20` }}
            >
              <div className="text-xs text-gray-500">Complejidad</div>
              <div 
                className="font-semibold"
                style={{ color: currentComplexity.color }}
              >
                {currentComplexity.label}
              </div>
            </div>
            <div 
              className="p-2 rounded text-center"
              style={{ backgroundColor: `${currentBandwidth.color}20` }}
            >
              <div className="text-xs text-gray-500">Ancho de banda</div>
              <div 
                className="font-semibold"
                style={{ color: currentBandwidth.color }}
              >
                {currentBandwidth.label}
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2 text-purple-600">Casos de uso:</div>
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

interface SnoopingProtocolsProps {
  protocols: {
    protocol: "bus" | "directory"
    name: string
    description: string
    scalability: "low" | "medium" | "high"
    complexity: "low" | "medium" | "high"
    bandwidth: "low" | "medium" | "high"
    useCases: string[]
  }[]
}

export function SnoopingProtocols({ protocols }: SnoopingProtocolsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">📡</span>
          Protocolos de Snooping
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué es el snooping?</div>
          <div className="text-sm text-purple-700 mt-1">
            El snooping es una técnica donde las cachés monitorizan el bus 
            de memoria para mantener la coherencia entre copias.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocols.map((protocol, index) => (
            <SnoopingProtocol
              key={index}
              protocol={protocol.protocol}
              name={protocol.name}
              description={protocol.description}
              scalability={protocol.scalability}
              complexity={protocol.complexity}
              bandwidth={protocol.bandwidth}
              useCases={protocol.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CoherencyEventProps {
  event: "read" | "write" | "invalidate" | "flush"
  name: string
  description: string
  effect: string
  example: string
}

export function CoherencyEvent({ 
  event,
  name,
  description,
  effect,
  example
}: CoherencyEventProps) {
  // Event icons and colors
  const eventInfo = {
    "read": {
      icon: "📥",
      color: "#3b82f6"
    },
    "write": {
      icon: "📤",
      color: "#10b981"
    },
    "invalidate": {
      icon: "❌",
      color: "#ef4444"
    },
    "flush": {
      icon: "🧹",
      color: "#8b5cf6"
    }
  }

  const currentEvent = eventInfo[event]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentEvent.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentEvent.color }}
      >
        <span className="mr-2 text-xl">{currentEvent.icon}</span>
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

interface CoherencyEventsProps {
  events: {
    event: "read" | "write" | "invalidate" | "flush"
    name: string
    description: string
    effect: string
    example: string
  }[]
}

export function CoherencyEvents({ events }: CoherencyEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <span className="mr-2">⚡</span>
          Eventos de Coherencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <div className="font-semibold text-orange-800">¿Qué eventos afectan la coherencia?</div>
          <div className="text-sm text-orange-700 mt-1">
            Diferentes eventos en el sistema desencadenan acciones de 
            coherencia para mantener la consistencia de datos.
          </div>
        </div>
        
        <div className="space-y-3">
          {events.map((event, index) => (
            <CoherencyEvent
              key={index}
              event={event.event}
              name={event.name}
              description={event.description}
              effect={event.effect}
              example={event.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}