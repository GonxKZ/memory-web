import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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

export default function MemoryProfilerIntegration() {
  const [profilingSession, setProfilingSession] = useState({
    id: "",
    status: "idle" as "idle" | "profiling" | "analyzing" | "completed",
    startTime: null as Date | null,
    endTime: null as Date | null
  })
  
  const [config, setConfig] = useState({
    samplingInterval: 100, // ms
    maxDuration: 30000, // ms
    heapTracking: true,
    stackTracking: true,
    allocationTracking: true,
    leakDetection: true
  })
  
  const [memoryData, setMemoryData] = useState<{
    timestamp: number,
    heapUsed: number,
    heapTotal: number,
    stackUsed: number,
    allocations: number,
    deallocations: number,
    leaks: number
  }[]>([])
  
  const [summary, setSummary] = useState({
    totalAllocations: 0,
    totalDeallocations: 0,
    leakedMemory: 0,
    peakHeapUsage: 0,
    averageHeapUsage: 0,
    allocationRate: 0,
    deallocationRate: 0
  })
  
  const [leaks, setLeaks] = useState<{
    id: number,
    size: number,
    stackTrace: string[],
    timestamp: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Start profiling session
  const startProfiling = () => {
    setIsRunning(true)
    setProfilingSession({
      id: `session-${Date.now()}`,
      status: "profiling",
      startTime: new Date(),
      endTime: null
    })
    setMemoryData([])
    setLeaks([])
    setProgress(0)
    
    // Simulate profiling data collection
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          clearInterval(interval)
          stopProfiling()
          return 100
        }
        return newProgress
      })
      
      // Generate simulated memory data
      const timestamp = Date.now()
      const heapUsed = Math.floor(100 + Math.random() * 900) // MB
      const heapTotal = 1024 // MB
      const stackUsed = Math.floor(1 + Math.random() * 15) // MB
      const allocations = Math.floor(1000 + Math.random() * 9000)
      const deallocations = Math.floor(900 + Math.random() * 8000)
      const leaks = Math.floor(Math.random() * 10)
      
      setMemoryData(prev => [...prev.slice(-59), {
        timestamp,
        heapUsed,
        heapTotal,
        stackUsed,
        allocations,
        deallocations,
        leaks
      }])
      
      // Generate simulated leaks occasionally
      if (Math.random() > 0.8 && config.leakDetection) {
        setLeaks(prev => [...prev, {
          id: prev.length + 1,
          size: Math.floor(1 + Math.random() * 100), // KB
          stackTrace: [
            `function_${Math.floor(Math.random() * 100)}()`,
            `function_${Math.floor(Math.random() * 100)}()`,
            `function_${Math.floor(Math.random() * 100)}()`
          ],
          timestamp
        }])
      }
    }, config.samplingInterval)
  }

  // Stop profiling session
  const stopProfiling = () => {
    setIsRunning(false)
    setProfilingSession(prev => ({
      ...prev,
      status: "analyzing",
      endTime: new Date()
    }))
    
    // Simulate analysis
    setTimeout(() => {
      // Calculate summary statistics
      const totalAllocations = memoryData.reduce((sum, data) => sum + data.allocations, 0)
      const totalDeallocations = memoryData.reduce((sum, data) => sum + data.deallocations, 0)
      const leakedMemory = leaks.reduce((sum, leak) => sum + leak.size, 0)
      const peakHeapUsage = Math.max(...memoryData.map(data => data.heapUsed), 0)
      const averageHeapUsage = memoryData.length > 0 
        ? memoryData.reduce((sum, data) => sum + data.heapUsed, 0) / memoryData.length
        : 0
      const allocationRate = memoryData.length > 1 
        ? (memoryData[memoryData.length - 1].allocations - memoryData[0].allocations) / 
          ((memoryData[memoryData.length - 1].timestamp - memoryData[0].timestamp) / 1000)
        : 0
      const deallocationRate = memoryData.length > 1 
        ? (memoryData[memoryData.length - 1].deallocations - memoryData[0].deallocations) / 
          ((memoryData[memoryData.length - 1].timestamp - memoryData[0].timestamp) / 1000)
        : 0
      
      setSummary({
        totalAllocations,
        totalDeallocations,
        leakedMemory,
        peakHeapUsage,
        averageHeapUsage,
        allocationRate,
        deallocationRate
      })
      
      setProfilingSession(prev => ({
        ...prev,
        status: "completed"
      }))
    }, 2000)
  }

  // Reset profiling session
  const resetProfiling = () => {
    setIsRunning(false)
    setProfilingSession({
      id: "",
      status: "idle",
      startTime: null,
      endTime: null
    })
    setMemoryData([])
    setLeaks([])
    setSummary({
      totalAllocations: 0,
      totalDeallocations: 0,
      leakedMemory: 0,
      peakHeapUsage: 0,
      averageHeapUsage: 0,
      allocationRate: 0,
      deallocationRate: 0
    })
    setProgress(0)
  }

  // Export profiling data
  const exportData = () => {
    const dataStr = JSON.stringify({
      session: profilingSession,
      config,
      memoryData,
      summary,
      leaks
    }, null, 2)
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `memory-profile-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Integración del Profiler de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Analiza y optimiza el uso de memoria de tus aplicaciones en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración del Profiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="samplingInterval">Intervalo de Muestreo (ms)</Label>
              <Input
                id="samplingInterval"
                type="number"
                value={config.samplingInterval}
                onChange={(e) => setConfig({...config, samplingInterval: Number(e.target.value)})}
                min="10"
                max="1000"
                step="10"
              />
            </div>

            <div>
              <Label htmlFor="maxDuration">Duración Máxima (ms)</Label>
              <Input
                id="maxDuration"
                type="number"
                value={config.maxDuration}
                onChange={(e) => setConfig({...config, maxDuration: Number(e.target.value)})}
                min="1000"
                max="300000"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="heapTracking">Seguimiento de Heap</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="heapTracking"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.heapTracking}
                    onChange={(e) => setConfig({...config, heapTracking: e.target.checked})}
                  />
                  <label
                    htmlFor="heapTracking"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="stackTracking">Seguimiento de Stack</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="stackTracking"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.stackTracking}
                    onChange={(e) => setConfig({...config, stackTracking: e.target.checked})}
                  />
                  <label
                    htmlFor="stackTracking"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allocationTracking">Seguimiento de Asignaciones</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="allocationTracking"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.allocationTracking}
                    onChange={(e) => setConfig({...config, allocationTracking: e.target.checked})}
                  />
                  <label
                    htmlFor="allocationTracking"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="leakDetection">Detección de Fugas</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="leakDetection"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.leakDetection}
                    onChange={(e) => setConfig({...config, leakDetection: e.target.checked})}
                  />
                  <label
                    htmlFor="leakDetection"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {!isRunning ? (
                <Button 
                  onClick={startProfiling} 
                  disabled={profilingSession.status === "analyzing"}
                  className="flex-1"
                >
                  {profilingSession.status === "analyzing" ? "Analizando..." : "Iniciar Profiling"}
                </Button>
              ) : (
                <Button 
                  onClick={stopProfiling} 
                  variant="outline" 
                  className="flex-1"
                >
                  Detener Profiling
                </Button>
              )}
              <Button 
                onClick={resetProfiling} 
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
            <CardTitle>Estado del Profiling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Sesión ID</div>
                  <div className="font-mono text-sm">{profilingSession.id || "Ninguna"}</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Estado</div>
                  <div className="font-semibold">
                    {profilingSession.status === "idle" && "Inactivo"}
                    {profilingSession.status === "profiling" && "Profiling"}
                    {profilingSession.status === "analyzing" && "Analizando"}
                    {profilingSession.status === "completed" && "Completado"}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Inicio</div>
                  <div className="text-sm">
                    {profilingSession.startTime 
                      ? profilingSession.startTime.toLocaleTimeString() 
                      : "N/A"}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fin</div>
                  <div className="text-sm">
                    {profilingSession.endTime 
                      ? profilingSession.endTime.toLocaleTimeString() 
                      : "N/A"}
                  </div>
                </div>
              </div>

              {memoryData.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={memoryData.map(data => ({
                        ...data,
                        time: new Date(data.timestamp).toLocaleTimeString()
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        label={{ value: "Tiempo", position: "insideBottom", offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: "Memoria (MB)", angle: -90, position: "insideLeft" }} 
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="heapUsed" 
                        stroke="#3b82f6" 
                        activeDot={{ r: 8 }} 
                        name="Heap Usado (MB)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="heapTotal" 
                        stroke="#10b981" 
                        name="Heap Total (MB)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="stackUsed" 
                        stroke="#8b5cf6" 
                        name="Stack Usado (MB)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Asignaciones</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {summary.totalAllocations.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Liberaciones</div>
                  <div className="text-2xl font-bold text-green-600">
                    {summary.totalDeallocations.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fugas Detectadas</div>
                  <div className="text-2xl font-bold text-red-600">
                    {leaks.length}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Memoria Perdida</div>
                  <div className="text-2xl font-bold text-red-600">
                    {summary.leakedMemory} KB
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={exportData} 
                  disabled={profilingSession.status !== "completed"}
                  className="flex-1"
                >
                  Exportar Datos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Detalles de Fugas de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          {leaks.length > 0 ? (
            <div className="space-y-3">
              {leaks.map(leak => (
                <Card key={leak.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Fuga #{leak.id}</span>
                      <Badge variant="destructive">{leak.size} KB</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Detectada: {new Date(leak.timestamp).toLocaleTimeString()}
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold mb-1">Stack Trace:</div>
                        <div className="font-mono text-xs bg-gray-800 text-green-400 p-2 rounded">
                          {leak.stackTrace.map((frame, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              <span className="text-gray-500">#{index + 1} </span>
                              {frame}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>
                {profilingSession.status === "completed" 
                  ? "No se detectaron fugas de memoria en esta sesión." 
                  : "No hay datos de fugas todavía. Inicie una sesión de profiling para detectar fugas."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recomendaciones de Optimización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Gestión de Memoria</div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Usa RAII (Resource Acquisition Is Initialization) en C++</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Evita asignaciones innecesarias en bucles críticos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Usa pools de objetos para objetos de tamaño fijo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span>Implementa contadores de referencias inteligentes</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Detección de Fugas</div>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Usa herramientas como Valgrind, AddressSanitizer</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Implementa macros de debugging para seguimiento de asignaciones</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Realiza profiling regularmente durante el desarrollo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Establece límites máximos de memoria para detección temprana</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Optimización de Rendimiento</div>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Minimiza la fragmentación con allocators personalizados</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Usa estructuras de datos con localidad espacial</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Evita patrones de acceso que causen false sharing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">✓</span>
                  <span>Implementa prefetching para patrones predecibles</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Mejores Prácticas</div>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">✓</span>
                  <span>Establece métricas claras de rendimiento de memoria</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">✓</span>
                  <span>Documenta el comportamiento esperado de uso de memoria</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">✓</span>
                  <span>Realiza pruebas de estrés con límites de memoria</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">✓</span>
                  <span>Monitorea el uso de memoria en producción</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos Adicionales:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa herramientas de profiling para identificar hotspots de memoria</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Considera el uso de memory profilers específicos de tu plataforma</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Establece alertas para crecimiento inesperado del uso de memoria</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Documenta patrones de uso de memoria en tu arquitectura</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
