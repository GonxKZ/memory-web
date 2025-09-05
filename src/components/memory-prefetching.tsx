import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PrefetcherTypeProps {
  type: "sequential" | "stride" | "stream" | "ml"
  name: string
  description: string
  accuracy: number
  coverage: number
  complexity: "low" | "medium" | "high"
  useCases: string[]
}

export function PrefetcherType({ 
  type,
  name,
  description,
  accuracy,
  coverage,
  complexity,
  useCases
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

  const complexityInfo = {
    "low": { label: "Baja", color: "#10b981" },
    "medium": { label: "Media", color: "#f59e0b" },
    "high": { label: "Alta", color: "#ef4444" }
  }

  const currentType = typeInfo[type]
  const currentComplexity = complexityInfo[complexity]

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
        
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Precisión</div>
            <div className="font-semibold">{accuracy}%</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Cobertura</div>
            <div className="font-semibold">{coverage}%</div>
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

interface PrefetchingTechniquesProps {
  techniques: {
    type: "sequential" | "stride" | "stream" | "ml"
    name: string
    description: string
    accuracy: number
    coverage: number
    complexity: "low" | "medium" | "high"
    useCases: string[]
  }[]
}

export function PrefetchingTechniques({ techniques }: PrefetchingTechniquesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🔮</span>
          Técnicas de Prefetching
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es el prefetching?</div>
          <div className="text-sm text-blue-700 mt-1">
            El prefetching anticipa y carga datos en la caché antes de que 
            sean solicitados, reduciendo las esperas por fallos de caché.
          </div>
        </div>
        
        <div className="space-y-3">
          {techniques.map((technique, index) => (
            <PrefetcherType
              key={index}
              type={technique.type}
              name={technique.name}
              description={technique.description}
              accuracy={technique.accuracy}
              coverage={technique.coverage}
              complexity={technique.complexity}
              useCases={technique.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PrefetchingVisualizationProps {
  history: number[]
  prefetches: number[]
  hits: boolean[]
  currentTime: number
  onTimeChange: (time: number) => void
}

export function PrefetchingVisualization({ 
  history,
  prefetches,
  hits,
  currentTime,
  onTimeChange
}: PrefetchingVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">📈</span>
          Visualización de Prefetching
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Secuencia de accesos</div>
          <div className="text-sm text-green-700 mt-1">
            Visualiza cómo el prefetching anticipa los accesos a memoria.
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {history.map((address, index) => (
              <div
                key={index}
                className={`
                  w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                  ${index <= currentTime 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700"}
                `}
              >
                {address}
              </div>
            ))}
          </div>
          
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max={history.length - 1}
              value={currentTime}
              onChange={(e) => onTimeChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-500 mt-1">
              Tiempo: {currentTime + 1} / {history.length}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold mb-2">Prefetches realizados:</div>
            <div className="flex flex-wrap gap-2">
              {prefetches.map((address, index) => {
                const isHit = hits[index]
                return (
                  <div
                    key={index}
                    className={`
                      w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                      ${isHit 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"}
                  `}
                  >
                    {address}
                  </div>
                )
              })}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Estadísticas:</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Prefetches:</span>
                <span className="font-semibold">{prefetches.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Aciertos:</span>
                <span className="font-semibold text-green-600">
                  {hits.filter(h => h).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fallos:</span>
                <span className="font-semibold text-red-600">
                  {hits.filter(h => !h).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Precisión:</span>
                <span className="font-semibold">
                  {prefetches.length > 0 
                    ? ((hits.filter(h => h).length / prefetches.length) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface HardwarePrefetcherProps {
  prefetcher: "l1" | "l2" | "l3" | "tlb"
  name: string
  description: string
  features: string[]
  limitations: string[]
}

export function HardwarePrefetcher({ 
  prefetcher,
  name,
  description,
  features,
  limitations
}: HardwarePrefetcherProps) {
  // Prefetcher icons and colors
  const prefetcherInfo = {
    "l1": {
      icon: "⚡",
      color: "#3b82f6"
    },
    "l2": {
      icon: "🔥",
      color: "#10b981"
    },
    "l3": {
      icon: "🌡️",
      color: "#8b5cf6"
    },
    "tlb": {
      icon: "🗺️",
      color: "#f59e0b"
    }
  }

  const currentPrefetcher = prefetcherInfo[prefetcher]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentPrefetcher.color }}
        >
          <span className="mr-2 text-xl">{currentPrefetcher.icon}</span>
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
              <div className="font-semibold mb-2 text-green-600">Características:</div>
              <ul className="space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-red-600">Limitaciones:</div>
              <ul className="space-y-1">
                {limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-500">✗</span>
                    <span className="text-sm">{limitation}</span>
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

interface HardwarePrefetchersProps {
  prefetchers: {
    prefetcher: "l1" | "l2" | "l3" | "tlb"
    name: string
    description: string
    features: string[]
    limitations: string[]
  }[]
}

export function HardwarePrefetchers({ prefetchers }: HardwarePrefetchersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">⚙️</span>
          Prefetchers de Hardware
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué son los prefetchers de hardware?</div>
          <div className="text-sm text-purple-700 mt-1">
            Los prefetchers de hardware son circuitos especializados que 
            detectan patrones de acceso y cargan datos anticipadamente.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prefetchers.map((prefetcher, index) => (
            <HardwarePrefetcher
              key={index}
              prefetcher={prefetcher.prefetcher}
              name={prefetcher.name}
              description={prefetcher.description}
              features={prefetcher.features}
              limitations={prefetcher.limitations}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}