import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export default function MemoryBandwidthSaturation() {
  const [config, setConfig] = useState({
    memoryType: "dram" as "dram" | "l1" | "l2" | "l3" | "hbm" | "gddr",
    bandwidth: 50, // GB/s
    threads: 8,
    accessPattern: "sequential" as "sequential" | "random" | "stride",
    blockSize: 64, // bytes
    stride: 1,
    simulationDuration: 10000, // ms
    updateInterval: 100 // ms
  })
  
  const [saturation, setSaturation] = useState({
    currentBandwidth: 0,
    maxBandwidth: 0,
    utilization: 0,
    saturated: false,
    saturationPoint: 0
  })
  
  const [threads, setThreads] = useState<{
    id: number,
    bandwidthDemand: number,
    currentBandwidth: number,
    blocked: boolean
  }[]>([])
  
  const [history, setHistory] = useState<{
    time: number,
    totalBandwidth: number,
    utilization: number,
    saturated: boolean
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Memory type information
  const memoryTypeInfo = {
    "dram": {
      name: "DRAM",
      bandwidth: 50, // GB/s
      latency: 50, // ns
      color: "#3b82f6",
      icon: "🧠"
    },
    "l1": {
      name: "L1 Caché",
      bandwidth: 500, // GB/s
      latency: 1, // ns
      color: "#ef4444",
      icon: "⚡"
    },
    "l2": {
      name: "L2 Caché",
      bandwidth: 200, // GB/s
      latency: 3, // ns
      color: "#f97316",
      icon: "🔥"
    },
    "l3": {
      name: "L3 Caché",
      bandwidth: 100, // GB/s
      latency: 10, // ns
      color: "#8b5cf6",
      icon: "🌡️"
    },
    "hbm": {
      name: "HBM",
      bandwidth: 300, // GB/s
      latency: 15, // ns
      color: "#10b981",
      icon: "📶"
    },
    "gddr": {
      name: "GDDR",
      bandwidth: 100, // GB/s
      latency: 20, // ns
      color: "#f59e0b",
      icon: "🎮"
    }
  }

  const currentMemoryType = memoryTypeInfo[config.memoryType]

  // Access pattern information
  const patternInfo = {
    "sequential": {
      name: "Secuencial",
      description: "Acceso a direcciones consecutivas",
      efficiency: 1.0,
      icon: "➡️"
    },
    "random": {
      name: "Aleatorio",
      description: "Acceso a direcciones aleatorias",
      efficiency: 0.3,
      icon: "🔀"
    },
    "stride": {
      name: "Stride",
      description: "Acceso con salto fijo entre direcciones",
      efficiency: 0.6,
      icon: "🔢"
    }
  }

  const currentPattern = patternInfo[config.accessPattern]

  // Simulate memory bandwidth saturation
  const simulateBandwidthSaturation = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setSaturation({
      currentBandwidth: 0,
      maxBandwidth: 0,
      utilization: 0,
      saturated: false,
      saturationPoint: 0
    })
    
    // Initialize threads
    const newThreads = []
    for (let i = 0; i < config.threads; i++) {
      newThreads.push({
        id: i,
        bandwidthDemand: Math.random() * 10, // GB/s
        currentBandwidth: 0,
        blocked: false
      })
    }
    setThreads(newThreads)
    
    const newHistory = []
    let totalBandwidth = 0
    let maxBandwidth = 0
    let saturationPoint = 0
    let saturated = false
    
    // Memory type bandwidths
    const maxBandwidthForType = currentMemoryType.bandwidth
    
    // Simulation loop
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Calculate total bandwidth demand
      let totalDemand = threads.reduce((sum, thread) => sum + thread.bandwidthDemand, 0)
      
      // Apply access pattern efficiency
      totalDemand *= currentPattern.efficiency
      
      // Calculate actual bandwidth allocation
      let totalAllocated = 0
      const updatedThreads = [...threads]
      
      if (totalDemand <= maxBandwidthForType) {
        // Enough bandwidth for all threads
        updatedThreads.forEach(thread => {
          thread.currentBandwidth = thread.bandwidthDemand * currentPattern.efficiency
          thread.blocked = false
          totalAllocated += thread.currentBandwidth
        })
        saturated = false
      } else {
        // Bandwidth saturation - allocate proportionally
        saturated = true
        if (saturationPoint === 0) {
          saturationPoint = i
        }
        
        const allocationRatio = maxBandwidthForType / totalDemand
        updatedThreads.forEach(thread => {
          thread.currentBandwidth = thread.bandwidthDemand * allocationRatio * currentPattern.efficiency
          thread.blocked = thread.currentBandwidth < thread.bandwidthDemand * 0.1 // Blocked if < 10% of demand
          totalAllocated += thread.currentBandwidth
        })
      }
      
      setThreads(updatedThreads)
      
      // Update saturation metrics
      totalBandwidth = totalAllocated
      maxBandwidth = Math.max(maxBandwidth, totalBandwidth)
      const utilization = (totalBandwidth / maxBandwidthForType) * 100
      
      setSaturation({
        currentBandwidth: parseFloat(totalBandwidth.toFixed(2)),
        maxBandwidth: parseFloat(maxBandwidth.toFixed(2)),
        utilization: parseFloat(utilization.toFixed(2)),
        saturated,
        saturationPoint
      })
      
      // Add to history
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          totalBandwidth: parseFloat(totalBandwidth.toFixed(2)),
          utilization: parseFloat(utilization.toFixed(2)),
          saturated
        })
        setHistory(newHistory)
      }
      
      // Add small delay for visualization
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setSaturation({
      currentBandwidth: 0,
      maxBandwidth: 0,
      utilization: 0,
      saturated: false,
      saturationPoint: 0
    })
    
    // Reset threads
    const newThreads = threads.map(thread => ({
      ...thread,
      currentBandwidth: 0,
      blocked: false
    }))
    setThreads(newThreads)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Saturación de Ancho de Banda de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo múltiples hilos compiten por el ancho de banda de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memoryType">Tipo de Memoria</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(memoryTypeInfo).map(([key, memory]) => (
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
              <Label htmlFor="threads">Número de Hilos</Label>
              <Input
                id="threads"
                type="number"
                value={config.threads}
                onChange={(e) => setConfig({...config, threads: Number(e.target.value)})}
                min="1"
                max="32"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="bandwidth">Ancho de Banda Máximo (GB/s)</Label>
              <Input
                id="bandwidth"
                type="number"
                value={config.bandwidth}
                onChange={(e) => setConfig({...config, bandwidth: Number(e.target.value)})}
                min="1"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(patternInfo).map(([key, pattern]) => (
                  <Button
                    key={key}
                    variant={config.accessPattern === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, accessPattern: key as any})}
                  >
                    <span className="mr-1">{pattern.icon}</span>
                    <span className="text-xs">{pattern.name}</span>
                  </Button>
                ))}
              </div>
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
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="16"
                step="16"
              />
            </div>

            <div>
              <Label htmlFor="simulationDuration">Duración de Simulación (ms)</Label>
              <Input
                id="simulationDuration"
                type="number"
                value={config.simulationDuration}
                onChange={(e) => setConfig({...config, simulationDuration: Number(e.target.value)})}
                min="1000"
                step="1000"
              />
            </div>

            <div>
              <Label htmlFor="updateInterval">Intervalo de Actualización (ms)</Label>
              <Input
                id="updateInterval"
                type="number"
                value={config.updateInterval}
                onChange={(e) => setConfig({...config, updateInterval: Number(e.target.value)})}
                min="10"
                max="1000"
                step="10"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateBandwidthSaturation} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Simulando..." : "Iniciar Simulación"}
              </Button>
              <Button 
                onClick={resetSimulation} 
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
            <CardTitle 
              className="flex items-center"
              style={{ color: currentMemoryType.color }}
            >
              <span className="mr-2 text-2xl">{currentMemoryType.icon}</span>
              {currentMemoryType.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda Actual</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {saturation.currentBandwidth.toFixed(2)} GB/s
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda Máximo</div>
                  <div className="text-2xl font-bold text-green-600">
                    {saturation.maxBandwidth.toFixed(2)} GB/s
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Utilización</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {saturation.utilization.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold mb-2">Resumen</div>
                <div className="text-sm text-gray-600">
                  Saturación de ancho de banda en {currentMemoryType.name} 
                  con patrón {currentPattern.name} 
                  utilizando {config.threads} hilo(s).
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2">Estado de Saturación</div>
                <div className={`p-3 rounded ${
                  saturation.saturated ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold" 
                      style={{ color: saturation.saturated ? "#ef4444" : "#10b981" }}
                    >
                      {saturation.saturated ? "Saturado" : "No Saturado"}
                    </div>
                    {saturation.saturated && (
                      <Badge variant="destructive">Saturado</Badge>
                    )}
                  </div>
                  
                  {saturation.saturated && (
                    <div className="mt-2 text-sm text-red-700">
                      Punto de saturación alcanzado en iteración {saturation.saturationPoint}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Hilos</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {threads.map(thread => (
                    <Card 
                      key={thread.id}
                      className={thread.blocked ? "border-red-200 bg-red-50" : ""}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-sm">
                          <span>Hilo {thread.id}</span>
                          {thread.blocked && (
                            <Badge variant="destructive">Bloqueado</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Demanda de Ancho de Banda</div>
                            <div className="font-mono">{thread.bandwidthDemand.toFixed(2)} GB/s</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Ancho de Banda Asignado</div>
                            <div className="font-mono">{thread.currentBandwidth.toFixed(2)} GB/s</div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Utilización</span>
                              <span>
                                {thread.bandwidthDemand > 0 
                                  ? ((thread.currentBandwidth / thread.bandwidthDemand) * 100).toFixed(1) 
                                  : "0"}%
                              </span>
                            </div>
                            <Progress 
                              value={thread.bandwidthDemand > 0 
                                ? (thread.currentBandwidth / thread.bandwidthDemand) * 100 
                                : 0} 
                              className="w-full" 
                              color={thread.blocked ? "red" : "green"}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Utilización</CardTitle>
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
                    label={{ value: "Tiempo", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Ancho de Banda (GB/s)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Utilización (%)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="totalBandwidth" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Ancho de Banda Total"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="utilization" 
                    stroke="#10b981" 
                    name="Utilización"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay datos de simulación todavía. Ejecute una simulación para ver el historial.</p>
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
            {Object.entries(memoryTypeInfo).map(([key, memory]) => (
              <Card 
                key={key}
                className={config.memoryType === key ? "ring-2 ring-blue-500 bg-blue-50" : ""}
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
                        <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                        <div className="font-semibold">{memory.bandwidth} GB/s</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500 mb-1">Latencia</div>
                        <div className="font-semibold">{memory.latency} ns</div>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-500 mb-1">Tamaño</div>
                      <div className="font-semibold">
                        {key === "l1" || key === "l2" || key === "l3" ? "KB/MB" : "GB"}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Características:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {memory.name === "DRAM" && "Alto ancho de banda, latencia moderada"}
                            {memory.name === "L1 Caché" && "Baja latencia, alto ancho de banda"}
                            {memory.name === "L2 Caché" && "Balance entre L1 y L3"}
                            {memory.name === "L3 Caché" && "Compartida entre cores, latencia moderada"}
                            {memory.name === "HBM" && "Muy alto ancho de banda, apilada en 3D"}
                            {memory.name === "GDDR" && "Diseñada para gráficos, alto ancho de banda"}
                          </span>
                        </li>
                      </ul>
                    </div>
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
