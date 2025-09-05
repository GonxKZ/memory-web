import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function NUMATopologyExplorer() {
  const [config, setConfig] = useState({
    nodes: 4,
    coresPerNode: 8,
    memoryPerNode: 16 * 1024, // 16GB
    interconnectLatency: 100, // ns
    localLatency: 10, // ns
    memoryAccessPattern: "local" as "local" | "remote" | "mixed"
  })
  
  const [topology, setTopology] = useState<any[]>([])
  const [performance, setPerformance] = useState({
    localAccesses: 0,
    remoteAccesses: 0,
    averageLatency: 0,
    memoryBandwidth: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Generate NUMA topology
  useEffect(() => {
    const newTopology = []
    
    for (let nodeId = 0; nodeId < config.nodes; nodeId++) {
      const node = {
        id: nodeId,
        cores: [] as any[],
        memory: config.memoryPerNode,
        connections: [] as number[],
        latencyMatrix: {} as any
      }
      
      // Create cores for this node
      for (let coreId = 0; coreId < config.coresPerNode; coreId++) {
        node.cores.push({
          id: coreId,
          nodeId: nodeId,
          load: Math.random() * 100
        })
      }
      
      // Create connections to other nodes
      for (let otherNodeId = 0; otherNodeId < config.nodes; otherNodeId++) {
        if (otherNodeId !== nodeId) {
          node.connections.push(otherNodeId)
          node.latencyMatrix[otherNodeId] = config.interconnectLatency
        } else {
          node.latencyMatrix[otherNodeId] = config.localLatency
        }
      }
      
      newTopology.push(node)
    }
    
    setTopology(newTopology)
  }, [config])

  // Simulate NUMA performance
  const simulateNUMAPerformance = async () => {
    setIsRunning(true)
    setProgress(0)
    
    let localAccesses = 0
    let remoteAccesses = 0
    let totalLatency = 0
    let memoryBandwidth = 0
    
    // Simulate memory accesses
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Determine access pattern
      let accessType = "local"
      if (config.memoryAccessPattern === "remote") {
        accessType = "remote"
      } else if (config.memoryAccessPattern === "mixed") {
        accessType = Math.random() > 0.5 ? "local" : "remote"
      }
      
      // Calculate latency
      let latency = config.localLatency
      if (accessType === "remote") {
        latency = config.interconnectLatency
        remoteAccesses++
      } else {
        localAccesses++
      }
      
      totalLatency += latency
      memoryBandwidth = Math.min(100, memoryBandwidth + (Math.random() * 2 - 0.5))
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Update performance metrics
    setPerformance({
      localAccesses,
      remoteAccesses,
      averageLatency: parseFloat((totalLatency / 100).toFixed(2)),
      memoryBandwidth: parseFloat(memoryBandwidth.toFixed(2))
    })
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setPerformance({
      localAccesses: 0,
      remoteAccesses: 0,
      averageLatency: 0,
      memoryBandwidth: 0
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Explorador de Topología NUMA</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo la arquitectura NUMA afecta el rendimiento del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Topología</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nodes">Nodos NUMA</Label>
              <Input
                id="nodes"
                type="range"
                min="2"
                max="8"
                value={config.nodes}
                onChange={(e) => setConfig({...config, nodes: Number(e.target.value)})}
              />
              <div className="text-center">{config.nodes} nodos</div>
            </div>

            <div>
              <Label htmlFor="coresPerNode">Núcleos por Nodo</Label>
              <Input
                id="coresPerNode"
                type="range"
                min="2"
                max="16"
                value={config.coresPerNode}
                onChange={(e) => setConfig({...config, coresPerNode: Number(e.target.value)})}
              />
              <div className="text-center">{config.coresPerNode} núcleos</div>
            </div>

            <div>
              <Label htmlFor="memoryPerNode">Memoria por Nodo (GB)</Label>
              <Input
                id="memoryPerNode"
                type="range"
                min="4"
                max="64"
                step="4"
                value={config.memoryPerNode / 1024}
                onChange={(e) => setConfig({...config, memoryPerNode: Number(e.target.value) * 1024})}
              />
              <div className="text-center">{config.memoryPerNode / 1024} GB</div>
            </div>

            <div>
              <Label htmlFor="interconnectLatency">Latencia de Interconexión (ns)</Label>
              <Input
                id="interconnectLatency"
                type="range"
                min="50"
                max="500"
                value={config.interconnectLatency}
                onChange={(e) => setConfig({...config, interconnectLatency: Number(e.target.value)})}
              />
              <div className="text-center">{config.interconnectLatency} ns</div>
            </div>

            <div>
              <Label htmlFor="localLatency">Latencia Local (ns)</Label>
              <Input
                id="localLatency"
                type="range"
                min="1"
                max="50"
                value={config.localLatency}
                onChange={(e) => setConfig({...config, localLatency: Number(e.target.value)})}
              />
              <div className="text-center">{config.localLatency} ns</div>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1">
                Patrón de Acceso
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={config.memoryAccessPattern === "local" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryAccessPattern: "local"})}
                >
                  Local
                </Button>
                <Button
                  variant={config.memoryAccessPattern === "remote" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryAccessPattern: "remote"})}
                >
                  Remoto
                </Button>
                <Button
                  variant={config.memoryAccessPattern === "mixed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryAccessPattern: "mixed"})}
                >
                  Mixto
                </Button>
              </div>
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
            <CardTitle>Visualización de Topología</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Locales</div>
                  <div className="text-2xl font-bold text-blue-600">{performance.localAccesses}</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Remotos</div>
                  <div className="text-2xl font-bold text-green-600">{performance.remoteAccesses}</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia Promedio</div>
                  <div className="text-2xl font-bold text-red-600">{performance.averageLatency} ns</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                  <div className="text-2xl font-bold text-purple-600">{performance.memoryBandwidth} GB/s</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Topología NUMA</div>
                <div className="relative h-64 bg-gray-50 rounded p-4 overflow-hidden">
                  {/* NUMA nodes visualization */}
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {topology.slice(0, 4).map(node => (
                      <div key={node.id} className="bg-white rounded border p-2">
                        <div className="font-semibold text-center mb-1">Nodo {node.id}</div>
                        <div className="text-xs text-gray-500 mb-1">{node.memory / 1024} GB RAM</div>
                        
                        {/* Cores visualization */}
                        <div className="grid grid-cols-4 gap-1">
                          {node.cores.slice(0, 8).map((core: any) => (
                            <div 
                              key={core.id} 
                              className="h-4 bg-blue-200 rounded flex items-center justify-center text-[6px]"
                              title={`Núcleo ${core.id} - Carga: ${core.load.toFixed(1)}%`}
                            >
                              {core.id}
                            </div>
                          ))}
                        </div>
                        
                        {/* Connections */}
                        <div className="mt-1 text-[8px] text-gray-500">
                          Conectado a: {node.connections.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Matriz de Latencia</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="border p-1">Desde/Hacia</th>
                        {topology.slice(0, 4).map(node => (
                          <th key={node.id} className="border p-1">Nodo {node.id}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topology.slice(0, 4).map((rowNode: any) => (
                        <tr key={rowNode.id}>
                          <td className="border p-1 font-medium">Nodo {rowNode.id}</td>
                          {topology.slice(0, 4).map((colNode: any) => (
                            <td 
                              key={colNode.id} 
                              className={`border p-1 text-center ${
                                rowNode.id === colNode.id 
                                  ? 'bg-green-100' 
                                  : 'bg-red-100'
                              }`}
                            >
                              {rowNode.latencyMatrix[colNode.id]}ns
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Optimización para NUMA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Mejores Prácticas</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Localidad de Datos:</strong> Mantén los datos cerca del núcleo que los usa.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Asignación Consciente:</strong> Usa funciones como <code>numa_alloc_onnode()</code>.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Afinidad de Hilos:</strong> Vincula hilos a nodos específicos con <code>numa_bind()</code>.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Minimiza Accesos Remotos:</strong> Rediseña estructuras para evitar datos compartidos.
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Herramientas de Análisis</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>numactl:</strong> Controla las políticas de NUMA para procesos.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>numastat:</strong> Muestra estadísticas de uso de memoria NUMA.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>hwloc:</strong> Visualiza la topología de hardware del sistema.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>perf:</strong> Analiza el rendimiento y detecta accesos remotos costosos.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}