import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface LatencyComparisonProps {
  latencies: {
    name: string
    value: number
    unit: string
    color: string
  }[]
  selectedLatency: number
  onLatencyChange: (value: number) => void
}

export function LatencyComparison({ 
  latencies, 
  selectedLatency,
  onLatencyChange
}: LatencyComparisonProps) {
  // Find the selected latency
  const selected = latencies.find(l => l.value === selectedLatency) || latencies[0]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Latencias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold" style={{ color: selected.color }}>
              {selected.name}
            </div>
            <div className="text-4xl font-mono mt-2">
              {selected.value} {selected.unit}
            </div>
          </div>
          
          <Slider
            value={[selectedLatency]}
            onValueChange={([value]) => onLatencyChange(value)}
            max={Math.max(...latencies.map(l => l.value))}
            min={Math.min(...latencies.map(l => l.value))}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{latencies[0].name}</span>
            <span>{latencies[latencies.length - 1].name}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {latencies.map((latency, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-3" 
                style={{ backgroundColor: latency.color }}
              ></div>
              <div className="flex-1">{latency.name}</div>
              <div className="font-mono">
                {latency.value} {latency.unit}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface LatencyScaleProps {
  scale: {
    name: string
    value: number
    unit: string
    description: string
    color: string
  }[]
  selectedScale: number
  onScaleChange: (value: number) => void
}

export function LatencyScale({ 
  scale, 
  selectedScale,
  onScaleChange
}: LatencyScaleProps) {
  // Find the selected scale
  const selected = scale.find(s => s.value === selectedScale) || scale[0]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escala de Latencias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold" style={{ color: selected.color }}>
              {selected.name}
            </div>
            <div className="text-4xl font-mono mt-2">
              {selected.value} {selected.unit}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {selected.description}
            </div>
          </div>
          
          <Slider
            value={[selectedScale]}
            onValueChange={([value]) => onScaleChange(value)}
            max={Math.max(...scale.map(s => s.value))}
            min={Math.min(...scale.map(s => s.value))}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {scale.map((item, index) => (
            <div 
              key={index}
              className={`
                border rounded p-3 cursor-pointer transition-all duration-200
                ${selectedScale === item.value 
                  ? "ring-2 ring-blue-500 bg-blue-50" 
                  : "border-gray-200"}
              `}
              onClick={() => onScaleChange(item.value)}
            >
              <div 
                className="font-semibold" 
                style={{ color: item.color }}
              >
                {item.name}
              </div>
              <div className="font-mono text-sm">
                {item.value} {item.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}