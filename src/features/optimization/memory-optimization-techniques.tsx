// @ts-nocheck
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function ControlFlowIntegrity() {
  const [config, setConfig] = useState({
    cfiType: "soft" as "soft" | "hard" | "hybrid",
    enforcementLevel: "full" as "full" | "partial" | "light",
    protectionScope: "functions" as "functions" | "loops" | "branches" | "all",
    attackScenario: "rop" as "rop" | "jop" | "ropJop" | "controlFlowHijacking",
    mitigationStrength: 0.8, // 0.0 - 1.0
    simulationSpeed: 300 // ms
  })
  
  const [cfi, setCFI] = useState({
    program: {
      functions: [] as {
        id: number,
        name: string,
        address: number,
        validTargets: number[],
        calledFrom: number[],
        returnAddresses: number[],
        instrumented: boolean,
        protected: boolean
      }[],
      branches: [] as {
        id: number,
        source: number,
        target: number,
        type: "direct" | "indirect" | "conditional" | "computed",
        valid: boolean,
        instrumented: boolean,
        protected: boolean,
        lastCheck: number
      }[],
      callStack: [] as {
        functionId: number,
        returnAddress: number,
        timestamp: number
      }[],
      controlFlowGraph: {
        nodes: [] as {
          id: number,
          type: "function" | "branch" | "loop" | "basicBlock",
          address: number,
          successors: number[],
          predecessors: number[]
        }[],
        edges: [] as {
          source: number,
          target: number,
          type: "call" | "return" | "branch" | "jump",
          valid: boolean,
          instrumented: boolean
        }[]
      }
    },
    attacks: {
      rop: {
        attempts: 0,
        successes: 0,
        blocked: 0,
        gadgetsUsed: [] as number[]
      },
      jop: {
        attempts: 0,
        successes: number,
        blocked: 0,
        dispatchersUsed: [] as number[]
      },
      controlFlowHijacking: {
        attempts: 0,
        successes: 0,
        blocked: 0,
        techniques: [] as string[]
      }
    },
    defenses: {
      shadowStack: false,
      controlFlowGuard: false,
      randomizedLayout: false,
      stackCanaries: false,
      aslr: true,
      nxBit: true
    },
    performance: {
      overhead: 0, // %
      executionTime: 0, // ms
      memoryUsage: 0, // KB
      checkFrequency: 0, // checks/sec
      falsePositives: 0,
      falseNegatives: 0
    },
    statistics: {
      totalChecks: 0,
      validTransitions: 0,
      invalidTransitions: 0,
      protectionEffectiveness: 0,
      attackSuccessRate: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Initialize CFI simulation
  useState(() => {
    // Create program functions
    const functions = []
    const functionNames = [
      "main", "init", "process", "validate", "encrypt", "decrypt", 
      "compress", "decompress", "network_send", "network_receive",
      "file_read", "file_write", "memory_allocate", "memory_free",
      "thread_create", "thread_join", "mutex_lock", "mutex_unlock"
    ]
    
    for (let i = 0; i < functionNames.length; i++) {
      // Generate valid targets for each function
      const validTargets = []
      const numTargets = Math.floor(Math.random() * 5) + 1 // 1-5 targets
      
      for (let j = 0; j < numTargets; j++) {
        const target = Math.floor(Math.random() * functionNames.length)
        if (target !== i && !validTargets.includes(target)) {
          validTargets.push(target)
        }
      }
      
      functions.push({
        id: i,
        name: functionNames[i],
        address: 0x400000 + i * 0x1000, // 4KB spacing
        validTargets,
        calledFrom: [],
        returnAddresses: [],
        instrumented: config.cfiType !== "soft" || Math.random() > 0.3, // 70% instrumented for soft CFI
        protected: config.enforcementLevel === "full" || 
                   (config.enforcementLevel === "partial" && Math.random() > 0.5) ||
                   (config.enforcementLevel === "light" && Math.random() > 0.8)
      })
    }
    
    // Create branches
    const branches = []
    const branchTypes: ("direct" | "indirect" | "conditional" | "computed")[] = 
      ["direct", "indirect", "conditional", "computed"]
    
    for (let i = 0; i < 50; i++) {
      const source = Math.floor(Math.random() * functions.length)
      const target = Math.floor(Math.random() * functions.length)
      const type = branchTypes[Math.floor(Math.random() * branchTypes.length)]
      
      branches.push({
        id: i,
        source: functions[source].address,
        target: functions[target].address,
        type,
        valid: source !== target && functions[source].validTargets.includes(target),
        instrumented: config.cfiType !== "soft" || Math.random() > 0.4, // 60% instrumented for soft CFI
        protected: config.enforcementLevel === "full" || 
                   (config.enforcementLevel === "partial" && Math.random() > 0.5) ||
                   (config.enforcementLevel === "light" && Math.random() > 0.8),
        lastCheck: 0
      })
    }
    
    // Create control flow graph
    const nodes = []
    const edges = []
    
    // Add function nodes
    for (const func of functions) {
      nodes.push({
        id: func.id,
        type: "function" as const,
        address: func.address,
        successors: func.validTargets,
        predecessors: func.calledFrom
      })
    }
    
    // Add branch nodes
    for (const branch of branches) {
      const branchId = nodes.length
      nodes.push({
        id: branchId,
        type: "branch" as const,
        address: branch.source,
        successors: [branch.target],
        predecessors: [branch.source]
      })
      
      edges.push({
        source: branch.source,
        target: branch.target,
        type: branch.type === "direct" ? "call" : 
              branch.type === "indirect" ? "jump" : 
              branch.type === "conditional" ? "branch" : "jump",
        valid: branch.valid,
        instrumented: branch.instrumented
      })
    }
    
    // Create basic blocks
    for (let i = 0; i < 20; i++) {
      const functionId = Math.floor(Math.random() * functions.length)
      const functionAddress = functions[functionId].address
      
      nodes.push({
        id: nodes.length,
        type: "basicBlock" as const,
        address: functionAddress + Math.floor(Math.random() * 0x1000),
        successors: [],
        predecessors: []
      })
    }
    
    // Create loops
    for (let i = 0; i < 10; i++) {
      const functionId = Math.floor(Math.random() * functions.length)
      const functionAddress = functions[functionId].address
      
      nodes.push({
        id: nodes.length,
        type: "loop" as const,
        address: functionAddress + Math.floor(Math.random() * 0x1000),
        successors: [],
        predecessors: []
      })
    }
    
    setCFI({
      program: {
        functions,
        branches,
        callStack: [],
        controlFlowGraph: {
          nodes,
          edges
        }
      },
      attacks: {
        rop: {
          attempts: 0,
          successes: 0,
          blocked: 0,
          gadgetsUsed: []
        },
        jop: {
          attempts: 0,
          successes: 0,
          blocked: 0,
          dispatchersUsed: []
        },
        controlFlowHijacking: {
          attempts: 0,
          successes: 0,
          blocked: 0,
          techniques: []
        }
      },
      defenses: {
        shadowStack: config.cfiType === "hard" || config.cfiType === "hybrid",
        controlFlowGuard: config.cfiType === "hard" || config.cfiType === "hybrid",
        randomizedLayout: true,
        stackCanaries: false,
        aslr: true,
        nxBit: true
      },
      performance: {
        overhead: 0,
        executionTime: 0,
        memoryUsage: 0,
        checkFrequency: 0,
        falsePositives: 0,
        falseNegatives: 0
      },
      statistics: {
        totalChecks: 0,
        validTransitions: 0,
        invalidTransitions: 0,
        protectionEffectiveness: 0,
        attackSuccessRate: 0
      }
    })
  })

  // Simulate CFI protection
  const simulateCFIProtection = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset statistics
    setCFI(prev => ({
      ...prev,
      statistics: {
        totalChecks: 0,
        validTransitions: 0,
        invalidTransitions: 0,
        protectionEffectiveness: 0,
        attackSuccessRate: 0
      },
      performance: {
        overhead: 0,
        executionTime: 0,
        memoryUsage: 0,
        checkFrequency: 0,
        falsePositives: 0,
        falseNegatives: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current CFI state
      const currentCFI = JSON.parse(JSON.stringify(cfi))
      const currentStatistics = { ...cfi.statistics }
      const currentPerformance = { ...cfi.performance }
      
      // Generate memory accesses based on pattern
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
      
      // Apply optimization techniques
      let totalLatency = 0
      let totalBandwidth = 0
      let cacheHits = 0
      let totalAccesses = 0
      
      for (const access of accesses) {
        totalAccesses++
        
        // Apply prefetching
        if (config.technique === "prefetching" && currentOptimization.techniques.prefetching.enabled) {
          // Simulate prefetch accuracy
          const prefetchAccuracy = 0.8 // 80% accuracy
          if (Math.random() < prefetchAccuracy) {
            // Prefetch hit - reduced latency
            totalLatency += 10 // ns with prefetch
            cacheHits++
            currentOptimization.techniques.prefetching.accuracy += 1
            currentOptimization.techniques.prefetching.coverage += 1
          } else {
            // Prefetch miss - normal latency plus prefetch overhead
            totalLatency += 100 // ns without prefetch
            currentOptimization.techniques.prefetching.falsePrefetches += 1
          }
          
          currentOptimization.techniques.prefetching.bandwidthSaved += 
            Math.floor(Math.random() * 1000) // bytes saved
        } 
        // Apply compression
        else if (config.technique === "compression" && currentOptimization.techniques.compression.enabled) {
          // Simulate compression benefits
          const compressionRatio = 0.6 // 40% space saving
          const compressedSize = Math.floor(config.blockSize * compressionRatio)
          totalLatency += 50 // ns with compression (includes decompression)
          cacheHits += 0.9 // 90% cache hit rate with compression
          currentOptimization.techniques.compression.ratio = compressionRatio
          currentOptimization.techniques.compression.spaceSaved += 
            config.blockSize - compressedSize
          currentOptimization.techniques.compression.compressionTime += 5 // ns
          currentOptimization.techniques.compression.decompressionTime += 10 // ns
        } 
        // Apply pooling
        else if (config.technique === "pooling" && currentOptimization.techniques.pooling.enabled) {
          // Simulate pooling benefits
          const reuseRate = 0.7 // 70% reuse rate
          if (Math.random() < reuseRate) {
            // Object reused from pool - no allocation time
            totalLatency += 5 // ns (much faster)
            cacheHits += 0.95 // 95% cache hit rate with pooling
            currentOptimization.techniques.pooling.objectsReused += 1
            currentOptimization.techniques.pooling.allocationTimeSaved += 50 // ns saved
          } else {
            // New allocation - normal time
            totalLatency += 50 // ns
            cacheHits += 0.8 // 80% cache hit rate
          }
          
          currentOptimization.techniques.pooling.poolSize = 
            Math.floor(config.memorySize * 0.2) // 20% of memory for pool
          currentOptimization.techniques.pooling.memoryOverhead = 
            Math.floor(currentOptimization.techniques.pooling.poolSize * 0.05) // 5% overhead
        } 
        // Apply streaming
        else if (config.technique === "streaming" && currentOptimization.techniques.streaming.enabled) {
          // Simulate streaming benefits
          const streamHitRate = 0.85 // 85% stream hit rate
          if (Math.random() < streamHitRate) {
            // Stream hit - data already in stream buffer
            totalLatency += 15 // ns with streaming
            cacheHits += 0.9 // 90% cache hit rate
            currentOptimization.techniques.streaming.streamHits += 1
          } else {
            // Stream miss - normal access
            totalLatency += 80 // ns without streaming
            currentOptimization.techniques.streaming.streamMisses += 1
          }
          
          currentOptimization.techniques.streaming.bandwidthUtilization = 0.75 // 75% utilization
          currentOptimization.techniques.streaming.prefetchAccuracy = streamHitRate
        } 
        // No optimization
        else {
          totalLatency += 100 // ns without optimization
          cacheHits += 0.7 // 70% cache hit rate
        }
        
        totalBandwidth += config.blockSize // bytes transferred
      }
      
      // Calculate performance metrics
      currentPerformance.accessLatency = totalLatency / totalAccesses
      currentPerformance.memoryBandwidth = totalBandwidth / (totalLatency / 1000000000) // bytes/sec
      currentPerformance.cacheHitRate = (cacheHits / totalAccesses) * 100
      currentPerformance.memoryFootprint = currentOptimization.memory.allocated.reduce(
        (sum, alloc) => sum + (alloc.optimized ? alloc.size * alloc.compressionRatio : alloc.size), 0
      )
      currentPerformance.optimizationBenefits = 
        ((config.memorySize * 1024 * 1024 - currentPerformance.memoryFootprint) / 
         (config.memorySize * 1024 * 1024)) * 100
      
      // Update technique stats
      if (config.technique === "prefetching") {
        currentOptimization.techniques.prefetching.accuracy /= totalAccesses
        currentOptimization.techniques.prefetching.coverage /= totalAccesses
      } else if (config.technique === "compression") {
        currentOptimization.techniques.compression.ratio = 
          currentOptimization.techniques.compression.spaceSaved / 
          (config.memorySize * 1024 * 1024)
      } else if (config.technique === "pooling") {
        currentOptimization.techniques.pooling.poolSize = 
          Math.floor(config.memorySize * 0.2) // 20% of memory for pool
        currentOptimization.techniques.pooling.memoryOverhead = 
          Math.floor(currentOptimization.techniques.pooling.poolSize * 0.05) // 5% overhead
      } else if (config.technique === "streaming") {
        currentOptimization.techniques.streaming.bandwidthUtilization = 0.75 // 75% utilization
        currentOptimization.techniques.streaming.prefetchAccuracy = 0.85 // 85% accuracy
      }
      
      // Update memory allocations
      const updatedAllocations = currentOptimization.memory.allocated.map(alloc => {
        // Apply optimization based on technique
        let optimized = false
        let compressionRatio = alloc.compressionRatio
        
        if (config.technique === "compression") {
          optimized = true
          compressionRatio *= 0.6 // Additional compression
        } else if (config.technique === "pooling") {
          optimized = Math.random() > 0.3 // 70% chance of being pooled
        } else if (config.technique === "streaming") {
          optimized = Math.random() > 0.2 // 80% chance of being streamed
        }
        
        return {
          ...alloc,
          optimized,
          compressionRatio,
          lastAccess: step
        }
      })
      
      currentOptimization.memory.allocated = updatedAllocations
      currentOptimization.memory.used = updatedAllocations.reduce((sum, alloc) => sum + alloc.size, 0)
      currentOptimization.memory.available = config.memorySize - currentOptimization.memory.used
      
      // Update state
      setOptimization(currentOptimization)
      setPerformance(currentPerformance)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          performance: {...currentPerformance},
          techniques: {...currentOptimization.techniques},
          memory: {
            used: currentOptimization.memory.used,
            available: currentOptimization.memory.available,
            footprint: currentPerformance.memoryFootprint
          }
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
    
    // Reset optimization state
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
      
      // Determine compression ratio based on data type
      let compressionRatio = 1.0
      if (allocationType === "array") {
        compressionRatio = 0.5 // Arrays compress well
      } else if (allocationType === "hash") {
        compressionRatio = 0.7 // Hashes compress moderately
      } else if (allocationType === "matrix") {
        compressionRatio = 0.6 // Matrices compress well
      } else {
        compressionRatio = 0.9 // Linked lists compress poorly
      }
      
      allocated.push({
        id: i,
        size: config.blockSize,
        type: allocationType,
        optimized: false,
        compressionRatio,
        accessPattern: config.accessPattern,
        lastAccess: 0
      })
    }
    
    setOptimization({
      memory: {
        total: config.memorySize,
        used: allocated.reduce((sum, alloc) => sum + alloc.size, 0),
        available: config.memorySize - allocated.reduce((sum, alloc) => sum + alloc.size, 0),
        allocated
      },
      techniques: {
        prefetching: {
          enabled: config.technique === "prefetching",
          accuracy: 0,
          coverage: 0,
          bandwidthSaved: 0,
          falsePrefetches: 0
        },
        compression: {
          enabled: config.technique === "compression",
          ratio: 0,
          spaceSaved: 0,
          compressionTime: 0,
          decompressionTime: 0
        },
        pooling: {
          enabled: config.technique === "pooling",
          objectsReused: 0,
          allocationTimeSaved: 0,
          memoryOverhead: 0,
          poolSize: 0
        },
        streaming: {
          enabled: config.technique === "streaming",
          streamHits: 0,
          streamMisses: 0,
          bandwidthUtilization: 0,
          prefetchAccuracy: 0
        }
      },
      performance: {
        accessLatency: 0,
        memoryBandwidth: 0,
        cacheHitRate: 0,
        memoryFootprint: 0,
        optimizationBenefits: 0
      }
    })
  }

  // Get optimization information
  const getOptimizationInfo = () => {
    switch (config.technique) {
      case "prefetching":
        return {
          name: "Prefetching",
          description: "Carga anticipada de datos basada en patrones de acceso predecibles",
          color: "#3b82f6",
          icon: "🔮"
        }
      case "compression":
        return {
          name: "Compresión",
          description: "Reduce el tamaño de los datos en memoria para ahorrar espacio",
          color: "#10b981",
          icon: "🗜️"
        }
      case "pooling":
        return {
          name: "Pooling",
          description: "Reutiliza objetos en lugar de crear/eliminar continuamente",
          color: "#8b5cf6",
          icon: "🏊"
        }
      case "streaming":
        return {
          name: "Streaming",
          description: "Transfiere datos en secuencias continuas para mejor rendimiento",
          color: "#f59e0b",
          icon: "🌊"
        }
      default:
        return {
          name: "Prefetching",
          description: "Carga anticipada de datos basada en patrones de acceso predecibles",
          color: "#3b82f6",
          icon: "🔮"
        }
    }
  }

  const optimizationInfo = getOptimizationInfo()

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Técnicas de Optimización de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo diferentes técnicas de optimización mejoran el rendimiento de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="technique">Técnica de Optimización</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.technique === "prefetching" ? "default" : "outline"}
                  onClick={() => setConfig({...config, technique: "prefetching"})}
                >
                  <span className="mr-1 text-lg">🔮</span>
                  Prefetching
                </Button>
                <Button
                  variant={config.technique === "compression" ? "default" : "outline"}
                  onClick={() => setConfig({...config, technique: "compression"})}
                >
                  <span className="mr-1 text-lg">🗜️</span>
                  Compresión
                </Button>
                <Button
                  variant={config.technique === "pooling" ? "default" : "outline"}
                  onClick={() => setConfig({...config, technique: "pooling"})}
                >
                  <span className="mr-1 text-lg">🏊</span>
                  Pooling
                </Button>
                <Button
                  variant={config.technique === "streaming" ? "default" : "outline"}
                  onClick={() => setConfig({...config, technique: "streaming"})}
                >
                  <span className="mr-1 text-lg">🌊</span>
                  Streaming
                </Button>
              </div>
            </div>

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
              <Label htmlFor="optimizationLevel">Nivel de Optimización</Label>
              <Input
                id="optimizationLevel"
                type="range"
                min="1"
                max="5"
                value={config.optimizationLevel}
                onChange={(e) => setConfig({...config, optimizationLevel: Number(e.target.value)})}
              />
              <div className="text-center">{config.optimizationLevel}</div>
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
                onClick={simulateMemoryOptimization} 
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
              style={{ color: optimizationInfo.color }}
            >
              <span className="mr-2 text-2xl">{optimizationInfo.icon}</span>
              {optimizationInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {optimizationInfo.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia de Acceso</div>
                  <div className="text-2xl font-bold text-green-600">
                    {optimization.performance.accessLatency.toFixed(1)} ns
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(optimization.performance.memoryBandwidth / 1024 / 1024).toFixed(1)} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Hit en Caché</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {optimization.performance.cacheHitRate.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Huella de Memoria</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(optimization.performance.memoryFootprint / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Técnicas de Optimización</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center text-blue-600">
                        <span className="mr-2 text-lg">🔮</span>
                        Prefetching
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Precisión</div>
                            <div className="font-semibold text-blue-600">
                              {(optimization.techniques.prefetching.accuracy * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Cobertura</div>
                            <div className="font-semibold text-blue-600">
                              {(optimization.techniques.prefetching.coverage * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Ancho de Banda Ahorrado</div>
                            <div className="font-semibold text-blue-600">
                              {(optimization.techniques.prefetching.bandwidthSaved / 1024).toFixed(1)} KB
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Prefetches Falsos</div>
                            <div className="font-semibold text-blue-600">
                              {optimization.techniques.prefetching.falsePrefetches}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Efectividad</span>
                            <span>
                              {optimization.techniques.prefetching.accuracy > 0.8 
                                ? "Alta" 
                                : optimization.techniques.prefetching.accuracy > 0.6 
                                  ? "Media" 
                                  : "Baja"}
                            </span>
                          </div>
                          <Progress 
                            value={optimization.techniques.prefetching.accuracy * 100} 
                            className="w-full" 
                            color={
                              optimization.techniques.prefetching.accuracy > 0.8 
                                ? "green" 
                                : optimization.techniques.prefetching.accuracy > 0.6 
                                  ? "yellow" 
                                  : "red"
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center text-green-600">
                        <span className="mr-2 text-lg">🗜️</span>
                        Compresión
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Ratio de Compresión</div>
                            <div className="font-semibold text-green-600">
                              {(optimization.techniques.compression.ratio * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Espacio Ahorrado</div>
                            <div className="font-semibold text-green-600">
                              {(optimization.techniques.compression.spaceSaved / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Tiempo de Compresión</div>
                            <div className="font-semibold text-green-600">
                              {optimization.techniques.compression.compressionTime} ns
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Tiempo de Descompresión</div>
                            <div className="font-semibold text-green-600">
                              {optimization.techniques.compression.decompressionTime} ns
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Eficiencia</span>
                            <span>
                              {optimization.techniques.compression.ratio > 0.5 
                                ? "Alta" 
                                : optimization.techniques.compression.ratio > 0.3 
                                  ? "Media" 
                                  : "Baja"}
                            </span>
                          </div>
                          <Progress 
                            value={optimization.techniques.compression.ratio * 100} 
                            className="w-full" 
                            color={
                              optimization.techniques.compression.ratio > 0.5 
                                ? "green" 
                                : optimization.techniques.compression.ratio > 0.3 
                                  ? "yellow" 
                                  : "red"
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Asignaciones de Memoria</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Uso de Memoria</div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usada: {optimization.memory.used.toLocaleString()} bytes</span>
                      <span>Disponible: {optimization.memory.available.toLocaleString()} bytes</span>
                    </div>
                    <Progress 
                      value={(optimization.memory.used / config.memorySize / 1024 / 1024) * 100} 
                      className="w-full" 
                      color={(optimization.memory.used / config.memorySize / 1024 / 1024) > 0.8 ? "red" : "blue"}
                    />
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Huella de Memoria</div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Original: {config.memorySize} MB</span>
                      <span>Optimizada: {(optimization.performance.memoryFootprint / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                    <Progress 
                      value={(optimization.performance.memoryFootprint / (config.memorySize * 1024 * 1024)) * 100} 
                      className="w-full" 
                      color={(optimization.performance.memoryFootprint / (config.memorySize * 1024 * 1024)) < 0.5 ? "green" : "yellow"}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">Asignaciones Recientes</div>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                    {optimization.memory.allocated.slice(-20).map(alloc => (
                      <div
                        key={alloc.id}
                        className={`
                          w-8 h-8 rounded flex items-center justify-center text-xs font-mono
                          ${alloc.optimized 
                            ? alloc.type === "array" 
                              ? "bg-green-500 text-white" 
                              : alloc.type === "hash" 
                                ? "bg-blue-500 text-white" 
                                : alloc.type === "matrix" 
                                  ? "bg-purple-500 text-white" 
                                  : "bg-red-500 text-white"
                            : "bg-gray-300"}
                        `}
                        title={`
                          ID: ${alloc.id}
                          Tipo: ${alloc.type}
                          Tamaño: ${alloc.size} bytes
                          Optimizada: ${alloc.optimized ? "Sí" : "No"}
                          Ratio de compresión: ${alloc.compressionRatio.toFixed(2)}
                          Patrón de acceso: ${alloc.accessPattern}
                          Último acceso: ${alloc.lastAccess}
                        `}
                      >
                        {alloc.optimized ? "O" : "N"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Técnicas de Optimización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Prefetching</div>
              <p className="text-sm text-blue-700 mb-3">
                Carga anticipada de datos basada en patrones de acceso predecibles.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Beneficio:</strong> Reduce latencia de acceso</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Mejora:</strong> Aprovecha patrones secuenciales</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Costo:</strong> Puede prefetchear innecesariamente</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Compresión</div>
              <p className="text-sm text-green-700 mb-3">
                Reduce el tamaño de los datos en memoria para ahorrar espacio.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Beneficio:</strong> Ahorra memoria física</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Mejora:</strong> Reduce ancho de banda de memoria</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Costo:</strong> Sobrecarga de compresión/descompresión</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Pooling</div>
              <p className="text-sm text-purple-700 mb-3">
                Reutiliza objetos en lugar de crear/eliminar continuamente.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Beneficio:</strong> Reduce tiempo de asignación</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Mejora:</strong> Mejora localidad de caché</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Costo:</strong> Complejidad adicional en gestión</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Streaming</div>
              <p className="text-sm text-yellow-700 mb-3">
                Transfiere datos en secuencias continuas para mejor rendimiento.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Beneficio:</strong> Mejora eficiencia de transferencia</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Mejora:</strong> Reduce sobrecarga de llamadas</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Costo:</strong> Requiere búferes adicionales</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Combinar técnicas:</strong> Usa múltiples técnicas para maximizar beneficios 
                  (ej. compresión + prefetching para datos comprimidos)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Perfilado:</strong> Mide el impacto real de cada técnica antes de aplicarla 
                  en producción
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Adaptativo:</strong> Ajusta técnicas basadas en patrones de acceso 
                  observados en tiempo real
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Balance:</strong> Considera el trade-off entre sobrecarga de optimización 
                  y beneficios obtenidos
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
