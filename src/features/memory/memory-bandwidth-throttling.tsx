import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function MemoryBandwidthThrottling() {
  const [config, setConfig] = useState({
    throttlingType: "fixed" as "fixed" | "dynamic" | "adaptive" | "predictive",
    bandwidthLimit: 1024, // MB/s
    memorySize: 16384, // MB
    accessPattern: "sequential" as "sequential" | "random" | "stride" | "pointerChase",
    blockSize: 64, // bytes
    throttlingThreshold: 80, // %
    simulationSpeed: 200 // ms
  })
  
  const [throttling, setThrottling] = useState({
    memory: {
      total: 0,
      used: 0,
      available: 0,
      allocated: [] as {
        id: number,
        size: number,
        type: string,
        priority: number,
        throttled: boolean,
        bandwidthUsed: number,
        lastAccess: number
      }[]
    },
    throttling: {
      currentBandwidth: 0, // MB/s
      throttledBandwidth: 0, // MB/s
      throttleRate: 0, // %
      activeThrottles: 0,
      totalThrottles: 0,
      throttleEvents: [] as {
        id: number,
        processId: number,
        reason: string,
        timestamp: number,
        duration: number
      }[]
    },
    processes: [] as {
      id: number,
      name: string,
      memoryUsage: number,
      bandwidthUsage: number,
      priority: number,
      throttled: boolean,
      throttleHistory: {
        timestamp: number,
        rate: number,
        reason: string
      }[]
    }[],
    performance: {
      throughput: 0, // operations/sec
      latency: 0, // ns
      utilization: 0, // %
      fairness: 0, // 0-100
      qos: 0 // Quality of Service
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Initialize memory bandwidth throttling
  useState(() => {
    // Create memory allocations
    const allocated = []
    const numAllocations = Math.floor(config.memorySize / config.blockSize)
    
    for (let i = 0; i < Math.min(numAllocations, 1024); i++) {
      // Determine allocation type based on access pattern
      let allocationType: string
      if (config.accessPattern === "sequential") {
        allocationType = "array"
      } else if (config.accessPattern === "random") {
        allocationType = "hash"
      } else if (config.accessPattern === "stride") {
        allocationType = "matrix"
      } else {
        allocationType = "linked_list"
      }
      
      // Determine priority based on allocation type
      let priority = 1
      if (allocationType === "array") {
        priority = 3 // High priority
      } else if (allocationType === "hash") {
        priority = 2 // Medium priority
      } else if (allocationType === "matrix") {
        priority = 4 // Very high priority
      } else {
        priority = 1 // Low priority
      }
      
      allocated.push({
        id: i,
        size: config.blockSize,
        type: allocationType,
        priority,
        throttled: false,
        bandwidthUsed: 0,
        lastAccess: 0
      })
    }
    
    // Create processes
    const processes = []
    const processNames = [
      "Database Engine",
      "Web Server",
      "Image Processor",
      "Video Encoder",
      "Network Stack",
      "File System",
      "Graphics Renderer",
      "Audio Processor"
    ]
    
    for (let i = 0; i < Math.min(8, processNames.length); i++) {
      // Determine process priority
      let priority = 1
      if (processNames[i].includes("Database") || processNames[i].includes("Web")) {
        priority = 4 // Critical processes
      } else if (processNames[i].includes("Image") || processNames[i].includes("Video")) {
        priority = 3 // High priority
      } else if (processNames[i].includes("Network") || processNames[i].includes("File")) {
        priority = 2 // Medium priority
      } else {
        priority = 1 // Low priority
      }
      
      processes.push({
        id: i,
        name: processNames[i],
        memoryUsage: Math.floor(Math.random() * 1024), // MB
        bandwidthUsage: Math.floor(Math.random() * 512), // MB/s
        priority,
        throttled: false,
        throttleHistory: []
      })
    }
    
    setThrottling({
      memory: {
        total: config.memorySize,
        used: allocated.reduce((sum, alloc) => sum + alloc.size, 0),
        available: config.memorySize - allocated.reduce((sum, alloc) => sum + alloc.size, 0),
        allocated
      },
      throttling: {
        currentBandwidth: 0,
        throttledBandwidth: 0,
        throttleRate: 0,
        activeThrottles: 0,
        totalThrottles: 0,
        throttleEvents: []
      },
      processes,
      performance: {
        throughput: 0,
        latency: 0,
        utilization: 0,
        fairness: 0,
        qos: 0
      }
    })
  })

  // Simulate memory bandwidth throttling
  const simulateMemoryBandwidthThrottling = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset throttling stats
    setThrottling(prev => ({
      ...prev,
      throttling: {
        currentBandwidth: 0,
        throttledBandwidth: 0,
        throttleRate: 0,
        activeThrottles: 0,
        totalThrottles: 0,
        throttleEvents: []
      },
      performance: {
        throughput: 0,
        latency: 0,
        utilization: 0,
        fairness: 0,
        qos: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current throttling state
      const currentThrottling = JSON.parse(JSON.stringify(throttling))
      const currentPerformance = { ...throttling.performance }
      
      // Simulate memory accesses based on pattern
      const accesses = []
      const batchSize = 10
      
      for (let i = 0; i < batchSize; i++) {
        let address: number
        if (config.accessPattern === "sequential") {
          address = (step * batchSize + i) * config.blockSize
        } else if (config.accessPattern === "random") {
          address = Math.floor(Math.random() * config.memorySize * 1024 * 1024)
        } else if (config.accessPattern === "stride") {
          address = (step * batchSize + i) * config.blockSize * 2
        } else {
          // Pointer chase - follow linked list pattern
          address = (step * batchSize + i) * config.blockSize + Math.floor(Math.random() * 1024)
        }
        
        accesses.push({
          address,
          timestamp: step * batchSize + i,
          type: config.accessPattern
        })
      }
      
      // Calculate current bandwidth usage
      const currentBandwidth = accesses.length * config.blockSize / (config.simulationSpeed / 1000) // bytes/sec
      const currentBandwidthMB = currentBandwidth / (1024 * 1024) // MB/s
      
      // Apply throttling based on type
      let throttledBandwidth = currentBandwidthMB
      let throttleRate = 0
      let activeThrottles = 0
      let totalThrottles = currentThrottling.throttling.totalThrottles
      const throttleEvents = [...currentThrottling.throttling.throttleEvents]
      
      switch (config.throttlingType) {
        case "fixed": {
          // Fixed throttling - always limit to bandwidth limit
          if (currentBandwidthMB > config.bandwidthLimit) {
            throttledBandwidth = config.bandwidthLimit
            throttleRate = ((currentBandwidthMB - config.bandwidthLimit) / currentBandwidthMB) * 100
            activeThrottles = 1
            totalThrottles++
            
            // Add throttle event
            throttleEvents.push({
              id: throttleEvents.length,
              processId: Math.floor(Math.random() * currentThrottling.processes.length),
              reason: "Fixed limit exceeded",
              timestamp: step,
              duration: 1
            })
          }
          break
        }
        case "dynamic": {
          // Dynamic throttling - adjust based on utilization
          const utilization = (currentBandwidthMB / config.bandwidthLimit) * 100
          if (utilization > config.throttlingThreshold) {
            // Throttle proportional to excess usage
            const excess = utilization - config.throttlingThreshold
            throttleRate = excess
            throttledBandwidth = currentBandwidthMB * (1 - (excess / 100))
            activeThrottles = 1
            totalThrottles++
            
            // Add throttle event
            throttleEvents.push({
              id: throttleEvents.length,
              processId: Math.floor(Math.random() * currentThrottling.processes.length),
              reason: `Dynamic threshold (${config.throttlingThreshold}%) exceeded`,
              timestamp: step,
              duration: 1
            })
          }
          break
        }
        case "adaptive": {
          // Adaptive throttling - adjust based on historical usage
          const historicalAvg = currentThrottling.throttling.currentBandwidth > 0 
            ? (currentThrottling.throttling.currentBandwidth + currentBandwidthMB) / 2 
            : currentBandwidthMB
            
          if (currentBandwidthMB > historicalAvg * 1.5) { // 50% above average
            throttleRate = 25 // 25% throttle rate
            throttledBandwidth = currentBandwidthMB * 0.75
            activeThrottles = 1
            totalThrottles++
            
            // Add throttle event
            throttleEvents.push({
              id: throttleEvents.length,
              processId: Math.floor(Math.random() * currentThrottling.processes.length),
              reason: "Adaptive spike detection",
              timestamp: step,
              duration: 1
            })
          }
          break
        }
        case "predictive": {
          // Predictive throttling - anticipate future usage
          // Simple prediction based on trend
          const trend = currentBandwidthMB > currentThrottling.throttling.currentBandwidth 
            ? currentBandwidthMB - currentThrottling.throttling.currentBandwidth 
            : 0
            
          if (trend > 0 && (currentBandwidthMB + trend) > config.bandwidthLimit * 0.9) {
            // Predict approaching limit and throttle preemptively
            throttleRate = 20 // 20% throttle rate
            throttledBandwidth = currentBandwidthMB * 0.8
            activeThrottles = 1
            totalThrottles++
            
            // Add throttle event
            throttleEvents.push({
              id: throttleEvents.length,
              processId: Math.floor(Math.random() * currentThrottling.processes.length),
              reason: "Predictive throttling",
              timestamp: step,
              duration: 1
            })
          }
          break
        }
      }
      
      // Update process bandwidth usage
      const updatedProcesses = [...currentThrottling.processes]
      for (const process of updatedProcesses) {
        // Simulate process activity
        const activityFactor = Math.random() * 2 // 0-2x activity multiplier
        process.bandwidthUsage = Math.floor(process.bandwidthUsage * activityFactor)
        
        // Apply throttling to high-bandwidth processes
        if (process.bandwidthUsage > config.bandwidthLimit / updatedProcesses.length) {
          process.throttled = true
          process.bandwidthUsage = Math.floor(config.bandwidthLimit / updatedProcesses.length)
          
          // Add to throttle history
          process.throttleHistory.push({
            timestamp: step,
            rate: throttleRate,
            reason: "Process bandwidth limit"
          })
          
          // Keep only recent throttle events
          if (process.throttleHistory.length > 10) {
            process.throttleHistory = process.throttleHistory.slice(-10)
          }
        } else {
          process.throttled = false
        }
      }
      
      // Update memory allocations
      const updatedAllocations = [...currentThrottling.memory.allocated]
      for (const allocation of updatedAllocations) {
        // Simulate allocation access
        const accessChance = 0.1 // 10% chance of access per step
        if (Math.random() < accessChance) {
          allocation.lastAccess = step
          allocation.bandwidthUsed += config.blockSize
          
          // Apply throttling based on priority
          if (allocation.priority < 3 && throttleRate > 0) {
            allocation.throttled = true
            allocation.bandwidthUsed = Math.floor(allocation.bandwidthUsed * (1 - throttleRate / 100))
          } else {
            allocation.throttled = false
          }
        }
      }
      
      // Calculate performance metrics
      const throughput = accesses.length / (config.simulationSpeed / 1000) // operations/sec
      const latency = 100 + (throttleRate * 2) // Base 100ns + throttle impact
      const utilization = (throttledBandwidth / config.bandwidthLimit) * 100
      
      // Calculate fairness (standard deviation of process bandwidth usage)
      const avgBandwidth = updatedProcesses.reduce((sum, proc) => sum + proc.bandwidthUsage, 0) / updatedProcesses.length
      const variance = updatedProcesses.reduce((sum, proc) => sum + Math.pow(proc.bandwidthUsage - avgBandwidth, 2), 0) / updatedProcesses.length
      const stdDev = Math.sqrt(variance)
      const fairness = 100 - (stdDev / avgBandwidth) * 100 // Higher is better
      
      // Calculate QoS (Quality of Service)
      const criticalProcesses = updatedProcesses.filter(proc => proc.priority >= 3)
      const criticalBandwidth = criticalProcesses.reduce((sum, proc) => sum + proc.bandwidthUsage, 0)
      const totalBandwidth = updatedProcesses.reduce((sum, proc) => sum + proc.bandwidthUsage, 0)
      const qos = totalBandwidth > 0 ? (criticalBandwidth / totalBandwidth) * 100 : 0
      
      // Update throttling state
      currentThrottling.memory.allocated = updatedAllocations
      currentThrottling.processes = updatedProcesses
      currentThrottling.throttling = {
        currentBandwidth: parseFloat(currentBandwidthMB.toFixed(2)),
        throttledBandwidth: parseFloat(throttledBandwidth.toFixed(2)),
        throttleRate: parseFloat(throttleRate.toFixed(1)),
        activeThrottles,
        totalThrottles,
        throttleEvents: throttleEvents.slice(-20) // Keep last 20 events
      }
      
      // Update performance metrics
      currentPerformance.throughput = parseFloat(throughput.toFixed(0))
      currentPerformance.latency = parseFloat(latency.toFixed(1))
      currentPerformance.utilization = parseFloat(utilization.toFixed(1))
      currentPerformance.fairness = parseFloat(fairness.toFixed(1))
      currentPerformance.qos = parseFloat(qos.toFixed(1))
      
      // Update state
      setThrottling(prev => ({ ...currentThrottling, performance: { ...currentPerformance } }))
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          throttling: {...currentThrottling.throttling},
          performance: {...currentPerformance},
          processes: updatedProcesses.length,
          allocations: updatedAllocations.length
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
    
    // Reset throttling state
    const allocated = []
    const numAllocations = Math.floor(config.memorySize / config.blockSize)
    
    for (let i = 0; i < Math.min(numAllocations, 1024); i++) {
      // Determine allocation type based on access pattern
      let allocationType: string
      if (config.accessPattern === "sequential") {
        allocationType = "array"
      } else if (config.accessPattern === "random") {
        allocationType = "hash"
      } else if (config.accessPattern === "stride") {
        allocationType = "matrix"
      } else {
        allocationType = "linked_list"
      }
      
      // Determine priority based on allocation type
      let priority = 1
      if (allocationType === "array") {
        priority = 3 // High priority
      } else if (allocationType === "hash") {
        priority = 2 // Medium priority
      } else if (allocationType === "matrix") {
        priority = 4 // Very high priority
      } else {
        priority = 1 // Low priority
      }
      
      allocated.push({
        id: i,
        size: config.blockSize,
        type: allocationType,
        priority,
        throttled: false,
        bandwidthUsed: 0,
        lastAccess: 0
      })
    }
    
    // Create processes
    const processes = []
    const processNames = [
      "Database Engine",
      "Web Server",
      "Image Processor",
      "Video Encoder",
      "Network Stack",
      "File System",
      "Graphics Renderer",
      "Audio Processor"
    ]
    
    for (let i = 0; i < Math.min(8, processNames.length); i++) {
      // Determine process priority
      let priority = 1
      if (processNames[i].includes("Database") || processNames[i].includes("Web")) {
        priority = 4 // Critical processes
      } else if (processNames[i].includes("Image") || processNames[i].includes("Video")) {
        priority = 3 // High priority
      } else if (processNames[i].includes("Network") || processNames[i].includes("File")) {
        priority = 2 // Medium priority
      } else {
        priority = 1 // Low priority
      }
      
      processes.push({
        id: i,
        name: processNames[i],
        memoryUsage: Math.floor(Math.random() * 1024), // MB
        bandwidthUsage: Math.floor(Math.random() * 512), // MB/s
        priority,
        throttled: false,
        throttleHistory: []
      })
    }
    
    setThrottling({
      memory: {
        total: config.memorySize,
        used: allocated.reduce((sum, alloc) => sum + alloc.size, 0),
        available: config.memorySize - allocated.reduce((sum, alloc) => sum + alloc.size, 0),
        allocated
      },
      throttling: {
        currentBandwidth: 0,
        throttledBandwidth: 0,
        throttleRate: 0,
        activeThrottles: 0,
        totalThrottles: 0,
        throttleEvents: []
      },
      processes,
      performance: {
        throughput: 0,
        latency: 0,
        utilization: 0,
        fairness: 0,
        qos: 0
      }
    })
  }

  // Get throttling info
  const getThrottlingInfo = () => {
    switch (config.throttlingType) {
      case "fixed":
        return {
          name: "Throttling Fijo",
          description: "Limita el ancho de banda a un valor fijo independientemente del uso",
          color: "#3b82f6",
          icon: "📏"
        }
      case "dynamic":
        return {
          name: "Throttling Dinámico",
          description: "Ajusta el ancho de banda en tiempo real basado en el uso actual",
          color: "#10b981",
          icon: "🔄"
        }
      case "adaptive":
        return {
          name: "Throttling Adaptativo",
          description: "Ajusta el ancho de banda basado en patrones históricos de uso",
          color: "#8b5cf6",
          icon: "🧠"
        }
      case "predictive":
        return {
          name: "Throttling Predictivo",
          description: "Anticipa el uso futuro y ajusta el ancho de banda proactivamente",
          color: "#f59e0b",
          icon: "🔮"
        }
      default:
        return {
          name: "Throttling Fijo",
          description: "Limita el ancho de banda a un valor fijo independientemente del uso",
          color: "#3b82f6",
          icon: "📏"
        }
    }
  }

  const throttlingInfo = getThrottlingInfo()

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Throttling de Ancho de Banda de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo el throttling controla el uso del ancho de banda de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="throttlingType">Tipo de Throttling</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.throttlingType === "fixed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, throttlingType: "fixed"})}
                >
                  Fijo
                </Button>
                <Button
                  variant={config.throttlingType === "dynamic" ? "default" : "outline"}
                  onClick={() => setConfig({...config, throttlingType: "dynamic"})}
                >
                  Dinámico
                </Button>
                <Button
                  variant={config.throttlingType === "adaptive" ? "default" : "outline"}
                  onClick={() => setConfig({...config, throttlingType: "adaptive"})}
                >
                  Adaptativo
                </Button>
                <Button
                  variant={config.throttlingType === "predictive" ? "default" : "outline"}
                  onClick={() => setConfig({...config, throttlingType: "predictive"})}
                >
                  Predictivo
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="bandwidthLimit">Límite de Ancho de Banda (MB/s)</Label>
              <Input
                id="bandwidthLimit"
                type="number"
                value={config.bandwidthLimit}
                onChange={(e) => setConfig({...config, bandwidthLimit: Number(e.target.value)})}
                min="128"
                step="128"
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
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
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
                <Button
                  variant={config.accessPattern === "pointerChase" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "pointerChase"})}
                >
                  Pointer Chase
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="32"
                step="32"
              />
            </div>

            <div>
              <Label htmlFor="throttlingThreshold">Umbral de Throttling (%)</Label>
              <Input
                id="throttlingThreshold"
                type="range"
                min="50"
                max="95"
                value={config.throttlingThreshold}
                onChange={(e) => setConfig({...config, throttlingThreshold: Number(e.target.value)})}
              />
              <div className="text-center">{config.throttlingThreshold}%</div>
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
                onClick={simulateMemoryBandwidthThrottling} 
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
              style={{ color: throttlingInfo.color }}
            >
              <span className="mr-2 text-2xl">{throttlingInfo.icon}</span>
              {throttlingInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {throttlingInfo.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda Actual</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {throttling.throttling.currentBandwidth.toFixed(2)} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda Throttled</div>
                  <div className="text-2xl font-bold text-green-600">
                    {throttling.throttling.throttledBandwidth.toFixed(2)} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Throttling</div>
                  <div className="text-2xl font-bold text-red-600">
                    {throttling.throttling.throttleRate.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Throttles Activos</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {throttling.throttling.activeThrottles}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-blue-600">
                      <span className="mr-2">📊</span>
                      Procesos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="max-h-48 overflow-y-auto">
                        {throttling.processes.map(process => (
                          <Card key={process.id} className="mb-2">
                            <CardHeader>
                              <CardTitle className="text-xs flex justify-between items-center">
                                <span>{process.name}</span>
                                <Badge 
                                  variant={process.throttled ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {process.throttled ? "Throttled" : "Normal"}
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="p-2 bg-gray-50 rounded text-center">
                                    <div className="text-xs text-gray-500 mb-1">Uso de Memoria</div>
                                    <div className="font-semibold">{process.memoryUsage} MB</div>
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded text-center">
                                    <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                                    <div className="font-semibold">{process.bandwidthUsage} MB/s</div>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Prioridad</span>
                                    <span>{process.priority}</span>
                                  </div>
                                  <Progress 
                                    value={process.priority * 25} 
                                    className="w-full" 
                                    color={
                                      process.priority >= 4 ? "red" : 
                                      process.priority >= 3 ? "orange" : 
                                      process.priority >= 2 ? "yellow" : "green"
                                    }
                                  />
                                </div>
                                
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Historial de Throttling</div>
                                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-2 bg-gray-50 rounded">
                                    {process.throttleHistory.slice(-10).map((event, index) => (
                                      <div
                                        key={index}
                                        className={`
                                          w-6 h-6 rounded flex items-center justify-center text-xs
                                          ${event.rate > 50 
                                            ? "bg-red-500 text-white" 
                                            : event.rate > 25 
                                              ? "bg-orange-500 text-white" 
                                              : "bg-yellow-500 text-white"}
                                        `}
                                        title={`
                                          Razón: ${event.reason}
                                          Tasa: ${event.rate}%
                                          Tiempo: ${event.timestamp}
                                        `}
                                      >
                                        {Math.floor(event.rate / 10)}
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
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-green-600">
                      <span className="mr-2">💾</span>
                      Asignaciones de Memoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Total</div>
                          <div className="font-semibold">{throttling.memory.total.toLocaleString()} MB</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Usada</div>
                          <div className="font-semibold">{throttling.memory.used.toLocaleString()} MB</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{((throttling.memory.used / throttling.memory.total) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(throttling.memory.used / throttling.memory.total) * 100} 
                          className="w-full" 
                          color={(throttling.memory.used / throttling.memory.total) > 0.8 ? "red" : "green"}
                        />
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Asignaciones</div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                          {throttling.memory.allocated.slice(-50).map(alloc => (
                            <div
                              key={alloc.id}
                              className={`
                                w-6 h-6 rounded flex items-center justify-center text-xs
                                ${alloc.throttled 
                                  ? "bg-red-500 text-white" 
                                  : alloc.priority >= 4 
                                    ? "bg-purple-500 text-white" 
                                    : alloc.priority >= 3 
                                      ? "bg-blue-500 text-white" 
                                      : alloc.priority >= 2 
                                        ? "bg-green-500 text-white" 
                                        : "bg-gray-300"}
                              `}
                              title={`
                                ID: ${alloc.id}
                                Tipo: ${alloc.type}
                                Tamaño: ${alloc.size} bytes
                                Prioridad: ${alloc.priority}
                                Ancho de banda usado: ${alloc.bandwidthUsed} bytes
                                Último acceso: ${alloc.lastAccess}
                                Throttled: ${alloc.throttled ? "Sí" : "No"}
                              `}
                            >
                              {alloc.throttled ? "T" : alloc.priority}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold mb-2">Tipos de Asignación</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Arrays</div>
                            <div className="font-semibold">
                              {throttling.memory.allocated.filter(a => a.type === "array").length}
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Hashes</div>
                            <div className="font-semibold">
                              {throttling.memory.allocated.filter(a => a.type === "hash").length}
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Matrices</div>
                            <div className="font-semibold">
                              {throttling.memory.allocated.filter(a => a.type === "matrix").length}
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Listas Enlazadas</div>
                            <div className="font-semibold">
                              {throttling.memory.allocated.filter(a => a.type === "linked_list").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Eventos de Throttling</div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                  {throttling.throttling.throttleEvents.slice(-30).map(event => (
                    <div
                      key={event.id}
                      className={`
                        w-8 h-8 rounded flex items-center justify-center text-xs font-mono
                        ${event.reason.includes("Fixed") 
                          ? "bg-blue-500 text-white" 
                          : event.reason.includes("Dynamic") 
                            ? "bg-green-500 text-white" 
                            : event.reason.includes("Adaptive") 
                              ? "bg-purple-500 text-white" 
                              : "bg-yellow-500 text-white"}
                      `}
                      title={`
                        Evento: ${event.id}
                        Proceso: ${event.processId}
                        Razón: ${event.reason}
                        Tiempo: ${event.timestamp}
                        Duración: ${event.duration}
                      `}
                    >
                      {event.reason.includes("Fixed") && "F"}
                      {event.reason.includes("Dynamic") && "D"}
                      {event.reason.includes("Adaptive") && "A"}
                      {event.reason.includes("Predictive") && "P"}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Rendimiento</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Throughput</div>
                    <div className="text-2xl font-bold">
                      {throttling.performance.throughput.toLocaleString()} ops/s
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Latencia</div>
                    <div className="text-2xl font-bold">
                      {throttling.performance.latency.toFixed(1)} ns
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Utilización</div>
                    <div className="text-2xl font-bold">
                      {throttling.performance.utilization.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Calidad de Servicio</div>
                    <div className="text-2xl font-bold">
                      {throttling.performance.qos.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tipos de Throttling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Throttling Fijo</div>
              <p className="text-sm text-blue-700 mb-3">
                Aplica un límite constante al ancho de banda de memoria sin importar 
                el patrón de uso actual.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Simple:</strong> Fácil de implementar y entender</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Predictible:</strong> Límites constantes garantizados</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Ineficiente:</strong> No adapta a uso real</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Throttling Dinámico</div>
              <p className="text-sm text-green-700 mb-3">
                Ajusta el ancho de banda en tiempo real basado en el uso actual 
                y las condiciones del sistema.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Adaptativo:</strong> Responde a condiciones cambiantes</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Eficiente:</strong> Maximiza uso disponible</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Complejo:</strong> Requiere monitoreo continuo</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Throttling Adaptativo</div>
              <p className="text-sm text-purple-700 mb-3">
                Aprende de patrones históricos de uso para tomar decisiones 
                inteligentes sobre límites de ancho de banda.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Inteligente:</strong> Aprende de patrones pasados</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Proactivo:</strong> Anticipa necesidades futuras</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Lag:</strong> Requiere datos históricos</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Throttling Predictivo</div>
              <p className="text-sm text-yellow-700 mb-3">
                Usa modelos predictivos para anticipar picos de uso y ajustar 
                el ancho de banda antes de que ocurran.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Proactivo:</strong> Anticipa y previene congestión</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Optimizado:</strong> Minimiza impacto en rendimiento</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Complejidad:</strong> Requiere modelos sofisticados</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Técnicas de Throttling:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Mecanismos de Control</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Token Bucket:</strong> Sistema de créditos para control de tasa
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Leaky Bucket:</strong> Cola FIFO con tasa de salida constante
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Rate Limiting:</strong> Límites máximos por proceso/tipo
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Estrategias de Priorización</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>QoS:</strong> Calidad de servicio por tipo de proceso
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Fair Sharing:</strong> Distribución equitativa de recursos
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Priority-Based:</strong> Asignación basada en prioridad
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Optimización de Rendimiento</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Burst Allowance:</strong> Permite picos cortos
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Grace Period:</strong> Período de gracia antes de throttling
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Adaptive Thresholds:</strong> Umbrales que se ajustan automáticamente
                    </span>
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
