import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function NUMAAwareProgramming() {
  const [config, setConfig] = useState({
    nodes: 4,
    threadsPerNode: 8,
    memoryPerNode: 16 * 1024, // 16GB
    localLatency: 50, // ns
    remoteLatency: 200, // ns
    allocationStrategy: "first-touch" as "first-touch" | "interleaved" | "manual"
  })
  
  const [numa, setNuma] = useState({
    nodes: [] as {
      id: number,
      threads: {
        id: number,
        nodeId: number,
        load: number
      }[],
      memory: {
        total: number,
        allocated: number,
        policy: string
      },
      accessPatterns: {
        local: number,
        remote: number
      }
    }[],
    performance: {
      localAccesses: 0,
      remoteAccesses: 0,
      averageLatency: 0,
      memoryBandwidth: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize NUMA simulation
  useEffect(() => {
    const nodes = []
    
    for (let nodeId = 0; nodeId < config.nodes; nodeId++) {
      // Create threads for this node
      const threads = []
      for (let threadId = 0; threadId < config.threadsPerNode; threadId++) {
        threads.push({
          id: nodeId * config.threadsPerNode + threadId,
          nodeId,
          load: Math.random() * 100
        })
      }
      
      nodes.push({
        id: nodeId,
        threads,
        memory: {
          total: config.memoryPerNode,
          allocated: Math.random() * config.memoryPerNode,
          policy: config.allocationStrategy
        },
        accessPatterns: {
          local: Math.random() * 1000,
          remote: Math.random() * 500
        }
      })
    }
    
    setNuma({
      nodes,
      performance: {
        localAccesses: Math.floor(Math.random() * 10000),
        remoteAccesses: Math.floor(Math.random() * 5000),
        averageLatency: parseFloat((config.localLatency * 0.8 + config.remoteLatency * 0.2).toFixed(2)),
        memoryBandwidth: parseFloat((Math.random() * 100).toFixed(2))
      }
    })
  }, [config])

  // Simulate NUMA-aware programming
  const simulateNUMA = async () => {
    setIsRunning(true)
    setProgress(0)
    
    let localAccesses = numa.performance.localAccesses
    let remoteAccesses = numa.performance.remoteAccesses
    let totalLatency = 0
    let memoryBandwidth = numa.performance.memoryBandwidth
    
    // Simulate memory accesses
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Determine access pattern based on allocation strategy
      let isLocalAccess = true
      if (config.allocationStrategy === "interleaved") {
        isLocalAccess = Math.random() > 0.3
      } else if (config.allocationStrategy === "manual") {
        isLocalAccess = Math.random() > 0.5
      }
      
      // Calculate latency
      let latency = config.localLatency
      if (!isLocalAccess) {
        latency = config.remoteLatency
        remoteAccesses++
      } else {
        localAccesses++
      }
      
      totalLatency += latency
      memoryBandwidth = Math.min(100, memoryBandwidth + (Math.random() * 2 - 0.5))
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    // Update performance metrics
    setNuma(prev => ({
      ...prev,
      performance: {
        localAccesses,
        remoteAccesses,
        averageLatency: parseFloat((totalLatency / 100).toFixed(2)),
        memoryBandwidth: parseFloat(memoryBandwidth.toFixed(2))
      }
    }))
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    
    // Reset NUMA state
    setNuma(prev => ({
      ...prev,
      performance: {
        localAccesses: 0,
        remoteAccesses: 0,
        averageLatency: 0,
        memoryBandwidth: 0
      }
    }))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Programación Consciente de NUMA</h1>
        <p className="text-gray-600 mt-2">
          Optimiza el rendimiento del sistema mediante técnicas de programación conscientes de la topología NUMA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Simulación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nodes">Nodos NUMA</Label>
              <Input
                id="nodes"
                type="number"
                value={config.nodes}
                onChange={(e) => setConfig({...config, nodes: Number(e.target.value)})}
                min="2"
                max="8"
              />
            </div>

            <div>
              <Label htmlFor="threadsPerNode">Hilos por Nodo</Label>
              <Input
                id="threadsPerNode"
                type="number"
                value={config.threadsPerNode}
                onChange={(e) => setConfig({...config, threadsPerNode: Number(e.target.value)})}
                min="2"
                max="16"
              />
            </div>

            <div>
              <Label htmlFor="memoryPerNode">Memoria por Nodo (GB)</Label>
              <Input
                id="memoryPerNode"
                type="number"
                value={config.memoryPerNode / 1024}
                onChange={(e) => setConfig({...config, memoryPerNode: Number(e.target.value) * 1024})}
                min="4"
                step="4"
              />
            </div>

            <div>
              <Label htmlFor="localLatency">Latencia Local (ns)</Label>
              <Input
                id="localLatency"
                type="range"
                min="10"
                max="200"
                value={config.localLatency}
                onChange={(e) => setConfig({...config, localLatency: Number(e.target.value)})}
              />
              <div className="text-center">{config.localLatency} ns</div>
            </div>

            <div>
              <Label htmlFor="remoteLatency">Latencia Remota (ns)</Label>
              <Input
                id="remoteLatency"
                type="range"
                min="50"
                max="500"
                value={config.remoteLatency}
                onChange={(e) => setConfig({...config, remoteLatency: Number(e.target.value)})}
                step="50"
              />
            </div>

            <div>
              <Label>Estrategia de Asignación</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.allocationStrategy === "first-touch" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationStrategy: "first-touch"})}
                >
                  First-Touch
                </Button>
                <Button
                  variant={config.allocationStrategy === "interleaved" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationStrategy: "interleaved"})}
                >
                  Interleaved
                </Button>
                <Button
                  variant={config.allocationStrategy === "manual" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationStrategy: "manual"})}
                  className="col-span-2"
                >
                  Manual
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateNUMA} 
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
            <CardTitle>Visualización de Topología NUMA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Locales</div>
                  <div className="text-2xl font-bold text-blue-600">{numa.performance.localAccesses}</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Remotos</div>
                  <div className="text-2xl font-bold text-green-600">{numa.performance.remoteAccesses}</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia Promedio</div>
                  <div className="text-2xl font-bold text-red-600">{numa.performance.averageLatency} ns</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                  <div className="text-2xl font-bold text-purple-600">{numa.performance.memoryBandwidth} GB/s</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Nodos NUMA</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {numa.nodes.slice(0, 4).map(node => (
                    <Card key={node.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">Nodo {node.id}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500">Memoria</div>
                            <div className="font-medium">{node.memory.allocated.toFixed(0)} / {node.memory.total / 1024} GB</div>
                            <div className="text-xs text-gray-500">Política: {node.memory.policy}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500">Hilos</div>
                            <div className="flex flex-wrap gap-1">
                              {node.threads.slice(0, 8).map(thread => (
                                <div 
                                  key={thread.id}
                                  className="w-6 h-6 bg-blue-200 rounded flex items-center justify-center text-[8px]"
                                  title={`Hilo ${thread.id} - Carga: ${thread.load.toFixed(1)}%`}
                                >
                                  {thread.id}
                                </div>
                              ))}
                              {node.threads.length > 8 && (
                                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-[8px]">
                                  +{node.threads.length - 8}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-green-50 rounded">
                              <div className="text-gray-500">Local</div>
                              <div className="font-medium">{node.accessPatterns.local.toFixed(0)}</div>
                            </div>
                            <div className="p-2 bg-red-50 rounded">
                              <div className="text-gray-500">Remoto</div>
                              <div className="font-medium">{node.accessPatterns.remote.toFixed(0)}</div>
                            </div>
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
          <CardTitle>Estrategias de Programación NUMA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <span className="mr-2 text-xl">🎯</span>
                  First-Touch Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Asigna la memoria al nodo donde se realiza el primer acceso.
                  </div>
                  
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Automática y simple de implementar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Buena localidad de datos</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-red-50 rounded">
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">⚠</span>
                        <span>Puede ser impredecible</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">⚠</span>
                        <span>No funciona bien con inicialización</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-xs p-2 bg-gray-100 rounded">
                    <div className="font-semibold mb-1">Ejemplo:</div>
                    <code className="text-gray-700">
                      #pragma omp parallel for<br/>
                      for (int i = 0; i &lt; N; i++) {'{'}
                      <br/>
                      &nbsp;&nbsp;a[i] = 0; // First-touch aquí
                      <br/>
                      {'}'}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="mr-2 text-xl">🔀</span>
                  Interleaved Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Distribuye la memoria equitativamente entre todos los nodos.
                  </div>
                  
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Balance de carga óptimo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Mejor para datos compartidos</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-red-50 rounded">
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">⚠</span>
                        <span>Aumenta accesos remotos</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">⚠</span>
                        <span>No aprovecha localidad espacial</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-xs p-2 bg-gray-100 rounded">
                    <div className="font-semibold mb-1">Ejemplo:</div>
                    <code className="text-gray-700">
                      void *ptr = mmap(NULL, size,<br/>
                      &nbsp;&nbsp;PROT_READ|PROT_WRITE,<br/>
                      &nbsp;&nbsp;MAP_PRIVATE|MAP_ANONYMOUS|<br/>
                      &nbsp;&nbsp;MAP_POPULATE|MAP_HUGETLB,<br/>
                      &nbsp;&nbsp;-1, 0);
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <span className="mr-2 text-xl">🛠️</span>
                  Manual Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    El programador controla explícitamente la asignación de memoria.
                  </div>
                  
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Control total sobre la asignación</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Óptimo para patrones conocidos</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-red-50 rounded">
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">⚠</span>
                        <span>Complejidad añadida</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">⚠</span>
                        <span>No portable entre sistemas</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-xs p-2 bg-gray-100 rounded">
                    <div className="font-semibold mb-1">Ejemplo:</div>
                    <code className="text-gray-700">
                      numa_set_preferred(node_id);<br/>
                      ptr = numa_alloc_local(size);<br/><br/>
                      // O para vincular hilo:<br/>
                      numa_run_on_node(node_id);
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}