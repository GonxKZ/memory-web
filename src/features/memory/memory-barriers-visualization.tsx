import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function MemoryBarriersVisualization() {
  const [config, setConfig] = useState({
    threads: 4,
    operationsPerThread: 100,
    barrierType: "sequential" as "sequential" | "relaxed" | "acquire" | "release" | "sequential",
    memoryOrder: "strong" as "strong" | "weak",
    simulationSpeed: 200 // ms
  })
  
  const [barriers, setBarriers] = useState({
    threads: [] as {
      id: number,
      name: string,
      operations: {
        id: number,
        type: "load" | "store" | "atomic",
        address: number,
        value: number,
        order: "relaxed" | "consume" | "acquire" | "release" | "acq_rel" | "seq_cst",
        executed: boolean,
        timestamp: number
      }[],
      barriers: {
        id: number,
        type: "memory" | "atomic" | "compiler",
        executed: boolean,
        timestamp: number
      }[],
      executionOrder: number[]
    }[],
    memory: [] as {
      address: number,
      value: number,
      lastWriter: number | null,
      lastWriteTime: number,
      readers: number[]
    }[],
    synchronization: {
      locks: [] as {
        id: number,
        owner: number | null,
        waiting: number[]
      }[],
      conditionVariables: [] as {
        id: number,
        waiting: number[]
      }[],
      semaphores: [] as {
        id: number,
        count: number,
        maxCount: number,
        waiting: number[]
      }[]
    },
    performance: {
      dataRaces: 0,
      deadlocks: 0,
      synchronizations: 0,
      executionTime: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [_history, setHistory] = useState<any[]>([])

  // Initialize barriers simulation
  useState(() => {
    // Create threads
    const threads = []
    for (let i = 0; i < config.threads; i++) {
      // Create operations for each thread
      const operations = []
      for (let j = 0; j < config.operationsPerThread; j++) {
        operations.push({
          id: j,
          type: ["load", "store", "atomic"][Math.floor(Math.random() * 3)] as "load" | "store" | "atomic",
          address: Math.floor(Math.random() * 100),
          value: Math.floor(Math.random() * 1000),
          order: config.barrierType as "relaxed" | "consume" | "acquire" | "release" | "acq_rel" | "seq_cst",
          executed: false,
          timestamp: 0
        })
      }
      
      // Create barriers for each thread
      const threadBarriers = []
      for (let j = 0; j < 5; j++) { // 5 barriers per thread
        threadBarriers.push({
          id: j,
          type: ["memory", "atomic", "compiler"][Math.floor(Math.random() * 3)] as "memory" | "atomic" | "compiler",
          executed: false,
          timestamp: 0
        })
      }
      
      threads.push({
        id: i,
        name: `Thread ${i}`,
        operations,
        barriers: threadBarriers,
        executionOrder: []
      })
    }
    
    // Create shared memory
    const memory = []
    for (let i = 0; i < 100; i++) {
      memory.push({
        address: i,
        value: 0,
        lastWriter: null,
        lastWriteTime: 0,
        readers: []
      })
    }
    
    // Create synchronization primitives
    const locks = []
    for (let i = 0; i < 5; i++) {
      locks.push({
        id: i,
        owner: null,
        waiting: []
      })
    }
    
    const conditionVariables = []
    for (let i = 0; i < 3; i++) {
      conditionVariables.push({
        id: i,
        waiting: []
      })
    }
    
    const semaphores = []
    for (let i = 0; i < 3; i++) {
      semaphores.push({
        id: i,
        count: 1,
        maxCount: 3,
        waiting: []
      })
    }
    
    setBarriers({
      threads,
      memory,
      synchronization: {
        locks,
        conditionVariables,
        semaphores
      },
      performance: {
        dataRaces: 0,
        deadlocks: 0,
        synchronizations: 0,
        executionTime: 0
      }
    })
  })

  // Simulate memory barriers
  const simulateMemoryBarriers = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset performance counters
    setBarriers(prev => ({
      ...prev,
      performance: {
        dataRaces: 0,
        deadlocks: 0,
        synchronizations: 0,
        executionTime: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current barriers state
      const currentBarriers = JSON.parse(JSON.stringify(barriers))
      const currentPerformance = { ...barriers.performance }
      
      // Simulate thread execution
      for (const thread of currentBarriers.threads) {
        // Execute operations
        for (const operation of thread.operations) {
          if (!operation.executed && Math.random() > 0.7) {
            operation.executed = true
            operation.timestamp = step
            
            // Add to execution order
            thread.executionOrder.push(operation.id)
            
            // Handle memory operations
            if (operation.type === "store") {
              // Store operation
              const memoryLocation = currentBarriers.memory.find((loc: any) => loc.address === operation.address)
              if (memoryLocation) {
                memoryLocation.value = operation.value
                memoryLocation.lastWriter = thread.id
                memoryLocation.lastWriteTime = step
              }
            } else if (operation.type === "load") {
              // Load operation
              const memoryLocation = currentBarriers.memory.find((loc: any) => loc.address === operation.address)
              if (memoryLocation) {
                memoryLocation.readers.push(thread.id)
                operation.value = memoryLocation.value
                
                // Check for data races
                if (memoryLocation.lastWriter !== null && memoryLocation.lastWriter !== thread.id) {
                  if (config.memoryOrder === "weak" && operation.order === "relaxed") {
                    currentPerformance.dataRaces++
                  }
                }
              }
            } else if (operation.type === "atomic") {
              // Atomic operation
              const memoryLocation = currentBarriers.memory.find((loc: any) => loc.address === operation.address)
              if (memoryLocation) {
                if (operation.order !== "relaxed") {
                  // Synchronization operation
                  currentPerformance.synchronizations++
                }
                memoryLocation.value = operation.value
                memoryLocation.lastWriter = thread.id
                memoryLocation.lastWriteTime = step
              }
            }
          }
        }
        
        // Execute barriers
        for (const barrier of thread.barriers) {
          if (!barrier.executed && Math.random() > 0.8) {
            barrier.executed = true
            barrier.timestamp = step
            
            // Apply barrier effects based on type
            if (barrier.type === "memory") {
              // Memory barrier - ensures ordering
              // In a real system, this would prevent reordering of memory operations
            } else if (barrier.type === "atomic") {
              // Atomic barrier - ensures atomic operations complete
              currentPerformance.synchronizations++
            } else if (barrier.type === "compiler") {
              // Compiler barrier - prevents compiler optimizations
            }
          }
        }
      }
      
      // Check for deadlocks
      let _deadlockDetected = false
      for (const lock of currentBarriers.synchronization.locks) {
        if (lock.waiting.length > 0 && lock.owner !== null) {
          // Check if owner is waiting for another lock held by waiting thread
          const owner = currentBarriers.threads.find((t: any) => t.id === lock.owner)
          if (owner) {
            for (const waitingThreadId of lock.waiting) {
              const waitingThread = currentBarriers.threads.find((t: any) => t.id === waitingThreadId)
              if (waitingThread) {
                // Simplified deadlock detection
                if (Math.random() > 0.95) {
                  _deadlockDetected = true
                  currentPerformance.deadlocks++
                }
              }
            }
          }
        }
      }
      
      // Update state
      setBarriers(_prev => ({ ...currentBarriers, performance: { ...currentPerformance } }))
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(_prev => [..._prev, {
          step,
          dataRaces: currentPerformance.dataRaces,
          deadlocks: currentPerformance.deadlocks,
          synchronizations: currentPerformance.synchronizations,
          executionTime: currentPerformance.executionTime
        }])
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 100))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    
    // Reset barriers state
    const threads = []
    for (let i = 0; i < config.threads; i++) {
      const operations = []
      for (let j = 0; j < config.operationsPerThread; j++) {
        operations.push({
          id: j,
          type: ["load", "store", "atomic"][Math.floor(Math.random() * 3)] as "load" | "store" | "atomic",
          address: Math.floor(Math.random() * 100),
          value: Math.floor(Math.random() * 1000),
          order: config.barrierType as "relaxed" | "consume" | "acquire" | "release" | "acq_rel" | "seq_cst",
          executed: false,
          timestamp: 0
        })
      }
      
      const threadBarriers = []
      for (let j = 0; j < 5; j++) {
        threadBarriers.push({
          id: j,
          type: ["memory", "atomic", "compiler"][Math.floor(Math.random() * 3)] as "memory" | "atomic" | "compiler",
          executed: false,
          timestamp: 0
        })
      }
      
      threads.push({
        id: i,
        name: `Thread ${i}`,
        operations,
        barriers: threadBarriers,
        executionOrder: []
      })
    }
    
    const memory = []
    for (let i = 0; i < 100; i++) {
      memory.push({
        address: i,
        value: 0,
        lastWriter: null,
        lastWriteTime: 0,
        readers: []
      })
    }
    
    const locks = []
    for (let i = 0; i < 5; i++) {
      locks.push({
        id: i,
        owner: null,
        waiting: []
      })
    }
    
    const conditionVariables = []
    for (let i = 0; i < 3; i++) {
      conditionVariables.push({
        id: i,
        waiting: []
      })
    }
    
    const semaphores = []
    for (let i = 0; i < 3; i++) {
      semaphores.push({
        id: i,
        count: 1,
        maxCount: 3,
        waiting: []
      })
    }
    
    setBarriers({
      threads,
      memory,
      synchronization: {
        locks,
        conditionVariables,
        semaphores
      },
      performance: {
        dataRaces: 0,
        deadlocks: 0,
        synchronizations: 0,
        executionTime: 0
      }
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Barreras de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo las barreras de memoria garantizan el orden de operaciones en sistemas multiprocesador
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="threads">Número de Hilos</Label>
              <Input
                id="threads"
                type="number"
                value={config.threads}
                onChange={(e) => setConfig({...config, threads: Number(e.target.value)})}
                min="2"
                max="8"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="operationsPerThread">Operaciones por Hilo</Label>
              <Input
                id="operationsPerThread"
                type="number"
                value={config.operationsPerThread}
                onChange={(e) => setConfig({...config, operationsPerThread: Number(e.target.value)})}
                min="10"
                step="10"
              />
            </div>

            <div>
              <Label htmlFor="barrierType">Tipo de Barrera</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.barrierType === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, barrierType: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.barrierType === "relaxed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, barrierType: "relaxed"})}
                >
                  Relajada
                </Button>
                <Button
                  variant={config.barrierType === "acquire" ? "default" : "outline"}
                  onClick={() => setConfig({...config, barrierType: "acquire"})}
                >
                  Adquisición
                </Button>
                <Button
                  variant={config.barrierType === "release" ? "default" : "outline"}
                  onClick={() => setConfig({...config, barrierType: "release"})}
                >
                  Liberación
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="memoryOrder">Orden de Memoria</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.memoryOrder === "strong" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryOrder: "strong"})}
                >
                  Fuerte
                </Button>
                <Button
                  variant={config.memoryOrder === "weak" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryOrder: "weak"})}
                >
                  Débil
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
                onClick={simulateMemoryBarriers} 
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
            <CardTitle>Estado de Sincronización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Carreras de Datos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {barriers.performance.dataRaces}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Interbloqueos</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {barriers.performance.deadlocks}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Sincronizaciones</div>
                  <div className="text-2xl font-bold text-green-600">
                    {barriers.performance.synchronizations}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Ejecución</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {barriers.performance.executionTime} ciclos
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <span className="mr-2">🧵</span>
                      Hilos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="max-h-48 overflow-y-auto">
                        {barriers.threads.map(thread => (
                          <div key={thread.id} className="p-2 border-b">
                            <div className="font-semibold text-sm">{thread.name}</div>
                            <div className="text-xs text-gray-500 mb-1">
                              {thread.operations.filter(op => op.executed).length} / {thread.operations.length} operaciones
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-blue-600" 
                                style={{ 
                                  width: `${(thread.operations.filter(op => op.executed).length / thread.operations.length) * 100}%` 
                                }}
                              ></div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {thread.operations.slice(0, 20).map(op => (
                                <div
                                  key={op.id}
                                  className={`
                                    w-4 h-4 rounded text-xs flex items-center justify-center
                                    ${op.executed 
                                      ? op.type === "load" 
                                        ? "bg-green-500 text-white" 
                                        : op.type === "store" 
                                          ? "bg-red-500 text-white" 
                                          : "bg-purple-500 text-white"
                                      : "bg-gray-200"}
                                  `}
                                  title={`
                                    ID: ${op.id}
                                    Tipo: ${op.type}
                                    Dirección: ${op.address}
                                    Valor: ${op.value}
                                    Orden: ${op.order}
                                    Ejecutada: ${op.executed ? "Sí" : "No"}
                                  `}
                                >
                                  {op.type === "load" ? "L" : op.type === "store" ? "S" : "A"}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <span className="mr-2">💾</span>
                      Memoria Compartida
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-10 gap-1">
                          {barriers.memory.slice(0, 100).map(location => (
                            <div
                              key={location.address}
                              className={`
                                w-5 h-5 rounded text-xs flex items-center justify-center
                                ${location.lastWriter !== null 
                                  ? location.readers.length > 0 
                                    ? "bg-purple-500 text-white" 
                                    : "bg-red-500 text-white"
                                  : location.readers.length > 0 
                                    ? "bg-green-500 text-white" 
                                    : "bg-gray-200"}
                              `}
                              title={`
                                Dirección: ${location.address}
                                Valor: ${location.value}
                                Último escritor: ${location.lastWriter !== null ? `Thread ${location.lastWriter}` : "Ninguno"}
                                Lectores: ${location.readers.length > 0 ? location.readers.map(id => `T${id}`).join(", ") : "Ninguno"}
                              `}
                            >
                              {location.value > 0 ? location.value % 10 : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-sm mb-1">Lectores/Escritores</div>
                        <div className="flex flex-wrap gap-1">
                          {barriers.memory.slice(0, 20).map(location => (
                            <div key={location.address} className="text-xs">
                              <div className="font-mono">0x{location.address.toString(16)}</div>
                              <div className="flex gap-1">
                                <span className="text-green-600">R:{location.readers.length}</span>
                                <span className="text-red-600">W:{location.lastWriter !== null ? 1 : 0}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Barreras de Memoria</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {barriers.threads.flatMap(thread => 
                    thread.barriers.map(barrier => ({
                      ...barrier,
                      threadId: thread.id
                    }))
                  ).slice(0, 12).map((barrier, index) => (
                    <div 
                      key={index} 
                      className={`
                        p-2 rounded text-center text-xs
                        ${barrier.executed 
                          ? barrier.type === "memory" 
                            ? "bg-blue-500 text-white" 
                            : barrier.type === "atomic" 
                              ? "bg-purple-500 text-white" 
                              : "bg-yellow-500 text-white"
                          : "bg-gray-200"}
                      `}
                    >
                      <div className="font-semibold">
                        {barrier.type === "memory" ? "MEM" : 
                         barrier.type === "atomic" ? "ATOM" : "COMP"}
                      </div>
                      <div>Hilo {barrier.threadId}</div>
                      <div>{barrier.executed ? "Ejecutada" : "Pendiente"}</div>
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
          <CardTitle>Tipos de Barreras de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Barrera de Memoria (Memory Barrier)</div>
              <p className="text-sm text-blue-700 mb-3">
                Impide que las operaciones de memoria se reordenen a través de ella, 
                garantizando que todas las operaciones antes de la barrera se 
                completen antes de que comiencen las operaciones después.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Garantiza orden de memoria</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Previene reordenamiento</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Overhead de sincronización</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Barrera de Adquisición (Acquire Barrier)</div>
              <p className="text-sm text-green-700 mb-3">
                Garantiza que ninguna operación posterior se ejecute antes 
                de que se complete la operación de adquisición (por ejemplo, 
                adquirir un lock). Se coloca después de la operación crítica.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Ordena operaciones después</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Usada en entrada a secciones críticas</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>No afecta operaciones anteriores</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">Barrera de Liberación (Release Barrier)</div>
              <p className="text-sm text-red-700 mb-3">
                Garantiza que todas las operaciones anteriores se completen 
                antes de que se ejecute la operación de liberación (por ejemplo, 
                liberar un lock). Se coloca antes de la operación crítica.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Ordena operaciones antes</span>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Usada en salida de secciones críticas</span>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>No afecta operaciones posteriores</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Barrera Secuencialmente Consistente</div>
              <p className="text-sm text-purple-700 mb-3">
                Combina adquisición y liberación, garantizando orden total 
                de todas las operaciones secuencialmente consistentes. 
                Equivale a una barrera de memoria completa.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Orden total de operaciones</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Más fuerte que acquire/release</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Mayor overhead</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Modelos de Consistencia:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Consistencia Secuencial (SC)</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Resultado como si hubiera un único procesador</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Fácil de razonar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-red-500">✗</span>
                    <span>Alto overhead</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Consistencia Débil</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Alto rendimiento</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Requiere barreras explícitas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-red-500">✗</span>
                    <span>Difícil de programar correctamente</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
