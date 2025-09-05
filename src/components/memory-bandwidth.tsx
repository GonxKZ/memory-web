import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BandwidthMetricProps {
  metric: "sequential" | "random" | "peak" | "sustained"
  name: string
  description: string
  value: number
  unit: string
  theoreticalMax: number
  color: string
}

export function BandwidthMetric({ 
  metric,
  name,
  description,
  value,
  unit,
  theoreticalMax,
  color
}: BandwidthMetricProps) {
  // Metric icons
  const metricInfo = {
    "sequential": {
      icon: "➡️",
    },
    "random": {
      icon: "🔀",
    },
    "peak": {
      icon: "🏔️",
    },
    "sustained": {
      icon: "⏳",
    }
  }

  const currentMetric = metricInfo[metric]
  const percentage = (value / theoreticalMax) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color }}
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
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Utilización</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 rounded-full" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: color
                }}
              ></div>
            </div>
          </div>
          
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Máximo teórico</div>
            <div className="font-mono">{theoreticalMax} {unit}</div>
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
    description: string
    value: number
    unit: string
    theoreticalMax: number
    color: string
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
              description={metric.description}
              value={metric.value}
              unit={metric.unit}
              theoreticalMax={metric.theoreticalMax}
              color={metric.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PerformanceVisualizationProps {
  testData: {
    pattern: "sequential" | "random" | "stride"
    name: string
    bandwidth: number
    latency: number
    efficiency: number
  }[]
  currentTime: number
  onTimeChange: (time: number) => void
}

export function PerformanceVisualization({ 
  testData,
  currentTime,
  onTimeChange
}: PerformanceVisualizationProps) {
  const currentTest = testData[currentTime]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">📊</span>
          Visualización de Rendimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Patrones de acceso</div>
          <div className="text-sm text-green-700 mt-1">
            Comparativa de rendimiento entre diferentes patrones de acceso a memoria.
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-semibold mb-2">Patrón actual:</div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="font-semibold">
              {currentTest.name}
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500">Ancho de banda</div>
                <div className="font-bold text-blue-600">{currentTest.bandwidth} GB/s</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Latencia</div>
                <div className="font-bold text-red-600">{currentTest.latency} ns</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Eficiencia</div>
                <div className="font-bold text-green-600">{currentTest.efficiency}%</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="font-semibold mb-2">Comparativa:</div>
          <div className="space-y-3">
            {testData.map((test, index) => (
              <div
                key={index}
                className={`
                  p-3 rounded border flex justify-between items-center
                  ${index === currentTime 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "bg-gray-50 border-gray-200"}
                `}
                onClick={() => onTimeChange(index)}
              >
                <div className="font-semibold">{test.name}</div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">BW</div>
                    <div className="font-mono">{test.bandwidth} GB/s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Lat</div>
                    <div className="font-mono">{test.latency} ns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Eff</div>
                    <div className="font-mono">{test.efficiency}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="font-semibold mb-2">Gráfico de rendimiento:</div>
          <div className="h-48 relative bg-gray-50 rounded p-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
              <span>20 GB/s</span>
              <span>15 GB/s</span>
              <span>10 GB/s</span>
              <span>5 GB/s</span>
              <span>0 GB/s</span>
            </div>
            
            {/* Chart area */}
            <div className="absolute left-8 right-0 top-0 bottom-6">
              {/* Grid lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>
              <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-200"></div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
              <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-200"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
              
              {/* Data bars */}
              {testData.map((test, index) => {
                const heightPercent = (test.bandwidth / 20) * 100
                return (
                  <div
                    key={index}
                    className="absolute bottom-0 w-12 flex flex-col items-center"
                    style={{ 
                      left: `${(index / (testData.length - 1)) * 80 + 10}%` 
                    }}
                  >
                    <div
                      className={`
                        w-8 rounded-t transition-all duration-300
                        ${index === currentTime 
                          ? "bg-blue-600" 
                          : "bg-gray-400"}
                      `}
                      style={{ 
                        height: `${heightPercent}%` 
                      }}
                    ></div>
                    <div className="text-xs mt-1 text-gray-600">
                      {test.name.split(' ')[0]}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* X-axis label */}
            <div className="absolute bottom-0 left-8 right-0 text-center text-xs text-gray-500">
              Patrones de acceso
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ThroughputMetricProps {
  metric: "loads" | "stores" | "instructions" | "flops"
  name: string
  description: string
  value: number
  unit: string
  peak: number
  color: string
}

export function ThroughputMetric({ 
  metric,
  name,
  description,
  value,
  unit,
  peak,
  color
}: ThroughputMetricProps) {
  // Metric icons
  const metricInfo = {
    "loads": {
      icon: "📥",
    },
    "stores": {
      icon: "📤",
    },
    "instructions": {
      icon: "⚙️",
    },
    "flops": {
      icon: "🧮",
    }
  }

  const currentMetric = metricInfo[metric]
  const percentage = peak > 0 ? (value / peak) * 100 : 0

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color }}
      >
        <span className="mr-2 text-xl">{currentMetric.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Actual</div>
            <div className="font-semibold">{value.toLocaleString()} {unit}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Pico</div>
            <div className="font-semibold">{peak.toLocaleString()} {unit}</div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Eficiencia</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full" 
              style={{ 
                width: `${percentage}%`,
                backgroundColor: color
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MemoryThroughputProps {
  metrics: {
    metric: "loads" | "stores" | "instructions" | "flops"
    name: string
    description: string
    value: number
    unit: string
    peak: number
    color: string
  }[]
}

export function MemoryThroughput({ metrics }: MemoryThroughputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">🚀</span>
          Rendimiento de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué es el rendimiento de memoria?</div>
          <div className="text-sm text-purple-700 mt-1">
            El rendimiento de memoria mide la capacidad del sistema para 
            ejecutar operaciones de memoria y otras instrucciones relacionadas.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <ThroughputMetric
              key={index}
              metric={metric.metric}
              name={metric.name}
              description={metric.description}
              value={metric.value}
              unit={metric.unit}
              peak={metric.peak}
              color={metric.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface BottleneckAnalysisProps {
  bottlenecks: {
    component: "memory" | "cache" | "bandwidth" | "latency"
    name: string
    severity: number
    description: string
    recommendation: string
  }[]
}

export function BottleneckAnalysis({ bottlenecks }: BottleneckAnalysisProps) {
  // Component icons and colors
  const componentInfo = {
    "memory": {
      icon: "💾",
      color: "#3b82f6"
    },
    "cache": {
      icon: "キャッシング",
      color: "#10b981"
    },
    "bandwidth": {
      icon: "📶",
      color: "#8b5cf6"
    },
    "latency": {
      icon: "⏱️",
      color: "#f59e0b"
    }
  }

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
          <div className="font-semibold text-red-800">¿Dónde están los cuellos de botella?</div>
          <div className="text-sm text-red-700 mt-1">
            Identificación de componentes que limitan el rendimiento del sistema.
          </div>
        </div>
        
        <div className="space-y-3">
          {bottlenecks.map((bottleneck, index) => {
            const component = componentInfo[bottleneck.component]
            return (
              <div 
                key={index}
                className="p-4 rounded-lg border"
                style={{ 
                  borderLeftColor: component.color, 
                  borderLeftWidth: '4px' 
                }}
              >
                <div 
                  className="font-semibold mb-2 flex items-center"
                  style={{ color: component.color }}
                >
                  <span className="mr-2 text-xl">{component.icon}</span>
                  {bottleneck.name}
                </div>
                
                <div className="space-y-3">
                  <div className="text-gray-600">
                    {bottleneck.description}
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Severidad</span>
                      <span>{bottleneck.severity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full" 
                        style={{ 
                          width: `${bottleneck.severity}%`,
                          backgroundColor: component.color
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    <div className="font-semibold text-blue-800 text-sm mb-1">
                      Recomendación:
                    </div>
                    <div className="text-sm text-blue-700">
                      {bottleneck.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}