import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CacheMetricProps {
  name: string
  value: number
  max: number
  unit: string
  description: string
  color: string
}

export function CacheMetric({ 
  name, 
  value, 
  max, 
  unit, 
  description,
  color
}: CacheMetricProps) {
  const percentage = (value / max) * 100
  
  return (
    <div className="p-4 bg-gray-50 rounded">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">{name}</div>
        <div className="font-mono">{value.toFixed(2)} {unit}</div>
      </div>
      
      <Progress 
        value={percentage} 
        className="w-full mb-2"
        indicatorClassName={`bg-[${color}]`}
        style={{ 
          backgroundColor: '#e5e7eb',
        }}
      />
      
      <div className="text-xs text-gray-500">
        {description}
      </div>
    </div>
  )
}

interface CachePerformanceProps {
  metrics: {
    name: string
    value: number
    max: number
    unit: string
    description: string
    color: string
  }[]
}

export function CachePerformance({ metrics }: CachePerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Rendimiento de Caché</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Por qué son importantes?</div>
          <div className="text-sm text-blue-700 mt-1">
            Las métricas de rendimiento de caché ayudan a entender la eficiencia 
            del sistema y a identificar cuellos de botella.
          </div>
        </div>
        
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <CacheMetric
              key={index}
              name={metric.name}
              value={metric.value}
              max={metric.max}
              unit={metric.unit}
              description={metric.description}
              color={metric.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface HitRateVisualizationProps {
  levels: {
    name: string
    hitRate: number
    missRate: number
    accesses: number
    hits: number
    misses: number
  }[]
}

export function HitRateVisualization({ levels }: HitRateVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasa de Aciertos por Nivel de Caché</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Qué es la tasa de aciertos?</div>
          <div className="text-sm text-green-700 mt-1">
            La tasa de aciertos es la proporción de accesos a caché que encuentran 
            los datos solicitados en la caché.
          </div>
        </div>
        
        <div className="space-y-4">
          {levels.map((level, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-3">{level.name}</div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{level.hitRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Aciertos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{level.missRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Fallos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{level.accesses}</div>
                  <div className="text-xs text-gray-500">Accesos</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="h-4 rounded-full bg-green-600" 
                  style={{ width: `${level.hitRate}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-mono">{level.hits} aciertos</div>
                </div>
                <div className="p-2 bg-red-50 rounded">
                  <div className="font-mono">{level.misses} fallos</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface AMATCalculationProps {
  levels: {
    name: string
    hitTime: number
    missRate: number
    missPenalty: number
  }[]
}

export function AMATCalculation({ levels }: AMATCalculationProps) {
  // Calculate AMAT (Average Memory Access Time)
  let amat = 0
  let cumulativeMissRate = 1
  
  const calculations = levels.map(level => {
    const contribution = cumulativeMissRate * (level.hitTime + level.missRate * level.missPenalty)
    amat += contribution
    cumulativeMissRate *= level.missRate
    return {
      ...level,
      contribution,
      cumulativeMissRate
    }
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AMAT (Tiempo Medio de Acceso a Memoria)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué es el AMAT?</div>
          <div className="text-sm text-purple-700 mt-1">
            El AMAT es el tiempo promedio que tarda una instrucción en acceder a los datos, 
            considerando aciertos y fallos en todos los niveles de caché.
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-gray-800 text-white rounded">
          <div className="font-mono text-center">
            AMAT = HitTime + MissRate × MissPenalty
          </div>
          <div className="text-center mt-2">
            AMAT Total: <span className="font-bold">{amat.toFixed(2)} ciclos</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {calculations.map((level, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-2">{level.name}</div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="p-2 bg-white border rounded">
                  <div className="text-xs text-gray-500">Tiempo de acierto</div>
                  <div className="font-mono">{level.hitTime} ciclos</div>
                </div>
                <div className="p-2 bg-white border rounded">
                  <div className="text-xs text-gray-500">Tasa de fallos</div>
                  <div className="font-mono">{(level.missRate * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="p-2 bg-white border rounded mb-3">
                <div className="text-xs text-gray-500">Penalización por fallo</div>
                <div className="font-mono">{level.missPenalty} ciclos</div>
              </div>
              
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-xs text-gray-500">Contribución al AMAT</div>
                <div className="font-mono">{level.contribution.toFixed(2)} ciclos</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CacheSimulationProps {
  accesses: {
    address: number
    result: "hit" | "miss"
    level?: string
    latency: number
  }[]
  currentAccess: number
}

export function CacheSimulation({ accesses, currentAccess }: CacheSimulationProps) {
  const current = accesses[currentAccess]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulación de Accesos a Caché</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">Simulación interactiva</div>
          <div className="text-sm text-blue-700 mt-1">
            Visualiza cómo se procesan los accesos a memoria y si resultan en aciertos o fallos.
          </div>
        </div>
        
        <div className="mb-6">
          <div className="font-semibold mb-2">Acceso actual:</div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Dirección</div>
                <div className="font-mono text-lg">0x{current.address.toString(16).toUpperCase()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Resultado</div>
                <div className={`text-lg font-bold ${current.result === "hit" ? "text-green-600" : "text-red-600"}`}>
                  {current.result === "hit" ? "ACIERTO" : "FALLO"}
                </div>
              </div>
            </div>
            
            {current.level && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">Nivel de caché</div>
                <div className="font-semibold">{current.level}</div>
              </div>
            )}
            
            <div className="mt-2">
              <div className="text-xs text-gray-500">Latencia</div>
              <div className="font-mono">{current.latency} ciclos</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="font-semibold mb-2">Historial de accesos:</div>
          <div className="flex flex-wrap gap-2">
            {accesses.map((access, index) => (
              <div
                key={index}
                className={`
                  w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                  ${index === currentAccess 
                    ? "ring-2 ring-blue-500" 
                    : access.result === "hit"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"}
                `}
              >
                0x{access.address.toString(16).toUpperCase().slice(-2)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}