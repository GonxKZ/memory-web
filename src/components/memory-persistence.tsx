import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StorageClassProps {
  type: "dram" | "nvdimm" | "ssd" | "hdd" | "scm"
  name: string
  description: string
  persistence: "volatile" | "persistent"
  speed: string
  durability: string
  cost: string
  useCases: string[]
}

export function StorageClass({ 
  type,
  name,
  description,
  persistence,
  speed,
  durability,
  cost,
  useCases
}: StorageClassProps) {
  // Type icons and colors
  const typeInfo = {
    "dram": {
      icon: "⚡",
      color: "#3b82f6"
    },
    "nvdimm": {
      icon: "💾",
      color: "#10b981"
    },
    "ssd": {
      icon: "💿",
      color: "#8b5cf6"
    },
    "hdd": {
      icon: "💽",
      color: "#f59e0b"
    },
    "scm": {
      icon: "🔬",
      color: "#ef4444"
    }
  }

  const persistenceInfo = {
    "volatile": { label: "Volátil", color: "#ef4444" },
    "persistent": { label: "Persistente", color: "#10b981" }
  }

  const currentType = typeInfo[type]
  const currentPersistence = persistenceInfo[persistence]

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
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: `${currentPersistence.color}20` }}
          >
            <div className="text-xs text-gray-500">Persistencia</div>
            <div 
              className="font-semibold"
              style={{ color: currentPersistence.color }}
            >
              {currentPersistence.label}
            </div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Velocidad</div>
            <div className="font-semibold">{speed}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Durabilidad</div>
            <div className="font-semibold">{durability}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Costo</div>
            <div className="font-semibold">{cost}</div>
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

interface StorageClassMemoryProps {
  storageClasses: {
    type: "dram" | "nvdimm" | "ssd" | "hdd" | "scm"
    name: string
    description: string
    persistence: "volatile" | "persistent"
    speed: string
    durability: string
    cost: string
    useCases: string[]
  }[]
}

export function StorageClassMemory({ storageClasses }: StorageClassMemoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🗄️</span>
          Clases de Almacenamiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la jerarquía de almacenamiento?</div>
          <div className="text-sm text-blue-700 mt-1">
            La jerarquía de almacenamiento organiza diferentes tecnologías 
            según velocidad, persistencia, durabilidad y costo.
          </div>
        </div>
        
        <div className="space-y-3">
          {storageClasses.map((storageClass, index) => (
            <StorageClass
              key={index}
              type={storageClass.type}
              name={storageClass.name}
              description={storageClass.description}
              persistence={storageClass.persistence}
              speed={storageClass.speed}
              durability={storageClass.durability}
              cost={storageClass.cost}
              useCases={storageClass.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PersistenceVisualizationProps {
  data: {
    time: number
    value: number
    persistent: boolean
  }[]
  currentTime: number
  onTimeChange: (time: number) => void
}

export function PersistenceVisualization({ 
  data,
  currentTime,
  onTimeChange
}: PersistenceVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">📉</span>
          Visualización de Persistencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Datos a lo largo del tiempo</div>
          <div className="text-sm text-green-700 mt-1">
            Visualiza cómo los datos persisten o se pierden con el tiempo.
          </div>
        </div>
        
        <div className="mb-4 h-48 relative bg-gray-50 rounded">
          {/* Time axis */}
          <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-gray-300">
            {data.map((point, index) => (
              <div
                key={index}
                className="absolute bottom-0"
                style={{ left: `${(index / (data.length - 1)) * 100}%` }}
              >
                <div className="text-xs text-gray-500 transform -translate-x-1/2">
                  t{point.time}
                </div>
              </div>
            ))}
          </div>
          
          {/* Data points */}
          {data.map((point, index) => (
            <div
              key={index}
              className={`
                absolute w-4 h-4 rounded-full
                ${point.persistent 
                  ? "bg-green-500" 
                  : "bg-red-500"}
              `}
              style={{
                left: `${(index / (data.length - 1)) * 100}%`,
                bottom: `${(point.value / 100) * 160 + 20}px`
              }}
            ></div>
          ))}
          
          {/* Lines connecting points */}
          <svg className="absolute inset-0 w-full h-full">
            {data.slice(0, -1).map((point, index) => (
              <line
                key={index}
                x1={`${(index / (data.length - 1)) * 100}%`}
                y1={`${180 - (point.value / 100) * 160}px`}
                x2={`${((index + 1) / (data.length - 1)) * 100}%`}
                y2={`${180 - (data[index + 1].value / 100) * 160}px`}
                stroke={point.persistent ? "#10b981" : "#ef4444"}
                strokeWidth="2"
              />
            ))}
          </svg>
          
          {/* Current time indicator */}
          <div
            className="absolute top-0 bottom-8 w-0.5 bg-blue-500"
            style={{ left: `${(currentTime / (data.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max={data.length - 1}
            value={currentTime}
            onChange={(e) => onTimeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-500 mt-1">
            Tiempo: {data[currentTime]?.time || 0}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-xs text-gray-500">Datos persistentes</div>
            <div className="font-semibold text-green-600">
              {data.filter(d => d.persistent).length}
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded text-center">
            <div className="text-xs text-gray-500">Datos volátiles</div>
            <div className="font-semibold text-red-600">
              {data.filter(d => !d.persistent).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface NVMTechnologyProps {
  technology: "pcm" | "mram" | "rram" | "spintronics"
  name: string
  description: string
  readLatency: string
  writeLatency: string
  endurance: string
  useCases: string[]
}

export function NVMTechnology({ 
  technology,
  name,
  description,
  readLatency,
  writeLatency,
  endurance,
  useCases
}: NVMTechnologyProps) {
  // Technology icons and colors
  const techInfo = {
    "pcm": {
      icon: "💾",
      color: "#3b82f6"
    },
    "mram": {
      icon: "🧲",
      color: "#10b981"
    },
    "rram": {
      icon: "💡",
      color: "#8b5cf6"
    },
    "spintronics": {
      icon: "🔄",
      color: "#f59e0b"
    }
  }

  const currentTech = techInfo[technology]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTech.color }}
        >
          <span className="mr-2 text-xl">{currentTech.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Latencia lectura</div>
              <div className="font-semibold">{readLatency}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Latencia escritura</div>
              <div className="font-semibold">{writeLatency}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Endurance</div>
              <div className="font-semibold">{endurance}</div>
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
      </CardContent>
    </Card>
  )
}

interface NonVolatileMemoryProps {
  technologies: {
    technology: "pcm" | "mram" | "rram" | "spintronics"
    name: string
    description: string
    readLatency: string
    writeLatency: string
    endurance: string
    useCases: string[]
  }[]
}

export function NonVolatileMemory({ technologies }: NonVolatileMemoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">🔬</span>
          Memoria No Volátil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué es la memoria no volátil?</div>
          <div className="text-sm text-purple-700 mt-1">
            La memoria no volátil mantiene los datos incluso cuando se corta 
            la alimentación, combinando las ventajas de la memoria y el almacenamiento.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technologies.map((technology, index) => (
            <NVMTechnology
              key={index}
              technology={technology.technology}
              name={technology.name}
              description={technology.description}
              readLatency={technology.readLatency}
              writeLatency={technology.writeLatency}
              endurance={technology.endurance}
              useCases={technology.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}