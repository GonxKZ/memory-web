import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export default function StackHeapVisualization() {
  const [config, setConfig] = useState({
    stackSize: 8192, // 8KB
    heapSize: 32768, // 32KB
    blockSize: 64, // 64 bytes
    allocationPattern: "mixed" as "sequential" | "random" | "mixed",
    simulationSpeed: 200 // ms
  })
  
  const [stack, setStack] = useState<{
    frames: {
      id: number,
      size: number,
      variables: {name: string, size: number}[]
    }[]
  }>({
    frames: []
  })
  
  const [heap, setHeap] = useState<{
    blocks: {
      id: number,
      size: number,
      allocated: boolean,
      address: number
    }[]
  }>({
    blocks: []
  })
  
  const [memory, setMemory] = useState<{
    addresses: {
      address: number,
      type: "stack" | "heap" | "free",
      size: number,
      frameId: number | null,
      blockId: number | null
    }[]
  }>({
    addresses: []
  })
  
  const [results, setResults] = useState({
    stackUsage: 0,
    heapUsage: 0,
    fragmentation: 0,
    allocations: 0,
    deallocations: 0
  })
  
  const [history, setHistory] = useState<{
    time: number,
    stackUsage: number,
    heapUsage: number,
    fragmentation: number,
    allocations: number,
    deallocations: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize memory layout
  useEffect(() => {
    // Initialize stack frames
    const stackFrames = []
    for (let i = 0; i < 10; i++) {
      stackFrames.push({
        id: i,
        size: Math.floor(Math.random() * config.blockSize * 4) + config.blockSize,
        variables: [
          { name: `var${i}_1`, size: Math.floor(Math.random() * 16) + 8 },
          { name: `var${i}_2`, size: Math.floor(Math.random() * 16) + 8 }
        ]
      })
    }
    setStack({ frames: stackFrames })
    
    // Initialize heap blocks
    const heapBlocks = []
    const totalHeapBlocks = Math.floor(config.heapSize / config.blockSize)
    for (let i = 0; i < totalHeapBlocks; i++) {
      heapBlocks.push({
        id: i,
        size: config.blockSize,
        allocated: Math.random() > 0.7,
        address: i * config.blockSize
      })
    }
    setHeap({ blocks: heapBlocks })
    
    // Initialize memory addresses
    const addresses: { address: number; type: "stack" | "heap" | "free"; size: number; frameId: number | null; blockId: number | null }[] = []
    const totalMemory = config.stackSize + config.heapSize
    for (let i = 0; i < totalMemory / config.blockSize; i++) {
      addresses.push({
        address: i * config.blockSize,
        type: i < config.stackSize / config.blockSize 
          ? "stack" 
          : heapBlocks.find(b => b.address === i * config.blockSize)?.allocated 
            ? "heap" 
            : "free",
        size: config.blockSize,
        frameId: i < config.stackSize / config.blockSize ? Math.floor(i / 4) : null,
        blockId: i >= config.stackSize / config.blockSize 
          ? heapBlocks.find(b => b.address === i * config.blockSize)?.id || null 
          : null
      })
    }
    setMemory({ addresses })
  }, [])

  // Simulate stack and heap operations
  const simulateStackHeap = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setResults({
      stackUsage: 0,
      heapUsage: 0,
      fragmentation: 0,
      allocations: 0,
      deallocations: 0
    })
    
    const newHistory = []
    let stackUsage = 0
    let heapUsage = 0
    let fragmentation = 0
    let allocations = 0
    let deallocations = 0
    
    // Simulate operations
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate random operation
      const operationType = Math.random()
      let operation = ""
      
      if (operationType < 0.4) {
        // Stack push/pop
        operation = "stack"
      } else if (operationType < 0.7) {
        // Heap allocation
        operation = "heap_alloc"
        allocations++
      } else {
        // Heap deallocation
        operation = "heap_free"
        deallocations++
      }
      
      // Update memory state based on operation
      if (operation === "stack") {
        // Simulate stack frame push/pop
        const isPush = Math.random() > 0.5
        if (isPush) {
          // Push new frame
          const newFrame = {
            id: stack.frames.length,
            size: Math.floor(Math.random() * config.blockSize * 4) + config.blockSize,
            variables: [
              { name: `var${stack.frames.length}_1`, size: Math.floor(Math.random() * 16) + 8 },
              { name: `var${stack.frames.length}_2`, size: Math.floor(Math.random() * 16) + 8 }
            ]
          }
          
          setStack(prev => ({
            ...prev,
            frames: [...prev.frames.slice(-9), newFrame]
          }))
          
          stackUsage += newFrame.size
        } else {
          // Pop frame
          if (stack.frames.length > 0) {
            const frame = stack.frames[stack.frames.length - 1]
            setStack(prev => ({
              ...prev,
              frames: prev.frames.slice(0, -1)
            }))
            
            stackUsage = Math.max(0, stackUsage - frame.size)
          }
        }
      } else if (operation === "heap_alloc") {
        // Simulate heap allocation
        const blockSize = Math.floor(Math.random() * config.blockSize * 4) + config.blockSize
        const freeBlock = heap.blocks.find(b => !b.allocated)
        
        if (freeBlock) {
          // Allocate free block
          const newBlocks = [...heap.blocks]
          const blockIndex = newBlocks.findIndex(b => b.id === freeBlock.id)
          if (blockIndex !== -1) {
            newBlocks[blockIndex] = {
              ...newBlocks[blockIndex],
              allocated: true
            }
            setHeap({ blocks: newBlocks })
            heapUsage += blockSize
          }
        } else {
          // No free blocks - increase fragmentation
          fragmentation += 0.5
        }
      } else if (operation === "heap_free") {
        // Simulate heap deallocation
        const allocatedBlocks = heap.blocks.filter(b => b.allocated)
        if (allocatedBlocks.length > 0) {
          const blockToFree = allocatedBlocks[Math.floor(Math.random() * allocatedBlocks.length)]
          const newBlocks = [...heap.blocks]
          const blockIndex = newBlocks.findIndex(b => b.id === blockToFree.id)
          if (blockIndex !== -1) {
            newBlocks[blockIndex] = {
              ...newBlocks[blockIndex],
              allocated: false
            }
            setHeap({ blocks: newBlocks })
            heapUsage = Math.max(0, heapUsage - blockToFree.size)
            deallocations++
          }
        }
      }
      
      // Update fragmentation
      const freeBlocks = heap.blocks.filter(b => !b.allocated).length
      const totalBlocks = heap.blocks.length
      fragmentation = totalBlocks > 0 ? (freeBlocks / totalBlocks) * 100 : 0
      
      // Update results
      setResults({
        stackUsage: parseFloat(stackUsage.toFixed(2)),
        heapUsage: parseFloat(heapUsage.toFixed(2)),
        fragmentation: parseFloat(fragmentation.toFixed(2)),
        allocations,
        deallocations
      })
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          stackUsage: parseFloat(stackUsage.toFixed(2)),
          heapUsage: parseFloat(heapUsage.toFixed(2)),
          fragmentation: parseFloat(fragmentation.toFixed(2)),
          allocations,
          deallocations
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
    setResults({
      stackUsage: 0,
      heapUsage: 0,
      fragmentation: 0,
      allocations: 0,
      deallocations: 0
    })
    
    // Reset stack
    const stackFrames = []
    for (let i = 0; i < 10; i++) {
      stackFrames.push({
        id: i,
        size: Math.floor(Math.random() * config.blockSize * 4) + config.blockSize,
        variables: [
          { name: `var${i}_1`, size: Math.floor(Math.random() * 16) + 8 },
          { name: `var${i}_2`, size: Math.floor(Math.random() * 16) + 8 }
        ]
      })
    }
    setStack({ frames: stackFrames })
    
    // Reset heap
    const heapBlocks = []
    const totalHeapBlocks = Math.floor(config.heapSize / config.blockSize)
    for (let i = 0; i < totalHeapBlocks; i++) {
      heapBlocks.push({
        id: i,
        size: config.blockSize,
        allocated: Math.random() > 0.7,
        address: i * config.blockSize
      })
    }
    setHeap({ blocks: heapBlocks })
    
    // Reset memory
    const addresses: { address: number; type: "stack" | "heap" | "free"; size: number; frameId: number | null; blockId: number | null }[] = []
    const totalMemory = config.stackSize + config.heapSize
    for (let i = 0; i < totalMemory / config.blockSize; i++) {
      addresses.push({
        address: i * config.blockSize,
        type: i < config.stackSize / config.blockSize 
          ? "stack" 
          : heapBlocks.find(b => b.address === i * config.blockSize)?.allocated 
            ? "heap" 
            : "free",
        size: config.blockSize,
        frameId: i < config.stackSize / config.blockSize ? Math.floor(i / 4) : null,
        blockId: i >= config.stackSize / config.blockSize 
          ? heapBlocks.find(b => b.address === i * config.blockSize)?.id || null 
          : null
      })
    }
    setMemory({ addresses })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Stack y Heap</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo se gestionan las estructuras de datos stack y heap en memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stackSize">Tamaño del Stack (bytes)</Label>
              <Input
                id="stackSize"
                type="number"
                value={config.stackSize}
                onChange={(e) => setConfig({...config, stackSize: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="heapSize">Tamaño del Heap (bytes)</Label>
              <Input
                id="heapSize"
                type="number"
                value={config.heapSize}
                onChange={(e) => setConfig({...config, heapSize: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

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
              <Label htmlFor="allocationPattern">Patrón de Asignación</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.allocationPattern === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.allocationPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.allocationPattern === "mixed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "mixed"})}
                >
                  Mixto
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
                onClick={simulateStackHeap} 
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
            <CardTitle>Estado de Memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Uso de Stack</div>
                  <div className="text-2xl font-bold text-blue-600">{results.stackUsage.toFixed(0)} bytes</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Uso de Heap</div>
                  <div className="text-2xl font-bold text-green-600">{results.heapUsage.toFixed(0)} bytes</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fragmentación</div>
                  <div className="text-2xl font-bold text-red-600">{results.fragmentation.toFixed(1)}%</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Asignaciones</div>
                  <div className="text-2xl font-bold text-purple-600">{results.allocations}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Layout de Memoria</div>
                <div className="relative h-64 bg-gray-50 rounded p-4 overflow-hidden">
                  {/* Stack visualization */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-100 border-r border-blue-300"
                    style={{ width: "50%" }}
                  >
                    <div className="absolute top-2 left-2 text-xs text-blue-800 font-semibold">
                      STACK
                    </div>
                    
                    {/* Stack frames */}
                    <div className="absolute inset-0 flex flex-col-reverse">
                      {stack.frames.map(frame => (
                        <div
                          key={frame.id}
                          className="bg-blue-300 border-b border-blue-500 flex items-center justify-center text-xs truncate"
                          style={{ height: `${(frame.size / config.stackSize) * 100}%` }}
                          title={`Frame ${frame.id}: ${frame.size} bytes`}
                        >
                          Frame {frame.id} ({frame.size} bytes)
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Heap visualization */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-1/2 bg-green-100"
                    style={{ width: "50%" }}
                  >
                    <div className="absolute top-2 right-2 text-xs text-green-800 font-semibold">
                      HEAP
                    </div>
                    
                    {/* Heap blocks */}
                    <div className="absolute inset-0 grid grid-cols-8 gap-1 p-2">
                      {heap.blocks.map(block => (
                        <div
                          key={block.id}
                          className={`
                            rounded flex items-center justify-center text-xs
                            ${block.allocated 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-200 text-gray-700"}
                          `}
                          title={
                            `Bloque ${block.id}: ${block.size} bytes
` +
                            `${block.allocated ? "Asignado" : "Libre"}`
                          }
                        >
                          {block.allocated ? "A" : "L"}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Memory boundary */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400"></div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Frames del Stack Recientes</div>
                <div className="flex flex-wrap gap-2">
                  {stack.frames.slice(-5).map(frame => (
                    <Card key={frame.id} className="w-40">
                      <CardHeader>
                        <CardTitle className="text-sm">Frame {frame.id}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-gray-500 mb-1">Tamaño: {frame.size} bytes</div>
                        <div className="space-y-1">
                          {frame.variables.map((variable, varIndex) => (
                            <div key={varIndex} className="flex justify-between text-xs">
                              <span>{variable.name}</span>
                              <span>{variable.size} bytes</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Bloques del Heap</div>
                <div className="flex flex-wrap gap-1">
                  {heap.blocks.slice(0, 32).map(block => (
                    <div
                      key={block.id}
                      className={`
                        w-8 h-8 rounded flex items-center justify-center text-xs font-mono
                        ${block.allocated 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-200 text-gray-700"}
                      `}
                      title={
                        `Bloque ${block.id}: ${block.size} bytes
` +
                        `${block.allocated ? "Asignado" : "Libre"}`
                      }
                    >
                      {block.allocated ? "A" : "L"}
                    </div>
                  ))}
                  {heap.blocks.length > 32 && (
                    <div className="w-8 h-8 rounded flex items-center justify-center text-xs bg-gray-300 text-gray-700">
                      +{heap.blocks.length - 32}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Uso</CardTitle>
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
                    label={{ value: "Memoria (bytes)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Fragmentación (%)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="stackUsage" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Uso de Stack"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="heapUsage" 
                    stroke="#10b981" 
                    name="Uso de Heap"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="fragmentation" 
                    stroke="#ef4444" 
                    name="Fragmentación"
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
          <CardTitle>Diferencias entre Stack y Heap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <span className="mr-2 text-xl">スタッガ</span>
                  Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Memoria gestionada automáticamente por el compilador
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Características:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Asignación/desasignación automática</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Acceso muy rápido</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Tamaño limitado</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Organización LIFO</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Usos típicos:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-blue-500">•</span>
                        <span>Variables locales</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-blue-500">•</span>
                        <span>Parámetros de función</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-blue-500">•</span>
                        <span>Direcciones de retorno</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="mr-2 text-xl">ヒープ</span>
                  Heap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Memoria gestionada manualmente por el programador
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Características:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Asignación/desasignación manual</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Tamaño dinámico</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Acceso más lento que stack</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Sujeto a fragmentación</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Usos típicos:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">•</span>
                        <span>Estructuras de datos dinámicas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">•</span>
                        <span>Objetos grandes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">•</span>
                        <span>Datos con vida útil variable</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Uso:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa stack para variables pequeñas con vida corta</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa heap para datos grandes o con vida prolongada</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Evita el stack overflow con estructuras grandes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Libera memoria del heap para evitar fugas</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
