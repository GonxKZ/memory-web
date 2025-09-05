import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BandwidthMeterProps {
  current: number
  max: number
  unit: string
  label: string
  color: string
}

export function BandwidthMeter({ 
  current, 
  max, 
  unit, 
  label,
  color
}: BandwidthMeterProps) {
  const percentage = (current / max) * 100
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>{current.toFixed(1)} {unit} / {max} {unit}</span>
      </div>
      <Progress 
        value={percentage} 
        className="w-full"
        indicatorClassName={`bg-[${color}]`}
        style={{ 
          backgroundColor: '#e5e7eb',
        }}
      />
      <div className="text-xs text-gray-500 text-right">
        {percentage.toFixed(1)}%
      </div>
    </div>
  )
}

interface MemoryBandwidthProps {
  bandwidths: {
    level: string
    current: number
    max: number
    unit: string
    color: string
  }[]
}

export function MemoryBandwidth({ bandwidths }: MemoryBandwidthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ancho de Banda de Memoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es el ancho de banda?</div>
          <div className="text-sm text-blue-700 mt-1">
            El ancho de banda de memoria es la cantidad de datos que pueden transferirse 
            entre la memoria y el procesador en un período de tiempo determinado.
          </div>
        </div>
        
        <div className="space-y-4">
          {bandwidths.map((bandwidth, index) => (
            <BandwidthMeter
              key={index}
              current={bandwidth.current}
              max={bandwidth.max}
              unit={bandwidth.unit}
              label={bandwidth.level}
              color={bandwidth.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface ThroughputVisualizationProps {
  operations: {
    name: string
    throughput: number
    unit: string
    color: string
  }[]
}

export function ThroughputVisualization({ operations }: ThroughputVisualizationProps) {
  // Find max throughput for scaling
  const maxThroughput = Math.max(...operations.map(op => op.throughput))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de Operaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Qué es el rendimiento?</div>
          <div className="text-sm text-green-700 mt-1">
            El rendimiento mide cuántas operaciones pueden completarse por unidad de tiempo, 
            considerando factores como latencia, ancho de banda y paralelismo.
          </div>
        </div>
        
        <div className="space-y-4">
          {operations.map((operation, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{operation.name}</span>
                <span>{operation.throughput.toFixed(1)} {operation.unit}</span>
              </div>
              <div 
                className="h-6 rounded bg-gray-200 overflow-hidden"
                style={{ backgroundColor: '#e5e7eb' }}
              >
                <div 
                  className="h-full rounded"
                  style={{ 
                    width: `${(operation.throughput / maxThroughput) * 100}%`,
                    backgroundColor: operation.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface LatencyThroughputTradeoffProps {
  data: {
    name: string
    latency: number
    throughput: number
    latencyUnit: string
    throughputUnit: string
  }[]
}

export function LatencyThroughputTradeoff({ data }: LatencyThroughputTradeoffProps) {
  // Find max values for scaling
  const maxLatency = Math.max(...data.map(d => d.latency))
  const maxThroughput = Math.max(...data.map(d => d.throughput))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compensación entre Latencia y Rendimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">Latencia vs Rendimiento</div>
          <div className="text-sm text-purple-700 mt-1">
            Existe una compensación fundamental entre latencia y rendimiento. 
            Optimizar uno puede afectar al otro.
          </div>
        </div>
        
        <div className="space-y-4">
          {data.map((point, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <div className="font-semibold mb-2">{point.name}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Latencia</div>
                  <div className="text-lg font-mono">
                    {point.latency} {point.latencyUnit}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(point.latency / maxLatency) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Rendimiento</div>
                  <div className="text-lg font-mono">
                    {point.throughput} {point.throughputUnit}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(point.throughput / maxThroughput) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}