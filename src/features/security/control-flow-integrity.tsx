import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
        successes: 0,
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

  // Toggle defenses helper
  type DefenseKey = "shadowStack" | "controlFlowGuard" | "randomizedLayout" | "stackCanaries" | "aslr" | "nxBit"
  const toggleDefense = (key: DefenseKey) => {
    setCFI(prev => ({
      ...prev,
      defenses: {
        ...prev.defenses,
        [key]: !prev.defenses[key]
      }
    }))
  }

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
      const validTargets: number[] = []
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
    const edges: { source: number; target: number; type: "call" | "return" | "branch" | "jump"; valid: boolean; instrumented: boolean }[] = []
    
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
      const branchId: number = nodes.length
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
        type: (branch.type === "direct" ? "call" : 
              branch.type === "indirect" ? "jump" : 
              branch.type === "conditional" ? "branch" : "jump") as "call" | "return" | "branch" | "jump",
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
        stackCanaries: true,
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
      
      // Create a copy of current CFI state (keep typing)
      const currentCFI = JSON.parse(JSON.stringify(cfi)) as typeof cfi
      const currentStatistics = { ...cfi.statistics }
      const currentPerformance = { ...cfi.performance }
      
      // Simulate program execution
      const batchSize = 10
      for (let i = 0; i < batchSize; i++) {
        // Select random function to call
        const functionId = Math.floor(Math.random() * currentCFI.program.functions.length)
        const func = currentCFI.program.functions[functionId]
        
        if (!func) continue
        
        // Add to call stack
        const returnAddress = func.address + 0x100 // Simplified return address
        currentCFI.program.callStack.push({
          functionId,
          returnAddress,
          timestamp: step * batchSize + i
        })
        
        // Update function stats
        func.calledFrom.push(returnAddress)
        func.returnAddresses.push(returnAddress)
        
        // Simulate branch execution
        const branchesInFunction = currentCFI.program.branches.filter(
          branch => branch.source >= func.address && 
                   branch.source < func.address + 0x1000
        )
        
        for (const branch of branchesInFunction) {
          // Perform CFI check
          const isValidTransition = branch.valid && branch.protected
          const isInstrumented = branch.instrumented
          
          if (isInstrumented) {
            currentStatistics.totalChecks++
            
            if (isValidTransition) {
              currentStatistics.validTransitions++
              branch.lastCheck = step * batchSize + i
            } else {
              currentStatistics.invalidTransitions++
              branch.lastCheck = step * batchSize + i
              
              // Handle invalid transition based on CFI type
              if (config.cfiType === "soft") {
                // Soft CFI - may allow some invalid transitions
                if (Math.random() > config.mitigationStrength) {
                  currentPerformance.falseNegatives++
                }
              } else if (config.cfiType === "hard") {
                // Hard CFI - should block all invalid transitions
                if (Math.random() > 0.95) { // 5% false negatives due to complexity
                  currentPerformance.falseNegatives++
                }
              } else if (config.cfiType === "hybrid") {
                // Hybrid CFI - balance between soft and hard
                if (Math.random() > (config.mitigationStrength + 0.5) / 2) {
                  currentPerformance.falseNegatives++
                }
              }
            }
          }
        }
        
        // Simulate attack attempts
        const attackType = config.attackScenario
        let attackSuccess = false
        
        switch (attackType) {
          case "rop":
            // ROP attack - try to redirect execution to gadget
            if (Math.random() > 0.9) { // 10% chance of ROP attempt
              currentCFI.attacks.rop.attempts++
              
              // Try to bypass CFI
              const bypassSuccess = Math.random() > config.mitigationStrength
              if (bypassSuccess) {
                currentCFI.attacks.rop.successes++
                attackSuccess = true
                
                // Add to gadgets used
                const gadgetAddress = Math.floor(Math.random() * currentCFI.program.functions.length)
                currentCFI.attacks.rop.gadgetsUsed.push(gadgetAddress)
              } else {
                currentCFI.attacks.rop.blocked++
              }
            }
            break
            
          case "jop":
            // JOP attack - try to redirect execution through dispatcher
            if (Math.random() > 0.85) { // 15% chance of JOP attempt
              currentCFI.attacks.jop.attempts++
              
              // Try to bypass CFI
              const bypassSuccess = Math.random() > config.mitigationStrength * 0.8 // JOP is harder to defend
              if (bypassSuccess) {
                currentCFI.attacks.jop.successes++
                attackSuccess = true
                
                // Add to dispatchers used
                const dispatcherAddress = Math.floor(Math.random() * currentCFI.program.functions.length)
                currentCFI.attacks.jop.dispatchersUsed.push(dispatcherAddress)
              } else {
                currentCFI.attacks.jop.blocked++
              }
            }
            break
            
          case "ropJop":
            // Combined ROP/JOP attack
            if (Math.random() > 0.8) { // 20% chance of combined attack
              // ROP component
              if (Math.random() > 0.5) {
                currentCFI.attacks.rop.attempts++
                const bypassSuccess = Math.random() > config.mitigationStrength
                if (bypassSuccess) {
                  currentCFI.attacks.rop.successes++
                  attackSuccess = true
                  const gadgetAddress = Math.floor(Math.random() * currentCFI.program.functions.length)
                  currentCFI.attacks.rop.gadgetsUsed.push(gadgetAddress)
                } else {
                  currentCFI.attacks.rop.blocked++
                }
              }
              
              // JOP component
              if (Math.random() > 0.5) {
                currentCFI.attacks.jop.attempts++
                const bypassSuccess = Math.random() > config.mitigationStrength * 0.8
                if (bypassSuccess) {
                  currentCFI.attacks.jop.successes++
                  attackSuccess = true
                  const dispatcherAddress = Math.floor(Math.random() * currentCFI.program.functions.length)
                  currentCFI.attacks.jop.dispatchersUsed.push(dispatcherAddress)
                } else {
                  currentCFI.attacks.jop.blocked++
                }
              }
            }
            break
            
          case "controlFlowHijacking":
            // Generic control flow hijacking
            if (Math.random() > 0.75) { // 25% chance of hijacking attempt
              currentCFI.attacks.controlFlowHijacking.attempts++
              
              // Try to bypass CFI
              const bypassSuccess = Math.random() > config.mitigationStrength * 0.9 // Generally easier to defend
              if (bypassSuccess) {
                currentCFI.attacks.controlFlowHijacking.successes++
                attackSuccess = true
                
                // Add technique used
                const techniques = ["stackSmashing", "heapOverflow", "formatString", "integerOverflow"]
                const technique = techniques[Math.floor(Math.random() * techniques.length)]
                currentCFI.attacks.controlFlowHijacking.techniques.push(technique)
              } else {
                currentCFI.attacks.controlFlowHijacking.blocked++
              }
            }
            break
        }
        
        // Apply defenses
        if (currentCFI.defenses.shadowStack) {
          // Shadow stack validation
          const shadowStackValid = Math.random() > 0.05 // 5% false positives
          if (!shadowStackValid) {
            currentPerformance.falsePositives++
          }
        }
        
        if (currentCFI.defenses.controlFlowGuard) {
          // CFG validation
          const cfgValid = Math.random() > 0.02 // 2% false positives
          if (!cfgValid) {
            currentPerformance.falsePositives++
          }
        }
        
        if (currentCFI.defenses.randomizedLayout) {
          // ASLR makes attacks harder
          if (attackSuccess) {
            // Reduce attack success rate due to ASLR
            attackSuccess = Math.random() > 0.3 // 30% chance attack still succeeds with ASLR
          }
        }
        
        if (currentCFI.defenses.stackCanaries) {
          // Stack canaries detect buffer overflows
          const canaryValid = Math.random() > 0.1 // 10% false negatives
          if (!canaryValid && attackType === "controlFlowHijacking") {
            // Canary detected overflow, prevent attack
            attackSuccess = false
            currentCFI.attacks.controlFlowHijacking.blocked++
            currentCFI.attacks.controlFlowHijacking.successes = Math.max(0, currentCFI.attacks.controlFlowHijacking.successes - 1)
          }
        }
        
        // Update performance metrics
        currentPerformance.overhead = (1 - config.mitigationStrength) * 30 // Max 30% overhead
        currentPerformance.executionTime = 100 + (currentPerformance.overhead * 10) // Base 100ms + overhead
        currentPerformance.memoryUsage = 1024 + (currentPerformance.overhead * 50) // Base 1MB + overhead
        currentPerformance.checkFrequency = currentStatistics.totalChecks / ((step + 1) * batchSize) * 1000 // checks/sec
      }
      
      // Update statistics
      const totalAttacks = 
        currentCFI.attacks.rop.attempts + 
        currentCFI.attacks.jop.attempts + 
        currentCFI.attacks.controlFlowHijacking.attempts
      
      const successfulAttacks = 
        currentCFI.attacks.rop.successes + 
        currentCFI.attacks.jop.successes + 
        currentCFI.attacks.controlFlowHijacking.successes
      
      currentStatistics.protectionEffectiveness = totalAttacks > 0 
        ? ((totalAttacks - successfulAttacks) / totalAttacks) * 100 
        : 100
      
      currentStatistics.attackSuccessRate = totalAttacks > 0 
        ? (successfulAttacks / totalAttacks) * 100 
        : 0
      
      // Update CFI state
      currentCFI.statistics = currentStatistics
      currentCFI.performance = currentPerformance
      setCFI(currentCFI)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          statistics: {...currentStatistics},
          performance: {...currentPerformance},
          attacks: {
            rop: {...currentCFI.attacks.rop},
            jop: {...currentCFI.attacks.jop},
            controlFlowHijacking: {...currentCFI.attacks.controlFlowHijacking}
          },
          defenses: {...currentCFI.defenses}
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
    
    // Reset CFI state
    const functions = []
    const functionNames = [
      "main", "init", "process", "validate", "encrypt", "decrypt", 
      "compress", "decompress", "network_send", "network_receive",
      "file_read", "file_write", "memory_allocate", "memory_free",
      "thread_create", "thread_join", "mutex_lock", "mutex_unlock"
    ]
    
    for (let i = 0; i < functionNames.length; i++) {
      const validTargets: number[] = []
      const numTargets = Math.floor(Math.random() * 5) + 1
      
      for (let j = 0; j < numTargets; j++) {
        const target = Math.floor(Math.random() * functionNames.length)
        if (target !== i && !validTargets.includes(target)) {
          validTargets.push(target)
        }
      }
      
      functions.push({
        id: i,
        name: functionNames[i],
        address: 0x400000 + i * 0x1000,
        validTargets,
        calledFrom: [],
        returnAddresses: [],
        instrumented: config.cfiType !== "soft" || Math.random() > 0.3,
        protected: config.enforcementLevel === "full" || 
                   (config.enforcementLevel === "partial" && Math.random() > 0.5) ||
                   (config.enforcementLevel === "light" && Math.random() > 0.8)
      })
    }
    
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
        instrumented: config.cfiType !== "soft" || Math.random() > 0.4,
        protected: config.enforcementLevel === "full" || 
                   (config.enforcementLevel === "partial" && Math.random() > 0.5) ||
                   (config.enforcementLevel === "light" && Math.random() > 0.8),
        lastCheck: 0
      })
    }
    
    const nodes = []
    const edges: { source: number; target: number; type: "call" | "return" | "branch" | "jump"; valid: boolean; instrumented: boolean }[] = []
    
    for (const func of functions) {
      nodes.push({
        id: func.id,
        type: "function" as const,
        address: func.address,
        successors: func.validTargets,
        predecessors: func.calledFrom
      })
    }
    
    for (const branch of branches) {
      const branchId: number = nodes.length
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
        type: (branch.type === "direct" ? "call" : 
              branch.type === "indirect" ? "jump" : 
              branch.type === "conditional" ? "branch" : "jump") as "call" | "return" | "branch" | "jump",
        valid: branch.valid,
        instrumented: branch.instrumented
      })
    }
    
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
        stackCanaries: true,
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
  }

  // Get CFI information
  const getCFIInfo = () => {
    switch (config.cfiType) {
      case "soft":
        return {
          name: "CFI Suave",
          description: "Protección basada en análisis estático y runtime checks ligeros",
          color: "#3b82f6",
          icon: "🛡️"
        }
      case "hard":
        return {
          name: "CFI Dura",
          description: "Protección basada en hardware y runtime checks exhaustivos",
          color: "#10b981",
          icon: "🔒"
        }
      case "hybrid":
        return {
          name: "CFI Híbrida",
          description: "Combinación de técnicas suaves y duras para balance óptimo",
          color: "#8b5cf6",
          icon: "🔄"
        }
      default:
        return {
          name: "CFI Suave",
          description: "Protección basada en análisis estático y runtime checks ligeros",
          color: "#3b82f6",
          icon: "🛡️"
        }
    }
  }

  const cfiInfo = getCFIInfo()

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Integridad del Flujo de Control (CFI)</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo CFI protege contra ataques de redirección de flujo de control
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cfiType">Tipo de CFI</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.cfiType === "soft" ? "default" : "outline"}
                  onClick={() => setConfig({...config, cfiType: "soft"})}
                >
                  Suave
                </Button>
                <Button
                  variant={config.cfiType === "hard" ? "default" : "outline"}
                  onClick={() => setConfig({...config, cfiType: "hard"})}
                >
                  Dura
                </Button>
                <Button
                  variant={config.cfiType === "hybrid" ? "default" : "outline"}
                  onClick={() => setConfig({...config, cfiType: "hybrid"})}
                >
                  Híbrida
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="enforcementLevel">Nivel de Cumplimiento</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.enforcementLevel === "full" ? "default" : "outline"}
                  onClick={() => setConfig({...config, enforcementLevel: "full"})}
                >
                  Completo
                </Button>
                <Button
                  variant={config.enforcementLevel === "partial" ? "default" : "outline"}
                  onClick={() => setConfig({...config, enforcementLevel: "partial"})}
                >
                  Parcial
                </Button>
                <Button
                  variant={config.enforcementLevel === "light" ? "default" : "outline"}
                  onClick={() => setConfig({...config, enforcementLevel: "light"})}
                >
                  Ligero
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="protectionScope">Ámbito de Protección</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.protectionScope === "functions" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionScope: "functions"})}
                >
                  Funciones
                </Button>
                <Button
                  variant={config.protectionScope === "loops" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionScope: "loops"})}
                >
                  Bucles
                </Button>
                <Button
                  variant={config.protectionScope === "branches" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionScope: "branches"})}
                >
                  Ramas
                </Button>
                <Button
                  variant={config.protectionScope === "all" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionScope: "all"})}
                >
                  Todo
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="attackScenario">Escenario de Ataque</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.attackScenario === "rop" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackScenario: "rop"})}
                >
                  ROP
                </Button>
                <Button
                  variant={config.attackScenario === "jop" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackScenario: "jop"})}
                >
                  JOP
                </Button>
                <Button
                  variant={config.attackScenario === "ropJop" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackScenario: "ropJop"})}
                >
                  ROP+JOP
                </Button>
                <Button
                  variant={config.attackScenario === "controlFlowHijacking" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackScenario: "controlFlowHijacking"})}
                >
                  Hijacking
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="mitigationStrength">Fuerza de Mitigación</Label>
              <Input
                id="mitigationStrength"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.mitigationStrength}
                onChange={(e) => setConfig({...config, mitigationStrength: Number(e.target.value)})}
              />
              <div className="text-center">{(config.mitigationStrength * 100).toFixed(0)}%</div>
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
                onClick={simulateCFIProtection} 
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
              style={{ color: cfiInfo.color }}
            >
              <span className="mr-2 text-2xl">{cfiInfo.icon}</span>
              {cfiInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {cfiInfo.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Chequeos Totales</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {cfi.statistics.totalChecks.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Transiciones Válidas</div>
                  <div className="text-2xl font-bold text-green-600">
                    {cfi.statistics.validTransitions.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Transiciones Inválidas</div>
                  <div className="text-2xl font-bold text-red-600">
                    {cfi.statistics.invalidTransitions.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Efectividad</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {cfi.statistics.protectionEffectiveness.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-blue-600">
                      <span className="mr-2">🧩</span>
                      Ataques ROP
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Intentos</div>
                          <div className="font-semibold">{cfi.attacks.rop.attempts}</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Bloqueados</div>
                          <div className="font-semibold text-green-600">{cfi.attacks.rop.blocked}</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Exitosos</div>
                          <div className="font-semibold text-red-600">{cfi.attacks.rop.successes}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tasa de Bloqueo</span>
                          <span>
                            {cfi.attacks.rop.attempts > 0 
                              ? ((cfi.attacks.rop.blocked / cfi.attacks.rop.attempts) * 100).toFixed(1) 
                              : "0.0"}%
                          </span>
                        </div>
                        <Progress 
                          value={cfi.attacks.rop.attempts > 0 
                            ? (cfi.attacks.rop.blocked / cfi.attacks.rop.attempts) * 100 
                            : 0} 
                          className="w-full" 
                          color={cfi.attacks.rop.blocked / (cfi.attacks.rop.attempts || 1) > 0.9 ? "green" : "red"}
                        />
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Gadgets Utilizados (muestra)</div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                          {cfi.attacks.rop.gadgetsUsed.slice(-20).map((gadget, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center text-xs"
                              title={`Gadget utilizado: Dirección 0x${(0x400000 + gadget * 0x1000).toString(16).toUpperCase()}`}
                            >
                              {gadget % 10}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-green-600">
                      <span className="mr-2">🔀</span>
                      Ataques JOP
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Intentos</div>
                          <div className="font-semibold">{cfi.attacks.jop.attempts}</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Bloqueados</div>
                          <div className="font-semibold text-green-600">{cfi.attacks.jop.blocked}</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Exitosos</div>
                          <div className="font-semibold text-red-600">{cfi.attacks.jop.successes}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tasa de Bloqueo</span>
                          <span>
                            {cfi.attacks.jop.attempts > 0 
                              ? ((cfi.attacks.jop.blocked / cfi.attacks.jop.attempts) * 100).toFixed(1) 
                              : "0.0"}%
                          </span>
                        </div>
                        <Progress 
                          value={cfi.attacks.jop.attempts > 0 
                            ? (cfi.attacks.jop.blocked / cfi.attacks.jop.attempts) * 100 
                            : 0} 
                          className="w-full" 
                          color={cfi.attacks.jop.blocked / (cfi.attacks.jop.attempts || 1) > 0.8 ? "green" : "red"}
                        />
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Dispatchers Utilizados (muestra)</div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                          {cfi.attacks.jop.dispatchersUsed.slice(-20).map((dispatcher, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center text-xs"
                              title={`Dispatcher utilizado: Dirección 0x${(0x400000 + dispatcher * 0x1000).toString(16).toUpperCase()}`}
                            >
                              {dispatcher % 10}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-purple-600">
                      <span className="mr-2">🔐</span>
                      Defensas Activas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={cfi.defenses.shadowStack ? "default" : "outline"}
                          onClick={() => toggleDefense("shadowStack")}
                          className={cfi.defenses.shadowStack ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          Shadow Stack {cfi.defenses.shadowStack && "✓"}
                        </Button>
                        <Button
                          variant={cfi.defenses.controlFlowGuard ? "default" : "outline"}
                          onClick={() => toggleDefense("controlFlowGuard")}
                          className={cfi.defenses.controlFlowGuard ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          CFG {cfi.defenses.controlFlowGuard && "✓"}
                        </Button>
                        <Button
                          variant={cfi.defenses.randomizedLayout ? "default" : "outline"}
                          onClick={() => toggleDefense("randomizedLayout")}
                          className={cfi.defenses.randomizedLayout ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          Layout Aleatorio {cfi.defenses.randomizedLayout && "✓"}
                        </Button>
                        <Button
                          variant={cfi.defenses.stackCanaries ? "default" : "outline"}
                          onClick={() => toggleDefense("stackCanaries")}
                          className={cfi.defenses.stackCanaries ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          Canarios {cfi.defenses.stackCanaries && "✓"}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={cfi.defenses.aslr ? "default" : "outline"}
                          onClick={() => toggleDefense("aslr")}
                          className={cfi.defenses.aslr ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          ASLR {cfi.defenses.aslr && "✓"}
                        </Button>
                        <Button
                          variant={cfi.defenses.nxBit ? "default" : "outline"}
                          onClick={() => toggleDefense("nxBit")}
                          className={cfi.defenses.nxBit ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          NX Bit {cfi.defenses.nxBit && "✓"}
                        </Button>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Defensas Activas</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(cfi.defenses)
                            .filter(([_, enabled]) => enabled)
                            .map(([defense, _]) => (
                              <Badge key={defense} variant="secondary" className="text-xs">
                                {defense}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-yellow-600">
                      <span className="mr-2">📊</span>
                      Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Overhead</div>
                          <div className="font-semibold">{cfi.performance.overhead.toFixed(1)}%</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Tiempo Ejecución</div>
                          <div className="font-semibold">{cfi.performance.executionTime.toFixed(0)} ms</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Uso Memoria</div>
                          <div className="font-semibold">{(cfi.performance.memoryUsage / 1024).toFixed(1)} MB</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Frecuencia Chequeos</div>
                          <div className="font-semibold">{cfi.performance.checkFrequency.toFixed(0)}/s</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Falsos Positivos</div>
                          <div className="font-semibold">{cfi.performance.falsePositives}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Falsos Negativos</div>
                          <div className="font-semibold">{cfi.performance.falseNegatives}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Rendimiento</span>
                          <span>
                            {cfi.performance.overhead < 10 
                              ? "Excelente" 
                              : cfi.performance.overhead < 20 
                                ? "Bueno" 
                                : "Aceptable"}
                          </span>
                        </div>
                        <Progress 
                          value={100 - cfi.performance.overhead} 
                          className="w-full" 
                          color={cfi.performance.overhead < 10 ? "green" : cfi.performance.overhead < 20 ? "yellow" : "red"}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Grafo de Flujo de Control</div>
                <div className="h-48 bg-gray-50 rounded p-4 relative overflow-hidden">
                  {/* Simplified visualization of control flow graph */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {cfi.program.controlFlowGraph.nodes.slice(0, 16).map((node, index) => {
                      // Position nodes in a grid
                      const gridSize = 4
                      const row = Math.floor(index / gridSize)
                      const col = index % gridSize
                      const x = (col * 25) + 10
                      const y = (row * 25) + 10
                      
                      return (
                        <div key={node.id}>
                          {/* Node */}
                          <div
                            className={`
                              absolute w-8 h-8 rounded-full flex items-center justify-center text-xs
                              ${node.type === "function" 
                                ? "bg-blue-500 text-white" 
                                : node.type === "branch" 
                                  ? "bg-green-500 text-white" 
                                  : node.type === "loop" 
                                    ? "bg-yellow-500 text-white" 
                                    : "bg-purple-500 text-white"}
                            `}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`
                            }}
                            title={`
                              Nodo: ${node.id}
                              Tipo: ${node.type}
                              Dirección: 0x${node.address.toString(16).toUpperCase()}
                              Sucesores: ${node.successors.length}
                              Predecesores: ${node.predecessors.length}
                            `}
                          >
                            {node.type === "function" && "F"}
                            {node.type === "branch" && "B"}
                            {node.type === "loop" && "L"}
                            {node.type === "basicBlock" && "BB"}
                          </div>
                          
                          {/* Edges to successors */}
                          {node.successors.slice(0, 3).map(successorId => {
                            const successor = cfi.program.controlFlowGraph.nodes.find(n => n.id === successorId)
                            if (!successor) return null
                            
                            // Find successor position
                            const succIndex = cfi.program.controlFlowGraph.nodes.findIndex(n => n.id === successorId)
                            const succRow = Math.floor(succIndex / gridSize)
                            const succCol = succIndex % gridSize
                            const succX = (succCol * 25) + 10
                            const succY = (succRow * 25) + 10
                            
                            return (
                              <div
                                key={`${node.id}-${successorId}`}
                                className="absolute bg-gray-400"
                                style={{
                                  left: `${x + 4}%`,
                                  top: `${y + 4}%`,
                                  width: `${Math.sqrt((succX - x) * (succX - x) + (succY - y) * (succY - y))}%`,
                                  height: "1px",
                                  transform: `rotate(${Math.atan2(succY - y, succX - x)}rad)`,
                                  transformOrigin: "0 0"
                                }}
                              ></div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Pila de Llamadas</div>
                <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                  {cfi.program.callStack.slice(-10).map(call => {
                    const func = cfi.program.functions.find(f => f.id === call.functionId)
                    return (
                      <div key={call.timestamp} className="p-2 border-b text-sm">
                        <div className="font-semibold">
                          {func ? func.name : `Función ${call.functionId}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          Dirección: 0x{call.returnAddress.toString(16).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-400">
                          Tiempo: {call.timestamp}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tipos de CFI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">CFI Suave (Software)</div>
              <p className="text-sm text-blue-700 mb-3">
                Implementada completamente en software usando análisis estático 
                y runtime checks para validar el flujo de control.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Implementación:</strong> Análisis de compilador</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Overhead:</strong> Bajo a moderado</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Compatibilidad:</strong> Buena con código existente</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Seguridad:</strong> Vulnerable a ciertos ataques</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">CFI Dura (Hardware)</div>
              <p className="text-sm text-green-700 mb-3">
                Implementada en hardware con soporte de CPU para validar 
                todas las transiciones de flujo de control.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Implementación:</strong> Extensiones de CPU</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Seguridad:</strong> Muy alta</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Rendimiento:</strong> Muy bajo overhead</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Requisitos:</strong> Hardware compatible</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">CFI Híbrida</div>
              <p className="text-sm text-purple-700 mb-3">
                Combina técnicas de software y hardware para obtener 
                el mejor balance entre seguridad y rendimiento.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Flexibilidad:</strong> Aprovecha ambos enfoques</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Adaptabilidad:</strong> Se ajusta al hardware disponible</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Seguridad:</strong> Alta protección multicapa</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Complejidad:</strong> Mayor complejidad de implementación</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Técnicas de Ataque y Defensa:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-gray-700 mb-1">ROP (Return-Oriented Programming)</div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Defensa:</strong> Shadow Stack, CFG, ASLR
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Detección:</strong> Análisis de patrones de retorno
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">JOP (Jump-Oriented Programming)</div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Defensa:</strong> CFI estricta, validación de saltos
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Detección:</strong> Análisis de dispatchers
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Control Flow Hijacking</div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Defensa:</strong> Canarios, NX Bit, enmascaramiento
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Detección:</strong> Monitoreo de integridad
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Side Channel Attacks</div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Defensa:</strong> Tiempo constante, ruido, aleatorización
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>
                      <strong>Detección:</strong> Análisis estadístico
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
