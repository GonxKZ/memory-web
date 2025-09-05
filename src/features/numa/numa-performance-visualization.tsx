import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

export default function NUMAPerformanceVisualization() {
  const [config, setConfig] = useState({
    nodes: 4,
    coresPerNode: 8,
    memoryPerNode: 16384, // 16GB
    interNodeLatency: 100, // ns
    intraNodeLatency: 10, // ns
    accessPattern: "local" as "local" | "remote" | "mixed",
    threads: 8
  })
  
  const [performance, setPerformance] = useState({
    localAccesses: 0,
    remoteAccesses: 0,
    averageLatency: 0,
    throughput: 0,
    cpuUtilization: 0
  })
  
  const [history, setHistory] = useState<{
    time: number,
    localAccesses: number,
    remoteAccesses: number,
    averageLatency: number,
    throughput: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate NUMA performance
  const simulateNUMAPerformance = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset performance counters
    setPerformance({
      localAccesses: 0,
      remoteAccesses: 0,
      averageLatency: 0,
      throughput: 0,
      cpuUtilization: 0
    })
    
    // Simulate over time
    let time = 0
    let totalLatency = 0
    let accesses = 0
    const newHistory = []
    
    for (let i = 0; i < 100; i++) {
      time += 100 // ms
      setProgress(((i + 1) / 100) * 100)
      
      // Generate random accesses based on pattern
      let localAccesses = 0
      let remoteAccesses = 0
      let batchLatency = 0
      let batchThroughput = 0
      
      for (let j = 0; j < config.threads; j++) {
        // Determine which node this thread runs on
        const node = Math.floor(j / (config.threads / config.nodes))
        
        // Determine memory access based on pattern
        let memoryNode: number
        let isRemote = false
        
        if (config.accessPattern === "local") {
          memoryNode = node
        } else if (config.accessPattern === "remote") {
          // Access remote memory (any node except local)
          const remoteNodes = Array.from({ length: config.nodes }, (_, idx) => idx).filter(idx => idx !== node)
          if (remoteNodes.length > 0) {
            memoryNode = remoteNodes[Math.floor(Math.random() * remoteNodes.length)]
            isRemote = true
          } else {
            memoryNode = node
          }
        } else {
          // Mixed pattern: 70% local, 30% remote
          if (Math.random() > 0.7) {
            const remoteNodes = Array.from({ length: config.nodes }, (_, idx) => idx).filter(idx => idx !== node)
            if (remoteNodes.length > 0) {
              memoryNode = remoteNodes[Math.floor(Math.random() * remoteNodes.length)]
              isRemote = true
            } else {
              memoryNode = node
            }
          } else {
            memoryNode = node
          }
        }
        
        // Calculate latency
        const latency = node === memoryNode ? config.intraNodeLatency : config.interNodeLatency
        batchLatency += latency
        
        // Update counters
        if (isRemote) {
          remoteAccesses++
        } else {
          localAccesses++
        }
        
        // Calculate throughput based on latency
        batchThroughput += 1000 / latency // Operations per second approximation
      }
      
      accesses += config.threads
      totalLatency += batchLatency
      
      // Update performance metrics
      setPerformance(prev => ({
        ...prev,
        localAccesses: prev.localAccesses + localAccesses,
        remoteAccesses: prev.remoteAccesses + remoteAccesses,
        averageLatency: totalLatency / accesses,
        throughput: batchThroughput / config.threads,
        cpuUtilization: (localAccesses / (localAccesses + remoteAccesses)) * 100
      }))
      
      // Add to history
      newHistory.push({
        time,
        localAccesses: localAccesses,
        remoteAccesses: remoteAccesses,
        averageLatency: batchLatency / config.threads,
        throughput: batchThroughput / config.threads
      })
      
      setHistory(newHistory)
      
      // Add delay to visualize
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setPerformance({
      localAccesses: 0,
      remoteAccesses: 0,
      averageLatency: 0,
      throughput: 0,
      cpuUtilization: 0
    })
  }

  // Calculate remote access ratio
  const remoteRatio = performance.localAccesses + performance.remoteAccesses > 0 
    ? (performance.remoteAccesses / (performance.localAccesses + performance.remoteAccesses)) * 100
    : 0

  // Calculate performance degradation
  const performanceDegradation = (config.interNodeLatency / config.intraNodeLatency) * 100 - 100

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Efectos NUMA</h1>
        <p className="text-gray-600 mt-2">
          Analiza cómo la arquitectura NUMA afecta el rendimiento del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración NUMA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nodes">Número de Nodos</Label>
              <Input
                id="nodes"
                type="number"
                value={config.nodes}
                onChange={(e) => setConfig({...config, nodes: Number(e.target.value)})}
                min="2"
                max="8"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="coresPerNode">Cores por Nodo</Label>
              <Input
                id="coresPerNode"
                type="number"
                value={config.coresPerNode}
                onChange={(e) => setConfig({...config, coresPerNode: Number(e.target.value)})}
                min="4"
                max="16"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="memoryPerNode">Memoria por Nodo (GB)</Label>
              <Input
                id="memoryPerNode"
                type="number"
                value={config.memoryPerNode / 1024}
                onChange={(e) => setConfig({...config, memoryPerNode: Number(e.target.value) * 1024})}
                min="8"
                max="64"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="intraNodeLatency">Latencia Intranodal (ns)</Label>
              <Input
                id="intraNodeLatency"
                type="number"
                value={config.intraNodeLatency}
                onChange={(e) => setConfig({...config, intraNodeLatency: Number(e.target.value)})}
                min="1"
                max="50"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="interNodeLatency">Latencia Internodal (ns)</Label>
              <Input
                id="interNodeLatency"
                type="number"
                value={config.interNodeLatency}
                onChange={(e) => setConfig({...config, interNodeLatency: Number(e.target.value)})}
                min="50"
                max="500"
                step="10"
              />
            </div>

            <div>
              <Label>Patrón de Acceso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.accessPattern === "local" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "local"})}
                >
                  Local
                </Button>
                <Button
                  variant={config.accessPattern === "remote" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "remote"})}
                >
                  Remoto
                </Button>
                <Button
                  variant={config.accessPattern === "mixed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "mixed"})}
                >
                  Mixto
                </Button>
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
                max={config.nodes * config.coresPerNode}
                step="1"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateNUMAPerformance} 
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
            <CardTitle>Resultados de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Locales</div>
                  <div className="text-2xl font-bold text-green-600">
                    {performance.localAccesses.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Remotos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {performance.remoteAccesses.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia Media</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {performance.averageLatency.toFixed(1)} ns
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Rendimiento</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(performance.throughput / 1000).toFixed(1)} Kops/s
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Ratio de Accesos Remotos</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {remoteRatio.toFixed(1)}%
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                    <Progress 
                      value={remoteRatio} 
                      className="w-full" 
                      color={remoteRatio > 30 ? "red" : "green"}
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Utilización de CPU</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {performance.cpuUtilization.toFixed(1)}%
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                    <Progress 
                      value={performance.cpuUtilization} 
                      className="w-full" 
                      color={performance.cpuUtilization < 50 ? "red" : "green"}
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Degradación NUMA</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {performanceDegradation.toFixed(1)}%
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>0%</span>
                      <span>+∞%</span>
                    </div>
                    <Progress 
                      value={Math.min(performanceDegradation, 100)} 
                      className="w-full" 
                      color={performanceDegradation > 50 ? "red" : "green"}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold mb-2">Configuración Actual</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Nodos</div>
                    <div className="font-semibold">{config.nodes}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Cores/Nodo</div>
                    <div className="font-semibold">{config.coresPerNode}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Memoria/Nodo</div>
                    <div className="font-semibold">{config.memoryPerNode / 1024} GB</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Patrón</div>
                    <div className="font-semibold capitalize">{config.accessPattern}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Simulación</CardTitle>
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
                    label={{ value: "Accesos", angle: -90, position: "insideLeft" }} 
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
                    dataKey="localAccesses" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Accesos Locales"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="remoteAccesses" 
                    stroke="#ef4444" 
                    name="Accesos Remotos"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="averageLatency" 
                    stroke="#3b82f6" 
                    name="Latencia Media"
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
          <CardTitle>Topología NUMA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="font-semibold text-blue-800">¿Qué es NUMA?</div>
            <div className="text-sm text-blue-700 mt-1">
              NUMA (Non-Uniform Memory Access) es una arquitectura donde cada procesador 
              tiene acceso a su propia memoria local con menor latencia que a la memoria de otros nodos.
            </div>
          </div>
          
          <div className="relative h-64 bg-gray-50 rounded p-4">
            {/* Visualization of NUMA nodes in a ring topology */}
            {Array.from({ length: config.nodes }).map((_, nodeIndex) => {
              // Position nodes in a circle
              const angle = (nodeIndex * (2 * Math.PI)) / config.nodes
              const radius = 100
              const centerX = 150
              const centerY = 120
              const x = centerX + radius * Math.cos(angle)
              const y = centerY + radius * Math.sin(angle)
              
              return (
                <div key={nodeIndex}>
                  {/* Node visualization */}
                  <div
                    className="absolute w-24 h-24 bg-blue-100 border-2 border-blue-500 rounded-lg p-2 text-center"
                    style={{
                      left: `${x - 48}px`,
                      top: `${y - 48}px`
                    }}
                  >
                    <div className="font-semibold text-blue-800">Nodo {nodeIndex}</div>
                    <div className="text-xs mt-1">
                      <div>Cores: {config.coresPerNode}</div>
                      <div>Mem: {config.memoryPerNode / 1024} GB</div>
                    </div>
                  </div>
                  
                  {/* Connections to other nodes */}
                  {Array.from({ length: config.nodes }).map((__, connectionIndex) => {
                    if (connectionIndex <= nodeIndex) return null
                    
                    // Calculate position of connected node
                    const connAngle = (connectionIndex * (2 * Math.PI)) / config.nodes
                    const connX = centerX + radius * Math.cos(connAngle)
                    const connY = centerY + radius * Math.sin(connAngle)
                    
                    return (
                      <div
                        key={`${nodeIndex}-${connectionIndex}`}
                        className="absolute bg-gray-400"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          width: `${Math.sqrt((connX - x) * (connX - x) + (connY - y) * (connY - y))}px`,
                          height: "2px",
                          transform: `rotate(${Math.atan2(connY - y, connX - x)}rad)`,
                          transformOrigin: "0 0"
                        }}
                      ></div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Ventajas de NUMA</div>
              <ul className="space-y-1 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Escalabilidad mejorada</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mejor rendimiento de memoria local</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mayor ancho de banda total</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">Desafíos de NUMA</div>
              <ul className="space-y-1 text-sm text-red-700">
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Mayor latencia para acceso remoto</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Complejidad en programación</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Posible desbalance de carga</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Optimización para NUMA</div>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Uso de CPU affinity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Asignación de memoria local</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Balanceo de carga</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
