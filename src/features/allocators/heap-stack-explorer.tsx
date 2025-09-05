import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function HeapStackExplorer() {
  const [config, setConfig] = useState({
    stackSize: 1024, // KB
    heapSize: 4096, // KB
    allocationPattern: "mixed" as "stack" | "heap" | "mixed",
    functionCalls: 5,
    allocationSize: 64, // bytes
    simulationSpeed: 300 // ms
  })
  
  const [memory, setMemory] = useState({
    stack: [] as {id: number, size: number, function: string, variables: any[]}[],
    heap: [] as {id: number, size: number, allocated: boolean, pointer: string}[],
    stackPointer: 1024 * 1024, // Start at top of stack
    heapPointer: 0, // Start at bottom of heap
    functionCallStack: [] as string[]
  })
  
  const [stats, setStats] = useState({
    stackUsage: 0,
    heapUsage: 0,
    allocations: 0,
    deallocations: 0,
    stackOverflows: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate stack and heap operations
  const simulateMemoryOperations = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Reset memory state
    setMemory({
      stack: [],
      heap: [],
      stackPointer: config.stackSize * 1024,
      heapPointer: 0,
      functionCallStack: []
    })
    
    // Reset stats
    setStats({
      stackUsage: 0,
      heapUsage: 0,
      allocations: 0,
      deallocations: 0,
      stackOverflows: 0
    })
    
    // Function names for simulation
    const functionNames = ["main", "processData", "calculate", "validate", "render", "update", "fetch", "save"]
    
    // Run simulation
    for (let step = 0; step < 50; step++) {
      setProgress((step + 1) * 2)
      
      // Create a copy of current memory state
      const currentMemory = { ...memory }
      const currentStats = { ...stats }
      
      // Decide what operation to perform based on allocation pattern
      const operation = Math.random()
      
      if (config.allocationPattern === "stack" || 
          (config.allocationPattern === "mixed" && operation < 0.6)) {
        // Stack operation - function call or return
        if (Math.random() > 0.5 && currentMemory.functionCallStack.length < config.functionCalls) {
          // Function call
          const functionName = functionNames[Math.floor(Math.random() * functionNames.length)]
          currentMemory.functionCallStack.push(functionName)
          
          // Allocate stack variables
          const variableCount = Math.floor(Math.random() * 5) + 1
          const variables = []
          let totalSize = 0
          
          for (let i = 0; i < variableCount; i++) {
            const varSize = Math.floor(Math.random() * 32) + 8 // 8-40 bytes
            variables.push({
              name: `var_${i}`,
              size: varSize,
              type: ["int", "float", "char", "struct"][Math.floor(Math.random() * 4)]
            })
            totalSize += varSize
          }
          
          // Check for stack overflow
          if (currentMemory.stackPointer - totalSize < 0) {
            currentStats.stackOverflows++
          } else {
            currentMemory.stackPointer -= totalSize
            currentMemory.stack.push({
              id: step,
              size: totalSize,
              function: functionName,
              variables
            })
            currentStats.stackUsage += totalSize
          }
        } else if (currentMemory.functionCallStack.length > 0) {
          // Function return - deallocate stack frame
          const frame = currentMemory.stack.pop()
          if (frame) {
            currentMemory.stackPointer += frame.size
            currentMemory.functionCallStack.pop()
            currentStats.stackUsage -= frame.size
          }
        }
      } else {
        // Heap operation - allocation or deallocation
        if (Math.random() > 0.5) {
          // Allocation
          const size = config.allocationSize + Math.floor(Math.random() * 128)
          const pointer = `0x${(0x10000000 + currentMemory.heapPointer).toString(16).toUpperCase()}`
          
          currentMemory.heap.push({
            id: step,
            size,
            allocated: true,
            pointer
          })
          
          currentMemory.heapPointer += size
          currentStats.heapUsage += size
          currentStats.allocations++
        } else if (currentMemory.heap.length > 0) {
          // Deallocation - find a random allocated block
          const allocatedBlocks = currentMemory.heap.filter(block => block.allocated)
          if (allocatedBlocks.length > 0) {
            const blockToFree = allocatedBlocks[Math.floor(Math.random() * allocatedBlocks.length)]
            const index = currentMemory.heap.findIndex(block => block.id === blockToFree.id)
            
            if (index !== -1) {
              currentMemory.heap[index] = {
                ...currentMemory.heap[index],
                allocated: false
              }
              
              currentStats.heapUsage -= blockToFree.size
              currentStats.deallocations++
            }
          }
        }
      }
      
      // Update state
      setMemory(currentMemory)
      setStats(currentStats)
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 50))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setMemory({
      stack: [],
      heap: [],
      stackPointer: config.stackSize * 1024,
      heapPointer: 0,
      functionCallStack: []
    })
    setStats({
      stackUsage: 0,
      heapUsage: 0,
      allocations: 0,
      deallocations: 0,
      stackOverflows: 0
    })
  }

  // Calculate memory utilization percentages
  const stackUtilization = (stats.stackUsage / (config.stackSize * 1024)) * 100
  const heapUtilization = (stats.heapUsage / (config.heapSize * 1024)) * 100

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Explorador de Stack y Heap</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo se gestionan las estructuras de stack y heap en tiempo de ejecución
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stackSize">Tamaño del Stack (KB)</Label>
              <Input
                id="stackSize"
                type="number"
                value={config.stackSize}
                onChange={(e) => setConfig({...config, stackSize: Number(e.target.value)})}
                min="256"
                step="256"
              />
            </div>

            <div>
              <Label htmlFor="heapSize">Tamaño del Heap (KB)</Label>
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
              <Label htmlFor="allocationPattern">Patrón de Asignación</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.allocationPattern === "stack" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "stack"})}
                >
                  Stack
                </Button>
                <Button
                  variant={config.allocationPattern === "heap" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "heap"})}
                >
                  Heap
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
              <Label htmlFor="functionCalls">Llamadas a Función</Label>
              <Input
                id="functionCalls"
                type="number"
                value={config.functionCalls}
                onChange={(e) => setConfig({...config, functionCalls: Number(e.target.value)})}
                min="1"
                max="10"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="allocationSize">Tamaño de Asignación (bytes)</Label>
              <Input
                id="allocationSize"
                type="number"
                value={config.allocationSize}
                onChange={(e) => setConfig({...config, allocationSize: Number(e.target.value)})}
                min="8"
                step="8"
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
                onClick={simulateMemoryOperations} 
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
                  <span>{progress}%</span>
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
                  <div className="text-2xl font-bold text-blue-600">
                    {(stats.stackUsage / 1024).toFixed(1)} KB
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Uso de Heap</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(stats.heapUsage / 1024).toFixed(1)} KB
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Asignaciones</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.allocations}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Stack Overflows</div>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.stackOverflows}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <span className="mr-2">スタッカ</span>
                      Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{stackUtilization.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={stackUtilization} 
                          className="w-full" 
                          color={stackUtilization > 80 ? "red" : stackUtilization > 60 ? "yellow" : "blue"}
                        />
                      </div>
                      
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">Puntero de Stack</div>
                        <div className="font-mono text-sm">
                          0x{memory.stackPointer.toString(16).toUpperCase()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Llamadas Activas</div>
                        <div className="flex flex-wrap gap-1">
                          {memory.functionCallStack.map((func, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {func}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Frames de Stack</div>
                        <div className="max-h-32 overflow-y-auto">
                          {memory.stack.slice(-5).map((frame) => (
                            <div key={frame.id} className="p-2 border-b text-xs">
                              <div className="font-semibold">{frame.function}</div>
                              <div className="text-gray-600">{frame.size} bytes</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {frame.variables.map((variable, varIndex) => (
                                  <Badge key={varIndex} variant="outline" className="text-xs">
                                    {variable.name} ({variable.type})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <span className="mr-2">ヒープ</span>
                      Heap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{heapUtilization.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={heapUtilization} 
                          className="w-full" 
                          color={heapUtilization > 80 ? "red" : heapUtilization > 60 ? "yellow" : "green"}
                        />
                      </div>
                      
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">Puntero de Heap</div>
                        <div className="font-mono text-sm">
                          0x{memory.heapPointer.toString(16).toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Asignados</div>
                          <div className="font-semibold">{stats.allocations}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Liberados</div>
                          <div className="font-semibold">{stats.deallocations}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Bloques de Heap</div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                          {memory.heap.slice(-20).map((block) => (
                            <div
                              key={block.id}
                              className={`
                                w-6 h-6 rounded flex items-center justify-center text-xs
                                ${block.allocated 
                                  ? "bg-green-500 text-white" 
                                  : "bg-gray-300 text-gray-700"}
                              `}
                              title={`
                                Bloque ${block.id}
                                Tamaño: ${block.size} bytes
                                Dirección: ${block.pointer}
                                ${block.allocated ? "Asignado" : "Liberado"}
                              `}
                            >
                              {block.allocated ? "A" : "F"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Stack y Heap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Stack</div>
              <p className="text-sm text-blue-700 mb-3">
                La memoria stack se utiliza para almacenar variables locales, 
                parámetros de función y direcciones de retorno. Se gestiona 
                automáticamente por el compilador.
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>Asignación automática:</strong> Variables locales se crean y destruyen automáticamente</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>Tamaño limitado:</strong> Típicamente unos pocos MB por hilo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>Acceso rápido:</strong> Muy eficiente debido a la estructura LIFO</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Heap</div>
              <p className="text-sm text-green-700 mb-3">
                La memoria heap se utiliza para asignaciones dinámicas que 
                persisten más allá del ámbito de una función. Requiere gestión 
                manual (malloc/free en C, new/delete en C++).
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>Asignación manual:</strong> El programador controla cuándo crear y destruir objetos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>Tamaño flexible:</strong> Puede crecer hasta los límites del sistema</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>Acceso más lento:</strong> Requiere punteros y puede fragmentarse</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Diferencias Clave:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Gestión</div>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Stack: Automática</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Heap: Manual</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Tamaño</div>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Stack: Limitada</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Heap: Flexible</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Rendimiento</div>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Stack: Rápida</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Heap: Más lenta</span>
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