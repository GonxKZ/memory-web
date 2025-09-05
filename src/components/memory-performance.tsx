import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BandwidthMetricProps {
  metric: "sequential" | "random" | "peak" | "sustained"
  name: string
  value: number
  unit: string
  description: string
}

export function BandwidthMetric({ 
  metric,
  name,
  value,
  unit,
  description
}: BandwidthMetricProps) {
  // Metric icons and colors
  const metricInfo = {
    "sequential": {
      icon: "➡️",
      color: "#3b82f6"
    },
    "random": {
      icon: "🔀",
      color: "#10b981"
    },
    "peak": {
      icon: "🏔️",
      color: "#8b5cf6"
    },
    "sustained": {
      icon: "💧",
      color: "#f59e0b"
    }
  }

  const currentMetric = metricInfo[metric]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentMetric.color }}
        >
          <span className="mr-2 text-xl">{currentMetric.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="p-3 bg-gray-800 text-white rounded text-center">
            <div className="text-2xl font-bold">{value} {unit}</div>
          </div>
          
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: `${currentMetric.color}20` }}
          >
            <div className="text-xs text-gray-500">Métrica</div>
            <div 
              className="font-semibold"
              style={{ color: currentMetric.color }}
            >
              {name}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryBandwidthProps {
  metrics: {
    metric: "sequential" | "random" | "peak" | "sustained"
    name: string
    value: number
    unit: string
    description: string
  }[]
}

