import { useState } from "react"
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
  ResponsiveContainer 
} from "recharts"

export default function MemoryInterleavingVisualization() {
  const [config, setConfig] = useState({
    interleavingType: "bit" as "bit" | "word" | "page" | "bank",
    modules: 4,
    blockSize: 64, // bytes
    accessPattern: "sequential" as "sequential" | "random" | "stride" | "pointer-chasing",
    stride: 1,
    memorySize: 1024, // MB
    simulationSpeed: 200 // ms
  })
  
  const [interleaving, setInterleaving] = useState({
    accesses: [] as {address: number, module: number, hit: boolean, latency: number}[],
    moduleUsage: [] as {moduleId: number, accesses: number, utilization: number}[],
    stats: {
      bandwidthImprovement: 0,
      latencyReduction: 0,
      moduleBalance: 0,
      totalAccesses: 0
    }
  })
  
  const [history, setHistory] = useState<{
    time: number,
    bandwidth: number,
    latency: number,
    balance: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize interleaving state
  useState(() => {
    // Initialize module usage
    const moduleUsage: {moduleId: number; accesses: number; utilization: number}[] = []
    for (let i = 0; i < config.modules; i++) {
      moduleUsage.push({
        moduleId: i,
        accesses: 0,
        utilization: 0
      })
    }
    setInterleaving(prev => ({...prev, moduleUsage}))
  })

  // Simulate memory interleaving
  const simulateInterleaving = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setInterleaving({
      accesses: [],
      moduleUsage: interleaving.moduleUsage.map(m => ({...m, accesses: 0, utilization: 0})),
      stats: {
        bandwidthImprovement: 0,
        latencyReduction: 0,
        moduleBalance: 0,
        totalAccesses: 0
      }
    })
    
    const newHistory = []
    const moduleUsage = interleaving.moduleUsage.map(m => ({...m, accesses: 0, utilization: 0}))
    let totalBandwidth = 0
    let totalLatency = 0
    let moduleBalance = 0
    
    // Simulate memory accesses
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate memory address based on access pattern
      let address = 0
      if (config.accessPattern === "sequential") {
        address = i * config.blockSize
      } else if (config.accessPattern === "random") {
        address = Math.floor(Math.random() * config.memorySize * 1024 * 1024)
      } else if (config.accessPattern === "stride") {
        address = i * config.stride * config.blockSize
      } else {
        // Pointer chasing - more complex pattern
        address = (i * 17 + 31) % (config.memorySize * 1024 * 1024)
      }
      
      // Calculate module based on interleaving type
      let module = 0
      const blockNumber = Math.floor(address / config.blockSize)
      
      switch (config.interleavingType) {
        case "bit":
          // Bit interleaving - use low-order bits
          module = blockNumber % config.modules
          break
          
        case "word":
          // Word interleaving - use word-aligned bits
          module = Math.floor(blockNumber / 4) % config.modules
          break
          
        case "page":
          // Page interleaving - use page-aligned bits
          module = Math.floor(blockNumber / 64) % config.modules
          break
          
        case "bank":
          // Bank interleaving - use bank bits
          module = Math.floor(blockNumber / 16) % config.modules
          break
      }
      
      // Check cache hit/miss
      const isInCache = interleaving.accesses.some(a => 
        Math.floor(a.address / config.blockSize) === Math.floor(address / config.blockSize) &&
        a.module === module
      )
      
      const isHit = isInCache
      const latency = isHit ? 5 : 100 // ns
      
      // Update module usage
      moduleUsage[module] = {
        ...moduleUsage[module],
        accesses: moduleUsage[module].accesses + 1,
        utilization: ((moduleUsage[module].accesses + 1) / (i + 1)) * 100
      }
      
      // Add to accesses
      setInterleaving(prev => ({
        ...prev,
        accesses: [...prev.accesses.slice(-49), {address, module, hit: isHit, latency}],
        moduleUsage: [...moduleUsage]
      }))
      
      // Update stats
      totalBandwidth += config.blockSize / (latency / 1000000000) // bytes/sec
      totalLatency += latency
      
      // Calculate module balance (standard deviation of usage)
      const avgUsage = moduleUsage.reduce((sum, m) => sum + m.utilization, 0) / config.modules
      const variance = moduleUsage.reduce((sum, m) => sum + Math.pow(m.utilization - avgUsage, 2), 0) / config.modules
      moduleBalance = 100 - Math.sqrt(variance) // Higher balance = lower variance
      
      const bandwidthImprovement = totalBandwidth / (i + 1)
      const latencyReduction = totalLatency / (i + 1)
      const totalAccesses = i + 1
      
      setInterleaving(prev => ({
        ...prev,
        stats: {
          bandwidthImprovement: parseFloat(bandwidthImprovement.toFixed(2)),
          latencyReduction: parseFloat(latencyReduction.toFixed(2)),
          moduleBalance: parseFloat(moduleBalance.toFixed(2)),
          totalAccesses
        }
      }))
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          bandwidth: parseFloat((bandwidthImprovement / 1024 / 1024).toFixed(2)),
          latency: parseFloat((latencyReduction / totalAccesses).toFixed(2)),
          balance: parseFloat(moduleBalance.toFixed(2))
        })
        setHistory(newHistory)
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
    setInterleaving({
      accesses: [],
      moduleUsage: interleaving.moduleUsage.map(m => ({...m, accesses: 0, utilization: 0})),
      stats: {
        bandwidthImprovement: 0,
        latencyReduction: 0,
        moduleBalance: 0,
        totalAccesses: 0
      }
    })
  }

  // Interleaving type information
  const interleavingInfo = {
    "bit": {
      name: "Interleaving de Bits",
      description: "Usa los bits menos significativos de la dirección para determinar el módulo",
      color: "#3b82f6",
      icon: "🔬"
    },
    "word": {
      name: "Interleaving de Palabras",
      description: "Distribuye palabras completas entre diferentes módulos",
      color: "#10b981",
      icon: "📝"
    },
    "page": {
      name: "Interleaving de Páginas",
      description: "Distribuye páginas enteras entre diferentes módulos",
      color: "#8b5cf6",
      icon: "📄"
    },
    "bank": {
      name: "Interleaving de Bancos",
      description: "Distribuye datos entre diferentes bancos de memoria",
      color: "#f59e0b",
      icon: "🏦"
    }
  }

  const currentInterleaving = interleavingInfo[config.interleavingType]

  // Access pattern information
  const patternInfo = {
    "sequential": {
      name: "Secuencial",
      description: "Acceso a direcciones consecutivas",
      color: "#3b82f6",
      icon: "➡️"
    },
    "random": {
      name: "Aleatorio",
      description: "Acceso a direcciones aleatorias",
      color: "#ef4444",
      icon: "🔀"
    },
    "stride": {
      name: "Stride",
      description: "Acceso con un patrón de salto fijo",
      color: "#10b981",
      icon: "🔢"
    },
    "pointer-chasing": {
      name: "Pointer Chasing",
      description: "Seguimiento de punteros en estructuras enlazadas",
      color: "#8b5cf6",
      icon: "🔗"
    }
  }

  const currentPattern = patternInfo[config.accessPattern]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Interleaving de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo el interleaving mejora el ancho de banda y reduce la latencia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="interleavingType">Tipo de Interleaving</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(interleavingInfo).map(([key, interleaving]) => (
                  <Button
                    key={key}
                    variant={config.interleavingType === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, interleavingType: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{interleaving.icon}</span>
                    <span className="text-xs">{interleaving.name.split(" ")[1]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="modules">Número de Módulos</Label>
              <Input
                id="modules"
                type="number"
                value={config.modules}
                onChange={(e) => setConfig({...config, modules: Number(e.target.value)})}
                min="2"
                max="16"
                step="1"
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
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(patternInfo).map(([key, pattern]) => (
                  <Button
                    key={key}
                    variant={config.accessPattern === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, accessPattern: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{pattern.icon}</span>
                    <span className="text-xs">{pattern.name.split(" ")[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            {config.accessPattern === "stride" && (
              <div>
                <Label htmlFor="stride">Valor de Stride</Label>
                <Input
                  id="stride"
                  type="number"
                  value={config.stride}
                  onChange={(e) => setConfig({...config, stride: Number(e.target.value)})}
                  min="1"
                  step="1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (MB)</Label>
              <Input
                id="memorySize"
                type="number"
                value={config.memorySize}
                onChange={(e) => setConfig({...config, memorySize: Number(e.target.value)})}
                min="256"
                step="256"
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
                onClick={simulateInterleaving} 
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
              style={{ color: currentInterleaving.color }}
            >
              <span className="mr-2 text-2xl">{currentInterleaving.icon}</span>
              {currentInterleaving.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {currentInterleaving.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Mejora de Ancho de Banda</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {interleaving.stats.bandwidthImprovement.toFixed(2)} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Reducción de Latencia</div>
                  <div className="text-2xl font-bold text-green-600">
                    {interleaving.stats.latencyReduction.toFixed(2)} ns
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Balance de Módulos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {interleaving.stats.moduleBalance.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Totales</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {interleaving.stats.totalAccesses}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Uso de Módulos</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {interleaving.moduleUsage.map(module => (
                    <div 
                      key={module.moduleId} 
                      className="p-2 bg-gray-50 rounded"
                    >
                      <div className="text-xs text-gray-500 mb-1">Módulo {module.moduleId}</div>
                      <div className="font-mono">{module.accesses}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="h-2 rounded-full bg-blue-600" 
                          style={{ width: `${module.utilization}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs mt-1">{module.utilization.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Accesos Recientes</div>
                <div className="flex flex-wrap gap-1">
                  {interleaving.accesses.map((access, index) => (
                    <div
                      key={index}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${access.hit 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"}
                      `}
                      title={
                        `Dirección: 0x${access.address.toString(16).toUpperCase()}
` +
                        `Módulo: ${access.module}
` +
                        `${access.hit ? "Acierto" : "Fallo"}
` +
                        `Latencia: ${access.latency} ns`
                      }
                    >
                      M{access.module}
                      {access.hit ? "A" : "F"}
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
          <CardTitle>Historial de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                    label={{ value: "Rendimiento (MB/s)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Latencia (ns)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="bandwidth" 
                    fill="#3b82f6" 
                    name="Ancho de Banda"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="latency" 
                    fill="#10b981" 
                    name="Latencia"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="balance" 
                    fill="#8b5cf6" 
                    name="Balance de Módulos"
                  />
                </BarChart>
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
          <CardTitle>Comparativa de Tipos de Interleaving</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(interleavingInfo).map(([key, interleaving]) => (
              <Card 
                key={key}
                className={config.interleavingType === key ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center text-sm"
                    style={{ color: interleaving.color }}
                  >
                    <span className="mr-2 text-xl">{interleaving.icon}</span>
                    {interleaving.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      {interleaving.description}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Ventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "bit" && "Simple de implementar"}
                            {key === "word" && "Aprovecha el ancho de palabra completo"}
                            {key === "page" && "Reduce conflictos de página"}
                            {key === "bank" && "Paralelismo máximo entre bancos"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "bit" && "Buen equilibrio para acceso secuencial"}
                            {key === "word" && "Buen rendimiento para acceso secuencial"}
                            {key === "page" && "Mejora la localidad espacial"}
                            {key === "bank" && "Mejor aprovechamiento del ancho de banda"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Desventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "bit" && "Puede causar conflictos con strides"}
                            {key === "word" && "Menos flexible para tamaños variables"}
                            {key === "page" && "Mayor granularidad puede causar desequilibrio"}
                            {key === "bank" && "Complejidad en control de bancos"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "bit" && "No óptimo para todos los patrones"}
                            {key === "word" && "Puede dejar módulos inutilizados"}
                            {key === "page" && "Menos efectivo para acceso aleatorio"}
                            {key === "bank" && "Requiere hardware especializado"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Elija el tipo de interleaving según el patrón de acceso predominante</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use interleaving de bits para acceso secuencial simple</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use interleaving de páginas para acceso con localidad espacial</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Ajuste el número de módulos según el ancho de banda del bus de memoria</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
