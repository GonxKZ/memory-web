import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"
import { useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export default function MemoryInterleavingVisualization() {
  const [config, setConfig] = useState({
    interleavingType: "bit" as "bit" | "word" | "page" | "bank",
    modules: 4,
    blockSize: 64, // bytes
    accessPattern: "sequential" as "sequential" | "random" | "stride",
    stride: 1,
    memorySize: 1024, // MB
    simulationSpeed: 200 // ms
  })
  
  const [interleaving, setInterleaving] = useState({
    accesses: [] as {address: number, module: number, bank: number, latency: number}[],
    moduleUsage: [] as {moduleId: number, accesses: number, utilization: number}[],
    bankUsage: [] as {bankId: number, accesses: number, utilization: number}[],
    bandwidthImprovement: 0,
    latencyReduction: 0
  })
  
  const [history, setHistory] = useState<{
    time: number,
    sequentialBandwidth: number,
    interleavedBandwidth: number,
    moduleUsage: number[]
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [guided, setGuided] = useState(false)

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
    
    // Initialize bank usage (assuming 8 banks per module)
    const bankUsage: {bankId: number; accesses: number; utilization: number}[] = []
    for (let i = 0; i < config.modules * 8; i++) {
      bankUsage.push({
        bankId: i,
        accesses: 0,
        utilization: 0
      })
    }
    setInterleaving(prev => ({...prev, bankUsage}))
  })

  // Simulate memory interleaving
  const simulateInterleaving = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setInterleaving({
      accesses: [],
      moduleUsage: interleaving.moduleUsage.map(m => ({...m, accesses: 0, utilization: 0})),
      bankUsage: interleaving.bankUsage.map(b => ({...b, accesses: 0, utilization: 0})),
      bandwidthImprovement: 0,
      latencyReduction: 0
    })
    
    const newHistory = []
    const moduleUsage = interleaving.moduleUsage.map(m => ({...m, accesses: 0, utilization: 0}))
    const bankUsage = interleaving.bankUsage.map(b => ({...b, accesses: 0, utilization: 0}))
    let totalSequentialTime = 0
    let totalInterleavedTime = 0
    
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
      }
      
      // Calculate module and bank based on interleaving type
      let module = 0
      let bank = 0
      const blockNumber = Math.floor(address / config.blockSize)
      
      switch (config.interleavingType) {
        case "bit":
          // Bit interleaving - use low-order bits
          module = blockNumber % config.modules
          bank = Math.floor(blockNumber / config.modules) % 8
          break
          
        case "word":
          // Word interleaving - use word-aligned bits
          module = Math.floor(blockNumber / 4) % config.modules
          bank = Math.floor(blockNumber / (4 * config.modules)) % 8
          break
          
        case "page":
          // Page interleaving - use page-aligned bits
          module = Math.floor(blockNumber / 64) % config.modules
          bank = Math.floor(blockNumber / (64 * config.modules)) % 8
          break
          
        case "bank":
          // Bank interleaving - use bank bits
          module = Math.floor(blockNumber / 16) % config.modules
          bank = Math.floor(blockNumber / (16 * config.modules)) % 8
          break
      }
      
      // Calculate access time (sequential vs interleaved)
      const sequentialTime = 100 // Base time for sequential access
      const interleavedTime = 25 + (module * 5) // Interleaved time with some variation
      
      totalSequentialTime += sequentialTime
      totalInterleavedTime += interleavedTime
      
      // Update module usage
      moduleUsage[module] = {
        ...moduleUsage[module],
        accesses: moduleUsage[module].accesses + 1,
        utilization: ((moduleUsage[module].accesses + 1) / (i + 1)) * 100
      }
      
      // Update bank usage
      const bankId = module * 8 + bank
      bankUsage[bankId] = {
        ...bankUsage[bankId],
        accesses: bankUsage[bankId].accesses + 1,
        utilization: ((bankUsage[bankId].accesses + 1) / (i + 1)) * 100
      }
      
      // Add to accesses
      setInterleaving(prev => ({
        ...prev,
        accesses: [...prev.accesses.slice(-19), {address, module, bank, latency: interleavedTime}],
        moduleUsage: [...moduleUsage],
        bankUsage: [...bankUsage]
      }))
      
      // Calculate bandwidth improvement
      const bandwidthImprovement = totalSequentialTime > 0 
        ? ((totalSequentialTime - totalInterleavedTime) / totalSequentialTime) * 100
        : 0
      
      // Calculate latency reduction
      const latencyReduction = totalSequentialTime > 0 
        ? ((sequentialTime - interleavedTime) / sequentialTime) * 100
        : 0
      
      setInterleaving(prev => ({
        ...prev,
        bandwidthImprovement: parseFloat(bandwidthImprovement.toFixed(2)),
        latencyReduction: parseFloat(latencyReduction.toFixed(2))
      }))
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          sequentialBandwidth: 1000 / (totalSequentialTime / (i + 1)),
          interleavedBandwidth: 1000 / (totalInterleavedTime / (i + 1)),
          moduleUsage: moduleUsage.map(m => m.utilization)
        })
        setHistory(newHistory)
      }
      
      // Add delay to visualize
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
    setInterleaving({
      accesses: [],
      moduleUsage: interleaving.moduleUsage.map(m => ({...m, accesses: 0, utilization: 0})),
      bankUsage: interleaving.bankUsage.map(b => ({...b, accesses: 0, utilization: 0})),
      bandwidthImprovement: 0,
      latencyReduction: 0
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

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Interleaving de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo el interleaving mejora el ancho de banda y reduce la latencia
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Repartir la carga"
        metaphor="Como repartir huevos en varios alveolos: evitas que uno solo se rompa por carga."
        idea="Interleaving por bits/palabras/páginas/bancos distribuye accesos y sube el throughput efectivo."
        bullets={["Dirección → módulo/banco", "Patrón de acceso", "Balance de módulos"]}
        board={{ title: "Intuición", content: "Más módulos activos ⇒ más paralelismo\nPero: collisiones con stride grande" }}
      />

      {guided && (
        <GuidedFlow
          title="De dirección a módulo"
          steps={[
            { title: "Bloque", content: "Calculamos el número de bloque a partir de la dirección." },
            { title: "Mapeo", content: "Según el tipo (bit/word/page/bank) seleccionamos módulo y banco." },
            { title: "Acceso", content: "Mostramos latencia/variación según reparto." },
            { title: "Medir", content: "Compara ancho de banda y balance de módulos." },
          ]}
        />
      )}

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
                    <span className="mr-2 text-lg">{interleaving.icon}</span>
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
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.accessPattern === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.accessPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.accessPattern === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "stride"})}
                >
                  Stride
                </Button>
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
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{currentInterleaving.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentInterleaving.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Mejora de Ancho de Banda</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {interleaving.bandwidthImprovement}%
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Reducción de Latencia</div>
                  <div className="text-2xl font-bold text-green-600">
                    {interleaving.latencyReduction}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Módulos Usados</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {interleaving.moduleUsage.filter(u => u.accesses > 0).length}/{config.modules}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Uso de Módulos</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {interleaving.moduleUsage.map(module => (
                    <Card key={module.moduleId}>
                      <CardHeader>
                        <CardTitle className="text-sm">Módulo {module.moduleId}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Accesos</div>
                            <div className="font-mono">{module.accesses}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Utilización</div>
                            <div className="font-mono">{module.utilization.toFixed(1)}%</div>
                            <Progress 
                              value={module.utilization} 
                              className="w-full mt-1" 
                            />
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Bancos</div>
                            <div className="flex flex-wrap gap-1">
                              {Array.from({ length: 8 }).map((_, bankId) => {
                                const bank = interleaving.bankUsage[module.moduleId * 8 + bankId]
                                return (
                                  <Badge 
                                    key={bankId}
                                    variant={bank.accesses > 0 ? "default" : "outline"}
                                    className="text-xs"
                                  >
                                    B{bankId}:{bank.accesses}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                        ${access.module === 0 
                          ? "bg-red-500 text-white" 
                          : access.module === 1 
                            ? "bg-green-500 text-white" 
                            : access.module === 2 
                              ? "bg-blue-500 text-white" 
                              : "bg-purple-500 text-white"}
                      `}
                      title={
                        `Dirección: 0x${access.address.toString(16).toUpperCase()}
` +
                        `Módulo: ${access.module}
` +
                        `Banco: ${access.bank}
` +
                        `Latencia: ${access.latency}ns`
                      }
                    >
                      M{access.module}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Patrón de Interleaving</div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-mono text-center">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const blockNumber = i
                      let module = 0
                      
                      switch (config.interleavingType) {
                        case "bit":
                          module = blockNumber % config.modules
                          break
                        case "word":
                          module = Math.floor(blockNumber / 4) % config.modules
                          break
                        case "page":
                          module = Math.floor(blockNumber / 64) % config.modules
                          break
                        case "bank":
                          module = Math.floor(blockNumber / 16) % config.modules
                          break
                      }
                      
                      return (
                        <span 
                          key={i}
                          className={`
                            inline-block w-8 h-8 rounded mx-1 text-center leading-8
                            ${module === 0 
                              ? "bg-red-500 text-white" 
                              : module === 1 
                                ? "bg-green-500 text-white" 
                                : module === 2 
                                  ? "bg-blue-500 text-white" 
                                  : "bg-purple-500 text-white"}
                          `}
                        >
                          {module}
                        </span>
                      )
                    })}
                  </div>
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
                    label={{ value: "Ancho de Banda", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Utilización (%)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sequentialBandwidth" 
                    stroke="#ef4444" 
                    activeDot={{ r: 8 }} 
                    name="Ancho de Banda Secuencial"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="interleavedBandwidth" 
                    stroke="#10b981" 
                    name="Ancho de Banda Interleaved"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="moduleUsage" 
                    stroke="#3b82f6" 
                    name="Utilización de Módulos"
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