export function MemoryBandwidth({ metrics }: MemoryBandwidthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">📶</span>
          Ancho de Banda de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es el ancho de banda?</div>
          <div className="text-sm text-blue-700 mt-1">
            El ancho de banda de memoria mide la cantidad de datos que pueden 
            transferirse entre la memoria y el procesador por unidad de tiempo.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <BandwidthMetric
              key={index}
              metric={metric.metric}
              name={metric.name}
              value={metric.value}
              unit={metric.unit}
              description={metric.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface LatencyMetricProps {
  metric: "l1" | "l2" | "l3" | "dram" | "ssd" | "hdd"
  name: string
  latency: number
  unit: string
  description: string
}

export function LatencyMetric({ 
  metric,
  name,
  latency,
  unit,
  description
}: LatencyMetricProps) {
  // Metric icons and colors
  const metricInfo = {
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
    "dram": {
      icon: "🧠",
      color: "#f59e0b"
    },
    "ssd": {
      icon: "💾",
      color: "#ef4444"
    },
    "hdd": {
      icon: "💽",
      color: "#6b7280"
    }
  }

  const currentMetric = metricInfo[metric]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentMetric.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentMetric.color }}
      >
        <span className="mr-2 text-xl">{currentMetric.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="p-3 bg-gray-800 text-white rounded text-center">
          <div className="text-2xl font-bold">{latency} {unit}</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="h-4 rounded-full" 
            style={{ 
              width: `${Math.min((latency / 1000) * 100, 100)}%`,
              backgroundColor: currentMetric.color
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

interface MemoryLatencyProps {
  metrics: {
    metric: "l1" | "l2" | "l3" | "dram" | "ssd" | "hdd"
    name: string
    latency: number
    unit: string
    description: string
  }[]
}

export function MemoryLatency({ metrics }: MemoryLatencyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">⏱️</span>
          Latencia de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Qué es la latencia?</div>
          <div className="text-sm text-green-700 mt-1">
            La latencia de memoria es el tiempo que tarda en completarse 
            una operación de acceso a memoria desde que se solicita.
          </div>
        </div>
        
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <LatencyMetric
              key={index}
              metric={metric.metric}
              name={metric.name}
              latency={metric.latency}
              unit={metric.unit}
              description={metric.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PerformanceVisualizationProps {
  tests: {
    name: string
    sequential: number
    random: number
    unit: string
  }[]
  currentTime: number
  onTimeChange: (time: number) => void
}

export function PerformanceVisualization({ 
  tests,
  currentTime,
  onTimeChange
}: PerformanceVisualizationProps) {
  const currentTest = tests[currentTime]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">📊</span>
          Visualización de Rendimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">Comparación de patrones</div>
          <div className="text-sm text-purple-700 mt-1">
            Compara el rendimiento entre accesos secuenciales y aleatorios.
          </div>
        </div>
        
        {currentTest && (
          <div className="mb-6">
            <div className="font-semibold mb-2 text-center">{currentTest.name}</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500">Secuencial</div>
                <div className="font-mono text-2xl font-bold text-blue-600">
                  {currentTest.sequential} {currentTest.unit}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-xs text-gray-500">Aleatorio</div>
                <div className="font-mono text-2xl font-bold text-green-600">
                  {currentTest.random} {currentTest.unit}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Diferencia</span>
                <span>
                  {Math.abs(currentTest.sequential - currentTest.random).toFixed(1)} {currentTest.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="h-4 rounded-full bg-purple-600" 
                  style={{ 
                    width: `${(Math.min(currentTest.sequential, currentTest.random) / 
                               Math.max(currentTest.sequential, currentTest.random)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {tests.map((test, index) => (
            <button
              key={index}
              className={`
                p-2 rounded border text-sm
                ${index === currentTime 
                  ? "bg-purple-500 text-white border-purple-600" 
                  : "bg-gray-50 border-gray-200"}
              `}
              onClick={() => onTimeChange(index)}
            >
              {test.name}
            </button>
          ))}
        </div>
        
        <div className="text-center text-sm text-gray-500">
          Prueba: {currentTime + 1} / {tests.length}
        </div>
      </CardContent>
    </Card>
  )
}

interface ThroughputMetricProps {
  metric: "instructions" | "loads" | "stores" | "branches"
  name: string
  value: number
  unit: string
  description: string
}

export function ThroughputMetric({ 
  metric,
  name,
  value,
  unit,
  description
}: ThroughputMetricProps) {
  // Metric icons and colors
  const metricInfo = {
    "instructions": {
      icon: "⚙️",
      color: "#3b82f6"
    },
    "loads": {
      icon: "📥",
      color: "#10b981"
    },
    "stores": {
      icon: "📤",
      color: "#8b5cf6"
    },
    "branches": {
      icon: "🔀",
      color: "#f59e0b"
    }
  }

  const currentMetric = metricInfo[metric]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentMetric.color }}
        >
          <span className="mr-2 text-xl">{currentMetric.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="p-3 bg-gray-800 text-white rounded text-center">
            <div className="text-2xl font-bold">{value} {unit}</div>
          </div>
          
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: `${currentMetric.color}20` }}
          >
            <div className="text-xs text-gray-500">Métrica</div>
            <div 
              className="font-semibold"
              style={{ color: currentMetric.color }}
            >
              {name}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryThroughputProps {
  metrics: {
    metric: "instructions" | "loads" | "stores" | "branches"
    name: string
    value: number
    unit: string
    description: string
  }[]
}

export function MemoryThroughput({ metrics }: MemoryThroughputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <span className="mr-2">🏎️</span>
          Rendimiento de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <div className="font-semibold text-orange-800">¿Qué es el rendimiento?</div>
          <div className="text-sm text-orange-700 mt-1">
            El rendimiento de memoria mide la cantidad de operaciones que 
            pueden completarse por unidad de tiempo, considerando latencia 
            y ancho de banda.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <ThroughputMetric
              key={index}
              metric={metric.metric}
              name={metric.name}
              value={metric.value}
              unit={metric.unit}
              description={metric.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface BottleneckAnalysisProps {
  component: "cpu" | "memory" | "io" | "network"
  name: string
  utilization: number
  bottleneck: boolean
  recommendation: string
}

export function BottleneckAnalysis({ 
  component,
  name,
  utilization,
  bottleneck,
  recommendation
}: BottleneckAnalysisProps) {
  // Component icons and colors
  const componentInfo = {
    "cpu": {
      icon: "🖥️",
      color: "#3b82f6"
    },
    "memory": {
      icon: "🧠",
      color: "#10b981"
    },
    "io": {
      icon: "💾",
      color: "#8b5cf6"
    },
    "network": {
      icon: "🌐",
      color: "#f59e0b"
    }
  }

  const currentComponent = componentInfo[component]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentComponent.color }}
        >
          <span className="mr-2 text-xl">{currentComponent.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Utilización:</div>
            <div className="font-mono text-lg">{utilization}%</div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="h-6 rounded-full" 
              style={{ 
                width: `${utilization}%`,
                backgroundColor: currentComponent.color
              }}
            ></div>
          </div>
          
          <div 
            className={`
              p-3 rounded border
              ${bottleneck 
                ? "bg-red-50 border-red-200" 
                : "bg-green-50 border-green-200"}
            `}
          >
            <div className="font-semibold mb-1">
              {bottleneck ? "Cuello de botella" : "Sin problemas"}
            </div>
            <div className="text-sm">
              {bottleneck 
                ? "Este componente está limitando el rendimiento del sistema" 
                : "Este componente está funcionando dentro de parámetros normales"}
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="font-semibold text-blue-800 mb-1">Recomendación:</div>
            <div className="text-sm text-blue-700">{recommendation}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SystemBottlenecksProps {
  components: {
    component: "cpu" | "memory" | "io" | "network"
    name: string
    utilization: number
    bottleneck: boolean
    recommendation: string
  }[]
}

export function SystemBottlenecks({ components }: SystemBottlenecksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <span className="mr-2">瓶颈</span>
          Análisis de Cuellos de Botella
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800">¿Qué es un cuello de botella?</div>
          <div className="text-sm text-red-700 mt-1">
            Un cuello de botella es un componente del sistema que limita 
            el rendimiento general debido a su capacidad insuficiente.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map((component, index) => (
            <BottleneckAnalysis
              key={index}
              component={component.component}
              name={component.name}
              utilization={component.utilization}
              bottleneck={component.bottleneck}
              recommendation={component.recommendation}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}