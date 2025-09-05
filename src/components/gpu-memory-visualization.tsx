import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GPUMemoryTypeProps {
  type: "global" | "shared" | "constant" | "texture" | "local"
  description: string
  characteristics: string[]
  bandwidth: string
  latency: string
  size: string
}

export function GPUMemoryType({ 
  type,
  description,
  characteristics,
  bandwidth,
  latency,
  size
}: GPUMemoryTypeProps) {
  // Type information
  const typeInfo = {
    "global": {
      name: "Memoria Global",
      icon: "🌐",
      color: "#3b82f6"
    },
    "shared": {
      name: "Memoria Compartida",
      icon: "👥",
      color: "#10b981"
    },
    "constant": {
      name: "Memoria Constante",
      icon: "🔒",
      color: "#8b5cf6"
    },
    "texture": {
      name: "Memoria de Textura",
      icon: "🖼️",
      color: "#f59e0b"
    },
    "local": {
      name: "Memoria Local",
      icon: "👤",
      color: "#ef4444"
    }
  }

  const currentType = typeInfo[type]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentType.color }}
        >
          <span className="mr-2 text-xl">{currentType.icon}</span>
          {currentType.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            {description}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Ancho de banda</div>
              <div className="font-semibold">{bandwidth}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Latencia</div>
              <div className="font-semibold">{latency}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Tamaño</div>
              <div className="font-semibold">{size}</div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Características:</div>
            <ul className="space-y-1">
              {characteristics.map((char, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="mr-1">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface GPUMemoryHierarchyProps {
  memoryTypes: {
    type: "global" | "shared" | "constant" | "texture" | "local"
    description: string
    characteristics: string[]
    bandwidth: string
    latency: string
    size: string
  }[]
}

export function GPUMemoryHierarchy({ memoryTypes }: GPUMemoryHierarchyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jerarquía de Memoria GPU</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la jerarquía de memoria GPU?</div>
          <div className="text-sm text-blue-700 mt-1">
            Las GPUs tienen diferentes tipos de memoria con diferentes características de rendimiento 
            y propósito. Comprender esta jerarquía es crucial para optimizar aplicaciones paralelas.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memoryTypes.map((memoryType, index) => (
            <GPUMemoryType
              key={index}
              type={memoryType.type}
              description={memoryType.description}
              characteristics={memoryType.characteristics}
              bandwidth={memoryType.bandwidth}
              latency={memoryType.latency}
              size={memoryType.size}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CoalescedAccessVisualizationProps {
  accessPattern: "coalesced" | "uncoalesced"
  threads: number
  memoryAddresses: number[]
  bandwidth: number
  efficiency: number
}

export function CoalescedAccessVisualization({ 
  accessPattern,
  threads,
  memoryAddresses,
  bandwidth,
  efficiency
}: CoalescedAccessVisualizationProps) {
  // Pattern information
  const patternInfo = {
    "coalesced": {
      title: "Acceso Coalizado",
      description: "Los hilos acceden a direcciones de memoria consecutivas",
      color: "#10b981",
      icon: "✅"
    },
    "uncoalesced": {
      title: "Acceso No Coalizado",
      description: "Los hilos acceden a direcciones de memoria no consecutivas",
      color: "#ef4444",
      icon: "❌"
    }
  }

  const currentPattern = patternInfo[accessPattern]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentPattern.color }}
        >
          <span className="mr-2">{currentPattern.icon}</span>
          {currentPattern.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {currentPattern.description}
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Patrón de Acceso</div>
            <div className="flex flex-wrap gap-1">
              {memoryAddresses.map((address, index) => (
                <div 
                  key={index}
                  className="w-8 h-8 bg-blue-500 text-white text-xs rounded flex items-center justify-center"
                >
                  {address}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Hilos</div>
              <div className="font-semibold">{threads}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Ancho de banda</div>
              <div className="font-semibold">{bandwidth} GB/s</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Eficiencia</div>
              <div className="font-semibold">{efficiency}%</div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Visualización:</div>
            <div className="relative h-24 bg-gray-100 rounded overflow-hidden">
              {/* Memory banks */}
              <div className="absolute top-2 left-2 right-2 h-8 bg-gray-200 rounded flex">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-gray-300 last:border-r-0">
                    <div className="text-xs text-center pt-1">{i * 4}</div>
                  </div>
                ))}
              </div>
              
              {/* Thread accesses */}
              {memoryAddresses.map((address, index) => {
                const bank = Math.floor(address / 4) % 8
                const leftPercent = (bank / 8) * 100
                
                return (
                  <div
                    key={index}
                    className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"
                    style={{
                      top: '40px',
                      left: `${leftPercent}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    T{index}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}