import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function StackHeapVisualizer() {
  const [memory, setMemory] = useState({
    size: 1024, // 1KB for visualization
    stackPointer: 1024,
    heapPointer: 0
  })
  
  const [stack, setStack] = useState<{id: number, value: string, size: number}[]>([])
  const [heap, setHeap] = useState<{id: number, value: string, size: number, address: number}[]>([])
  
  const [operations, setOperations] = useState<{type: "push" | "pop" | "malloc" | "free", value?: string, size?: number, address?: number, result: "success" | "overflow" | "underflow"}[]>([])
  
  const [config, setConfig] = useState({
    stackSize: 512,
    heapSize: 512
  })
  
  const [nextId, setNextId] = useState(1)

  // Update memory pointers when config changes
  useEffect(() => {
    setMemory({
      size: config.stackSize + config.heapSize,
      stackPointer: config.stackSize + config.heapSize,
      heapPointer: 0
    })
  }, [config])

  // Push to stack
  const pushToStack = (value: string) => {
    const size = value.length || 1
    
    // Check if there's space in stack
    if (memory.stackPointer - size < memory.heapPointer + (heap.length > 0 ? Math.max(...heap.map(h => h.address + h.size)) : 0)) {
      setOperations(prev => [...prev, {type: "push", value, result: "overflow"}])
      return
    }
    
    const newStack = [...stack, {id: nextId, value, size}]
    setStack(newStack)
    setNextId(prev => prev + 1)
    
    setMemory(prev => ({
      ...prev,
      stackPointer: prev.stackPointer - size
    }))
    
    setOperations(prev => [...prev, {type: "push", value, size, result: "success"}])
  }

  // Pop from stack
  const popFromStack = () => {
    if (stack.length === 0) {
      setOperations(prev => [...prev, {type: "pop", result: "underflow"}])
      return
    }
    
    const popped = stack[stack.length - 1]
    const newStack = stack.slice(0, -1)
    setStack(newStack)
    
    setMemory(prev => ({
      ...prev,
      stackPointer: prev.stackPointer + popped.size
    }))
    
    setOperations(prev => [...prev, {type: "pop", value: popped.value, size: popped.size, result: "success"}])
  }

  // Malloc in heap
  const mallocInHeap = (size: number) => {
    // Simple first-fit allocation
    let address = memory.heapPointer
    
    // Check if there's space
    if (address + size > memory.stackPointer - (stack.length > 0 ? stack.reduce((acc, s) => acc + s.size, 0) : 0)) {
      setOperations(prev => [...prev, {type: "malloc", size, result: "overflow"}])
      return
    }
    
    // Find free space
    if (heap.length > 0) {
      const sortedHeap = [...heap].sort((a, b) => a.address - b.address)
      let foundSpace = false
      
      // Check beginning
      if (sortedHeap[0].address >= size) {
        address = 0
        foundSpace = true
      }
      
      // Check between blocks
      if (!foundSpace) {
        for (let i = 0; i < sortedHeap.length - 1; i++) {
          const gap = sortedHeap[i + 1].address - (sortedHeap[i].address + sortedHeap[i].size)
          if (gap >= size) {
            address = sortedHeap[i].address + sortedHeap[i].size
            foundSpace = true
            break
          }
        }
      }
      
      // Check end
      if (!foundSpace) {
        const lastBlock = sortedHeap[sortedHeap.length - 1]
        if (memory.stackPointer - (lastBlock.address + lastBlock.size) >= size) {
          address = lastBlock.address + lastBlock.size
          foundSpace = true
        }
      }
      
      if (!foundSpace) {
        setOperations(prev => [...prev, {type: "malloc", size, result: "overflow"}])
        return
      }
    }
    
    const newHeap = [...heap, {id: nextId, value: "", size, address}]
    setHeap(newHeap)
    setNextId(prev => prev + 1)
    
    setOperations(prev => [...prev, {type: "malloc", size, address, result: "success"}])
  }

  // Free from heap
  const freeFromHeap = (id: number) => {
    const block = heap.find(b => b.id === id)
    if (!block) return
    
    const newHeap = heap.filter(b => b.id !== id)
    setHeap(newHeap)
    
    setOperations(prev => [...prev, {type: "free", address: block.address, size: block.size, result: "success"}])
  }

  // Reset simulation
  const resetSimulation = () => {
    setStack([])
    setHeap([])
    setOperations([])
    setNextId(1)
    
    setMemory({
      size: config.stackSize + config.heapSize,
      stackPointer: config.stackSize + config.heapSize,
      heapPointer: 0
    })
  }

  // Calculate memory usage
  const stackUsage = stack.reduce((acc, s) => acc + s.size, 0)
  const heapUsage = heap.reduce((acc, h) => acc + h.size, 0)
  const totalUsage = stackUsage + heapUsage
  const usagePercentage = (totalUsage / memory.size) * 100

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualizador de Stack/Heap</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo se gestionan las estructuras de datos stack y heap en memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Operaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pushValue">Push a Stack</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="pushValue"
                  placeholder="Valor a insertar"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement
                      pushToStack(target.value)
                      target.value = ""
                    }
                  }}
                />
                <Button onClick={() => {
                  const input = document.getElementById("pushValue") as HTMLInputElement
                  pushToStack(input.value)
                  input.value = ""
                }}>
                  Push
                </Button>
              </div>
            </div>

            <div>
              <Button 
                onClick={popFromStack} 
                className="w-full"
                variant="outline"
              >
                Pop de Stack
              </Button>
            </div>

            <div>
              <Label htmlFor="mallocSize">Malloc en Heap</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="mallocSize"
                  type="number"
                  placeholder="Tamaño (bytes)"
                  min="1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement
                      mallocInHeap(Number(target.value) || 1)
                      target.value = ""
                    }
                  }}
                />
                <Button onClick={() => {
                  const input = document.getElementById("mallocSize") as HTMLInputElement
                  mallocInHeap(Number(input.value) || 1)
                  input.value = ""
                }}>
                  Malloc
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetSimulation} 
                variant="outline" 
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualización de Memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Uso de Memoria</span>
                <span>{totalUsage} / {memory.size} bytes ({usagePercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={usagePercentage} className="w-full" />
            </div>

            <div className="relative h-64 border rounded p-4 bg-gray-50">
              {/* Memory visualization */}
              <div className="absolute inset-0 flex flex-col">
                {/* Heap section */}
                <div 
                  className="flex-1 bg-green-100 border border-green-300 relative overflow-hidden"
                  style={{ height: `${(config.heapSize / memory.size) * 100}%` }}
                >
                  <div className="absolute top-2 left-2 text-xs text-green-800 font-semibold">
                    HEAP
                  </div>
                  
                  {/* Heap blocks */}
                  {heap.map(block => (
                    <div
                      key={block.id}
                      className="absolute bg-green-300 border border-green-500 flex items-center justify-center text-xs"
                      style={{
                        left: `${(block.address / memory.size) * 100}%`,
                        width: `${(block.size / memory.size) * 100}%`,
                        height: "30px",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}
                      title={`Bloque ${block.id}: ${block.size} bytes`}
                    >
                      <div className="truncate px-1">{block.size}B</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-2 -right-2 h-4 w-4 p-0"
                        onClick={() => freeFromHeap(block.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Divider */}
                <div className="h-px bg-gray-400 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-500">
                    Heap Pointer: {memory.heapPointer}
                  </div>
                </div>
                
                {/* Stack section */}
                <div 
                  className="flex-1 bg-blue-100 border border-blue-300 relative overflow-hidden"
                  style={{ height: `${(config.stackSize / memory.size) * 100}%` }}
                >
                  <div className="absolute bottom-2 left-2 text-xs text-blue-800 font-semibold">
                    STACK
                  </div>
                  
                  {/* Stack pointer */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: `${(memory.stackPointer / memory.size) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-1 rounded whitespace-nowrap">
                      SP: {memory.stackPointer}
                    </div>
                  </div>
                  
                  {/* Stack elements */}
                  <div className="absolute inset-0 flex flex-col-reverse">
                    {stack.map((element, index) => (
                      <div
                        key={element.id}
                        className="flex-1 bg-blue-300 border-b border-blue-500 flex items-center justify-center text-xs truncate"
                        style={{ height: `${(element.size / memory.size) * 100}%` }}
                        title={`Elemento ${element.id}: ${element.value}`}
                      >
                        {element.value || " "}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-xs text-gray-500 mb-1">Stack Usage</div>
                <div className="font-semibold text-blue-600">
                  {stackUsage} bytes ({((stackUsage / config.stackSize) * 100).toFixed(1)}%)
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(stackUsage / config.stackSize) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded">
                <div className="text-xs text-gray-500 mb-1">Heap Usage</div>
                <div className="font-semibold text-green-600">
                  {heapUsage} bytes ({((heapUsage / config.heapSize) * 100).toFixed(1)}%)
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(heapUsage / config.heapSize) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Registro de Operaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {operations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {operations.slice(-8).map((op, index) => (
                <div 
                  key={index} 
                  className={`
                    p-3 rounded flex flex-col items-center justify-center text-center
                    ${op.result === "success" 
                      ? op.type === "push" || op.type === "malloc"
                        ? "bg-green-50 border border-green-200"
                        : "bg-blue-50 border border-blue-200"
                      : "bg-red-50 border border-red-200"}
                  `}
                >
                  <Badge 
                    variant={op.result === "success" ? "default" : "destructive"}
                    className="mb-2"
                  >
                    {op.type.toUpperCase()}
                  </Badge>
                  
                  {op.value && (
                    <div className="text-xs truncate w-full" title={op.value}>
                      Valor: {op.value}
                    </div>
                  )}
                  
                  {op.size && (
                    <div className="text-xs">
                      Tamaño: {op.size} bytes
                    </div>
                  )}
                  
                  {op.address !== undefined && (
                    <div className="text-xs">
                      Dirección: 0x{op.address.toString(16)}
                    </div>
                  )}
                  
                  <div className="text-xs mt-1">
                    {op.result === "success" ? "Éxito" : 
                     op.result === "overflow" ? "Desbordamiento" : 
                     "Subdesbordamiento"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay operaciones registradas todavía. Realice algunas operaciones para ver el registro.</p>
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
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Stack</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Automático: asignación y liberación gestionadas por el compilador</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>LIFO (Last In, First Out)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Muy rápido: solo se mueve el stack pointer</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Tamaño limitado (normalmente unos pocos MB)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Variables locales, parámetros de función</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Heap</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Manual: asignación y liberación gestionadas por el programador</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Flexible: tamaño dinámico durante la ejecución</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Más lento: requiere gestión de memoria</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Tamaño mucho mayor (limitado por RAM)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Datos dinámicos, estructuras de tamaño variable</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Buenas Prácticas:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa stack para variables locales pequeñas y de tamaño fijo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa heap para datos grandes o de tamaño dinámico</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Siempre empareja malloc/free y new/delete</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Evita el stack overflow usando recursion con cuidado</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}