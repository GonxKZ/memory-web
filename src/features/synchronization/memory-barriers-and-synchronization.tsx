import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export default function MemoryBarriersAndSynchronization() {
  const [config, setConfig] = useState({
    barrierType: "memory" as "memory" | "compiler" | "cpu",
    threads: 4,
    operations: 100,
    barrierFrequency: 10, // Every N operations
    memoryOrdering: "sequential" as "sequential" | "acquire" | "release" | "relaxed",
    simulationSpeed: 200 // ms
  })
  
  const [synchronization, setSynchronization] = useState({
    barriers: [] as {id: number, type: string, threadId: number, timestamp: number}[],
    operations: [] as {id: number, threadId: number, operation: string, barrierBefore: boolean, barrierAfter: boolean, timestamp: number}[],
    orderingViolations: 0,
    barrierOverhead: 0,
    synchronizationSuccess: 0
  })
  
  const [history, setHistory] = useState<{
    time: number,
    barriers: number,
    violations: number,
    overhead: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate memory barriers and synchronization
  const simulateSynchronization = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setSynchronization({
      barriers: [],
      operations: [],
      orderingViolations: 0,
      barrierOverhead: 0,
      synchronizationSuccess: 0
    })
    
    const newHistory = []
    const barriers = []
    const operations = []
    let orderingViolations = 0
    let barrierOverhead = 0
    let synchronizationSuccess = 0
    
    // Simulate threads performing operations
    for (let i = 0; i < config.operations; i++) {
      setProgress((i / config.operations) * 100)
      
      // For each thread, perform an operation
      for (let threadId = 0; threadId < config.threads; threadId++) {
        // Determine if a barrier should be inserted
        const needsBarrier = i % config.barrierFrequency === 0 && i > 0
        const operation = Math.random() > 0.5 ? "read" : "write"
        
        // Add operation
        operations.push({
          id: operations.length,
          threadId,
          operation,
          barrierBefore: needsBarrier,
          barrierAfter: false,
          timestamp: i
        })
        
        // Add barrier if needed
        if (needsBarrier) {
          barriers.push({
            id: barriers.length,
            type: config.barrierType,
            threadId,
            timestamp: i
          })
          
          // Add barrier overhead
          barrierOverhead += 10 // ns
        }
        
        // Check for ordering violations based on memory ordering model
        if (config.memoryOrdering === "relaxed") {
          // In relaxed ordering, more violations are possible
          if (Math.random() > 0.8) {
            orderingViolations++
          }
        } else if (config.memoryOrdering === "acquire" || config.memoryOrdering === "release") {
          // In acquire/release ordering, fewer violations
          if (Math.random() > 0.95) {
            orderingViolations++
          }
        } else {
          // In sequential consistency, almost no violations
          if (Math.random() > 0.99) {
            orderingViolations++
          }
        }
        
        // Update synchronization success based on barriers
        synchronizationSuccess = barriers.length > 0 
          ? ((config.operations - orderingViolations) / config.operations) * 100 
          : 100 - (orderingViolations / config.operations) * 100
      }
      
      // Update state
      setSynchronization({
        barriers: [...barriers],
        operations: [...operations],
        orderingViolations,
        barrierOverhead: parseFloat(barrierOverhead.toFixed(2)),
        synchronizationSuccess: parseFloat(synchronizationSuccess.toFixed(2))
      })
      
      // Add to history every 10 operations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          barriers: barriers.length,
          violations: orderingViolations,
          overhead: barrierOverhead
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
    setSynchronization({
      barriers: [],
      operations: [],
      orderingViolations: 0,
      barrierOverhead: 0,
      synchronizationSuccess: 0
    })
  }

  // Barrier type information
  const barrierTypeInfo = {
    "memory": {
      name: "Barrera de Memoria",
      description: "Sincroniza operaciones de memoria entre hilos",
      color: "#3b82f6",
      icon: "🔒"
    },
    "compiler": {
      name: "Barrera del Compilador",
      description: "Evita optimizaciones que reordenen operaciones",
      color: "#10b981",
      icon: "💻"
    },
    "cpu": {
      name: "Barrera de CPU",
      description: "Instrucciones que sincronizan el pipeline de la CPU",
      color: "#8b5cf6",
      icon: "⚙️"
    }
  }

  const currentBarrierType = barrierTypeInfo[config.barrierType]

  // Memory ordering information
  const orderingInfo = {
    "sequential": {
      name: "Consistencia Secuencial",
      description: "Todas las operaciones parecen ocurrir en un orden global",
      color: "#3b82f6",
      icon: "🔒"
    },
    "acquire": {
      name: "Acquire",
      description: "Operaciones después de acquire ven operaciones anteriores",
      color: "#10b981",
      icon: "📥"
    },
    "release": {
      name: "Release",
      description: "Operaciones antes de release son visibles después",
      color: "#8b5cf6",
      icon: "📤"
    },
    "relaxed": {
      name: "Relajado",
      description: "Mínimas garantías de orden, máximo rendimiento",
      color: "#f59e0b",
      icon: "🔓"
    }
  }

  const currentOrdering = orderingInfo[config.memoryOrdering]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Barreras de Memoria y Sincronización</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo las barreras de memoria garantizan el orden de operaciones en sistemas concurrentes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="barrierType">Tipo de Barrera</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.barrierType === "memory" ? "default" : "outline"}
                  onClick={() => setConfig({...config, barrierType: "memory"})}
                >
                  Memoria
                </Button>
                <Button
                  variant={config.barrierType === "compiler" ? "default" : "outline"}
                  onClick={() => setConfig({...config, barrierType: "compiler"})}
                >
                  Compilador
                </Button>
                <Button
                  variant={config.barrierType === "cpu" ? "default" : "outline"}
                  onClick={() => setConfig({...config, barrierType: "cpu"})}
                >
                  CPU
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
                min="2"
                max="16"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="operations">Operaciones por Hilo</Label>
              <Input
                id="operations"
                type="number"
                value={config.operations}
                onChange={(e) => setConfig({...config, operations: Number(e.target.value)})}
                min="50"
                step="50"
              />
            </div>

            <div>
              <Label htmlFor="barrierFrequency">Frecuencia de Barreras</Label>
              <Input
                id="barrierFrequency"
                type="number"
                value={config.barrierFrequency}
                onChange={(e) => setConfig({...config, barrierFrequency: Number(e.target.value)})}
                min="1"
                max="50"
                step="1"
              />
              <div className="text-xs text-gray-500 mt-1">
                Insertar barrera cada {config.barrierFrequency} operaciones
              </div>
            </div>

            <div>
              <Label htmlFor="memoryOrdering">Ordenamiento de Memoria</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.memoryOrdering === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryOrdering: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.memoryOrdering === "acquire" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryOrdering: "acquire"})}
                >
                  Acquire
                </Button>
                <Button
                  variant={config.memoryOrdering === "release" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryOrdering: "release"})}
                >
                  Release
                </Button>
                <Button
                  variant={config.memoryOrdering === "relaxed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryOrdering: "relaxed"})}
                >
                  Relajado
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
                onClick={simulateSynchronization} 
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
              style={{ color: currentBarrierType.color }}
            >
              <span className="mr-2 text-2xl">{currentBarrierType.icon}</span>
              {currentBarrierType.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {currentBarrierType.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Barreras Totales</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {synchronization.barriers.length}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Violaciones de Orden</div>
                  <div className="text-2xl font-bold text-red-600">
                    {synchronization.orderingViolations}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Éxito de Sincronización</div>
                  <div className="text-2xl font-bold text-green-600">
                    {synchronization.synchronizationSuccess}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Overhead de Barreras</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {synchronization.barrierOverhead} ns
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Operaciones Totales</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {synchronization.operations.length}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Operaciones Recientes</div>
                <div className="flex flex-wrap gap-1">
                  {synchronization.operations.slice(-20).map((op) => (
                    <div
                      key={op.id}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${op.operation === "read" 
                          ? "bg-blue-500 text-white" 
                          : "bg-red-500 text-white"}
                        ${op.barrierBefore ? "ring-2 ring-green-500" : ""}
                      `}
                      title={
                        `Hilo ${op.threadId}: ${op.operation === "read" ? "Lectura" : "Escritura"}
` +
                        `${op.barrierBefore ? "Precedido por barrera" : "Sin barrera"}`
                      }
                    >
                      {op.operation === "read" ? "R" : "W"}
                      {op.barrierBefore ? "B" : ""}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Barreras</div>
                <div className="flex flex-wrap gap-1">
                  {synchronization.barriers.slice(-10).map((barrier) => (
                    <div
                      key={barrier.id}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${barrier.type === "memory" 
                          ? "bg-green-500 text-white" 
                          : barrier.type === "compiler" 
                            ? "bg-blue-500 text-white" 
                            : "bg-purple-500 text-white"}
                      `}
                      title={
                        `Barrera de ${barrier.type}
` +
                        `Hilo ${barrier.threadId}
` +
                        `Tiempo: ${barrier.timestamp}`
                      }
                    >
                      {barrier.type === "memory" ? "M" : barrier.type === "compiler" ? "C" : "CPU"}
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
          <CardTitle 
            className="flex items-center"
            style={{ color: currentOrdering.color }}
          >
            <span className="mr-2 text-2xl">{currentOrdering.icon}</span>
            {currentOrdering.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">
                {currentOrdering.description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold mb-2">Garantías</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Consistencia secuencial: {config.memoryOrdering === "sequential" ? "Sí" : "No"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Orden acquire/release: {config.memoryOrdering === "acquire" || config.memoryOrdering === "release" || config.memoryOrdering === "sequential" ? "Sí" : "No"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Reordenamiento permitido: {config.memoryOrdering === "relaxed" ? "Sí" : "No"}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <div className="font-semibold mb-2">Impacto en Rendimiento</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">📊</span>
                    <span>Latencia: {config.memoryOrdering === "sequential" ? "Alta" : config.memoryOrdering === "relaxed" ? "Baja" : "Media"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">📊</span>
                    <span>Rendimiento: {config.memoryOrdering === "relaxed" ? "Alto" : config.memoryOrdering === "sequential" ? "Bajo" : "Medio"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">📊</span>
                    <span>Complejidad: {config.memoryOrdering === "sequential" ? "Baja" : config.memoryOrdering === "relaxed" ? "Alta" : "Media"}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Cuándo usar cada modelo:</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✅</span>
                  <span>Secuencial: Cuando se requiere máxima predictibilidad</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✅</span>
                  <span>Acquire/Release: Para sincronización específica sin overhead innecesario</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✅</span>
                  <span>Relajado: Para máximo rendimiento cuando es seguro</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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
                    label={{ value: "Tiempo", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Overhead (ns)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="barriers" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Barreras"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="violations" 
                    stroke="#ef4444" 
                    name="Violaciones"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="overhead" 
                    stroke="#8b5cf6" 
                    name="Overhead"
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
          <CardTitle>Tipos de Barreras y Sincronización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <span className="mr-2 text-xl">🔒</span>
                  Barrera de Memoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Garantiza que todas las operaciones de memoria anteriores se completen antes 
                    de que comiencen las operaciones posteriores.
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Garantías fuertes de orden</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Prevención de reordenamiento</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Mayor latencia</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Puede limitar optimizaciones</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="mr-2 text-xl">💻</span>
                  Barrera del Compilador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Impide que el compilador reordene instrucciones alrededor de la barrera, 
                    sin afectar el hardware.
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Bajo overhead</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Evita optimizaciones peligrosas</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>No previene reordenamiento de hardware</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Depende del compilador</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <span className="mr-2 text-xl">⚙️</span>
                  Barrera de CPU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Instrucciones especiales que sincronizan el pipeline de la CPU y 
                    previenen reordenamiento de hardware.
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Control preciso del hardware</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Mayor flexibilidad</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Complejidad adicional</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Varía según arquitectura</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Sincronización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use barreras solo cuando sea necesario para evitar overhead innecesario</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Combine diferentes tipos de barreras para control fino</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use atomic operations para protecciones ligeras</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Minimice el número de barreras en caminos críticos</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
