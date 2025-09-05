// @ts-nocheck
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function SideChannelConcepts() {
  const [config, setConfig] = useState({
    attackType: "cache" as "cache" | "timing" | "power" | "emission",
    processes: 2,
    memoryAccesses: 1000,
    cacheSize: 32768, // 32KB
    simulationSpeed: 300 // ms
  })
  
  const [attack, setAttack] = useState({
    secret: "SECRET_KEY_12345",
    accessedAddresses: [] as number[],
    leakedBits: 0,
    successRate: 0
  })
  
  const [defense, setDefense] = useState({
    mitigations: {
      constantTime: false,
      cachePartitioning: false,
      randomization: false,
      noiseInjection: false
    },
    effectiveness: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Simulate side channel attack
  const simulateSideChannelAttack = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset attack state
    setAttack({
      secret: "SECRET_KEY_12345",
      accessedAddresses: [],
      leakedBits: 0,
      successRate: 0
    })
    
    // Run simulation
    const numSteps = 100
    const newHistory = []
    
    for (let step = 0; step < numSteps; step++) {
      setProgress((step + 1) * (100 / numSteps))
      
      // Simulate memory accesses based on attack type
      let leakedBits = 0
      let successRate = 0
      const accessedAddresses = []
      
      // Generate memory access pattern based on secret
      for (let i = 0; i < config.memoryAccesses / numSteps; i++) {
        // Simple model: secret bits determine which memory addresses are accessed
        const secretBit = Math.floor(Math.random() * 8) // 8 bits in our secret
        const address = (secretBit * 1024) + Math.floor(Math.random() * 1024)
        accessedAddresses.push(address)
        
        // Simulate attacker observing cache timing
        if (config.attackType === "cache") {
          // With no mitigations, attacker can easily observe cache hits/misses
          const canObserve = !defense.mitigations.constantTime && 
                            !defense.mitigations.cachePartitioning &&
                            !defense.mitigations.randomization
          
          if (canObserve && Math.random() > 0.7) {
            leakedBits++
          }
        } else if (config.attackType === "timing") {
          // Timing attacks are more effective without constant time execution
          if (!defense.mitigations.constantTime && Math.random() > 0.6) {
            leakedBits++
          }
        }
      }
      
      // Calculate success rate
      successRate = (leakedBits / (config.memoryAccesses / numSteps)) * 100
      
      // Update attack state
      setAttack(prev => ({
        ...prev,
        accessedAddresses: [...prev.accessedAddresses, ...accessedAddresses],
        leakedBits: prev.leakedBits + leakedBits,
        successRate: (prev.successRate + successRate) / (step + 1)
      }))
      
      // Calculate defense effectiveness
      let effectiveness = 0
      if (defense.mitigations.constantTime) effectiveness += 25
      if (defense.mitigations.cachePartitioning) effectiveness += 20
      if (defense.mitigations.randomization) effectiveness += 30
      if (defense.mitigations.noiseInjection) effectiveness += 25
      
      setDefense(prev => ({
        ...prev,
        effectiveness: Math.min(100, effectiveness)
      }))
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        newHistory.push({
          step,
          leakedBits: attack.leakedBits + leakedBits,
          successRate: (attack.successRate + successRate) / (step + 1),
          effectiveness: Math.min(100, effectiveness)
        })
        setHistory([...newHistory])
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 100))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setAttack({
      secret: "SECRET_KEY_12345",
      accessedAddresses: [],
      leakedBits: 0,
      successRate: 0
    })
    setDefense({
      mitigations: {
        constantTime: false,
        cachePartitioning: false,
        randomization: false,
        noiseInjection: false
      },
      effectiveness: 0
    })
  }

  // Toggle mitigation
  const toggleMitigation = (mitigation: keyof typeof defense.mitigations) => {
    setDefense(prev => ({
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
        <h1 className="text-3xl font-bold">Conceptos de Side Channels</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo los atacantes pueden extraer información secreta observando características indirectas
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
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.attackType === "cache" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "cache"})}
                >
                  Cache
                </Button>
                <Button
                  variant={config.attackType === "timing" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "timing"})}
                >
                  Timing
                </Button>
                <Button
                  variant={config.attackType === "power" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "power"})}
                >
                  Power
                </Button>
                <Button
                  variant={config.attackType === "emission" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "emission"})}
                >
                  Emission
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="processes">Número de Procesos</Label>
              <Input
                id="processes"
                type="number"
                value={config.processes}
                onChange={(e) => setConfig({...config, processes: Number(e.target.value)})}
                min="1"
                max="8"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="memoryAccesses">Accesos a Memoria</Label>
              <Input
                id="memoryAccesses"
                type="number"
                value={config.memoryAccesses}
                onChange={(e) => setConfig({...config, memoryAccesses: Number(e.target.value)})}
                min="100"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="cacheSize">Tamaño de Caché (bytes)</Label>
              <select
                id="cacheSize"
                value={config.cacheSize}
                onChange={(e) => setConfig({...config, cacheSize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={8192}>8 KB</option>
                <option value={16384}>16 KB</option>
                <option value={32768}>32 KB</option>
                <option value={65536}>64 KB</option>
              </select>
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
                onClick={simulateSideChannelAttack} 
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
            <CardTitle>Resultados del Ataque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Bits Leaked</div>
                  <div className="text-2xl font-bold text-red-600">
                    {attack.leakedBits}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Éxito</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {attack.successRate.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Efectividad de Defensa</div>
                  <div className="text-2xl font-bold text-green-600">
                    {defense.effectiveness.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Mitigaciones</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={defense.mitigations.constantTime ? "default" : "outline"}
                    onClick={() => toggleMitigation("constantTime")}
                    className={defense.mitigations.constantTime ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Ejecución de Tiempo Constante {defense.mitigations.constantTime && "✓"}
                  </Button>
                  <Button
                    variant={defense.mitigations.cachePartitioning ? "default" : "outline"}
                    onClick={() => toggleMitigation("cachePartitioning")}
                    className={defense.mitigations.cachePartitioning ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Particionamiento de Caché {defense.mitigations.cachePartitioning && "✓"}
                  </Button>
                  <Button
                    variant={defense.mitigations.randomization ? "default" : "outline"}
                    onClick={() => toggleMitigation("randomization")}
                    className={defense.mitigations.randomization ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Aleatorización {defense.mitigations.randomization && "✓"}
                  </Button>
                  <Button
                    variant={defense.mitigations.noiseInjection ? "default" : "outline"}
                    onClick={() => toggleMitigation("noiseInjection")}
                    className={defense.mitigations.noiseInjection ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Inyección de Ruido {defense.mitigations.noiseInjection && "✓"}
                  </Button>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Accesos a Memoria Recientes</div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                  {attack.accessedAddresses.slice(-50).map((address, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono bg-blue-500 text-white"
                      title={`Dirección: 0x${address.toString(16).toUpperCase()}`}
                    >
                      {(address / 1024).toFixed(0)}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Comparativa de Seguridad</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Riesgo de Ataque</span>
                      <span>
                        {defense.effectiveness > 70 ? "Bajo" : 
                         defense.effectiveness > 40 ? "Medio" : "Alto"}
                      </span>
                    </div>
                    <Progress 
                      value={100 - defense.effectiveness} 
                      className="w-full" 
                      color={
                        defense.effectiveness > 70 ? "green" : 
                        defense.effectiveness > 40 ? "yellow" : "red"
                      }
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Complejidad del Ataque</span>
                      <span>
                        {config.attackType === "cache" ? "Alta" : 
                         config.attackType === "timing" ? "Media" : "Baja"}
                      </span>
                    </div>
                    <Progress 
                      value={
                        config.attackType === "cache" ? 90 : 
                        config.attackType === "timing" ? 60 : 30
                      } 
                      className="w-full" 
                      color={
                        config.attackType === "cache" ? "red" : 
                        config.attackType === "timing" ? "yellow" : "green"
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
          <CardTitle>Tipos de Side Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Canal de Caché</div>
              <p className="text-sm text-blue-700">
                El atacante observa el tiempo de acceso a memoria para determinar 
                si los datos están en caché o en memoria principal.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Canal de Tiempo</div>
              <p className="text-sm text-green-700">
                El atacante mide las diferencias de tiempo en la ejecución de 
                operaciones criptográficas para inferir información secreta.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Canal de Poder</div>
              <p className="text-sm text-yellow-700">
                El atacante analiza el consumo de energía del dispositivo para 
                extraer información sobre operaciones internas.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Canal de Emisión</div>
              <p className="text-sm text-purple-700">
                El atacante captura emanaciones electromagnéticas del dispositivo 
                para reconstruir información procesada.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Mitigaciones Comunes:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Ejecución de Tiempo Constante:</strong> Asegurar que las operaciones 
                  tomen el mismo tiempo independientemente de los datos secretos.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Particionamiento de Caché:</strong> Separar datos sensibles en 
                  diferentes regiones de caché para evitar interferencias.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Aleatorización:</strong> Cambiar aleatoriamente la disposición 
                  de datos en memoria para dificultar el análisis.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Inyección de Ruido:</strong> Agregar operaciones aleatorias para 
                  enmascarar los patrones reales de acceso a memoria.
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
