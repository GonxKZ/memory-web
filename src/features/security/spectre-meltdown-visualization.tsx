// @ts-nocheck
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function SpectreMeltdownVisualization() {
  const [config, setConfig] = useState({
    attackType: "spectre" as "spectre" | "meltdown" | "both",
    mitigation: "none" as "none" | "ibpb" | "stibp" | "mdClear" | "rdclNo" | "rsbaNo" | "all",
    cpuArchitecture: "intel" as "intel" | "amd" | "arm",
    memorySize: 4096, // KB
    cacheLineSize: 64, // bytes
    trainingIterations: 100,
    exploitIterations: 1000,
    simulationSpeed: 200 // ms
  })
  
  const [spectreMeltdown, setSpectreMeltdown] = useState({
    memory: {
      kernelSpace: [] as {
        id: number,
        address: number,
        value: number,
        accessible: boolean,
        protected: boolean,
        accessed: boolean
      }[],
      userSpace: [] as {
        id: number,
        address: number,
        value: number,
        accessible: boolean,
        protected: boolean,
        accessed: boolean
      }[],
      cache: [] as {
        id: number,
        address: number,
        value: number,
        cached: boolean,
        accessed: boolean,
        latency: number
      }[],
      tlb: [] as {
        id: number,
        virtualAddress: number,
        physicalAddress: number,
        cached: boolean,
        accessed: boolean,
        latency: number
      }[]
    },
    attack: {
      spectre: {
        trained: false,
        successRate: 0,
        dataExtracted: [] as number[],
        sideChannelHits: 0,
        falsePredictions: 0,
        trainingIterations: 0
      },
      meltdown: {
        exploited: false,
        successRate: 0,
        dataExtracted: [] as number[],
        pageFaults: 0,
        exceptionHandling: 0,
        kernelAccesses: 0
      }
    },
    mitigations: {
      ibpb: false,
      stibp: false,
      mdClear: false,
      rdclNo: false,
      rsbaNo: false
    },
    performance: {
      attackLatency: 0,
      cacheHitRate: 0,
      tlbHitRate: 0,
      memoryBandwidth: 0,
      protectionEffectiveness: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [_history, setHistory] = useState<any[]>([])

  // Initialize Spectre/Meltdown simulation
  useState(() => {
    // Create kernel space memory
    const kernelSpace = []
    for (let i = 0; i < config.memorySize / 2; i++) {
      kernelSpace.push({
        id: i,
        address: 0xC0000000 + i * config.cacheLineSize, // Kernel space address
        value: Math.floor(Math.random() * 256),
        accessible: false, // Initially not accessible from user space
        protected: true,
        accessed: false
      })
    }
    
    // Create user space memory
    const userSpace = []
    for (let i = 0; i < config.memorySize / 2; i++) {
      userSpace.push({
        id: i,
        address: 0x00000000 + i * config.cacheLineSize, // User space address
        value: Math.floor(Math.random() * 256),
        accessible: true, // Accessible from user space
        protected: false,
        accessed: false
      })
    }
    
    // Create cache
    const cache = []
    for (let i = 0; i < 64; i++) { // 64 cache lines
      cache.push({
        id: i,
        address: 0,
        value: 0,
        cached: false,
        accessed: false,
        latency: config.cacheLineSize
      })
    }
    
    // Create TLB
    const tlb = []
    for (let i = 0; i < 16; i++) { // 16 TLB entries
      tlb.push({
        id: i,
        virtualAddress: 0,
        physicalAddress: 0,
        cached: false,
        accessed: false,
        latency: config.cacheLineSize * 10 // TLB access is slower than cache
      })
    }
    
    setSpectreMeltdown({
      memory: {
        kernelSpace,
        userSpace,
        cache,
        tlb
      },
      attack: {
        spectre: {
          trained: false,
          successRate: 0,
          dataExtracted: [],
          sideChannelHits: 0,
          falsePredictions: 0,
          trainingIterations: 0
        },
        meltdown: {
          exploited: false,
          successRate: 0,
          dataExtracted: [],
          pageFaults: 0,
          exceptionHandling: 0,
          kernelAccesses: 0
        }
      },
      mitigations: {
        ibpb: false,
        stibp: false,
        mdClear: false,
        rdclNo: false,
        rsbaNo: false
      },
      performance: {
        attackLatency: 0,
        cacheHitRate: 0,
        tlbHitRate: 0,
        memoryBandwidth: 0,
        protectionEffectiveness: 0
      }
    })
  })

  // Simulate Spectre/Meltdown attack
  const simulateSpectreMeltdown = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset attack state
    setSpectreMeltdown(prev => ({
      ...prev,
      attack: {
        spectre: {
          trained: false,
          successRate: 0,
          dataExtracted: [],
          sideChannelHits: 0,
          falsePredictions: 0,
          trainingIterations: 0
        },
        meltdown: {
          exploited: false,
          successRate: 0,
          dataExtracted: [],
          pageFaults: 0,
          exceptionHandling: 0,
          kernelAccesses: 0
        }
      },
      performance: {
        attackLatency: 0,
        cacheHitRate: 0,
        tlbHitRate: 0,
        memoryBandwidth: 0,
        protectionEffectiveness: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current state
      const currentSpectreMeltdown = JSON.parse(JSON.stringify(spectreMeltdown))
      const currentPerformance = { ...spectreMeltdown.performance }
      
      // Simulate memory accesses
      let cacheHits = 0
      let cacheMisses = 0
      let tlbHits = 0
      let tlbMisses = 0
      let totalLatency = 0
      const _memoryBandwidth = 0
      
      // Generate memory accesses based on attack type
      if (config.attackType === "spectre" || config.attackType === "both") {
        // Spectre attack - branch misprediction + side channel
        for (let i = 0; i < config.trainingIterations / 10; i++) {
          // Training phase - legitimate accesses to train branch predictor
          const index = Math.floor(Math.random() * currentSpectreMeltdown.memory.userSpace.length)
          const userAddress = currentSpectreMeltdown.memory.userSpace[index].address
          
          // Access user space memory
          const userMemory = currentSpectreMeltdown.memory.userSpace.find(mem => mem.address === userAddress)
          if (userMemory) {
            userMemory.accessed = true
            
            // Check cache for user memory access
            const cacheLine = currentSpectreMeltdown.memory.cache.find(line => 
              line.address === userAddress
            )
            
            if (cacheLine && cacheLine.cached) {
              cacheHits++
              cacheLine.accessed = true
              totalLatency += cacheLine.latency
            } else {
              cacheMisses++
              totalLatency += config.cacheLineSize * 10 // Main memory access
              
              // Load into cache if space available
              if (cacheLine) {
                cacheLine.cached = true
                cacheLine.address = userAddress
                cacheLine.value = userMemory.value
                cacheLine.accessed = true
              }
            }
            
            // Check TLB for address translation
            const tlbEntry = currentSpectreMeltdown.memory.tlb.find(entry => 
              entry.virtualAddress === userAddress
            )
            
            if (tlbEntry && tlbEntry.cached) {
              tlbHits++
              tlbEntry.accessed = true
              totalLatency += tlbEntry.latency
            } else {
              tlbMisses++
              totalLatency += config.cacheLineSize * 100 // Page table walk
              
              // Load into TLB if space available
              if (tlbEntry) {
                tlbEntry.cached = true
                tlbEntry.virtualAddress = userAddress
                tlbEntry.physicalAddress = userAddress // Simplified mapping
                tlbEntry.accessed = true
              }
            }
          }
          
          currentSpectreMeltdown.attack.spectre.trainingIterations++
        }
        
        // Exploitation phase - train branch predictor then access kernel memory
        for (let i = 0; i < config.exploitIterations / 100; i++) {
          // Train branch predictor with valid bounds
          const validIndex = Math.floor(Math.random() * (currentSpectreMeltdown.memory.userSpace.length - 10))
          const userAddress = currentSpectreMeltdown.memory.userSpace[validIndex].address
          
          // Access user space memory (legitimate)
          const userMemory = currentSpectreMeltdown.memory.userSpace.find(mem => mem.address === userAddress)
          if (userMemory) {
            userMemory.accessed = true
            
            // Check cache and TLB (similar to training phase)
            const cacheLine = currentSpectreMeltdown.memory.cache.find(line => 
              line.address === userAddress
            )
            
            if (cacheLine && cacheLine.cached) {
              cacheHits++
              cacheLine.accessed = true
              totalLatency += cacheLine.latency
            } else {
              cacheMisses++
              totalLatency += config.cacheLineSize * 10
              
              if (cacheLine) {
                cacheLine.cached = true
                cacheLine.address = userAddress
                cacheLine.value = userMemory.value
                cacheLine.accessed = true
              }
            }
            
            const tlbEntry = currentSpectreMeltdown.memory.tlb.find(entry => 
              entry.virtualAddress === userAddress
            )
            
            if (tlbEntry && tlbEntry.cached) {
              tlbHits++
              tlbEntry.accessed = true
              totalLatency += tlbEntry.latency
            } else {
              tlbMisses++
              totalLatency += config.cacheLineSize * 100
              
              if (tlbEntry) {
                tlbEntry.cached = true
                tlbEntry.virtualAddress = userAddress
                tlbEntry.physicalAddress = userAddress
                tlbEntry.accessed = true
              }
            }
          }
          
          // Now exploit - access out-of-bounds with trained branch predictor
          // This should normally fail but branch predictor might allow it
          const outOfBoundsIndex = currentSpectreMeltdown.memory.userSpace.length + 
            Math.floor(Math.random() * 100) // Access kernel memory indirectly
          
          // Check if branch predictor is trained enough
          const isTrained = currentSpectreMeltdown.attack.spectre.trainingIterations > 50
          
          if (isTrained && Math.random() > 0.7) { // 30% chance of successful misprediction
            // Speculative execution - access kernel memory
            const kernelIndex = Math.floor(Math.random() * currentSpectreMeltdown.memory.kernelSpace.length)
            const kernelAddress = currentSpectreMeltdown.memory.kernelSpace[kernelIndex].address
            const kernelMemory = currentSpectreMeltdown.memory.kernelSpace[kernelIndex]
            
            // In Spectre, this access happens speculatively
            kernelMemory.accessed = true
            
            // Extract data through side channel (cache timing)
            const cacheLine = currentSpectreMeltdown.memory.cache.find(line => 
              line.address === kernelAddress
            )
            
            if (cacheLine) {
              cacheLine.cached = true
              cacheLine.address = kernelAddress
              cacheLine.value = kernelMemory.value
              cacheLine.accessed = true
              cacheHits++
              totalLatency += cacheLine.latency
              
              // Add to extracted data
              currentSpectreMeltdown.attack.spectre.dataExtracted.push(kernelMemory.value)
              currentSpectreMeltdown.attack.spectre.sideChannelHits++
            }
            
            currentSpectreMeltdown.attack.spectre.successRate = 
              (currentSpectreMeltdown.attack.spectre.sideChannelHits / 
               (currentSpectreMeltdown.attack.spectre.sideChannelHits + 
                currentSpectreMeltdown.attack.spectre.falsePredictions)) * 100
          } else {
            // False prediction - normal behavior
            currentSpectreMeltdown.attack.spectre.falsePredictions++
          }
        }
        
        currentSpectreMeltdown.attack.spectre.trained = true
      }
      
      if (config.attackType === "meltdown" || config.attackType === "both") {
        // Meltdown attack - direct kernel memory access
        for (let i = 0; i < config.exploitIterations / 100; i++) {
          // Attempt direct access to kernel memory
          const kernelIndex = Math.floor(Math.random() * currentSpectreMeltdown.memory.kernelSpace.length)
          const kernelAddress = currentSpectreMeltdown.memory.kernelSpace[kernelIndex].address
          const kernelMemory = currentSpectreMeltdown.memory.kernelSpace[kernelIndex]
          
          // Check if mitigations are active
          const mitigationsActive = 
            config.mitigation === "all" ||
            (config.mitigation === "ibpb" && currentSpectreMeltdown.mitigations.ibpb) ||
            (config.mitigation === "stibp" && currentSpectreMeltdown.mitigations.stibp) ||
            (config.mitigation === "mdClear" && currentSpectreMeltdown.mitigations.mdClear) ||
            (config.mitigation === "rdclNo" && currentSpectreMeltdown.mitigations.rdclNo) ||
            (config.mitigation === "rsbaNo" && currentSpectreMeltdown.mitigations.rsbaNo)
          
          // Check if CPU architecture supports mitigations
          const architectureSupports = 
            (config.cpuArchitecture === "intel" && 
             (config.mitigation === "ibpb" || config.mitigation === "stibp" || 
              config.mitigation === "mdClear" || config.mitigation === "rdclNo" || 
              config.mitigation === "rsbaNo" || config.mitigation === "all")) ||
            (config.cpuArchitecture === "amd" && 
             (config.mitigation === "ibpb" || config.mitigation === "stibp" || 
              config.mitigation === "mdClear" || config.mitigation === "all")) ||
            (config.cpuArchitecture === "arm" && 
             (config.mitigation === "mdClear" || config.mitigation === "all"))
          
          // Check if attack succeeds based on mitigations
          if (!mitigationsActive || !architectureSupports || Math.random() > 0.8) {
            // Attack succeeds - access kernel memory
            kernelMemory.accessed = true
            currentSpectreMeltdown.attack.meltdown.kernelAccesses++
            
            // Extract data
            currentSpectreMeltdown.attack.meltdown.dataExtracted.push(kernelMemory.value)
            
            // Simulate page fault handling
            if (Math.random() > 0.9) { // 10% chance of page fault
              currentSpectreMeltdown.attack.meltdown.pageFaults++
              totalLatency += config.cacheLineSize * 1000 // Exception handling overhead
              currentSpectreMeltdown.attack.meltdown.exceptionHandling++
            } else {
              // Normal access
              totalLatency += config.cacheLineSize * 10
            }
            
            currentSpectreMeltdown.attack.meltdown.successRate = 
              (currentSpectreMeltdown.attack.meltdown.kernelAccesses / 
               (currentSpectreMeltdown.attack.meltdown.kernelAccesses + 
                currentSpectreMeltdown.attack.meltdown.pageFaults)) * 100
          } else {
            // Attack blocked by mitigations
            totalLatency += config.cacheLineSize * 1000 // High overhead from mitigation
            currentSpectreMeltdown.attack.meltdown.pageFaults++
            currentSpectreMeltdown.attack.meltdown.exceptionHandling++
          }
        }
        
        currentSpectreMeltdown.attack.meltdown.exploited = true
      }
      
      // Update performance metrics
      const totalAccesses = cacheHits + cacheMisses
      currentPerformance.cacheHitRate = totalAccesses > 0 ? (cacheHits / totalAccesses) * 100 : 0
      
      const totalTLBAcceses = tlbHits + tlbMisses
      currentPerformance.tlbHitRate = totalTLBAcceses > 0 ? (tlbHits / totalTLBAcceses) * 100 : 0
      
      currentPerformance.attackLatency = totalLatency
      currentPerformance.memoryBandwidth = totalAccesses * config.cacheLineSize / (totalLatency / 1000000000) // bytes/sec
      
      // Calculate protection effectiveness
      let protectionEffectiveness = 100
      if (config.attackType === "spectre" || config.attackType === "both") {
        protectionEffectiveness -= currentSpectreMeltdown.attack.spectre.successRate * 0.5
      }
      if (config.attackType === "meltdown" || config.attackType === "both") {
        protectionEffectiveness -= currentSpectreMeltdown.attack.meltdown.successRate * 0.5
      }
      
      // Apply mitigation effects
      if (config.mitigation !== "none") {
        if (config.mitigation === "all") {
          protectionEffectiveness = Math.min(100, protectionEffectiveness + 40)
        } else {
          protectionEffectiveness = Math.min(100, protectionEffectiveness + 10)
        }
      }
      
      currentPerformance.protectionEffectiveness = Math.max(0, protectionEffectiveness)
      
      // Update state
      setSpectreMeltdown(currentSpectreMeltdown)
      setPerformance(currentPerformance)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          spectre: {...currentSpectreMeltdown.attack.spectre},
          meltdown: {...currentSpectreMeltdown.attack.meltdown},
          performance: {...currentPerformance},
          mitigations: {...currentSpectreMeltdown.mitigations}
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
    
    // Reset Spectre/Meltdown state
    const kernelSpace = []
    for (let i = 0; i < config.memorySize / 2; i++) {
      kernelSpace.push({
        id: i,
        address: 0xC0000000 + i * config.cacheLineSize,
        value: Math.floor(Math.random() * 256),
        accessible: false,
        protected: true,
        accessed: false
      })
    }
    
    const userSpace = []
    for (let i = 0; i < config.memorySize / 2; i++) {
      userSpace.push({
        id: i,
        address: 0x00000000 + i * config.cacheLineSize,
        value: Math.floor(Math.random() * 256),
        accessible: true,
        protected: false,
        accessed: false
      })
    }
    
    const cache = []
    for (let i = 0; i < 64; i++) {
      cache.push({
        id: i,
        address: 0,
        value: 0,
        cached: false,
        accessed: false,
        latency: config.cacheLineSize
      })
    }
    
    const tlb = []
    for (let i = 0; i < 16; i++) {
      tlb.push({
        id: i,
        virtualAddress: 0,
        physicalAddress: 0,
        cached: false,
        accessed: false,
        latency: config.cacheLineSize * 10
      })
    }
    
    setSpectreMeltdown({
      memory: {
        kernelSpace,
        userSpace,
        cache,
        tlb
      },
      attack: {
        spectre: {
          trained: false,
          successRate: 0,
          dataExtracted: [],
          sideChannelHits: 0,
          falsePredictions: 0,
          trainingIterations: 0
        },
        meltdown: {
          exploited: false,
          successRate: 0,
          dataExtracted: [],
          pageFaults: 0,
          exceptionHandling: 0,
          kernelAccesses: 0
        }
      },
      mitigations: {
        ibpb: false,
        stibp: false,
        mdClear: false,
        rdclNo: false,
        rsbaNo: false
      },
      performance: {
        attackLatency: 0,
        cacheHitRate: 0,
        tlbHitRate: 0,
        memoryBandwidth: 0,
        protectionEffectiveness: 0
      }
    })
  }

  // Toggle mitigation
  const toggleMitigation = (mitigation: keyof typeof spectreMeltdown.mitigations) => {
    setSpectreMeltdown(prev => ({
      ...prev,
      mitigations: {
        ...prev.mitigations,
        [mitigation]: !prev.mitigations[mitigation]
      }
    }))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Spectre & Meltdown</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo estas vulnerabilidades de CPU permiten acceder a datos protegidos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="attackType">Tipo de Ataque</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.attackType === "spectre" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "spectre"})}
                >
                  Spectre
                </Button>
                <Button
                  variant={config.attackType === "meltdown" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "meltdown"})}
                >
                  Meltdown
                </Button>
                <Button
                  variant={config.attackType === "both" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "both"})}
                >
                  Ambos
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="cpuArchitecture">Arquitectura CPU</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.cpuArchitecture === "intel" ? "default" : "outline"}
                  onClick={() => setConfig({...config, cpuArchitecture: "intel"})}
                >
                  Intel
                </Button>
                <Button
                  variant={config.cpuArchitecture === "amd" ? "default" : "outline"}
                  onClick={() => setConfig({...config, cpuArchitecture: "amd"})}
                >
                  AMD
                </Button>
                <Button
                  variant={config.cpuArchitecture === "arm" ? "default" : "outline"}
                  onClick={() => setConfig({...config, cpuArchitecture: "arm"})}
                >
                  ARM
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (KB)</Label>
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
              <Label htmlFor="cacheLineSize">Tamaño de Línea de Caché (bytes)</Label>
              <Input
                id="cacheLineSize"
                type="number"
                value={config.cacheLineSize}
                onChange={(e) => setConfig({...config, cacheLineSize: Number(e.target.value)})}
                min="32"
                step="32"
              />
            </div>

            <div>
              <Label htmlFor="trainingIterations">Iteraciones de Entrenamiento</Label>
              <Input
                id="trainingIterations"
                type="number"
                value={config.trainingIterations}
                onChange={(e) => setConfig({...config, trainingIterations: Number(e.target.value)})}
                min="10"
                step="10"
              />
            </div>

            <div>
              <Label htmlFor="exploitIterations">Iteraciones de Explotación</Label>
              <Input
                id="exploitIterations"
                type="number"
                value={config.exploitIterations}
                onChange={(e) => setConfig({...config, exploitIterations: Number(e.target.value)})}
                min="100"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="mitigation">Mitigación</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.mitigation === "none" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mitigation: "none"})}
                >
                  Ninguna
                </Button>
                <Button
                  variant={config.mitigation === "ibpb" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mitigation: "ibpb"})}
                >
                  IBPB
                </Button>
                <Button
                  variant={config.mitigation === "stibp" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mitigation: "stibp"})}
                >
                  STIBP
                </Button>
                <Button
                  variant={config.mitigation === "mdClear" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mitigation: "mdClear"})}
                >
                  MDS Clear
                </Button>
                <Button
                  variant={config.mitigation === "rdclNo" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mitigation: "rdclNo"})}
                >
                  RDCL_NO
                </Button>
                <Button
                  variant={config.mitigation === "rsbaNo" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mitigation: "rsbaNo"})}
                >
                  RSBA_NO
                </Button>
                <Button
                  variant={config.mitigation === "all" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mitigation: "all"})}
                  className="col-span-2"
                >
                  Todas
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
                onClick={simulateSpectreMeltdown} 
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
            <CardTitle>Estado de Ataque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Datos Extraídos (Spectre)</div>
                  <div className="text-2xl font-bold text-red-600">
                    {spectreMeltdown.attack.spectre.dataExtracted.length}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Hits de Canal Lateral</div>
                  <div className="text-2xl font-bold text-green-600">
                    {spectreMeltdown.attack.spectre.sideChannelHits}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Datos Extraídos (Meltdown)</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {spectreMeltdown.attack.meltdown.dataExtracted.length}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos a Kernel</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {spectreMeltdown.attack.meltdown.kernelAccesses}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-red-600">
                      <span className="mr-2 text-xl">👻</span>
                      Spectre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tasa de Éxito</span>
                          <span>{spectreMeltdown.attack.spectre.successRate.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={spectreMeltdown.attack.spectre.successRate} 
                          className="w-full" 
                          color={spectreMeltdown.attack.spectre.successRate > 50 ? "red" : "yellow"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Iteraciones de Entrenamiento</div>
                          <div className="font-semibold">{spectreMeltdown.attack.spectre.trainingIterations}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Predicciones Falsas</div>
                          <div className="font-semibold">{spectreMeltdown.attack.spectre.falsePredictions}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Datos Extraídos (últimos 10)</div>
                        <div className="flex flex-wrap gap-1">
                          {spectreMeltdown.attack.spectre.dataExtracted.slice(-10).map((data, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded bg-red-500 text-white flex items-center justify-center text-xs"
                              title={`Dato extraído: ${data}`}
                            >
                              {data % 10}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-blue-600">
                      <span className="mr-2 text-xl">💣</span>
                      Meltdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tasa de Éxito</span>
                          <span>{spectreMeltdown.attack.meltdown.successRate.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={spectreMeltdown.attack.meltdown.successRate} 
                          className="w-full" 
                          color={spectreMeltdown.attack.meltdown.successRate > 50 ? "blue" : "yellow"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Page Faults</div>
                          <div className="font-semibold">{spectreMeltdown.attack.meltdown.pageFaults}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Manejo de Excepciones</div>
                          <div className="font-semibold">{spectreMeltdown.attack.meltdown.exceptionHandling}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Datos Extraídos (últimos 10)</div>
                        <div className="flex flex-wrap gap-1">
                          {spectreMeltdown.attack.meltdown.dataExtracted.slice(-10).map((data, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center text-xs"
                              title={`Dato extraído: ${data}`}
                            >
                              {data % 10}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Mitigaciones</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <Button
                    variant={spectreMeltdown.mitigations.ibpb ? "default" : "outline"}
                    onClick={() => toggleMitigation("ibpb")}
                    className={spectreMeltdown.mitigations.ibpb ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    IBPB {spectreMeltdown.mitigations.ibpb && "✓"}
                  </Button>
                  <Button
                    variant={spectreMeltdown.mitigations.stibp ? "default" : "outline"}
                    onClick={() => toggleMitigation("stibp")}
                    className={spectreMeltdown.mitigations.stibp ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    STIBP {spectreMeltdown.mitigations.stibp && "✓"}
                  </Button>
                  <Button
                    variant={spectreMeltdown.mitigations.mdClear ? "default" : "outline"}
                    onClick={() => toggleMitigation("mdClear")}
                    className={spectreMeltdown.mitigations.mdClear ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    MDS Clear {spectreMeltdown.mitigations.mdClear && "✓"}
                  </Button>
                  <Button
                    variant={spectreMeltdown.mitigations.rdclNo ? "default" : "outline"}
                    onClick={() => toggleMitigation("rdclNo")}
                    className={spectreMeltdown.mitigations.rdclNo ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    RDCL_NO {spectreMeltdown.mitigations.rdclNo && "✓"}
                  </Button>
                  <Button
                    variant={spectreMeltdown.mitigations.rsbaNo ? "default" : "outline"}
                    onClick={() => toggleMitigation("rsbaNo")}
                    className={spectreMeltdown.mitigations.rsbaNo ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    RSBA_NO {spectreMeltdown.mitigations.rsbaNo && "✓"}
                  </Button>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Rendimiento</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Latencia de Ataque</div>
                    <div className="text-2xl font-bold">
                      {spectreMeltdown.performance.attackLatency.toFixed(0)} ns
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Hit Rate de Caché</div>
                    <div className="text-2xl font-bold">
                      {spectreMeltdown.performance.cacheHitRate.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Hit Rate de TLB</div>
                    <div className="text-2xl font-bold">
                      {spectreMeltdown.performance.tlbHitRate.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Efectividad de Protección</div>
                    <div className="text-2xl font-bold">
                      {spectreMeltdown.performance.protectionEffectiveness.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Memoria</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Espacio de Kernel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                        {spectreMeltdown.memory.kernelSpace.slice(0, 64).map(mem => (
                          <div
                            key={mem.id}
                            className={`
                              w-4 h-4 rounded text-xs flex items-center justify-center
                              ${mem.accessed 
                                ? "bg-red-500 text-white" 
                                : mem.protected 
                                  ? "bg-gray-300" 
                                  : "bg-gray-200"}
                            `}
                            title={`
                              Dirección: 0x${mem.address.toString(16).toUpperCase()}
                              Valor: ${mem.value}
                              Accedido: ${mem.accessed ? "Sí" : "No"}
                              Protegido: ${mem.protected ? "Sí" : "No"}
                            `}
                          >
                            {mem.accessed ? "K" : mem.protected ? "P" : "U"}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Espacio de Usuario</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                        {spectreMeltdown.memory.userSpace.slice(0, 64).map(mem => (
                          <div
                            key={mem.id}
                            className={`
                              w-4 h-4 rounded text-xs flex items-center justify-center
                              ${mem.accessed 
                                ? "bg-green-500 text-white" 
                                : mem.protected 
                                  ? "bg-gray-300" 
                                  : "bg-gray-200"}
                            `}
                            title={`
                              Dirección: 0x${mem.address.toString(16).toUpperCase()}
                              Valor: ${mem.value}
                              Accedido: ${mem.accessed ? "Sí" : "No"}
                              Protegido: ${mem.protected ? "Sí" : "No"}
                            `}
                          >
                            {mem.accessed ? "U" : mem.protected ? "P" : "A"}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Caché</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Líneas de Caché</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                        {spectreMeltdown.memory.cache.slice(0, 32).map(line => (
                          <div
                            key={line.id}
                            className={`
                              w-6 h-6 rounded text-xs flex items-center justify-center
                              ${line.cached 
                                ? line.accessed 
                                  ? "bg-blue-500 text-white" 
                                  : "bg-gray-300"
                                : "bg-gray-100"}
                            `}
                            title={`
                              Dirección: 0x${line.address.toString(16).toUpperCase()}
                              Valor: ${line.value}
                              Cached: ${line.cached ? "Sí" : "No"}
                              Accedido: ${line.accessed ? "Sí" : "No"}
                              Latencia: ${line.latency} ns
                            `}
                          >
                            {line.cached ? (line.accessed ? "C" : "L") : "-"}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">TLB</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                        {spectreMeltdown.memory.tlb.slice(0, 16).map(entry => (
                          <div
                            key={entry.id}
                            className={`
                              w-8 h-8 rounded text-xs flex items-center justify-center
                              ${entry.cached 
                                ? entry.accessed 
                                  ? "bg-purple-500 text-white" 
                                  : "bg-gray-300"
                                : "bg-gray-100"}
                            `}
                            title={`
                              Dirección Virtual: 0x${entry.virtualAddress.toString(16).toUpperCase()}
                              Dirección Física: 0x${entry.physicalAddress.toString(16).toUpperCase()}
                              Cached: ${entry.cached ? "Sí" : "No"}
                              Accedido: ${entry.accessed ? "Sí" : "No"}
                              Latencia: ${entry.latency} ns
                            `}
                          >
                            {entry.cached ? (entry.accessed ? "T" : "E") : "-"}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Spectre & Meltdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">Spectre (Variante 1 - Branch Misprediction)</div>
              <p className="text-sm text-red-700 mb-3">
                Spectre engaña a las aplicaciones para que accedan a datos arbitrarios 
                mediante el uso de especulación de ejecución y predicción de ramas.
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span>
                    <strong>Mecanismo:</strong> Entrena el predictor de ramas con accesos legítimos, 
                    luego explota la especulación para acceder a memoria protegida.
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span>
                    <strong>Canal lateral:</strong> Usa técnicas de temporización (como cache timing) 
                    para extraer los datos accedidos especulativamente.
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span>
                    <strong>Impacto:</strong> Permite leer memoria de otros procesos o el propio proceso 
                    en ubicaciones que normalmente no deberían ser accesibles.
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Meltdown (Variante 3 - Rogue Data Cache Load)</div>
              <p className="text-sm text-blue-700 mb-3">
                Meltdown rompe la barrera de aislamiento entre el kernel y el espacio de usuario, 
                permitiendo que los programas accedan a la memoria del sistema y a secretos 
                almacenados en el kernel.
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>Mecanismo:</strong> Accede directamente a memoria del kernel durante 
                    la ejecución especulativa, antes de que se lance la excepción de privilegio.
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>Canal lateral:</strong> Almacena los datos leídos en caché durante 
                    la ejecución especulativa, permitiendo su recuperación posterior.
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>Impacto:</strong> Permite a procesos de usuario leer todo el contenido 
                    de la memoria del kernel, incluyendo contraseñas, claves criptográficas, etc.
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold text-gray-800 mb-2">Mitigaciones Comunes</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>KPTI (Kernel Page-Table Isolation):</strong> Separa las tablas de 
                    páginas del kernel y usuario para prevenir Meltdown.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Retpoline:</strong> Técnica de compilación que evita la predicción 
                    de ramas indirectas para mitigar Spectre V2.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>IBPB/STIBP:</strong> Instrucciones de barrera de predicción de ramas 
                    para prevenir contaminación del predictor entre contextos.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Array Bounds Checking:</strong> Técnicas de programación defensiva 
                    para prevenir Spectre V1.
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold text-gray-800 mb-2">Impacto en Rendimiento</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">⚠</span>
                  <span>
                    <strong>KPTI:</strong> 5-30% de penalización en syscalls dependiendo del workload.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">⚠</span>
                  <span>
                    <strong>Retpoline:</strong> 1-5% de penalización en llamadas indirectas.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">⚠</span>
                  <span>
                    <strong>IBPB/STIBP:</strong> Sobrecarga significativa en cambios de contexto.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">⚠</span>
                  <span>
                    <strong>Software mitigations:</strong> Impacto variable según la técnica usada.
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold text-gray-800 mb-2">Arquitecturas Afectadas</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>
                    <strong>Intel:</strong> Todas las CPUs modernas afectadas por Spectre/Meltdown.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>
                    <strong>AMD:</strong> Vulnerable a Spectre, parcialmente a Meltdown.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>
                    <strong>ARM:</strong> Muchos procesadores afectados, especialmente Cortex-A.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>RISC-V:</strong> Menos vulnerable gracias a diseño más simple.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Protección:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Mantén actualizado:</strong> Aplica parches de firmware y microcódigo 
                  tan pronto como estén disponibles.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Usa lenguajes seguros:</strong> Lenguajes con gestión automática de memoria 
                  (Rust, Go, etc.) reducen riesgos de Spectre.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Implementa mitigaciones:</strong> Usa KPTI, retpoline, y otras técnicas 
                  recomendadas por el fabricante.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Monitorea el rendimiento:</strong> Observa impactos de rendimiento 
                  tras aplicar mitigaciones y ajusta según sea necesario.
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
// @ts-nocheck
// @ts-nocheck
