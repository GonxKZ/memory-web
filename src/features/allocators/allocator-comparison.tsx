import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export default function MemoryAllocatorsComparison() {
  const [config, setConfig] = useState({
    allocatorType: "malloc" as "malloc" | "buddy" | "slab" | "jemalloc" | "tcmalloc",
    blockSize: 64,
    numAllocations: 1000,
    allocationPattern: "mixed" as "sequential" | "random" | "mixed",
    simulationSpeed: 100 // ms
  })
  
  const [results, setResults] = useState<{
    allocator: string,
    time: number,
    memoryUsed: number,
    fragmentation: number,
    allocationRate: number,
    deallocationRate: number
  }[]>([])
  
  const [history, setHistory] = useState<{
    time: number,
    allocations: number,
    deallocations: number,
    memoryUsed: number,
    fragmentation: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Allocator implementations
  const runSimulation = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setResults([])
    
    // Initialize allocator state
    const allocatorState = {
      malloc: {
        time: 0,
        memoryUsed: 0,
        fragmentation: 0,
        allocations: 0,
        deallocations: 0
      },
      buddy: {
        time: 0,
        memoryUsed: 0,
        fragmentation: 0,
        allocations: 0,
        deallocations: 0
      },
      slab: {
        time: 0,
        memoryUsed: 0,
        fragmentation: 0,
        allocations: 0,
        deallocations: 0
      },
      jemalloc: {
        time: 0,
        memoryUsed: 0,
        fragmentation: 0,
        allocations: 0,
        deallocations: 0
      },
      tcmalloc: {
        time: 0,
        memoryUsed: 0,
        fragmentation: 0,
        allocations: 0,
        deallocations: 0
      }
    }
    
    const newHistory: any[] = []
    const newResults: any[] = []
    
    // Simulate allocations over time
    for (let i = 0; i < config.numAllocations; i++) {
      setProgress((i / config.numAllocations) * 100)
      
      // Generate random allocation/deallocation
      const isAllocation = Math.random() > 0.3 // 70% allocations, 30% deallocations
      const size = isAllocation 
        ? Math.floor(Math.random() * config.blockSize * 4) + 1 
        : 0
      
      // Update allocator stats for each allocator type
      Object.keys(allocatorState).forEach(allocator => {
        const state = allocatorState[allocator as keyof typeof allocatorState]
        
        if (isAllocation) {
          // Simulate allocation
          state.allocations++
          state.memoryUsed += size
          state.time += Math.random() * 10 // Simulated allocation time
          
          // Calculate fragmentation based on allocator type
          if (allocator === "malloc") {
            // Standard malloc has some fragmentation
            state.fragmentation = Math.min(100, state.fragmentation + 0.2)
          } else if (allocator === "buddy") {
            // Buddy allocator has some internal fragmentation
            state.fragmentation = Math.min(100, state.fragmentation + 0.1)
          } else if (allocator === "slab") {
            // Slab allocator has low fragmentation for fixed-size objects
            state.fragmentation = Math.max(0, state.fragmentation - 0.05)
          } else if (allocator === "jemalloc") {
            // jemalloc has good fragmentation control
            state.fragmentation = Math.min(100, state.fragmentation + 0.02)
          } else if (allocator === "tcmalloc") {
            // tcmalloc also has good fragmentation control
            state.fragmentation = Math.min(100, state.fragmentation + 0.03)
          }
        } else {
          // Simulate deallocation
          if (state.allocations > state.deallocations) {
            state.deallocations++
            state.memoryUsed = Math.max(0, state.memoryUsed - size)
            state.time += Math.random() * 5 // Simulated deallocation time
          }
        }
      })
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          allocations: allocatorState[config.allocatorType].allocations,
          deallocations: allocatorState[config.allocatorType].deallocations,
          memoryUsed: allocatorState[config.allocatorType].memoryUsed,
          fragmentation: allocatorState[config.allocatorType].fragmentation
        })
      }
      
      // Add small delay to visualize
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed))
    }
    
    // Prepare results for all allocators
    Object.keys(allocatorState).forEach(allocator => {
      const state = allocatorState[allocator as keyof typeof allocatorState]
      const totalTime = state.time
      const allocationRate = state.allocations / (totalTime / 1000) // allocations per second
      
      newResults.push({
        allocator,
        time: parseFloat(totalTime.toFixed(2)),
        memoryUsed: state.memoryUsed,
        fragmentation: parseFloat(state.fragmentation.toFixed(2)),
        allocationRate: parseFloat(allocationRate.toFixed(2)),
        deallocationRate: parseFloat((state.deallocations / (totalTime / 1000)).toFixed(2))
      })
    })
    
    setHistory(newHistory)
    setResults(newResults)
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setResults([])
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Comparación de Asignadores de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Evalúa el rendimiento de diferentes asignadores de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="allocatorType">Tipo de Asignador</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.allocatorType === "malloc" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocatorType: "malloc"})}
                >
                  malloc
                </Button>
                <Button
                  variant={config.allocatorType === "buddy" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocatorType: "buddy"})}
                >
                  Buddy
                </Button>
                <Button
                  variant={config.allocatorType === "slab" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocatorType: "slab"})}
                >
                  Slab
                </Button>
                <Button
                  variant={config.allocatorType === "jemalloc" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocatorType: "jemalloc"})}
                >
                  jemalloc
                </Button>
                <Button
                  variant={config.allocatorType === "tcmalloc" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocatorType: "tcmalloc"})}
                >
                  tcmalloc
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque Base (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="1"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="numAllocations">Número de Asignaciones</Label>
              <Input
                id="numAllocations"
                type="number"
                value={config.numAllocations}
                onChange={(e) => setConfig({...config, numAllocations: Number(e.target.value)})}
                min="100"
                step="100"
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
                type="number"
                value={config.simulationSpeed}
                onChange={(e) => setConfig({...config, simulationSpeed: Number(e.target.value)})}
                min="10"
                max="1000"
                step="10"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={runSimulation} 
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
            <CardTitle>Resultados de la Simulación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo Total</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {results.find(r => r.allocator === config.allocatorType)?.time || 0} ms
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Memoria Usada</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(results.find(r => r.allocator === config.allocatorType)?.memoryUsed || 0).toLocaleString()} bytes
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fragmentación</div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.find(r => r.allocator === config.allocatorType)?.fragmentation || 0}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Asignación</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {results.find(r => r.allocator === config.allocatorType)?.allocationRate || 0} ops/s
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Liberación</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.find(r => r.allocator === config.allocatorType)?.deallocationRate || 0} ops/s
                  </div>
                </div>
              </div>

              {history.length > 0 && (
                <div>
                  <div className="font-semibold mb-2">Historial de Uso</div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={history}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="time" 
                          label={{ value: "Iteraciones", position: "insideBottom", offset: -5 }} 
                        />
                        <YAxis 
                          yAxisId="left" 
                          label={{ value: "Operaciones", angle: -90, position: "insideLeft" }} 
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          label={{ value: "Memoria (bytes)", angle: 90, position: "insideRight" }} 
                        />
                        <Tooltip />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="allocations" 
                          stroke="#3b82f6" 
                          activeDot={{ r: 8 }} 
                          name="Asignaciones"
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="deallocations" 
                          stroke="#10b981" 
                          name="Liberaciones"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="memoryUsed" 
                          stroke="#8b5cf6" 
                          name="Memoria Usada"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Comparativa de Asignadores</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="allocator" />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Tiempo (ms)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Fragmentación (%)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="time" 
                    fill="#3b82f6" 
                    name="Tiempo Total (ms)"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="fragmentation" 
                    fill="#ef4444" 
                    name="Fragmentación (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay resultados de simulación todavía. Ejecute una simulación para ver la comparativa.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Características de Asignadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <span className="mr-2 text-xl">📌</span>
                  malloc/free
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Asignador estándar de C
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Universalmente disponible</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Simple de usar</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Fragmentación significativa</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Rendimiento variable</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="mr-2 text-xl">🧱</span>
                  Buddy Allocator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Divide la memoria en bloques de tamaño potencia de 2
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Evita fragmentación externa</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Algoritmo simple</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Fragmentación interna</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Requiere tamaño potencia de 2</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <span className="mr-2 text-xl">💎</span>
                  Slab Allocator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Pre-asigna objetos de tamaño fijo en cachés
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Baja fragmentación</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Rápido para objetos de tamaño fijo</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>No eficiente para objetos variables</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Complejidad adicional</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <span className="mr-2 text-xl">⚡</span>
                  jemalloc/tcmalloc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Asignadores optimizados para rendimiento y escalabilidad
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Excelente rendimiento concurrente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Bajo overhead</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Buena gestión de fragmentación</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Complejidad de implementación</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Mayor uso de memoria</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Selección de Asignador:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa malloc para aplicaciones generales</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa Buddy para asignaciones de tamaño variable con bajo overhead</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa Slab para objetos de tamaño fijo en el kernel</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa jemalloc/tcmalloc para aplicaciones con alto rendimiento requerido</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}