import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemoryLevelProps {
  level: "registers" | "l1" | "l2" | "l3" | "dram" | "ssd" | "hdd"
  name: string
  size: string
  latency: string
  bandwidth: string
  color: string
  description: string
}

export function MemoryLevel({ 
  level,
  name,
  size,
  latency,
  bandwidth,
  color,
  description
}: MemoryLevelProps) {
  // Level icons
  const levelIcons = {
    "registers": "💾",
    "l1": "⚡",
    "l2": "🔥",
    "l3": "🌡️",
    "dram": "🧠",
    "ssd": "💾",
    "hdd": "💿"
  }

  return (
    <div 
      className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{levelIcons[level]}</span>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{size}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
        <div>
          <div className="text-xs text-gray-500">Latencia</div>
          <div className="font-mono">{latency}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Ancho de banda</div>
          <div className="font-mono">{bandwidth}</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        {description}
      </div>
    </div>
  )
}

interface MemoryHierarchyProps {
  levels: {
    level: "registers" | "l1" | "l2" | "l3" | "dram" | "ssd" | "hdd"
    name: string
    size: string
    latency: string
    bandwidth: string
    color: string
    description: string
  }[]
}

export function MemoryHierarchy({ levels }: MemoryHierarchyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jerarquía de Memoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la jerarquía de memoria?</div>
          <div className="text-sm text-blue-700 mt-1">
            La jerarquía de memoria organiza los diferentes tipos de almacenamiento 
            según su velocidad, tamaño y costo, optimizando el rendimiento del sistema.
          </div>
        </div>
        
        <div className="space-y-3">
          {levels.map((level, index) => (
            <MemoryLevel
              key={index}
              level={level.level}
              name={level.name}
              size={level.size}
              latency={level.latency}
              bandwidth={level.bandwidth}
              color={level.color}
              description={level.description}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Principios de la jerarquía:</div>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Los niveles más cercanos al procesador son más rápidos pero más pequeños</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Los niveles más lejanos son más grandes pero más lentos</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>El sistema intenta mantener los datos frecuentes en los niveles más rápidos</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryAccessPatternProps {
  pattern: "spatial" | "temporal"
  description: string
  example: string
  benefit: string
}

export function MemoryAccessPattern({ 
  pattern,
  description,
  example,
  benefit
}: MemoryAccessPatternProps) {
  // Pattern icons and colors
  const patternInfo = {
    "spatial": {
      icon: "📍",
      color: "#3b82f6",
      title: "Localidad Espacial"
    },
    "temporal": {
      icon: "⏱️",
      color: "#10b981",
      title: "Localidad Temporal"
    }
  }

  const currentPattern = patternInfo[pattern]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentPattern.color }}
        >
          <span className="mr-2 text-xl">{currentPattern.icon}</span>
          {currentPattern.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-semibold mb-1">Ejemplo:</div>
            <div className="text-sm">{example}</div>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-semibold text-green-800 mb-1">Beneficio:</div>
            <div className="text-sm text-green-700">{benefit}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface LocalityVisualizationProps {
  patterns: {
    pattern: "spatial" | "temporal"
    description: string
    example: string
    benefit: string
  }[]
}

export function LocalityVisualization({ patterns }: LocalityVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Localidad en Accesos a Memoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la localidad?</div>
          <div className="text-sm text-blue-700 mt-1">
            La localidad se refiere a la tendencia de un programa a acceder a datos 
            cercanos en el espacio (localidad espacial) o a reutilizar datos 
            recientemente accedidos (localidad temporal).
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern, index) => (
            <MemoryAccessPattern
              key={index}
              pattern={pattern.pattern}
              description={pattern.description}
              example={pattern.example}
              benefit={pattern.benefit}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}