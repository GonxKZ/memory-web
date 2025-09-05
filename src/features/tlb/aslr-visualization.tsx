import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ASLRVisualization() {
  const [config, setConfig] = useState({
    processes: 4,
    memoryLayout: "random" as "fixed" | "random" | "aslr",
    stackBase: 0x7fff00000000,
    heapBase: 0x555500000000,
    libraryBase: 0x7f0000000000,
    simulationSpeed: 500 // ms
  })
  
  const [processes, setProcesses] = useState<any[]>([])
  const [stats, setStats] = useState({
    entropy: 0,
    collisions: 0,
    securityScore: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [, setHistory] = useState<any[]>([])

  // Initialize processes with different memory layouts
  const initializeProcesses = () => {
    const newProcesses = []
    
    for (let i = 0; i < config.processes; i++) {
      let stackAddress, heapAddress, libraryAddress
      
      switch (config.memoryLayout) {
        case "fixed":
          // Fixed addresses for all processes
          stackAddress = config.stackBase
          heapAddress = config.heapBase
          libraryAddress = config.libraryBase
          break
          
        case "random":
          // Random addresses with limited entropy
          stackAddress = config.stackBase + Math.floor(Math.random() * 0x10000000)
          heapAddress = config.heapBase + Math.floor(Math.random() * 0x10000000)
          libraryAddress = config.libraryBase + Math.floor(Math.random() * 0x10000000)
          break
          
        case "aslr":
          // Full ASLR with high entropy
          stackAddress = config.stackBase + Math.floor(Math.random() * 0x100000000)
          heapAddress = config.heapBase + Math.floor(Math.random() * 0x100000000)
          libraryAddress = config.libraryBase + Math.floor(Math.random() * 0x100000000)
          break
      }
      
      newProcesses.push({
        id: i,
        name: `Process ${i}`,
        memoryLayout: {
          stack: stackAddress,
          heap: heapAddress,
          library: libraryAddress
        },
        entropy: 0,
        vulnerabilities: 0
      })
    }
    
    setProcesses(newProcesses)
    return newProcesses
  }

  // Simulate ASLR effectiveness
  const simulateASLR = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Initialize processes
    const initialProcesses = initializeProcesses()
    
    // Reset stats
    setStats({
      entropy: 0,
      collisions: 0,
      securityScore: 100
    })
    
    // Run simulation for 50 steps
    for (let step = 0; step < 50; step++) {
      setProgress((step + 1) * 2)
      
      // Create a copy of current state
      const currentProcesses = [...initialProcesses]
      
      // Simulate attacker attempts to guess addresses
      const attackAttempts = 100
      let successfulAttacks = 0
      let totalEntropy = 0
      
      for (let attempt = 0; attempt < attackAttempts; attempt++) {
        // Attacker guesses addresses
        const guessedStack = config.stackBase + Math.floor(Math.random() * 0x100000000)
        const guessedHeap = config.heapBase + Math.floor(Math.random() * 0x100000000)
        const guessedLibrary = config.libraryBase + Math.floor(Math.random() * 0x100000000)
        
        // Check if any process has these exact addresses
        for (const process of currentProcesses) {
          if (
            guessedStack === process.memoryLayout.stack ||
            guessedHeap === process.memoryLayout.heap ||
            guessedLibrary === process.memoryLayout.library
          ) {
            successfulAttacks++
            process.vulnerabilities++
          }
        }
      }
      
      // Calculate entropy (higher is better)
      switch (config.memoryLayout) {
        case "fixed":
          totalEntropy = 0
          break
        case "random":
          totalEntropy = 32 // bits of entropy
          break
        case "aslr":
          totalEntropy = 64 // bits of entropy
          break
      }
      
      // Update stats
      const collisionRate = (successfulAttacks / attackAttempts) * 100
      const securityScore = Math.max(0, 100 - collisionRate)
      
      setStats({
        entropy: totalEntropy,
        collisions: successfulAttacks,
        securityScore
      })
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          entropy: totalEntropy,
          collisions: successfulAttacks,
          securityScore,
          layout: config.memoryLayout
        }])
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 10))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setProcesses([])
    setStats({
      entropy: 0,
      collisions: 0,
      securityScore: 0
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de ASLR (Address Space Layout Randomization)</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo ASLR protege contra exploits aleatorizando la disposición del espacio de direcciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="processes">Número de Procesos</Label>
              <Input
                id="processes"
                type="number"
                value={config.processes}
                onChange={(e) => setConfig({...config, processes: Number(e.target.value)})}
                min="2"
                max="16"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="memoryLayout">Tipo de Layout</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.memoryLayout === "fixed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryLayout: "fixed"})}
                >
                  Fijo
                </Button>
                <Button
                  variant={config.memoryLayout === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryLayout: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.memoryLayout === "aslr" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryLayout: "aslr"})}
                >
                  ASLR
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="stackBase">Base de Stack (hex)</Label>
              <Input
                id="stackBase"
                value={`0x${config.stackBase.toString(16)}`}
                onChange={(e) => setConfig({...config, stackBase: parseInt(e.target.value, 16) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="heapBase">Base de Heap (hex)</Label>
              <Input
                id="heapBase"
                value={`0x${config.heapBase.toString(16)}`}
                onChange={(e) => setConfig({...config, heapBase: parseInt(e.target.value, 16) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="libraryBase">Base de Librerías (hex)</Label>
              <Input
                id="libraryBase"
                value={`0x${config.libraryBase.toString(16)}`}
                onChange={(e) => setConfig({...config, libraryBase: parseInt(e.target.value, 16) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="simulationSpeed">Velocidad de Simulación (ms)</Label>
              <Input
                id="simulationSpeed"
                type="range"
                min="100"
                max="2000"
                value={config.simulationSpeed}
                onChange={(e) => setConfig({...config, simulationSpeed: Number(e.target.value)})}
              />
              <div className="text-center">{config.simulationSpeed} ms</div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateASLR} 
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
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resultados de Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Entropía</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.entropy} bits
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Colisiones</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.collisions}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Puntuación de Seguridad</div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.securityScore.toFixed(1)}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Procesos y Layouts de Memoria</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processes.map(process => (
                    <Card key={process.id}>
                      <CardHeader>
                        <CardTitle className="text-sm flex justify-between">
                          <span>{process.name}</span>
                          <Badge variant="secondary">
                            {config.memoryLayout === "fixed" && "Fijo"}
                            {config.memoryLayout === "random" && "Aleatorio"}
                            {config.memoryLayout === "aslr" && "ASLR"}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Stack:</span>
                            <span className="font-mono">0x{process.memoryLayout.stack.toString(16)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Heap:</span>
                            <span className="font-mono">0x{process.memoryLayout.heap.toString(16)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Librerías:</span>
                            <span className="font-mono">0x{process.memoryLayout.library.toString(16)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Vulnerabilidades:</span>
                            <span className="font-semibold text-red-600">{process.vulnerabilities}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Comparativa de Seguridad</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Protección contra exploits</span>
                      <span>
                        {config.memoryLayout === "fixed" && "Baja"}
                        {config.memoryLayout === "random" && "Media"}
                        {config.memoryLayout === "aslr" && "Alta"}
                      </span>
                    </div>
                    <Progress 
                      value={
                        config.memoryLayout === "fixed" ? 20 : 
                        config.memoryLayout === "random" ? 50 : 90
                      } 
                      className="w-full" 
                      color={
                        config.memoryLayout === "fixed" ? "red" : 
                        config.memoryLayout === "random" ? "yellow" : "green"
                      }
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dificultad para el atacante</span>
                      <span>
                        {config.memoryLayout === "fixed" && "Fácil"}
                        {config.memoryLayout === "random" && "Moderada"}
                        {config.memoryLayout === "aslr" && "Difícil"}
                      </span>
                    </div>
                    <Progress 
                      value={
                        config.memoryLayout === "fixed" ? 10 : 
                        config.memoryLayout === "random" ? 40 : 85
                      } 
                      className="w-full" 
                      color={
                        config.memoryLayout === "fixed" ? "red" : 
                        config.memoryLayout === "random" ? "yellow" : "green"
                      }
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overhead del sistema</span>
                      <span>
                        {config.memoryLayout === "fixed" && "Nulo"}
                        {config.memoryLayout === "random" && "Bajo"}
                        {config.memoryLayout === "aslr" && "Moderado"}
                      </span>
                    </div>
                    <Progress 
                      value={
                        config.memoryLayout === "fixed" ? 0 : 
                        config.memoryLayout === "random" ? 15 : 30
                      } 
                      className="w-full" 
                      color={
                        config.memoryLayout === "fixed" ? "gray" : 
                        config.memoryLayout === "random" ? "yellow" : "orange"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de ASLR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es ASLR?</div>
              <p className="text-sm text-blue-700">
                ASLR (Address Space Layout Randomization) es una técnica de seguridad 
                que aleatoriza la ubicación de áreas de memoria como stack, heap y 
                librerías para dificultar exploits basados en direcciones conocidas.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Beneficios</div>
              <p className="text-sm text-green-700">
                Dificulta exploits de buffer overflow, previene ejecución de código 
                malicioso, y funciona sin modificar aplicaciones existentes.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Limitaciones</div>
              <p className="text-sm text-purple-700">
                Puede causar fallos intermitentes en aplicaciones mal escritas, 
                introduce un pequeño overhead, y no protege contra todos los tipos 
                de vulnerabilidades.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Niveles de ASLR:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-red-500">•</span>
                <span>
                  <strong>Layout Fijo:</strong> Todas las aplicaciones usan las mismas direcciones base, 
                  fácil para un atacante predecir ubicaciones de memoria.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-yellow-500">•</span>
                <span>
                  <strong>Aleatorización Parcial:</strong> Algunas áreas se aleatorizan con baja entropía, 
                  ofrece protección básica pero limitada.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>
                  <strong>ASLR Completo:</strong> Máxima aleatorización con alta entropía (32-64 bits), 
                  dificulta significativamente los exploits basados en direcciones.
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
