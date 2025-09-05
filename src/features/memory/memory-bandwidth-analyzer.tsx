import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"

export default function MemoryBandwidthAnalyzer() {
  const [config, setConfig] = useState({
    memoryType: "dram" as "dram" | "l1" | "l2" | "l3" | "hbm" | "gddr",
    accessPattern: "sequential" as "sequential" | "random" | "stride" | "pointer-chasing",
    blockSize: 64,
    numThreads: 1,
    testDuration: 1000, // ms
    stride: 1
  })
  
  const [results, setResults] = useState({
    bandwidth: 0, // GB/s
    latency: 0, // ns
    cpuUtilization: 0, // %
    memoryUtilization: 0, // %
    cacheHits: 0, // %
    throughput: 0 // ops/s
  })
  
  const [history, setHistory] = useState<{
    time: number,
    bandwidth: number,
    latency: number,
    cpuUtilization: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Memory type characteristics
  const memoryCharacteristics = {
    "dram": {
      name: "DRAM",
      typicalBandwidth: 50, // GB/s
      typicalLatency: 50, // ns
      size: "4-32 GB",
      color: "#3b82f6",
      icon: "🧠"
    },
    "l1": {
      name: "L1 Caché",
      typicalBandwidth: 500, // GB/s
      typicalLatency: 1, // ns
      size: "32-64 KB",
      color: "#ef4444",
      icon: "⚡"
    },
    "l2": {
      name: "L2 Caché",
      typicalBandwidth: 200, // GB/s
      typicalLatency: 3, // ns
      size: "256-512 KB",
      color: "#f97316",
      icon: "🔥"
    },
    "l3": {
      name: "L3 Caché",
      typicalBandwidth: 100, // GB/s
      typicalLatency: 10, // ns
      size: "2-32 MB",
      color: "#8b5cf6",
      icon: "🌡️"
    },
    "hbm": {
      name: "HBM (High Bandwidth Memory)",
      typicalBandwidth: 300, // GB/s
      typicalLatency: 15, // ns
      size: "1-8 GB",
      color: "#10b981",
      icon: "📶"
    },
    "gddr": {
      name: "GDDR (Graphics DDR)",
      typicalBandwidth: 100, // GB/s
      typicalLatency: 20, // ns
      size: "1-16 GB",
      color: "#f59e0b",
      icon: "🎮"
    }
  }

  // Access pattern characteristics
  const patternCharacteristics = {
    "sequential": {
      name: "Secuencial",
      description: "Acceso a direcciones consecutivas",
      cacheFriendly: true,
      typicalBandwidthMultiplier: 1.0
    },
    "random": {
      name: "Aleatorio",
      description: "Acceso a direcciones aleatorias",
      cacheFriendly: false,
      typicalBandwidthMultiplier: 0.3
    },
    "stride": {
      name: "Stride",
      description: "Acceso con salto fijo entre direcciones",
      cacheFriendly: false,
      typicalBandwidthMultiplier: 0.6
    },
    "pointer-chasing": {
      name: "Pointer Chasing",
      description: "Seguimiento de punteros en estructuras enlazadas",
      cacheFriendly: false,
      typicalBandwidthMultiplier: 0.2
    }
  }

  // Simulate memory bandwidth test
  const simulateBandwidthTest = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setResults({
      bandwidth: 0,
      latency: 0,
      cpuUtilization: 0,
      memoryUtilization: 0,
      cacheHits: 0,
      throughput: 0
    })
    
    const startTime = Date.now()
    const testDuration = config.testDuration
    const memoryChar = memoryCharacteristics[config.memoryType]
    const patternChar = patternCharacteristics[config.accessPattern]
    
    // Simulate test over time
    while (Date.now() - startTime < testDuration) {
      const elapsed = Date.now() - startTime
      const progressPercent = (elapsed / testDuration) * 100
      setProgress(progressPercent)
      
      // Calculate current performance metrics
      const timeFraction = elapsed / testDuration
      const baseBandwidth = memoryChar.typicalBandwidth * patternChar.typicalBandwidthMultiplier
      
      // Apply some variance based on pattern and time
      const variance = 0.1 * Math.sin(timeFraction * Math.PI * 2) // Small oscillation
      const currentBandwidth = baseBandwidth * (1 + variance)
      
      const currentLatency = memoryChar.typicalLatency * (1 - variance * 0.5)
      const currentCpuUtil = 80 + 10 * Math.sin(timeFraction * Math.PI * 3) // Oscillate between 70-90%
      const currentCacheHits = patternChar.cacheFriendly 
        ? 90 + 5 * Math.sin(timeFraction * Math.PI * 2) // High for cache-friendly patterns
        : 30 + 10 * Math.sin(timeFraction * Math.PI * 4) // Lower for non-cache-friendly
      
      // Update results periodically
      if (elapsed % 100 < 50) { // Update roughly every 100ms
        setResults({
          bandwidth: parseFloat(currentBandwidth.toFixed(2)),
          latency: parseFloat(currentLatency.toFixed(2)),
          cpuUtilization: parseFloat(currentCpuUtil.toFixed(2)),
          memoryUtilization: parseFloat((currentBandwidth / memoryChar.typicalBandwidth * 100).toFixed(2)),
          cacheHits: parseFloat(currentCacheHits.toFixed(2)),
          throughput: parseFloat((currentBandwidth * 1000000000 / config.blockSize).toFixed(0))
        })
      }
      
      // Add to history
      if (elapsed % 200 < 100) { // Add to history every 200ms
        setHistory(prev => [
          ...prev.slice(-29), // Keep last 30 points
          {
            time: elapsed,
            bandwidth: parseFloat(currentBandwidth.toFixed(2)),
            latency: parseFloat(currentLatency.toFixed(2)),
            cpuUtilization: parseFloat(currentCpuUtil.toFixed(2))
          }
        ])
      }
      
      // Add small delay to make simulation visible
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset test
  const resetTest = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setResults({
      bandwidth: 0,
      latency: 0,
      cpuUtilization: 0,
      memoryUtilization: 0,
      cacheHits: 0,
      throughput: 0
    })
  }

  // Get memory type info
  const getMemoryTypeInfo = (type: string) => {
    return memoryCharacteristics[type as keyof typeof memoryCharacteristics] || memoryCharacteristics.dram
  }

  // Get pattern info
  const getPatternInfo = (pattern: string) => {
    return patternCharacteristics[pattern as keyof typeof patternCharacteristics] || patternCharacteristics.sequential
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Analizador de Ancho de Banda de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Mide y analiza el rendimiento de diferentes tipos de memoria y patrones de acceso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Prueba</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memoryType">Tipo de Memoria</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(memoryCharacteristics).map(([key, memory]) => (
                  <Button
                    key={key}
                    variant={config.memoryType === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, memoryType: key as any})}
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <span className="text-xl mb-1">{memory.icon}</span>
                    <span className="text-xs">{memory.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(patternCharacteristics).map(([key, pattern]) => (
                  <Button
                    key={key}
                    variant={config.accessPattern === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, accessPattern: key as any})}
                    className="flex items-center justify-start"
                  >
                    <span className="mr-2">
                      {key === "sequential" && "➡️"}
                      {key === "random" && "🔀"}
                      {key === "stride" && "🔢"}
                      {key === "pointer-chasing" && "🔗"}
                    </span>
                    <span className="text-xs">{pattern.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="1"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="numThreads">Número de Hilos</Label>
              <Input
                id="numThreads"
                type="number"
                value={config.numThreads}
                onChange={(e) => setConfig({...config, numThreads: Number(e.target.value)})}
                min="1"
                max="64"
              />
            </div>

            {config.accessPattern === "stride" && (
              <div>
                <Label htmlFor="stride">Valor de Stride</Label>
                <Input
                  id="stride"
                  type="number"
                  value={config.stride}
                  onChange={(e) => setConfig({...config, stride: Number(e.target.value)})}
                  min="1"
                  step="1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="testDuration">Duración de Prueba (ms)</Label>
              <Input
                id="testDuration"
                type="number"
                value={config.testDuration}
                onChange={(e) => setConfig({...config, testDuration: Number(e.target.value)})}
                min="100"
                step="100"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateBandwidthTest} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Probando..." : "Iniciar Prueba"}
              </Button>
              <Button 
                onClick={resetTest} 
                variant="outline"
              >
                Reset
              </Button>
            </div>

            {isRunning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resultados de la Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {results.bandwidth.toFixed(2)} GB/s
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getMemoryTypeInfo(config.memoryType).name}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia</div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.latency.toFixed(2)} ns
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getPatternInfo(config.accessPattern).name}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Utilización de CPU</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {results.cpuUtilization.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {config.numThreads} hilo(s)
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Utilización de Memoria</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.memoryUtilization.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Eficiencia
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Aciertos de Caché</div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.cacheHits.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Efectividad
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Rendimiento</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {(results.throughput / 1000000).toFixed(2)} Mops/s
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Operaciones por segundo
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold mb-2">Resumen</div>
                <div className="text-sm text-gray-600">
                  Prueba de ancho de banda en {getMemoryTypeInfo(config.memoryType).name} 
                  con patrón {getPatternInfo(config.accessPattern).name} 
                  utilizando {config.numThreads} hilo(s).
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Prueba</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={history}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: "Tiempo (ms)", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Ancho de Banda (GB/s)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Latencia (ns)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="bandwidth" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Ancho de Banda (GB/s)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#10b981" 
                    name="Latencia (ns)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="cpuUtilization" 
                    stroke="#8b5cf6" 
                    name="Utilización de CPU (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay datos de prueba todavía. Ejecute una prueba para ver el historial.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Comparativa de Tipos de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(memoryCharacteristics).map(([key, memory]) => (
              <Card 
                key={key}
                className={`
                  transition-all duration-200
                  ${config.memoryType === key 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:shadow-md"}
                `}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center"
                    style={{ color: memory.color }}
                  >
                    <span className="mr-2 text-xl">{memory.icon}</span>
                    {memory.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Ancho de Banda</div>
                        <div className="font-semibold">{memory.typicalBandwidth} GB/s</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Latencia</div>
                        <div className="font-semibold">{memory.typicalLatency} ns</div>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-500">Tamaño</div>
                      <div className="font-semibold">{memory.size}</div>
                    </div>
                    
                    {/* Description omitted: not defined in memoryCharacteristics */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recomendaciones de Optimización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Elección de Patrones de Acceso</div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Usa acceso secuencial cuando sea posible para maximizar el ancho de banda</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Evita patrones aleatorios que generan muchos fallos de caché</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Considera el tamaño de línea de caché en tus estructuras de datos</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Optimización de Memoria</div>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Usa prefetching para patrones predecibles</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Minimiza la fragmentación con allocators apropiados</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Aprovecha la localidad espacial y temporal</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Hilos y Concurrencia</div>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Balancea la carga entre hilos para evitar cuellos de botella</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Minimiza el false sharing entre hilos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Usa estructuras de datos lock-free cuando sea apropiado</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Monitoreo y Medición</div>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">✓</span>
                  <span>Mide regularmente el rendimiento de memoria</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">✓</span>
                  <span>Usa herramientas de profiling para identificar problemas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">✓</span>
                  <span>Correlaciona el uso de CPU con el ancho de banda de memoria</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Conclusión:</div>
            <p className="text-sm text-gray-600">
              El rendimiento de memoria es un factor crítico en aplicaciones de alto rendimiento. 
              Comprender cómo diferentes tipos de memoria y patrones de acceso afectan el ancho de banda 
              y la latencia es esencial para optimizar aplicaciones. Usa este analizador para experimentar 
              con diferentes configuraciones y encontrar el equilibrio óptimo para tus casos de uso.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
