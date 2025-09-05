import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CompressionTechniqueProps {
  technique: "lz" | "huffman" | "delta" | "dictionary"
  name: string
  description: string
  compressionRatio: number
  speed: "fast" | "medium" | "slow"
  useCases: string[]
}

export function CompressionTechnique({ 
  technique,
  name,
  description,
  compressionRatio,
  speed,
  useCases
}: CompressionTechniqueProps) {
  // Technique icons and colors
  const techInfo = {
    "lz": {
      icon: "🗜️",
      color: "#3b82f6"
    },
    "huffman": {
      icon: "🌳",
      color: "#10b981"
    },
    "delta": {
      icon: "🔺",
      color: "#8b5cf6"
    },
    "dictionary": {
      icon: "📖",
      color: "#f59e0b"
    }
  }

  const speedInfo = {
    "fast": { label: "Rápida", color: "#10b981" },
    "medium": { label: "Media", color: "#f59e0b" },
    "slow": { label: "Lenta", color: "#ef4444" }
  }

  const currentTech = techInfo[technique]
  const currentSpeed = speedInfo[speed]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentTech.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentTech.color }}
      >
        <span className="mr-2 text-xl">{currentTech.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Ratio de compresión</div>
            <div className="font-semibold">{compressionRatio}:1</div>
          </div>
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: `${currentSpeed.color}20` }}
          >
            <div className="text-xs text-gray-500">Velocidad</div>
            <div 
              className="font-semibold"
              style={{ color: currentSpeed.color }}
            >
              {currentSpeed.label}
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

interface MemoryCompressionProps {
  techniques: {
    technique: "lz" | "huffman" | "delta" | "dictionary"
    name: string
    description: string
    compressionRatio: number
    speed: "fast" | "medium" | "slow"
    useCases: string[]
  }[]
}

export function MemoryCompression({ techniques }: MemoryCompressionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🗜️</span>
          Compresión de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Por qué comprimir memoria?</div>
          <div className="text-sm text-blue-700 mt-1">
            La compresión de memoria permite almacenar más datos en el mismo 
            espacio físico, mejorando la eficiencia y reduciendo costos.
          </div>
        </div>
        
        <div className="space-y-3">
          {techniques.map((technique, index) => (
            <CompressionTechnique
              key={index}
              technique={technique.technique}
              name={technique.name}
              description={technique.description}
              compressionRatio={technique.compressionRatio}
              speed={technique.speed}
              useCases={technique.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CompressionVisualizationProps {
  originalSize: number
  compressedSize: number
  technique: string
  savings: number
}

export function CompressionVisualization({ 
  originalSize,
  compressedSize,
  technique,
  savings
}: CompressionVisualizationProps) {
  const ratio = compressedSize / originalSize

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">📊</span>
          Visualización de Compresión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Técnica: {technique}</div>
          <div className="text-sm text-green-700 mt-1">
            La compresión reduce el tamaño de los datos manteniendo su integridad.
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Tamaño original</div>
            <div className="font-mono text-lg">{originalSize} MB</div>
          </div>
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-xs text-gray-500">Tamaño comprimido</div>
            <div className="font-mono text-lg">{compressedSize} MB</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Compresión</span>
            <span>{(ratio * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="h-6 rounded-full bg-green-600" 
              style={{ width: `${ratio * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800 mb-1">Ahorro:</div>
          <div className="text-2xl font-bold text-blue-600 text-center">
            {savings} MB ({((savings / originalSize) * 100).toFixed(1)}%)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryPackingProps {
  technique: "bitPacking" | "structPacking" | "arrayPacking"
  name: string
  description: string
  spaceSaved: number
  performanceImpact: "positive" | "negative" | "neutral"
  example: string
}

export function MemoryPacking({ 
  technique,
  name,
  description,
  spaceSaved,
  performanceImpact,
  example
}: MemoryPackingProps) {
  // Technique icons and colors
  const techInfo = {
    "bitPacking": {
      icon: "🔬",
      color: "#3b82f6"
    },
    "structPacking": {
      icon: "📦",
      color: "#10b981"
    },
    "arrayPacking": {
      icon: "🗃️",
      color: "#8b5cf6"
    }
  }

  const impactInfo = {
    "positive": { label: "Positivo", color: "#10b981" },
    "negative": { label: "Negativo", color: "#ef4444" },
    "neutral": { label: "Neutral", color: "#f59e0b" }
  }

  const currentTech = techInfo[technique]
  const currentImpact = impactInfo[performanceImpact]

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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Espacio ahorrado</div>
              <div className="font-semibold">{spaceSaved}%</div>
            </div>
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: `${currentImpact.color}20` }}
            >
              <div className="text-xs text-gray-500">Impacto en rendimiento</div>
              <div 
                className="font-semibold"
                style={{ color: currentImpact.color }}
              >
                {currentImpact.label}
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Ejemplo:</div>
            <div className="font-mono text-sm bg-gray-800 text-white p-2 rounded">
              {example}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PackingTechniquesProps {
  techniques: {
    technique: "bitPacking" | "structPacking" | "arrayPacking"
    name: string
    description: string
    spaceSaved: number
    performanceImpact: "positive" | "negative" | "neutral"
    example: string
  }[]
}

export function PackingTechniques({ techniques }: PackingTechniquesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">📦</span>
          Empaquetado de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué es el empaquetado?</div>
          <div className="text-sm text-purple-700 mt-1">
            El empaquetado de memoria organiza datos de manera más eficiente 
            para reducir el espacio utilizado y mejorar el acceso.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techniques.map((technique, index) => (
            <MemoryPacking
              key={index}
              technique={technique.technique}
              name={technique.name}
              description={technique.description}
              spaceSaved={technique.spaceSaved}
              performanceImpact={technique.performanceImpact}
              example={technique.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}