import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"

export default function NUMAConcepts() {
  const [config, setConfig] = useState({
    nodes: 4,
    coresPerNode: 8,
    memoryPerNode: 16384, // MB
    interconnectLatency: 100, // ns
    localLatency: 10, // ns
    accessPattern: "local" as "local" | "remote" | "mixed",
    workloadType: "balanced" as "balanced" | "skewed" | "random",
    simulationSpeed: 200 // ms
  })
  
  const [numa, setNUMA] = useState({
    nodes: [] as {
      id: number,
      name: string,
      cores: {
        id: number,
        nodeId: number,
        load: number,
        memoryAccesses: {
          local: number,
          remote: number,
          latency: number
        },
        affinity: number
      }[],
      memory: {
        total: number,
        used: number,
        available: number,
        allocated: number[]
      },
      connections: number[],
      latencyMatrix: { [key: number]: number }
    }[],
    interconnect: {
      bandwidth: 0,
      utilization: 0,
      latency: 0,
      traffic: [] as {
        source: number,
        destination: number,
        bytes: number,
        timestamp: number
      }[]
    },
    performance: {
      localAccesses: 0,
      remoteAccesses: 0,
      averageLatency: 0,
      memoryBandwidth: 0,
      nodeBalance: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [guided, setGuided] = useState(false)

  // Initialize NUMA topology
  useState(() => {
    // Create NUMA nodes
    const nodes = []
    
    for (let nodeId = 0; nodeId < config.nodes; nodeId++) {
      // Create cores for this node
      const cores = []
      for (let coreId = 0; coreId < config.coresPerNode; coreId++) {
        cores.push({
          id: coreId,
          nodeId,
          load: 0,
          memoryAccesses: {
            local: 0,
            remote: 0,
            latency: config.localLatency
          },
          affinity: nodeId // Default affinity to local node
        })
      }
      
      // Create connections (connect to adjacent nodes in a ring topology)
      const connections = [
        (nodeId - 1 + config.nodes) % config.nodes,
        (nodeId + 1) % config.nodes
      ]
      
      // Create latency matrix
      const latencyMatrix: { [key: number]: number } = {}
      for (let otherNodeId = 0; otherNodeId < config.nodes; otherNodeId++) {
        latencyMatrix[otherNodeId] = 
          otherNodeId === nodeId ? config.localLatency : config.interconnectLatency
      }
      
      nodes.push({
        id: nodeId,
        name: `Node ${nodeId}`,
        cores,
        memory: {
          total: config.memoryPerNode,
          used: 0,
          available: config.memoryPerNode,
          allocated: []
        },
        connections,
        latencyMatrix
      })
    }
    
    setNUMA({
      nodes,
      interconnect: {
        bandwidth: 0,
        utilization: 0,
        latency: 0,
        traffic: []
      },
      performance: {
        localAccesses: 0,
        remoteAccesses: 0,
        averageLatency: 0,
        memoryBandwidth: 0,
        nodeBalance: 0
      }
    })
  })

  // Simulate NUMA access pattern
  const simulateNUMAAccess = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset performance counters
    setNUMA(prev => ({
      ...prev,
      performance: {
        localAccesses: 0,
        remoteAccesses: 0,
        averageLatency: 0,
        memoryBandwidth: 0,
        nodeBalance: 0
      },
      interconnect: {
        ...prev.interconnect,
        traffic: [],
        utilization: 0
      }
    }))
    
    // Simulate over time
    let time = 0
    let totalLatency = 0
    let accesses = 0
    const newHistory = []
    
    for (let i = 0; i < 100; i++) {
      time += 100 // ms
      setProgress((i / 100) * 100)
      
      // Create a copy of current NUMA state
      const currentNUMA = JSON.parse(JSON.stringify(numa))
      const currentPerformance = { ...numa.performance }
      const currentInterconnect = { ...numa.interconnect }
      
      // Generate random accesses based on pattern
      let localAccesses = 0
      let remoteAccesses = 0
      let batchLatency = 0
      let interconnectTraffic = 0
      
      for (let j = 0; j < 10; j++) {
        // Select random node and core
        const nodeId = Math.floor(Math.random() * config.nodes)
        const node = currentNUMA.nodes[nodeId]
        
        if (!node) continue
        
        const coreId = Math.floor(Math.random() * config.coresPerNode)
        const core = node.cores[coreId]
        
        if (!core) continue
        
        // Determine memory access based on pattern
        let memoryNodeId: number
        let isRemote = false
        
        if (config.accessPattern === "local") {
          memoryNodeId = nodeId
        } else if (config.accessPattern === "remote") {
          // Access remote memory (any node except local)
          const remoteNodes = currentNUMA.nodes.filter((_: any, idx: number) => idx !== nodeId)
          if (remoteNodes.length > 0) {
            const remoteNode = remoteNodes[Math.floor(Math.random() * remoteNodes.length)]
            memoryNodeId = remoteNode.id
            isRemote = true
          } else {
            memoryNodeId = nodeId
          }
        } else {
          // Mixed pattern: 70% local, 30% remote
          if (Math.random() > 0.7) {
            const remoteNodes = currentNUMA.nodes.filter((_: any, idx: number) => idx !== nodeId)
            if (remoteNodes.length > 0) {
              const remoteNode = remoteNodes[Math.floor(Math.random() * remoteNodes.length)]
              memoryNodeId = remoteNode.id
              isRemote = true
            } else {
              memoryNodeId = nodeId
            }
          } else {
            memoryNodeId = nodeId
          }
        }
        
        // Calculate latency
        const latency = node.latencyMatrix[memoryNodeId] || config.localLatency
        batchLatency += latency
        
        // Update counters
        if (isRemote) {
          remoteAccesses++
          interconnectTraffic += 64 // 64 bytes per cache line
          
          // Add interconnect traffic record
          currentInterconnect.traffic.push({
            source: nodeId,
            destination: memoryNodeId,
            bytes: 64,
            timestamp: time
          })
        } else {
          localAccesses++
        }
        
        // Update core stats
        core.memoryAccesses.local += isRemote ? 0 : 1
        core.memoryAccesses.remote += isRemote ? 1 : 0
        core.memoryAccesses.latency = latency
        
        // Update node memory usage based on workload type
        const memoryNode = currentNUMA.nodes[memoryNodeId]
        if (memoryNode) {
          // Simulate memory allocation based on workload type
          if (config.workloadType === "balanced") {
            // Balanced allocation across nodes
            const allocation = Math.floor(Math.random() * 100) // 0-100 MB allocation
            if (memoryNode.memory.available >= allocation) {
              memoryNode.memory.used += allocation
              memoryNode.memory.available -= allocation
              memoryNode.memory.allocated.push(allocation)
            }
          } else if (config.workloadType === "skewed") {
            // Skewed allocation (favor first nodes)
            const skewFactor = nodeId === 0 ? 1.5 : nodeId === 1 ? 1.2 : 0.8
            const allocation = Math.floor(Math.random() * 100 * skewFactor)
            if (memoryNode.memory.available >= allocation) {
              memoryNode.memory.used += allocation
              memoryNode.memory.available -= allocation
              memoryNode.memory.allocated.push(allocation)
            }
          } else {
            // Random allocation
            const allocation = Math.floor(Math.random() * 150) // 0-150 MB allocation
            if (memoryNode.memory.available >= allocation) {
              memoryNode.memory.used += allocation
              memoryNode.memory.available -= allocation
              memoryNode.memory.allocated.push(allocation)
            }
          }
        }
      }
      
      accesses += 10
      totalLatency += batchLatency
      currentInterconnect.utilization = (interconnectTraffic / 10000) * 100 // Simplified utilization
      
      // Update performance metrics
      currentPerformance.localAccesses += localAccesses
      currentPerformance.remoteAccesses += remoteAccesses
      currentPerformance.averageLatency = totalLatency / accesses
      currentPerformance.memoryBandwidth = currentPerformance.localAccesses * 64 / (time / 1000) // Bytes/sec
      
      // Calculate node balance (standard deviation of memory usage)
      const memoryUsage = currentNUMA.nodes.map((node: { memory: { used: number } }) => node.memory.used)
      const mean = memoryUsage.reduce((sum: number, usage: number) => sum + usage, 0) / memoryUsage.length
      const variance = memoryUsage.reduce((sum: number, usage: number) => sum + Math.pow(usage - mean, 2), 0) / memoryUsage.length
      const stdDev = Math.sqrt(variance)
      currentPerformance.nodeBalance = 100 - (stdDev / mean) * 100 // Percentage balance (higher is better)
      
      // Update NUMA state
      currentNUMA.performance = currentPerformance
      currentNUMA.interconnect = currentInterconnect
      setNUMA(currentNUMA)
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time,
          localAccesses: currentPerformance.localAccesses,
          remoteAccesses: currentPerformance.remoteAccesses,
          averageLatency: currentPerformance.averageLatency,
          memoryBandwidth: currentPerformance.memoryBandwidth,
          nodeBalance: currentPerformance.nodeBalance,
          interconnectUtilization: currentInterconnect.utilization
        })
        setHistory(newHistory)
      }
      
      // Add delay to visualize
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
    
    // Reset NUMA state
    const nodes = []
    
    for (let nodeId = 0; nodeId < config.nodes; nodeId++) {
      const cores = []
      for (let coreId = 0; coreId < config.coresPerNode; coreId++) {
        cores.push({
          id: coreId,
          nodeId,
          load: 0,
          memoryAccesses: {
            local: 0,
            remote: 0,
            latency: config.localLatency
          },
          affinity: nodeId
        })
      }
      
      const connections = [
        (nodeId - 1 + config.nodes) % config.nodes,
        (nodeId + 1) % config.nodes
      ]
      
      const latencyMatrix: { [key: number]: number } = {}
      for (let otherNodeId = 0; otherNodeId < config.nodes; otherNodeId++) {
        latencyMatrix[otherNodeId] = 
          otherNodeId === nodeId ? config.localLatency : config.interconnectLatency
      }
      
      nodes.push({
        id: nodeId,
        name: `Node ${nodeId}`,
        cores,
        memory: {
          total: config.memoryPerNode,
          used: 0,
          available: config.memoryPerNode,
          allocated: []
        },
        connections,
        latencyMatrix
      })
    }
    
    setNUMA({
      nodes,
      interconnect: {
        bandwidth: 0,
        utilization: 0,
        latency: 0,
        traffic: []
      },
      performance: {
        localAccesses: 0,
        remoteAccesses: 0,
        averageLatency: 0,
        memoryBandwidth: 0,
        nodeBalance: 0
      }
    })
  }

  // Calculate remote access ratio
  const remoteRatio = numa.performance.localAccesses + numa.performance.remoteAccesses > 0 
    ? (numa.performance.remoteAccesses / (numa.performance.localAccesses + numa.performance.remoteAccesses)) * 100
    : 0

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Conceptos de NUMA</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo la arquitectura NUMA afecta el rendimiento del sistema
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Cerca de tus datos"
        metaphor="Como sentarte cerca de tu plato: si te sientas lejos, cada bocado tarda más."
        idea="Acceso local es más rápido que remoto. Reubicar tareas o páginas puede reducir latencia media."
        bullets={["Local vs remoto", "Balance de nodos", "Auto‑balanceo"]}
        board={{ title: "Latencia media", content: "L = (Local×nL + Remoto×nR) / (nL + nR)" }}
      />

      {guided && (
        <GuidedFlow
          title="Reduciendo la latencia"
          steps={[
            { title: "Mapa actual", content: "Observa cuántos accesos son remotos." },
            { title: "Mover hilos", content: "Ajusta afinidad para acercar CPU a sus datos." },
            { title: "Migrar páginas", content: "Acerca la memoria caliente a su nodo consumidor." },
            { title: "Medir", content: "Comprueba latencia media y balance." },
          ]}
        />
      )}

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
              <Label htmlFor="interconnectLatency">Latencia Interconexión (ns)</Label>
              <Input
                id="interconnectLatency"
                type="number"
                value={config.interconnectLatency}
                onChange={(e) => setConfig({...config, interconnectLatency: Number(e.target.value)})}
                min="50"
                max="500"
                step="10"
              />
            </div>

            <div>
              <Label htmlFor="localLatency">Latencia Local (ns)</Label>
              <Input
                id="localLatency"
                type="number"
                value={config.localLatency}
                onChange={(e) => setConfig({...config, localLatency: Number(e.target.value)})}
                min="1"
                max="50"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
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
              <Label htmlFor="workloadType">Tipo de Carga</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.workloadType === "balanced" ? "default" : "outline"}
                  onClick={() => setConfig({...config, workloadType: "balanced"})}
                >
                  Balanceada
                </Button>
                <Button
                  variant={config.workloadType === "skewed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, workloadType: "skewed"})}
                >
                  Sesgada
                </Button>
                <Button
                  variant={config.workloadType === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, workloadType: "random"})}
                >
                  Aleatoria
                </Button>
              </div>
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
                onClick={simulateNUMAAccess} 
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
            <CardTitle>Topología NUMA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="inline-block p-3 bg-gray-800 text-white rounded font-mono">
                  Configuración: {config.nodes} nodos × {config.coresPerNode} cores × {config.memoryPerNode / 1024} GB
                </div>
              </div>
              
              <div className="relative h-64 bg-gray-50 rounded p-4">
                {/* Visualization of NUMA nodes in a ring topology */}
                {numa.nodes.map((node, index) => {
                  // Position nodes in a circle
                  const angle = (index * (2 * Math.PI)) / numa.nodes.length
                  const radius = 100
                  const centerX = 150
                  const centerY = 120
                  const x = centerX + radius * Math.cos(angle)
                  const y = centerY + radius * Math.sin(angle)
                  
                  return (
                    <div key={node.id}>
                      {/* Node visualization */}
                      <div
                        className="absolute w-24 h-24 bg-blue-100 border-2 border-blue-500 rounded-lg p-2 text-center"
                        style={{
                          left: `${x - 48}px`,
                          top: `${y - 48}px`
                        }}
                      >
                        <div className="font-semibold text-blue-800">Nodo {node.id}</div>
                        <div className="text-xs mt-1">
                          <div>Cores: {node.cores.length}</div>
                          <div>Mem: {node.memory.total / 1024} GB</div>
                        </div>
                        <div className="text-xs mt-1">
                          <div>Usada: {(node.memory.used / node.memory.total * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      
                      {/* Connections to other nodes */}
                      {node.connections.map((connectionId: number) => {
                        const connectionNode = numa.nodes[connectionId]
                        if (!connectionNode) return null
                        
                        // Calculate position of connected node
                        const connIndex = numa.nodes.findIndex(n => n.id === connectionId)
                        const connAngle = (connIndex * (2 * Math.PI)) / numa.nodes.length
                        const connX = centerX + radius * Math.cos(connAngle)
                        const connY = centerY + radius * Math.sin(connAngle)
                        
                        return (
                          <div
                            key={`${node.id}-${connectionId}`}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-xs text-gray-500 mb-1">Accesos Locales</div>
                <div className="text-2xl font-bold text-green-600">{numa.performance.localAccesses}</div>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="text-xs text-gray-500 mb-1">Accesos Remotos</div>
                <div className="text-2xl font-bold text-red-600">{numa.performance.remoteAccesses}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500 mb-1">Latencia Promedio</div>
                <div className="text-2xl font-bold text-blue-600">{numa.performance.averageLatency.toFixed(1)} ns</div>
              </div>
              <div className="p-3 bg-purple-50 rounded text-center">
                <div className="text-xs text-gray-500 mb-1">Accesos Remotos</div>
                <div className="text-2xl font-bold text-purple-600">{remoteRatio.toFixed(1)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {numa.nodes.map(node => (
                <Card key={node.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">Nodo {node.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Memoria Total</div>
                          <div className="font-semibold">{node.memory.total / 1024} GB</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Memoria Usada</div>
                          <div className="font-semibold">{(node.memory.used / 1024).toFixed(1)} GB</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{((node.memory.used / node.memory.total) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(node.memory.used / node.memory.total) * 100} 
                          className="w-full" 
                          color={(node.memory.used / node.memory.total) > 0.8 ? "red" : "green"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500">Accesos Locales</div>
                          <div className="font-semibold text-green-600">
                            {node.cores.reduce((sum, core) => sum + core.memoryAccesses.local, 0)}
                          </div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500">Accesos Remotos</div>
                          <div className="font-semibold text-red-600">
                            {node.cores.reduce((sum, core) => sum + core.memoryAccesses.remote, 0)}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Cores ({node.cores.length})</div>
                        <div className="flex flex-wrap gap-1">
                          {node.cores.slice(0, 8).map(core => (
                            <div
                              key={core.id}
                              className={`
                                w-6 h-6 rounded flex items-center justify-center text-xs
                                ${core.memoryAccesses.remote > core.memoryAccesses.local 
                                  ? "bg-red-500 text-white" 
                                  : "bg-green-500 text-white"}
                              `}
                              title={`
                                Core ${core.id}
                                Local: ${core.memoryAccesses.local}
                                Remoto: ${core.memoryAccesses.remote}
                                Latencia: ${core.memoryAccesses.latency}ns
                              `}
                            >
                              {core.id}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Estadísticas de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Balance de Nodos</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {numa.performance.nodeBalance.toFixed(1)}%
              </div>
              <p className="text-sm text-blue-700">
                Mide cuán equilibrada está la distribución de memoria entre nodos.
                Valores más altos indican mejor balance.
              </p>
              <div className="mt-2">
                <Progress 
                  value={numa.performance.nodeBalance} 
                  className="w-full" 
                  color={numa.performance.nodeBalance > 80 ? "green" : numa.performance.nodeBalance > 60 ? "yellow" : "red"}
                />
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Ancho de Banda</div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(numa.performance.memoryBandwidth / 1024 / 1024).toFixed(1)} MB/s
              </div>
              <p className="text-sm text-green-700">
                Velocidad de transferencia de datos entre nodos y memoria.
                Depende del patrón de acceso y la interconexión.
              </p>
              <div className="mt-2">
                <Progress 
                  value={Math.min(100, (numa.performance.memoryBandwidth / 1000000000) * 100)} 
                  className="w-full" 
                  color="green"
                />
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Utilización del Bus</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {numa.interconnect.utilization.toFixed(1)}%
              </div>
              <p className="text-sm text-purple-700">
                Porcentaje de capacidad utilizada en la interconexión entre nodos.
                Valores altos pueden indicar cuellos de botella.
              </p>
              <div className="mt-2">
                <Progress 
                  value={numa.interconnect.utilization} 
                  className="w-full" 
                  color={numa.interconnect.utilization > 80 ? "red" : numa.interconnect.utilization > 60 ? "yellow" : "purple"}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Tráfico de Interconexión</div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2">
              {numa.interconnect.traffic.slice(-20).map((traffic, index) => (
                <div 
                  key={index} 
                  className="p-2 bg-gray-200 rounded text-xs"
                  title={`
                    De Nodo ${traffic.source} a Nodo ${traffic.destination}
                    ${traffic.bytes} bytes
                    Tiempo: ${traffic.timestamp}ms
                  `}
                >
                  <div className="font-semibold">{traffic.source}→{traffic.destination}</div>
                  <div>{traffic.bytes}B</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de NUMA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es NUMA?</div>
              <p className="text-sm text-blue-700 mb-3">
                NUMA (Non-Uniform Memory Access) es una arquitectura donde cada procesador 
                tiene acceso a su propia memoria local con menor latencia.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Escalabilidad mejorada</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mayor ancho de banda total</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Beneficios</div>
              <p className="text-sm text-green-700 mb-3">
                NUMA mejora el rendimiento al reducir la contención en el bus de memoria 
                y permitir acceso paralelo a múltiples módulos de memoria.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mejor rendimiento de memoria local</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Menor latencia para acceso local</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">Desafíos</div>
              <p className="text-sm text-red-700 mb-3">
                NUMA presenta desafíos en términos de programación y optimización 
                para asegurar que los procesos accedan a memoria local cuando sea posible.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Mayor latencia para acceso remoto</span>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Complejidad en programación</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Optimización para NUMA:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usar CPU affinity para mantener procesos en nodos locales</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Asignar memoria cerca del proceso que la utilizará</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Balancear carga entre nodos NUMA</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Minimizar transferencias de memoria entre nodos</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
