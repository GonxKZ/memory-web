import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export default function MemoryConsistencyModels() {
  const [config, setConfig] = useState({
    model: "sc" as "sc" | "tso" | "pso" | "rmo" | "pc",
    threads: 2,
    operations: 10,
    scenario: "simple" as "simple" | "race" | "barrier" | "lock"
  })
  
  const [consistency, setConsistency] = useState({
    executions: [] as {
      threadId: number,
      operation: "read" | "write",
      variable: string,
      value: number,
      timestamp: number,
      visibleTo: number[]
    }[],
    allowedExecutions: 0,
    prohibitedExecutions: 0,
    consistencyViolations: 0
  })
  
  const [history, setHistory] = useState<{
    time: number,
    model: string,
    allowed: number,
    prohibited: number,
    violations: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate consistency model
  const simulateConsistencyModel = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setConsistency({
      executions: [],
      allowedExecutions: 0,
      prohibitedExecutions: 0,
      consistencyViolations: 0
    })
    
    const newHistory = []
    let allowedExecutions = 0
    let prohibitedExecutions = 0
    let consistencyViolations = 0
    
    // Simulate executions
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate execution trace
      type Exec = { threadId: number; operation: "read" | "write"; variable: string; value: number; timestamp: number; visibleTo: number[] }
      const executions: Exec[] = []
      const variables = ["x", "y", "z"]
      
      // Generate operations for each thread
      for (let threadId = 0; threadId < config.threads; threadId++) {
        for (let opId = 0; opId < config.operations; opId++) {
          // Randomly choose operation type
          const operation = Math.random() > 0.5 ? "write" : "read"
          const variable = variables[Math.floor(Math.random() * variables.length)]
          const value = Math.floor(Math.random() * 100)
          const timestamp = threadId * config.operations + opId
          
          // Determine visibility based on consistency model
          let visibleTo = []
          
          switch (config.model) {
            case "sc":
              // Sequential consistency - all threads see operations in same order
              visibleTo = Array.from({ length: config.threads }, (_, i) => i)
              break
              
            case "tso":
              // Total store ordering - writes are ordered but can be delayed
              if (operation === "write") {
                // Writes are visible to all threads eventually
                visibleTo = Array.from({ length: config.threads }, (_, i) => i)
              } else {
                // Reads may see stale values
                visibleTo = [threadId] // Only visible to originating thread initially
              }
              break
              
            case "pso":
              // Partial store ordering - only writes to same location are ordered
              if (operation === "write") {
                // Writes to same variable are ordered
                visibleTo = [threadId] // Initially only visible to originating thread
              } else {
                // Reads may see inconsistent values
                visibleTo = [threadId]
              }
              break
              
            case "rmo":
              // Relaxed memory ordering - minimal ordering guarantees
              visibleTo = [threadId] // Only visible to originating thread
              break
              
            case "pc":
              // Processor consistency - writes from same processor are ordered
              if (threadId === 0) {
                // Processor 0 writes are ordered
                visibleTo = Array.from({ length: config.threads }, (_, i) => i)
              } else {
                // Other processors may see writes in different order
                visibleTo = [threadId]
              }
              break
          }
          
          executions.push({
            threadId,
            operation,
            variable,
            value,
            timestamp,
            visibleTo
          })
        }
      }
      
      // Check for consistency violations
      let violations = 0
      
      // Check for SC violations
      if (config.model === "sc") {
        // All operations should be seen in the same order by all threads
        for (let i = 0; i < executions.length - 1; i++) {
          for (let j = i + 1; j < executions.length; j++) {
            const op1 = executions[i]
            const op2 = executions[j]
            
            // Check if all threads see operations in same order
            for (let threadId = 0; threadId < config.threads; threadId++) {
              if (op1.visibleTo.includes(threadId) && op2.visibleTo.includes(threadId)) {
                // Both operations are visible to this thread
                if (op1.timestamp > op2.timestamp) {
                  // Violation: Later operation seen before earlier one
                  violations++
                }
              }
            }
          }
        }
      }
      
      // Check for TSO violations
      if (config.model === "tso") {
        // Writes should be seen in order by all threads
        const writes = executions.filter(op => op.operation === "write")
        
        for (let i = 0; i < writes.length - 1; i++) {
          for (let j = i + 1; j < writes.length; j++) {
            const write1 = writes[i]
            const write2 = writes[j]
            
            // Check if all threads see writes in order
            for (let threadId = 0; threadId < config.threads; threadId++) {
              const seesWrite1 = write1.visibleTo.includes(threadId)
              const seesWrite2 = write2.visibleTo.includes(threadId)
              
              if (seesWrite1 && seesWrite2 && write1.timestamp > write2.timestamp) {
                // Violation: Later write seen before earlier one
                violations++
              }
            }
          }
        }
      }
      
      // Update counters
      if (violations === 0) {
        allowedExecutions++
      } else {
        prohibitedExecutions++
        consistencyViolations += violations
      }
      
      // Update state
      setConsistency({
        executions,
        allowedExecutions,
        prohibitedExecutions,
        consistencyViolations
      })
      
      // Add to history
      newHistory.push({
        time: i,
        model: config.model,
        allowed: allowedExecutions,
        prohibited: prohibitedExecutions,
        violations: consistencyViolations
      })
      
      setHistory(newHistory)
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setConsistency({
      executions: [],
      allowedExecutions: 0,
      prohibitedExecutions: 0,
      consistencyViolations: 0
    })
  }

  // Model information
  const modelInfo = {
    "sc": {
      name: "Consistencia Secuencial",
      description: "Todas las operaciones parecen ocurrir en un orden global secuencial",
      color: "#3b82f6",
      icon: "🔒"
    },
    "tso": {
      name: "Orden Total de Almacenamiento",
      description: "Las escrituras se ven en orden global, pero pueden reordenarse con lecturas",
      color: "#10b981",
      icon: "🔄"
    },
    "pso": {
      name: "Orden Parcial de Almacenamiento",
      description: "Solo se garantiza el orden de escrituras al mismo lugar",
      color: "#8b5cf6",
      icon: "🔀"
    },
    "rmo": {
      name: "Orden de Memoria Relajada",
      description: "Mínimas garantías de orden, depende de fences",
      color: "#f59e0b",
      icon: "🔓"
    },
    "pc": {
      name: "Consistencia de Procesador",
      description: "Escrituras del mismo procesador se ven en orden",
      color: "#ef4444",
      icon: "⚙️"
    }
  }

  const currentModel = modelInfo[config.model]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Modelos de Consistencia de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo diferentes modelos de consistencia afectan la visibilidad de operaciones de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="model">Modelo de Consistencia</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(modelInfo).map(([key, model]) => (
                  <Button
                    key={key}
                    variant={config.model === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, model: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{model.icon}</span>
                    <span className="text-xs">{model.name.split(" ")[0]}</span>
                  </Button>
                ))}
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
                max="8"
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
                min="5"
                max="50"
                step="5"
              />
            </div>

            <div>
              <Label htmlFor="scenario">Escenario</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.scenario === "simple" ? "default" : "outline"}
                  onClick={() => setConfig({...config, scenario: "simple"})}
                >
                  Simple
                </Button>
                <Button
                  variant={config.scenario === "race" ? "default" : "outline"}
                  onClick={() => setConfig({...config, scenario: "race"})}
                >
                  Carrera
                </Button>
                <Button
                  variant={config.scenario === "barrier" ? "default" : "outline"}
                  onClick={() => setConfig({...config, scenario: "barrier"})}
                >
                  Barrera
                </Button>
                <Button
                  variant={config.scenario === "lock" ? "default" : "outline"}
                  onClick={() => setConfig({...config, scenario: "lock"})}
                >
                  Bloqueo
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateConsistencyModel} 
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
              style={{ color: currentModel.color }}
            >
              <span className="mr-2 text-2xl">{currentModel.icon}</span>
              {currentModel.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {currentModel.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ejecuciones Permitidas</div>
                  <div className="text-2xl font-bold text-green-600">
                    {consistency.allowedExecutions}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ejecuciones Prohibidas</div>
                  <div className="text-2xl font-bold text-red-600">
                    {consistency.prohibitedExecutions}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Violaciones</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {consistency.consistencyViolations}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Traza de Ejecución</div>
                <div className="max-h-64 overflow-y-auto">
                  {consistency.executions.length > 0 ? (
                    <div className="space-y-2">
                      {consistency.executions.map((execution, index) => (
                        <div 
                          key={index} 
                          className="p-2 border rounded flex justify-between items-center"
                        >
                          <div className="font-mono text-sm">
                            <span className="text-blue-600">Hilo {execution.threadId}</span>
                            <span className="mx-2">•</span>
                            <span className={execution.operation === "write" ? "text-red-600" : "text-green-600"}>
                              {execution.operation === "write" ? "WRITE" : "READ"}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-purple-600">{execution.variable}</span>
                            {execution.operation === "write" && (
                              <>
                                <span className="mx-2">=</span>
                                <span className="text-yellow-600">{execution.value}</span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            t={execution.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay ejecuciones registradas todavía</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Visibilidad de Operaciones</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from({ length: config.threads }).map((_, threadId) => (
                    <div key={threadId} className="p-2 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-500">Hilo {threadId}</div>
                      <div className="font-mono text-sm">
                        {consistency.executions
                          .filter(exec => exec.visibleTo.includes(threadId))
                          .length} ops
                      </div>
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
                    label={{ value: "Iteración", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="allowed" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Permitidas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prohibited" 
                    stroke="#ef4444" 
                    name="Prohibidas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="violations" 
                    stroke="#8b5cf6" 
                    name="Violaciones"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay historial de simulación todavía. Ejecute una simulación para ver el historial.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Comparativa de Modelos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(modelInfo).map(([key, model]) => (
              <Card 
                key={key}
                className={`
                  cursor-pointer transition-all duration-200
                  ${config.model === key 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:shadow-md"}
                `}
                onClick={() => setConfig({...config, model: key as any})}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center text-sm"
                    style={{ color: model.color }}
                  >
                    <span className="mr-1 text-lg">{model.icon}</span>
                    {model.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600">
                    {model.description}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-1">
                    <div className="p-1 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-500">Cons.</div>
                      <div className="font-semibold text-xs">
                        {key === "sc" ? "Alta" : key === "tso" ? "Media" : "Baja"}
                      </div>
                    </div>
                    <div className="p-1 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-500">Perf.</div>
                      <div className="font-semibold text-xs">
                        {key === "sc" ? "Baja" : key === "tso" ? "Media" : "Alta"}
                      </div>
                    </div>
                    <div className="p-1 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-500">Impl.</div>
                      <div className="font-semibold text-xs">
                        {key === "sc" ? "Simple" : key === "tso" ? "Media" : "Compleja"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Guía de Selección:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa SC para aplicaciones donde la corrección es crítica</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa TSO para balance entre rendimiento y consistencia</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa modelos relajados para máximo rendimiento cuando es seguro</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
