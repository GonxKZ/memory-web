import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function MemoryHierarchyExplorer() {
  const [config, setConfig] = useState({
    hierarchyType: "traditional" as "traditional" | "modern" | "heterogeneous" | "persistent",
    levels: 4,
    blockSize: 64, // bytes
    associativity: 8, // ways
    memorySize: 8192, // MB
    accessPattern: "sequential" as "sequential" | "random" | "stride",
    stride: 1,
    simulationSpeed: 300 // ms
  })
  
  const [hierarchy, setHierarchy] = useState({
    levels: [] as {
      id: number,
      name: string,
      type: "register" | "l1" | "l2" | "l3" | "dram" | "storage",
      size: number, // KB or MB
      latency: number, // cycles
      bandwidth: number, // GB/s
      associativity: number, // ways
      blockSize: number, // bytes
      hitRate: number, // percentage
      lines: {
        id: number,
        tag: number,
        data: number,
        valid: boolean,
        dirty: boolean,
        lastAccess: number
      }[]
    }[],
    statistics: {
      totalAccesses: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageLatency: 0,
      memoryBandwidth: 0,
      hitRates: [] as { level: number, rate: number }[]
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [guided, setGuided] = useState(false)

  // Initialize memory hierarchy
  useState(() => {
    // Create memory hierarchy levels
    const levels = []
    for (let i = 0; i < config.levels; i++) {
      // Determine level characteristics based on type
      let levelType: "register" | "l1" | "l2" | "l3" | "dram" | "storage"
      let levelName = ""
      let levelSize = 0
      let levelLatency = 0
      let levelBandwidth = 0
      let levelAssociativity = 0
      const levelBlockSize = config.blockSize
      
      switch (i) {
        case 0:
          levelType = "register"
          levelName = "Registros"
          levelSize = 1 // KB
          levelLatency = 1 // cycles
          levelBandwidth = 1000 // GB/s
          levelAssociativity = 1 // direct mapped
          break
        case 1:
          levelType = "l1"
          levelName = "L1 Caché"
          levelSize = 32 // KB
          levelLatency = 4 // cycles
          levelBandwidth = 500 // GB/s
          levelAssociativity = config.associativity
          break
        case 2:
          levelType = "l2"
          levelName = "L2 Caché"
          levelSize = 256 // KB
          levelLatency = 12 // cycles
          levelBandwidth = 200 // GB/s
          levelAssociativity = config.associativity
          break
        case 3:
          levelType = "l3"
          levelName = "L3 Caché"
          levelSize = 8192 // MB
          levelLatency = 40 // cycles
          levelBandwidth = 100 // GB/s
          levelAssociativity = config.associativity
          break
        case 4:
          levelType = "dram"
          levelName = "DRAM Principal"
          levelSize = config.memorySize // MB
          levelLatency = 200 // cycles
          levelBandwidth = 50 // GB/s
          levelAssociativity = 1 // direct mapped
          break
        case 5:
          levelType = "storage"
          levelName = "Almacenamiento"
          levelSize = config.memorySize * 100 // GB
          levelLatency = 1000000 // cycles
          levelBandwidth = 5 // GB/s
          levelAssociativity = 1 // direct mapped
          break
        default:
          levelType = "dram"
          levelName = "Memoria"
          levelSize = 1024 // MB
          levelLatency = 200 // cycles
          levelBandwidth = 50 // GB/s
          levelAssociativity = 1 // direct mapped
      }
      
      // Create cache lines (simplified - 64 lines per level)
      const lines = []
      for (let j = 0; j < 64; j++) {
        lines.push({
          id: j,
          tag: Math.floor(Math.random() * 1000),
          data: Math.floor(Math.random() * 1000),
          valid: Math.random() > 0.5,
          dirty: Math.random() > 0.8,
          lastAccess: Date.now() - Math.floor(Math.random() * 10000)
        })
      }
      
      levels.push({
        id: i,
        name: levelName,
        type: levelType,
        size: levelSize,
        latency: levelLatency,
        bandwidth: levelBandwidth,
        associativity: levelAssociativity,
        blockSize: levelBlockSize,
        hitRate: Math.floor(Math.random() * 100),
        lines
      })
    }
    
    // Initialize hierarchy state
    setHierarchy({
      levels,
      statistics: {
        totalAccesses: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageLatency: 0,
        memoryBandwidth: 0,
        hitRates: levels.map((level, index) => ({
          level: index,
          rate: level.hitRate
        }))
      }
    })
  })

  // Simulate memory hierarchy
  const simulateMemoryHierarchy = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset statistics
    setHierarchy(prev => ({
      ...prev,
      statistics: {
        totalAccesses: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageLatency: 0,
        memoryBandwidth: 0,
        hitRates: prev.levels.map((level, index) => ({
          level: index,
          rate: 0
        }))
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current hierarchy state (keep typing)
      const currentHierarchy = JSON.parse(JSON.stringify(hierarchy)) as typeof hierarchy
      const currentStatistics = { ...hierarchy.statistics }
      
      // Select a random level to access
      const levelId = Math.floor(Math.random() * config.levels)
      const level = currentHierarchy.levels[levelId]
      
      // Select a random cache line to access
      let lineIndex = Math.floor(Math.random() * level.lines.length)
      const line = level.lines[lineIndex]
      
      // Determine if it's a hit or miss based on hit rate
      const isHit = Math.random() * 100 < level.hitRate
      
      // Update statistics
      currentStatistics.totalAccesses++
      if (isHit) {
        currentStatistics.cacheHits++
        line.valid = true
        line.lastAccess = Date.now()
      } else {
        currentStatistics.cacheMisses++
        line.valid = true
        line.data = Math.floor(Math.random() * 1000)
        line.lastAccess = Date.now()
        
        // Update dirty bit for write operations
        if (Math.random() > 0.7) {
          line.dirty = true
        }
      }
      
      // Calculate average latency
      currentStatistics.averageLatency = 
        (currentStatistics.averageLatency * (currentStatistics.totalAccesses - 1) + level.latency) / 
        currentStatistics.totalAccesses
      
      // Calculate memory bandwidth usage
      currentStatistics.memoryBandwidth += level.bandwidth / 100
      
      // Update hit rates
      currentStatistics.hitRates = currentHierarchy.levels.map((lvl: any, idx: number) => ({
        level: idx,
        rate: lvl.hitRate
      }))
      
      // Apply access pattern
      switch (config.accessPattern) {
        case "sequential":
          // Sequential access pattern - good spatial locality
          lineIndex = (lineIndex + 1) % level.lines.length
          break
        case "random":
          // Random access pattern - poor locality
          lineIndex = Math.floor(Math.random() * level.lines.length)
          break
        case "stride":
          // Stride access pattern - depends on stride value
          lineIndex = (lineIndex + config.stride) % level.lines.length
          break
      }
      
      // Update state
      currentHierarchy.statistics = currentStatistics
      setHierarchy(currentHierarchy)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          levels: JSON.parse(JSON.stringify(currentHierarchy.levels)),
          statistics: {...currentStatistics}
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
    
    // Reset hierarchy state
    const levels = []
    for (let i = 0; i < config.levels; i++) {
      // Determine level characteristics based on type
      let levelType: "register" | "l1" | "l2" | "l3" | "dram" | "storage"
      let levelName = ""
      let levelSize = 0
      let levelLatency = 0
      let levelBandwidth = 0
      let levelAssociativity = 0
      const levelBlockSize = config.blockSize
      
      switch (i) {
        case 0:
          levelType = "register"
          levelName = "Registros"
          levelSize = 1 // KB
          levelLatency = 1 // cycles
          levelBandwidth = 1000 // GB/s
          levelAssociativity = 1 // direct mapped
          break
        case 1:
          levelType = "l1"
          levelName = "L1 Caché"
          levelSize = 32 // KB
          levelLatency = 4 // cycles
          levelBandwidth = 500 // GB/s
          levelAssociativity = config.associativity
          break
        case 2:
          levelType = "l2"
          levelName = "L2 Caché"
          levelSize = 256 // KB
          levelLatency = 12 // cycles
          levelBandwidth = 200 // GB/s
          levelAssociativity = config.associativity
          break
        case 3:
          levelType = "l3"
          levelName = "L3 Caché"
          levelSize = 8192 // MB
          levelLatency = 40 // cycles
          levelBandwidth = 100 // GB/s
          levelAssociativity = config.associativity
          break
        case 4:
          levelType = "dram"
          levelName = "DRAM Principal"
          levelSize = config.memorySize // MB
          levelLatency = 200 // cycles
          levelBandwidth = 50 // GB/s
          levelAssociativity = 1 // direct mapped
          break
        case 5:
          levelType = "storage"
          levelName = "Almacenamiento"
          levelSize = config.memorySize * 100 // GB
          levelLatency = 1000000 // cycles
          levelBandwidth = 5 // GB/s
          levelAssociativity = 1 // direct mapped
          break
        default:
          levelType = "dram"
          levelName = "Memoria"
          levelSize = 1024 // MB
          levelLatency = 200 // cycles
          levelBandwidth = 50 // GB/s
          levelAssociativity = 1 // direct mapped
      }
      
      // Create cache lines (simplified - 64 lines per level)
      const lines = []
      for (let j = 0; j < 64; j++) {
        lines.push({
          id: j,
          tag: Math.floor(Math.random() * 1000),
          data: Math.floor(Math.random() * 1000),
          valid: Math.random() > 0.5,
          dirty: Math.random() > 0.8,
          lastAccess: Date.now() - Math.floor(Math.random() * 10000)
        })
      }
      
      levels.push({
        id: i,
        name: levelName,
        type: levelType,
        size: levelSize,
        latency: levelLatency,
        bandwidth: levelBandwidth,
        associativity: levelAssociativity,
        blockSize: levelBlockSize,
        hitRate: Math.floor(Math.random() * 100),
        lines
      })
    }
    
    setHierarchy({
      levels,
      statistics: {
        totalAccesses: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageLatency: 0,
        memoryBandwidth: 0,
        hitRates: levels.map((level, index) => ({
          level: index,
          rate: level.hitRate
        }))
      }
    })
  }

  // Get hierarchy type information
  const getHierarchyTypeInfo = () => {
    switch (config.hierarchyType) {
      case "traditional":
        return {
          name: "Tradicional",
          description: "Jerarquía de memoria clásica con registros, cachés L1/L2/L3 y memoria principal",
          color: "#3b82f6",
          icon: "🏛️"
        }
      case "modern":
        return {
          name: "Moderna",
          description: "Jerarquía optimizada con tecnologías como HBM, NVDIMM y cachés más grandes",
          color: "#10b981",
          icon: "🚀"
        }
      case "heterogeneous":
        return {
          name: "Heterogénea",
          description: "Mezcla de diferentes tipos de memoria optimizados para diferentes usos",
          color: "#8b5cf6",
          icon: "🔧"
        }
      case "persistent":
        return {
          name: "Persistente",
          definition: "Jerarquía con memoria no volátil que mantiene datos después de apagar",
          color: "#f59e0b",
          icon: "💾"
        }
      default:
        return {
          name: "Tradicional",
          description: "Jerarquía de memoria clásica con registros, cachés L1/L2/L3 y memoria principal",
          color: "#3b82f6",
          icon: "🏛️"
        }
    }
  }

  const hierarchyTypeInfo = getHierarchyTypeInfo()

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Explorador de Jerarquía de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo los datos se mueven a través de diferentes niveles de memoria
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Idea clave"
        metaphor="Piensa en un ascensor: cuanto más lejos el piso, más espera. Las cachés son pisos cercanos con pocas plazas; DRAM es otro edificio; el disco es el trastero."
        idea="Un solo fallo grande (miss) puede dominar el tiempo medio. Mejorar localidad reduce misses y abarata el acceso efectivo."
        bullets={["Localidad temporal y espacial", "Tamaño de bloque vs tasa de fallos", "Latencias no lineales"]}
        board={{ title: "Coste efectivo", content: "AMAT ≈ HitTime + MissRate × MissPenalty\nEjemplo: 1ns + 5% × 50ns = 3.5ns" }}
        metrics={[{ label: "Niveles", value: config.levels }, { label: "Asociatividad", value: config.associativity }, { label: "Bloque (B)", value: config.blockSize }]}
      />

      {guided && (
        <GuidedFlow
          title="Recorrido de un acceso"
          steps={[
            { title: "Solicitud", content: "La CPU pide una dirección. Empezamos buscando en L1 (muy rápida, muy pequeña)." },
            { title: "L1 hit/miss", content: "Si acierta, listo. Si falla, vamos a L2 y sumamos latencia." },
            { title: "L2/L3", content: "Cachés más grandes y lentas; aún mejor que DRAM. Observa cómo la latencia crece por saltos." },
            { title: "DRAM", content: "Si también falla, pedimos a memoria principal. Aquí el coste domina si ocurre a menudo." },
            { title: "Conclusión", content: "Un pequeño cambio en localidad baja el MissRate y reduce mucho el AMAT." }
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
              <Label htmlFor="hierarchyType">Tipo de Jerarquía</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.hierarchyType === "traditional" ? "default" : "outline"}
                  onClick={() => setConfig({...config, hierarchyType: "traditional"})}
                >
                  Tradicional
                </Button>
                <Button
                  variant={config.hierarchyType === "modern" ? "default" : "outline"}
                  onClick={() => setConfig({...config, hierarchyType: "modern"})}
                >
                  Moderna
                </Button>
                <Button
                  variant={config.hierarchyType === "heterogeneous" ? "default" : "outline"}
                  onClick={() => setConfig({...config, hierarchyType: "heterogeneous"})}
                >
                  Heterogénea
                </Button>
                <Button
                  variant={config.hierarchyType === "persistent" ? "default" : "outline"}
                  onClick={() => setConfig({...config, hierarchyType: "persistent"})}
                >
                  Persistente
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="levels">Niveles de Jerarquía</Label>
              <Input
                id="levels"
                type="number"
                value={config.levels}
                onChange={(e) => setConfig({...config, levels: Number(e.target.value)})}
                min="2"
                max="6"
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
                max="512"
                step="16"
              />
            </div>

            <div>
              <Label htmlFor="associativity">Asociatividad</Label>
              <Input
                id="associativity"
                type="number"
                value={config.associativity}
                onChange={(e) => setConfig({...config, associativity: Number(e.target.value)})}
                min="1"
                max="16"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (MB)</Label>
              <Input
                id="memorySize"
                type="number"
                value={config.memorySize}
                onChange={(e) => setConfig({...config, memorySize: Number(e.target.value)})}
                min="1024"
                max="32768"
                step="1024"
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
                  max="16"
                  step="1"
                />
              </div>
            )}

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
                onClick={simulateMemoryHierarchy} 
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
              style={{ color: hierarchyTypeInfo.color }}
            >
              <span className="mr-2 text-2xl">{hierarchyTypeInfo.icon}</span>
              {hierarchyTypeInfo.name} - Jerarquía de Memoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {hierarchyTypeInfo.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Totales</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {hierarchy.statistics.totalAccesses}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Hits de Caché</div>
                  <div className="text-2xl font-bold text-green-600">
                    {hierarchy.statistics.cacheHits}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Misses de Caché</div>
                  <div className="text-2xl font-bold text-red-600">
                    {hierarchy.statistics.cacheMisses}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia Promedio</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {hierarchy.statistics.averageLatency.toFixed(2)} ciclos
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {hierarchy.statistics.memoryBandwidth.toFixed(2)} GB/s
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasas de Hit</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {hierarchy.statistics.hitRates.length}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Niveles de Jerarquía</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hierarchy.levels.map(level => (
                    <Card key={level.id}>
                      <CardHeader>
                        <CardTitle className="text-sm flex justify-between items-center">
                          <span>{level.name}</span>
                          <Badge variant="secondary">
                            {level.size >= 1024 ? `${level.size / 1024} MB` : `${level.size} KB`}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500 mb-1">Latencia</div>
                              <div className="font-semibold">{level.latency} ciclos</div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                              <div className="font-semibold">{level.bandwidth} GB/s</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Tasa de Hit: {level.hitRate}%</div>
                            <Progress value={level.hitRate} className="w-full" />
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Líneas de Caché ({level.lines.length})</div>
                            <div className="flex flex-wrap gap-1">
                              {level.lines.slice(0, 32).map(line => (
                                <div
                                  key={line.id}
                                  className={`
                                    w-4 h-4 rounded text-xs flex items-center justify-center
                                    ${line.valid 
                                      ? line.dirty 
                                        ? "bg-red-500 text-white" 
                                        : "bg-green-500 text-white"
                                      : "bg-gray-300"}
                                  `}
                                  title={`
                                    Línea: ${line.id}
                                    Tag: ${line.tag}
                                    Datos: ${line.data}
                                    Válida: ${line.valid ? "Sí" : "No"}
                                    Sucia: ${line.dirty ? "Sí" : "No"}
                                    Último acceso: ${new Date(line.lastAccess).toLocaleTimeString()}
                                  `}
                                >
                                  {line.valid ? (line.dirty ? "D" : "V") : "I"}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                <LineChart
                  data={history}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="step" 
                    label={{ value: "Paso", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Latencia (ciclos)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Ancho de Banda (GB/s)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="statistics.averageLatency" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Latencia Promedio"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="statistics.memoryBandwidth" 
                    stroke="#10b981" 
                    name="Ancho de Banda"
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
          <CardTitle>Tipos de Jerarquía de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Tradicional</div>
              <p className="text-sm text-blue-700 mb-3">
                Jerarquía clásica con registros, cachés L1/L2/L3 y memoria principal
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Estable:</span>
                    <span> Probada y confiable</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Compatible:</span>
                    <span> Soportada por la mayoría de arquitecturas</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <div>
                    <span className="font-semibold">Limitada:</span>
                    <span> No optimizada para nuevas tecnologías</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Moderna</div>
              <p className="text-sm text-green-700 mb-3">
                Optimizada con tecnologías como HBM, NVDIMM y cachés más grandes
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Rápida:</span>
                    <span> Mayor ancho de banda y menor latencia</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Eficiente:</span>
                    <span> Mejor uso de recursos de memoria</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <div>
                    <span className="font-semibold">Compleja:</span>
                    <span> Más niveles y tecnologías diferentes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Heterogénea</div>
              <p className="text-sm text-purple-700 mb-3">
                Mezcla de diferentes tipos de memoria optimizados para diferentes usos
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Flexible:</span>
                    <span> Adaptada a diferentes tipos de datos</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Optimizada:</span>
                    <span> Cada tipo de memoria para su propósito específico</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <div>
                    <span className="font-semibold">Difícil de gestionar:</span>
                    <span> Complejidad en la administración de memoria</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Persistente</div>
              <p className="text-sm text-yellow-700 mb-3">
                Jerarquía con memoria no volátil que mantiene datos después de apagar
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Segura:</span>
                    <span> Datos preservados tras apagado</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <div>
                    <span className="font-semibold">Rápida:</span>
                    <span> Elimina necesidad de cargar desde almacenamiento</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <div>
                    <span className="font-semibold">Costosa:</span>
                    <span> Tecnología más cara que DRAM tradicional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Principios de Jerarquía de Memoria:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Localidad:</strong> Datos accedidos recientemente o cercanos tienden a ser accedidos nuevamente
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Costo vs Velocidad:</strong> Memoria más rápida es más cara y escasa; más lenta es más barata y abundante
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Caching:</strong> Guardar copias de datos frecuentes en niveles más rápidos
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                <span>
                  <strong>Complejidad:</strong> Más niveles aumentan la complejidad de gestión y pueden impactar el rendimiento
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
