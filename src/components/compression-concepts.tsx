import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CompressionTechniqueProps {
  technique: "lz" | "huffman" | "delta" | "dictionary"
  name: string
  description: string
  compressionRatio: number
  speed: "fast" | "medium" | "slow"
  useCases: string[]
  technicalDetails: string
  examples: string[]
}

export function CompressionTechnique({ 
  technique,
  name,
  description,
  compressionRatio,
  speed,
  useCases,
  technicalDetails,
  examples
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTech.color }}
        >
          <span className="mr-2 text-2xl">{currentTech.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-700">
            {description}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">Detalles Técnicos</div>
            <div className="text-blue-700 text-sm">
              {technicalDetails}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded text-center">
              <div className="text-xs text-gray-500">Ratio de compresión</div>
              <div className="font-bold text-lg">{compressionRatio}:1</div>
            </div>
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: `${currentSpeed.color}20` }}
            >
              <div className="text-xs text-gray-500">Velocidad</div>
              <div 
                className="font-bold"
                style={{ color: currentSpeed.color }}
              >
                {currentSpeed.label}
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Casos de uso:</div>
            <ul className="space-y-2">
              {useCases.map((useCase, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span className="text-gray-700">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Ejemplos:</div>
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

interface MemoryCompressionConceptsProps {
  techniques: {
    technique: "lz" | "huffman" | "delta" | "dictionary"
    name: string
    description: string
    compressionRatio: number
    speed: "fast" | "medium" | "slow"
    useCases: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function MemoryCompressionConcepts({ techniques }: MemoryCompressionConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Compresión de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          La compresión de memoria permite almacenar más datos en el mismo espacio físico, 
          similar a empaquetar ropa de manera eficiente para un viaje. Esto es especialmente 
          útil cuando se tiene memoria limitada pero se necesita almacenar grandes cantidades 
          de datos. La compresión de datos es una técnica fundamental en informática que permite 
          reducir el tamaño de los archivos y optimizar el almacenamiento y la transmisión de información.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((technique, index) => (
          <CompressionTechnique
            key={index}
            technique={technique.technique}
            name={technique.name}
            description={technique.description}
            compressionRatio={technique.compressionRatio}
            speed={technique.speed}
            useCases={technique.useCases}
            technicalDetails={technique.technicalDetails}
            examples={technique.examples}
          />
        ))}
      </div>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚖️</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Equilibrio en compresión</h3>
              <p className="text-blue-700 mb-3">
                La compresión de memoria implica un equilibrio fundamental entre tres factores:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">Ratio de compresión:</span>
                    <span> Cuánto se reduce el tamaño (más es mejor). En sistemas modernos, ratios de 2:1 a 5:1 son comunes en aplicaciones prácticas.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Velocidad:</span>
                    <span> Qué tan rápido se comprime/descomprime (más rápido es mejor). La velocidad afecta directamente el rendimiento del sistema, especialmente en aplicaciones en tiempo real.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">Complejidad:</span>
                    <span> Cuántos recursos se necesitan (menos es mejor). La complejidad afecta el consumo de CPU, memoria y energía, factores críticos en sistemas embebidos y móviles.</span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-700 mt-3">
                Las diferentes técnicas ofrecen distintos puntos en este espacio de equilibrio, 
                permitiendo elegir la mejor opción para cada situación específica. En la práctica, 
                muchas implementaciones modernas combinan múltiples técnicas: un compilador puede 
                aplicar tiling seguido de vectorización y prefetching automático para obtener 
                mejoras compuestas en el rendimiento.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de compresión:</div>
                <div className="font-mono text-sm">
                  <div>// Datos originales: 1000 bytes</div>
                  <div>[AAAAAAAABBBBBBBBCCCCCCCCDDDDDDDD...] // Repetición de patrones</div>
                  <div className="my-1 text-center">↓ Compresión</div>
                  <div>// Datos comprimidos: 200 bytes</div>
                  <div>[(A,8)(B,8)(C,8)(D,8)...] // Tuplas de (caracter, conteo)</div>
                  <div className="my-1 text-center">↓ Descompresión</div>
                  <div>// Datos restaurados: 1000 bytes</div>
                  <div>[AAAAAAAABBBBBBBBCCCCCCCCDDDDDDDD...] // Idénticos a los originales</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}