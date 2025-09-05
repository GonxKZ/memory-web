import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GPUMemoryTypeProps {
  type: "global" | "shared" | "constant" | "texture" | "local"
  name: string
  description: string
  size: string
  bandwidth: string
  latency: string
  scope: "thread" | "block" | "grid" | "device"
  cache: boolean
}

export function GPUMemoryType({ 
  type,
  name,
  description,
  size,
  bandwidth,
  latency,
  scope,
  cache
}: GPUMemoryTypeProps) {
  // Type icons and colors
  const typeInfo = {
    "global": {
      icon: "🌐",
      color: "#3b82f6"
    },
    "shared": {
      icon: "👥",
      color: "#10b981"
    },
    "constant": {
      icon: "🔒",
      color: "#8b5cf6"
    },
    "texture": {
      icon: "🖼️",
      color: "#f59e0b"
    },
    "local": {
      icon: "👤",
      color: "#ef4444"
    }
  }

  const scopeInfo = {
    "thread": "Hilo",
    "block": "Bloque",
    "grid": "Grilla",
    "device": "Dispositivo"
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
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Tamaño</div>
            <div className="font-semibold">{size}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Ancho de banda</div>
            <div className="font-semibold">{bandwidth}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Latencia</div>
            <div className="font-semibold">{latency}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Alcance</div>
            <div className="font-semibold">{scopeInfo[scope]}</div>
          </div>
        </div>
        
        <div>
          {cache ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              Con caché
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              Sin caché
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface GPUMemoryHierarchyProps {
  memoryTypes: {
    type: "global" | "shared" | "constant" | "texture" | "local"
    name: string
    description: string
    size: string
    bandwidth: string
    latency: string
    scope: "thread" | "block" | "grid" | "device"
    cache: boolean
  }[]
}

export function GPUMemoryHierarchy({ memoryTypes }: GPUMemoryHierarchyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">📊</span>
          Jerarquía de Memoria GPU
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la jerarquía de memoria GPU?</div>
          <div className="text-sm text-blue-700 mt-1">
            Las GPUs tienen diferentes tipos de memoria con distintas características 
            de rendimiento y alcance para optimizar el procesamiento paralelo.
          </div>
        </div>
        
        <div className="space-y-3">
          {memoryTypes.map((memoryType, index) => (
            <GPUMemoryType
              key={index}
              type={memoryType.type}
              name={memoryType.name}
              description={memoryType.description}
              size={memoryType.size}
              bandwidth={memoryType.bandwidth}
              latency={memoryType.latency}
              scope={memoryType.scope}
              cache={memoryType.cache}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CoalescedAccessProps {
  pattern: "coalesced" | "uncoalesced"
  description: string
  benefit: string
  example: string
  performance: {
    bandwidth: number
    efficiency: number
  }
}

export function CoalescedAccess({ 
  pattern,
  description,
  benefit,
  example,
  performance
}: CoalescedAccessProps) {
  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: pattern === "coalesced" ? "#10b981" : "#ef4444", 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: pattern === "coalesced" ? "#10b981" : "#ef4444" }}
      >
        <span className="mr-2 text-xl">{pattern === "coalesced" ? "✅" : "❌"}</span>
        {pattern === "coalesced" ? "Acceso Coalizado" : "Acceso No Coalizado"}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="p-2 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800 text-sm">Beneficio:</div>
          <div className="text-sm text-green-700">{benefit}</div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Ejemplo:</div>
          <div className="font-mono text-xs bg-gray-800 text-white p-2 rounded">
            {example}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Ancho de banda</div>
            <div className="font-semibold">{performance.bandwidth} GB/s</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Eficiencia</div>
            <div className="font-semibold">{performance.efficiency}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MemoryCoalescingProps {
  patterns: {
    pattern: "coalesced" | "uncoalesced"
    description: string
    benefit: string
    example: string
    performance: {
      bandwidth: number
      efficiency: number
    }
  }[]
}

export function MemoryCoalescing({ patterns }: MemoryCoalescingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">🎯</span>
          Coalización de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Qué es la coalización?</div>
          <div className="text-sm text-green-700 mt-1">
            La coalización de memoria combina accesos de múltiples hilos en 
            transferencias más grandes y eficientes para maximizar el ancho de banda.
          </div>
        </div>
        
        <div className="space-y-3">
          {patterns.map((pattern, index) => (
            <CoalescedAccess
              key={index}
              pattern={pattern.pattern}
              description={pattern.description}
              benefit={pattern.benefit}
              example={pattern.example}
              performance={pattern.performance}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryBandwidthProps {
  memoryType: "global" | "shared" | "constant" | "texture" | "local"
  theoretical: number
  practical: number
  unit: string
  utilization: number
}

export function MemoryBandwidth({ 
  memoryType,
  theoretical,
  practical,
  unit,
  utilization
}: MemoryBandwidthProps) {
  // Memory type icons and colors
  const memoryTypeInfo = {
    "global": {
      icon: "🌐",
      color: "#3b82f6"
    },
    "shared": {
      icon: "👥",
      color: "#10b981"
    },
    "constant": {
      icon: "🔒",
      color: "#8b5cf6"
    },
    "texture": {
      icon: "🖼️",
      color: "#f59e0b"
    },
    "local": {
      icon: "👤",
      color: "#ef4444"
    }
  }

  const currentMemoryType = memoryTypeInfo[memoryType]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentMemoryType.color }}
        >
          <span className="mr-2 text-xl">{currentMemoryType.icon}</span>
          Ancho de Banda de {memoryType === "global" ? "Memoria Global" : 
                           memoryType === "shared" ? "Memoria Compartida" :
                           memoryType === "constant" ? "Memoria Constante" :
                           memoryType === "texture" ? "Memoria de Textura" :
                           "Memoria Local"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Teórico</div>
              <div className="font-semibold text-lg">{theoretical} {unit}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Práctico</div>
              <div className="font-semibold text-lg">{practical} {unit}</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Utilización</span>
              <span>{utilization}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 rounded-full" 
                style={{ 
                  width: `${utilization}%`,
                  backgroundColor: currentMemoryType.color
                }}
              ></div>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="font-semibold text-blue-800 mb-1">Consejo de optimización:</div>
            <div className="text-sm text-blue-700">
              {memoryType === "global" && "Usa acceso coalizado para maximizar el ancho de banda."}
              {memoryType === "shared" && "Minimiza bancos de memoria compartida en conflicto."}
              {memoryType === "constant" && "Usa para datos de solo lectura accedidos frecuentemente."}
              {memoryType === "texture" && "Aprovecha la caché de textura para acceso espacial."}
              {memoryType === "local" && "Evita el uso excesivo; prefiera memoria compartida."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface GPUMemoryBandwidthProps {
  bandwidths: {
    memoryType: "global" | "shared" | "constant" | "texture" | "local"
    theoretical: number
    practical: number
    unit: string
    utilization: number
  }[]
}

export function GPUMemoryBandwidth({ bandwidths }: GPUMemoryBandwidthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">📶</span>
          Ancho de Banda de Memoria GPU
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Por qué importa el ancho de banda?</div>
          <div className="text-sm text-purple-700 mt-1">
            El ancho de banda de memoria es a menudo el cuello de botella en 
            aplicaciones GPU; optimizar su uso es crucial para el rendimiento.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bandwidths.map((bandwidth, index) => (
            <MemoryBandwidth
              key={index}
              memoryType={bandwidth.memoryType}
              theoretical={bandwidth.theoretical}
              practical={bandwidth.practical}
              unit={bandwidth.unit}
              utilization={bandwidth.utilization}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}