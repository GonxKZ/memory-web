import { useState } from "react"
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

export default function NUMAMemoryAllocation() {
  const [config, setConfig] = useState({
    nodes: 4,
    threadsPerNode: 4,
    memoryPerNode: 16384, // 16GB
    allocationStrategy: "local" as "local" | "interleaved" | "first-touch" | "manual",
    accessPattern: "same-node" as "same-node" | "cross-node" | "random",
    blockSize: 4096, // 4KB
    numAllocations: 100,
    simulationSpeed: 200 // ms
  })
  
  const [allocation, setAllocation] = useState({
    allocations: [] as {id: number, nodeId: number, size: number, threadId: number | null, latency: number}[],
    nodeMemory: [] as {nodeId: number, used: number, available: number}[],
    accessLatencies: [] as {allocationId: number, latency: number, nodeId: number, threadId: number}[],
    stats: {
      localAllocations: 0,
      remoteAllocations: 0,
      averageLatency: 0,
      totalAllocations: 0
    }
  })
  
  const [history, setHistory] = useState<{
    time: number,
    localAllocations: number,
    remoteAllocations: number,
    averageLatency: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize NUMA nodes
  useState(() => {
    const newNodeMemory: { nodeId: number; used: number; available: number }[] = []
    for (let i = 0; i < config.nodes; i++) {
      newNodeMemory.push({
        nodeId: i,
        used: 0,
        available: config.memoryPerNode
      })
    }
    setAllocation(prev => ({...prev, nodeMemory: newNodeMemory}))
  })

  // Simulate NUMA memory allocation
  const simulateNUMAAllocation = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setAllocation({
      allocations: [],
      nodeMemory: allocation.nodeMemory.map(node => ({...node, used: 0, available: config.memoryPerNode})),
      accessLatencies: [],
      stats: {
        localAllocations: 0,
        remoteAllocations: 0,
        averageLatency: 0,
        totalAllocations: 0
      }
    })
    
    const newHistory = []
    let localAllocations = 0
    let remoteAllocations = 0
    let totalLatency = 0
    let totalAllocations = 0
    
    // Simulate allocations
    for (let i = 0; i < config.numAllocations; i++) {
      setProgress((i / config.numAllocations) * 100)
      
      // Generate random allocation
      const size = Math.floor(Math.random() * config.blockSize * 4) + config.blockSize // 1-4 blocks
      const threadId = Math.floor(Math.random() * config.threadsPerNode * config.nodes)
      const threadNode = Math.floor(threadId / config.threadsPerNode)
      
      // Determine allocation node based on strategy
      let allocationNode = 0
      switch (config.allocationStrategy) {
        case "local":
          // Allocate on local node
          allocationNode = threadNode
          break
          
        case "interleaved":
          // Interleave across nodes
          allocationNode = i % config.nodes
          break
          
        case "first-touch":
          // Allocate on first access node
          allocationNode = threadNode
          break
          
        case "manual":
          // Random allocation
          allocationNode = Math.floor(Math.random() * config.nodes)
          break
      }
      
      // Calculate allocation latency
      const isLocal = allocationNode === threadNode
      const latency = isLocal ? 10 : 100 // ns
      
      // Update stats
      if (isLocal) {
        localAllocations++
      } else {
        remoteAllocations++
      }
      totalLatency += latency
      totalAllocations++
      
      // Update node memory
      const newNodeMemory = [...allocation.nodeMemory]
      const nodeIndex = newNodeMemory.findIndex(node => node.nodeId === allocationNode)
      if (nodeIndex !== -1) {
        newNodeMemory[nodeIndex] = {
          ...newNodeMemory[nodeIndex],
          used: newNodeMemory[nodeIndex].used + size,
          available: newNodeMemory[nodeIndex].available - size
        }
      }
      
      // Add allocation
      const newAllocation = {
        id: i,
        nodeId: allocationNode,
        size,
        threadId,
        latency
      }
      
      setAllocation(prev => ({
        ...prev,
        allocations: [...prev.allocations.slice(-49), newAllocation],
        nodeMemory: newNodeMemory,
        stats: {
          ...prev.stats,
          localAllocations,
          remoteAllocations,
          averageLatency: totalLatency / totalAllocations,
          totalAllocations
        }
      }))
      
      // Simulate memory access
      const accessLatency = isLocal ? 50 : 150 // ns
      setAllocation(prev => ({
        ...prev,
        accessLatencies: [...prev.accessLatencies.slice(-49), {
          allocationId: i,
          latency: accessLatency,
          nodeId: allocationNode,
          threadId
        }]
      }))
      
      // Add to history every 10 allocations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          localAllocations,
          remoteAllocations,
          averageLatency: totalLatency / totalAllocations
        })
        setHistory(newHistory)
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setAllocation({
      allocations: [],
      nodeMemory: allocation.nodeMemory.map(node => ({...node, used: 0, available: config.memoryPerNode})),
      accessLatencies: [],
      stats: {
        localAllocations: 0,
        remoteAllocations: 0,
        averageLatency: 0,
        totalAllocations: 0
      }
    })
  }

  // Strategy information
  const strategyInfo = {
    "local": {
      name: "Asignación Local",
      description: "Asigna memoria en el nodo local del hilo",
      color: "#3b82f6",
      icon: "🏠"
    },
    "interleaved": {
      name: "Asignación Interleaved",
      description: "Distribuye memoria uniformemente entre nodos",
      color: "#10b981",
      icon: "🔀"
    },
    "first-touch": {
      name: "First-Touch",
      description: "Asigna memoria en el nodo que accede primero",
      color: "#8b5cf6",
      icon: "👆"
    },
    "manual": {
      name: "Asignación Manual",
      description: "Permite control explícito de asignación",
      color: "#f59e0b",
      icon: "🛠️"
    }
  }

  const currentStrategy = strategyInfo[config.allocationStrategy]

  // Access pattern information
  const patternInfo = {
    "same-node": {
      name: "Mismo Nodo",
      description: "Los hilos acceden a memoria en su nodo local",
      color: "#3b82f6",
      icon: "🏠"
    },
    "cross-node": {
      name: "Cruce de Nodos",
      description: "Los hilos acceden a memoria en nodos remotos",
      color: "#ef4444",
      icon: "🌐"
    },
    "random": {
      name: "Aleatorio",
      description: "Los hilos acceden a memoria en nodos aleatorios",
      color: "#8b5cf6",
      icon: "🔀"
    }
  }

  const currentPattern = patternInfo[config.accessPattern]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Asignación de Memoria NUMA</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo diferentes estrategias de asignación afectan el rendimiento en sistemas NUMA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
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
              <Label htmlFor="threadsPerNode">Hilos por Nodo</Label>
              <Input
                id="threadsPerNode"
                type="number"
                value={config.threadsPerNode}
                onChange={(e) => setConfig({...config, threadsPerNode: Number(e.target.value)})}
                min="1"
                max="16"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="memoryPerNode">Memoria por Nodo (MB)</Label>
              <Input
                id="memoryPerNode"
                type="number"
                value={config.memoryPerNode}
                onChange={(e) => setConfig({...config, memoryPerNode: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="allocationStrategy">Estrategia de Asignación</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(strategyInfo).map(([key, strategy]) => (
                  <Button
                    key={key}
                    variant={config.allocationStrategy === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, allocationStrategy: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{strategy.icon}</span>
                    <span className="text-xs">{strategy.name.split(" ")[1]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(patternInfo).map(([key, pattern]) => (
                  <Button
                    key={key}
                    variant={config.accessPattern === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, accessPattern: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{pattern.icon}</span>
                    <span className="text-xs">{pattern.name.split(" ")[0]}</span>
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
                min="256"
                step="256"
              />
            </div>

            <div>
              <Label htmlFor="numAllocations">Número de Asignaciones</Label>
              <Input
                id="numAllocations"
                type="number"
                value={config.numAllocations}
                onChange={(e) => setConfig({...config, numAllocations: Number(e.target.value)})}
                min="10"
                step="10"
              />
            </div>

            <div>
              <Label htmlFor="simulationSpeed">Velocidad de Simulación (ms)</Label>
              <Input
                id="simulationSpeed"
                type="range"
                min="50"
                max="1000"
                value={config.simulationSpeed}
                onChange={(e) => setConfig({...config, simulationSpeed: Number(e.target.value)})}
              />
              <div className="text-center">{config.simulationSpeed} ms</div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateNUMAAllocation} 
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
              style={{ color: currentStrategy.color }}
            >
              <span className="mr-2 text-2xl">{currentStrategy.icon}</span>
              {currentStrategy.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {currentStrategy.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Asignaciones Locales</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {allocation.stats.localAllocations}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Asignaciones Remotas</div>
                  <div className="text-2xl font-bold text-red-600">
                    {allocation.stats.remoteAllocations}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia Media</div>
                  <div className="text-2xl font-bold text-green-600">
                    {allocation.stats.averageLatency.toFixed(2)} ns
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Total Asignaciones</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {allocation.stats.totalAllocations}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Uso de Memoria por Nodo</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allocation.nodeMemory.map(node => (
                    <Card key={node.nodeId}>
                      <CardHeader>
                        <CardTitle className="text-sm">Nodo {node.nodeId}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Usado</div>
                              <div className="font-mono">
                                {node.used.toLocaleString()} MB
                              </div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Disponible</div>
                              <div className="font-mono">
                                {node.available.toLocaleString()} MB
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Utilización</span>
                              <span>
                                {((node.used / config.memoryPerNode) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={(node.used / config.memoryPerNode) * 100} 
                              className="w-full" 
                              color={((node.used / config.memoryPerNode) * 100) > 80 ? "red" : "green"}
                            />
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Total: {config.memoryPerNode.toLocaleString()} MB
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Asignaciones Recientes</div>
                <div className="flex flex-wrap gap-1">
                  {allocation.allocations.slice(-20).map(alloc => (
                    <div
                      key={alloc.id}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${alloc.nodeId === (alloc.threadId !== null ? Math.floor(alloc.threadId / config.threadsPerNode) : 0)
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"}
                      `}
                      title={
                        `Asignación ${alloc.id}
` +
                        `Nodo: ${alloc.nodeId}
` +
                        `Tamaño: ${alloc.size} bytes
` +
                        `Hilo: ${alloc.threadId}
` +
                        `Latencia: ${alloc.latency} ns`
                      }
                    >
                      {alloc.nodeId}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Latencias de Acceso</div>
                <div className="flex flex-wrap gap-1">
                  {allocation.accessLatencies.slice(-20).map(latency => (
                    <div
                      key={latency.allocationId}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${latency.latency < 100 
                          ? "bg-green-500 text-white" 
                          : latency.latency < 200 
                            ? "bg-yellow-500 text-white" 
                            : "bg-red-500 text-white"}
                      `}
                      title={
                        `Acceso a Asignación ${latency.allocationId}
` +
                        `Nodo: ${latency.nodeId}
` +
                        `Hilo: ${latency.threadId}
` +
                        `Latencia: ${latency.latency} ns`
                      }
                    >
                      {latency.latency < 100 ? "L" : latency.latency < 200 ? "M" : "H"}
                    </div>
                  ))}
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
                    label={{ value: "Asignaciones", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} 
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
                    dataKey="localAllocations" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Asignaciones Locales"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="remoteAllocations" 
                    stroke="#ef4444" 
                    name="Asignaciones Remotas"
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
          <CardTitle>Comparativa de Estrategias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(strategyInfo).map(([key, strategy]) => (
              <Card 
                key={key}
                className={config.allocationStrategy === key ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center text-sm"
                    style={{ color: strategy.color }}
                  >
                    <span className="mr-2 text-lg">{strategy.icon}</span>
                    {strategy.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      {strategy.description}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Ventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "local" && "Máxima localidad"}
                            {key === "interleaved" && "Distribución equitativa"}
                            {key === "first-touch" && "Asignación natural"}
                            {key === "manual" && "Control total"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "local" && "Baja latencia"}
                            {key === "interleaved" && "Evita desbalanceo"}
                            {key === "first-touch" && "Sin overhead"}
                            {key === "manual" && "Optimización específica"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Desventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "local" && "Posible desbalanceo"}
                            {key === "interleaved" && "Mayor latencia"}
                            {key === "first-touch" && "Impredecible"}
                            {key === "manual" && "Complejidad"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "local" && "No óptimo para todos"}
                            {key === "interleaved" && "No considera patrones"}
                            {key === "first-touch" && "Sin control"}
                            {key === "manual" && "Error humano"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use asignación local para aplicaciones con localidad fuerte</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use interleaved para distribuciones uniformes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use first-touch para aplicaciones que inicializan datos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use manual para control fino en aplicaciones críticas</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
