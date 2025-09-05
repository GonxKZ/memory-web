import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PrefetcherTypeProps {
  type: "sequential" | "stride" | "stream" | "ml"
  name: string
  description: string
  howItWorks: string
  accuracy: number
  complexity: "Baja" | "Media" | "Alta"
}

export function PrefetcherType({ 
  type,
  name,
  description,
  howItWorks,
  accuracy,
  complexity
}: PrefetcherTypeProps) {
  // Type icons and colors
  const typeInfo = {
    "sequential": {
      icon: "➡️",
      color: "#3b82f6"
    },
    "stride": {
      icon: "🔢",
      color: "#10b981"
    },
    "stream": {
      icon: "🌊",
      color: "#8b5cf6"
    },
    "ml": {
      icon: "🤖",
      color: "#f59e0b"
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
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            {description}
          </div>
          
          <div>
            <div className="font-semibold mb-1">¿Cómo funciona?</div>
            <div className="text-sm text-gray-600">
              {howItWorks}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Precisión</div>
              <div className="font-semibold">{accuracy}%</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-center">
              <div className="text-xs text-gray-500">Complejidad</div>
              <div className="font-semibold">{complexity}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PrefetchingVisualizationProps {
  prefetcherTypes: {
    type: "sequential" | "stride" | "stream" | "ml"
    name: string
    description: string
    howItWorks: string
    accuracy: number
    complexity: "Baja" | "Media" | "Alta"
  }[]
}

export function PrefetchingVisualization({ prefetcherTypes }: PrefetchingVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prefetching (Prefetching)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es el prefetching?</div>
          <div className="text-sm text-blue-700 mt-1">
            El prefetching es una técnica utilizada por las cachés para anticipar y cargar datos 
            antes de que sean solicitados por el procesador, mejorando el rendimiento.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prefetcherTypes.map((prefetcher, index) => (
            <PrefetcherType
              key={index}
              type={prefetcher.type}
              name={prefetcher.name}
              description={prefetcher.description}
              howItWorks={prefetcher.howItWorks}
              accuracy={prefetcher.accuracy}
              complexity={prefetcher.complexity}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface AccessPatternVisualizationProps {
  pattern: "sequential" | "stride" | "random" | "pointerChasing"
  addresses: number[]
  prefetchAddresses: number[]
  accessedAddresses: boolean[]
  prefetchedAddresses: boolean[]
}

export function AccessPatternVisualization({ 
  pattern,
  addresses,
  prefetchAddresses,
  accessedAddresses,
  prefetchedAddresses
}: AccessPatternVisualizationProps) {
  // Pattern information
  const patternInfo = {
    "sequential": {
      title: "Patrón Secuencial",
      description: "Acceso a direcciones de memoria en orden consecutivo",
      color: "#3b82f6"
    },
    "stride": {
      title: "Patrón con Stride",
      description: "Acceso a direcciones de memoria con un intervalo fijo",
      color: "#10b981"
    },
    "random": {
      title: "Patrón Aleatorio",
      description: "Acceso a direcciones de memoria en orden aleatorio",
      color: "#ef4444"
    },
    "pointerChasing": {
      title: "Pointer Chasing",
      description: "Seguimiento de punteros en estructuras de datos enlazadas",
      color: "#8b5cf6"
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
          <span className="mr-2">
            {pattern === "sequential" && "➡️"}
            {pattern === "stride" && "🔢"}
            {pattern === "random" && "🔀"}
            {pattern === "pointerChasing" && "🔗"}
          </span>
          {currentPattern.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {currentPattern.description}
          </div>
          
          <div>
            <div className="font-semibold mb-2">Direcciones de memoria accedidas:</div>
            <div className="flex flex-wrap gap-2">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`
                    w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                    ${accessedAddresses[index] 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-200 text-gray-700"}
                  `}
                >
                  {address}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Direcciones prefetched:</div>
            <div className="flex flex-wrap gap-2">
              {prefetchAddresses.map((address, index) => (
                <div
                  key={index}
                  className={`
                    w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                    ${prefetchedAddresses[index] 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-700"}
                  `}
                >
                  {address}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Visualización del patrón:</div>
            <div className="relative h-32 bg-white border rounded overflow-hidden">
              {/* Memory addresses as a line */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-300"></div>
              
              {/* Accessed addresses */}
              {addresses.map((address, index) => {
                if (!accessedAddresses[index]) return null
                
                // Calculate position based on address value
                const minAddr = Math.min(...addresses)
                const maxAddr = Math.max(...addresses)
                const range = maxAddr - minAddr || 1
                const position = ((address - minAddr) / range) * 100
                
                return (
                  <div
                    key={`accessed-${index}`}
                    className="absolute w-4 h-4 bg-green-500 rounded-full"
                    style={{
                      top: 'calc(50% - 8px)',
                      left: `${position}%`,
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                )
              })}
              
              {/* Prefetched addresses */}
              {prefetchAddresses.map((address, index) => {
                if (!prefetchedAddresses[index]) return null
                
                // Calculate position based on address value
                const minAddr = Math.min(...addresses, ...prefetchAddresses)
                const maxAddr = Math.max(...addresses, ...prefetchAddresses)
                const range = maxAddr - minAddr || 1
                const position = ((address - minAddr) / range) * 100
                
                return (
                  <div
                    key={`prefetched-${index}`}
                    className="absolute w-4 h-4 bg-blue-500 rounded-full"
                    style={{
                      top: 'calc(50% + 12px)',
                      left: `${position}%`,
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}