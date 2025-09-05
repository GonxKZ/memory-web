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
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

export default function MemoryPersistenceVisualization() {
  const [config, setConfig] = useState({
    storageType: "nvme" as "nvme" | "ssd" | "hdd" | "dram" | "nvdimm",
    blockSize: 4096, // 4KB
    ioSize: 65536, // 64KB
    queueDepth: 32,
    persistenceLevel: "powerLoss" as "powerLoss" | "crash" | "wearOut",
    simulationSpeed: 200 // ms
  })
  
  const [persistence, setPersistence] = useState({
    writeLatency: 0,
    readLatency: 0,
    endurance: 0,
    powerConsumption: 0,
    dataRetention: 0,
    wearLeveling: 0
  })
  
  const [operations, setOperations] = useState<{
    id: number,
    type: "read" | "write",
    latency: number,
    persistent: boolean,
    timestamp: number
  }[]>([])
  
  const [history, setHistory] = useState<{
    time: number,
    writeLatency: number,
    readLatency: number,
    endurance: number,
    powerConsumption: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate memory persistence
  const simulatePersistence = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setOperations([])
    
    // Reset persistence stats
    setPersistence({
      writeLatency: 0,
      readLatency: 0,
      endurance: 100,
      powerConsumption: 0,
      dataRetention: 100,
      wearLeveling: 0
    })
    
    const newHistory = []
    let totalWriteLatency = 0
    let totalReadLatency = 0
    let totalPowerConsumption = 0
    let currentEndurance = 100
    let totalWearLeveling = 0
    
    // Simulate operations over time
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate random operation
      const isWrite = Math.random() > 0.5
      const blockSize = config.blockSize
      const ioSize = config.ioSize
      
      // Calculate latency based on storage type
      let latency = 0
      let persistent = false
      let powerConsumption = 0
      let enduranceImpact = 0
      
      switch (config.storageType) {
        case "nvme":
          latency = isWrite ? 10 + Math.random() * 20 : 5 + Math.random() * 10
          persistent = true
          powerConsumption = isWrite ? 0.5 : 0.1
          enduranceImpact = isWrite ? 0.01 : 0
          break
          
        case "ssd":
          latency = isWrite ? 50 + Math.random() * 100 : 20 + Math.random() * 40
          persistent = true
          powerConsumption = isWrite ? 0.3 : 0.05
          enduranceImpact = isWrite ? 0.02 : 0
          break
          
        case "hdd":
          latency = isWrite ? 5000 + Math.random() * 5000 : 5000 + Math.random() * 5000
          persistent = true
          powerConsumption = isWrite ? 1.0 : 0.2
          enduranceImpact = isWrite ? 0.005 : 0
          break
          
        case "dram":
          latency = isWrite ? 50 + Math.random() * 100 : 20 + Math.random() * 40
          persistent = false // DRAM is volatile
          powerConsumption = isWrite ? 0.1 : 0.02
          enduranceImpact = 0
          break
          
        case "nvdimm":
          latency = isWrite ? 100 + Math.random() * 200 : 50 + Math.random() * 100
          persistent = true
          powerConsumption = isWrite ? 0.2 : 0.05
          enduranceImpact = isWrite ? 0.008 : 0
          break
      }
      
      // Update stats
      if (isWrite) {
        totalWriteLatency += latency
      } else {
        totalReadLatency += latency
      }
      
      totalPowerConsumption += powerConsumption
      currentEndurance = Math.max(0, currentEndurance - enduranceImpact)
      totalWearLeveling += Math.random() * 0.1
      
      // Add to operations
      setOperations(prev => [
        ...prev.slice(-19),
        {
          id: i,
          type: isWrite ? "write" : "read",
          latency: parseFloat(latency.toFixed(2)),
          persistent,
          timestamp: Date.now()
        }
      ])
      
      // Update persistence stats
      setPersistence({
        writeLatency: parseFloat((totalWriteLatency / (i + 1)).toFixed(2)),
        readLatency: parseFloat((totalReadLatency / (i + 1)).toFixed(2)),
        endurance: parseFloat(currentEndurance.toFixed(2)),
        powerConsumption: parseFloat(totalPowerConsumption.toFixed(2)),
        dataRetention: parseFloat((currentEndurance * 0.9).toFixed(2)), // Simplified model
        wearLeveling: parseFloat(totalWearLeveling.toFixed(2))
      })
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          writeLatency: parseFloat((totalWriteLatency / (i + 1)).toFixed(2)),
          readLatency: parseFloat((totalReadLatency / (i + 1)).toFixed(2)),
          endurance: parseFloat(currentEndurance.toFixed(2)),
          powerConsumption: parseFloat(totalPowerConsumption.toFixed(2))
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
    setOperations([])
    setPersistence({
      writeLatency: 0,
      readLatency: 0,
      endurance: 100,
      powerConsumption: 0,
      dataRetention: 100,
      wearLeveling: 0
    })
  }

  // Storage type information
  const storageTypeInfo = {
    "nvme": {
      name: "NVMe",
      description: "PCIe basado en almacenamiento flash con alto rendimiento",
      color: "#3b82f6",
      icon: "⚡"
    },
    "ssd": {
      name: "SSD",
      description: "Almacenamiento flash con interfaz SATA",
      color: "#10b981",
      icon: "💾"
    },
    "hdd": {
      name: "HDD",
      description: "Almacenamiento magnético con partes móviles",
      color: "#8b5cf6",
      icon: "💿"
    },
    "dram": {
      name: "DRAM",
      description: "Memoria de acceso aleatorio volátil",
      color: "#f59e0b",
      icon: "🧠"
    },
    "nvdimm": {
      name: "NVDIMM",
      description: "Memoria no volátil con persistencia de datos",
      color: "#ef4444",
      icon: "🔋"
    }
  }

  const currentStorageType = storageTypeInfo[config.storageType]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Persistencia de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo diferentes tecnologías de almacenamiento mantienen los datos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storageType">Tipo de Almacenamiento</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(storageTypeInfo).map(([key, storage]) => (
                  <Button
                    key={key}
                    variant={config.storageType === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, storageType: key as any})}
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <span className="text-xl mb-1">{storage.icon}</span>
                    <span className="text-xs">{storage.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="512"
                step="512"
              />
            </div>

            <div>
              <Label htmlFor="ioSize">Tamaño de IO (bytes)</Label>
              <Input
                id="ioSize"
                type="number"
                value={config.ioSize}
                onChange={(e) => setConfig({...config, ioSize: Number(e.target.value)})}
                min="4096"
                step="4096"
              />
            </div>

            <div>
              <Label htmlFor="queueDepth">Profundidad de Cola</Label>
              <Input
                id="queueDepth"
                type="range"
                min="1"
                max="128"
                value={config.queueDepth}
                onChange={(e) => setConfig({...config, queueDepth: Number(e.target.value)})}
              />
              <div className="text-center">{config.queueDepth}</div>
            </div>

            <div>
              <Label htmlFor="persistenceLevel">Nivel de Persistencia</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.persistenceLevel === "powerLoss" ? "default" : "outline"}
                  onClick={() => setConfig({...config, persistenceLevel: "powerLoss"})}
                >
                  Pérdida Energía
                </Button>
                <Button
                  variant={config.persistenceLevel === "crash" ? "default" : "outline"}
                  onClick={() => setConfig({...config, persistenceLevel: "crash"})}
                >
                  Crash
                </Button>
                <Button
                  variant={config.persistenceLevel === "wearOut" ? "default" : "outline"}
                  onClick={() => setConfig({...config, persistenceLevel: "wearOut"})}
                >
                  Desgaste
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
                onClick={simulatePersistence} 
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
              style={{ color: currentStorageType.color }}
            >
              <span className="mr-2 text-2xl">{currentStorageType.icon}</span>
              {currentStorageType.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {currentStorageType.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia de Escritura</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {persistence.writeLatency.toFixed(2)} μs
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia de Lectura</div>
                  <div className="text-2xl font-bold text-green-600">
                    {persistence.readLatency.toFixed(2)} μs
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Endurance</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {persistence.endurance.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Consumo Energía</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {persistence.powerConsumption.toFixed(2)} W
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Retención Datos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {persistence.dataRetention.toFixed(1)} años
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Wear Leveling</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {persistence.wearLeveling.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Operaciones Recientes</div>
                <div className="flex flex-wrap gap-1">
                  {operations.map((op, index) => (
                    <div
                      key={op.id}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${op.type === "write" 
                          ? op.persistent 
                            ? "bg-red-500 text-white" 
                            : "bg-orange-500 text-white"
                          : op.persistent 
                            ? "bg-green-500 text-white" 
                            : "bg-blue-500 text-white"}
                      `}
                      title={
                        `${op.type === "write" ? "Escritura" : "Lectura"} - ${op.latency}μs` +
                        `${op.persistent ? " - Persistente" : " - Volátil"}`
                      }
                    >
                      {op.type === "write" ? "W" : "R"}
                      {op.persistent ? "P" : "V"}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Nivel de Persistencia</div>
                <div className="grid grid-cols-3 gap-2">
                  <div 
                    className={`
                      p-2 rounded text-center
                      ${config.persistenceLevel === "powerLoss" 
                        ? "bg-red-500 text-white" 
                        : "bg-gray-200"}
                    `}
                  >
                    Pérdida Energía
                  </div>
                  <div 
                    className={`
                      p-2 rounded text-center
                      ${config.persistenceLevel === "crash" 
                        ? "bg-yellow-500 text-white" 
                        : "bg-gray-200"}
                    `}
                  >
                    Crash del Sistema
                  </div>
                  <div 
                    className={`
                      p-2 rounded text-center
                      ${config.persistenceLevel === "wearOut" 
                        ? "bg-purple-500 text-white" 
                        : "bg-gray-200"}
                    `}
                  >
                    Desgaste
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
                    label={{ value: "Latencia (μs)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "%", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="writeLatency" 
                    stroke="#ef4444" 
                    activeDot={{ r: 8 }} 
                    name="Latencia de Escritura"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="readLatency" 
                    stroke="#10b981" 
                    name="Latencia de Lectura"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="endurance" 
                    stroke="#8b5cf6" 
                    name="Endurance (%)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="powerConsumption" 
                    stroke="#f59e0b" 
                    name="Consumo Energía (W)"
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
          <CardTitle>Comparativa de Tecnologías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(storageTypeInfo).map(([key, storage]) => (
              <Card 
                key={key}
                className={`
                  transition-all duration-200
                  ${config.storageType === key 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:shadow-md"}
                `}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center"
                    style={{ color: storage.color }}
                  >
                    <span className="mr-2 text-xl">{storage.icon}</span>
                    {storage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 mb-3">
                      {storage.description}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Latencia</div>
                        <div className="font-semibold">
                          {key === "nvme" && "10-30 μs"}
                          {key === "ssd" && "50-150 μs"}
                          {key === "hdd" && "5-10 ms"}
                          {key === "dram" && "50-100 ns"}
                          {key === "nvdimm" && "100-300 ns"}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Persistente</div>
                        <div className="font-semibold">
                          {key === "dram" ? "No" : "Sí"}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Ventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "nvme" && "Alto ancho de banda"}
                            {key === "ssd" && "Sin partes móviles"}
                            {key === "hdd" && "Bajo costo por GB"}
                            {key === "dram" && "Muy baja latencia"}
                            {key === "nvdimm" && "Persistencia con baja latencia"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "nvme" && "Baja latencia"}
                            {key === "ssd" && "Fiabilidad mejorada"}
                            {key === "hdd" && "Alta capacidad"}
                            {key === "dram" && "Alto ancho de banda"}
                            {key === "nvdimm" && "Byte-addressable"}
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
                            {key === "nvme" && "Costo elevado"}
                            {key === "ssd" && "Endurance limitado"}
                            {key === "hdd" && "Latencia alta"}
                            {key === "dram" && "No persistente"}
                            {key === "nvdimm" && "Costo elevado"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "nvme" && "Complejidad"}
                            {key === "ssd" && "Degradación"}
                            {key === "hdd" && "Partes móviles"}
                            {key === "dram" && "Volatilidad"}
                            {key === "nvdimm" && "Capacidad limitada"}
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
            <div className="font-semibold mb-2">Consejos de Selección:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use NVMe para aplicaciones que requieren baja latencia</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use SSD para balance entre rendimiento y costo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use HDD para almacenamiento masivo de bajo costo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use NVDIMM para persistencia con rendimiento de DRAM</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
