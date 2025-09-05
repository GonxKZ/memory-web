import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function MemoryPrefetchingVisualization() {
  const [config, setConfig] = useState({
    cacheSize: 32768, // 32KB
    blockSize: 64, // 64 bytes
    prefetchDepth: 4, // Number of blocks to prefetch
    prefetchThreshold: 3, // Sequential accesses before prefetching
    simulationSpeed: 200 // ms
  })
  
  const [prefetching, setPrefetching] = useState({
    pattern: "sequential" as "sequential" | "strided" | "random",
    accesses: [] as {
      address: number,
      hit: boolean,
      prefetched: boolean,
      latency: number
    }[],
    prefetchQueue: [] as {
      address: number,
      issued: boolean,
      completed: boolean
    }[],
    statistics: {
      totalAccesses: 0,
      hits: 0,
      misses: 0,
      prefetchHits: 0,
      uselessPrefetches: 0,
      hitRate: 0,
      prefetchAccuracy: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize prefetching simulation
  useEffect(() => {
    // Create initial access pattern
    const accesses = []
    const cacheBlocks = Math.floor(config.cacheSize / config.blockSize)
    
    // Create sequential access pattern
    for (let i = 0; i < Math.min(50, cacheBlocks * 2); i++) {
      const address = i * config.blockSize
      accesses.push({
        address,
        hit: i < cacheBlocks, // First accesses are hits
        prefetched: false,
        latency: i < cacheBlocks ? 1 : 100 // Cache hit vs miss latency
      })
    }
    
    setPrefetching({
      pattern: "sequential",
      accesses,
      prefetchQueue: [],
      statistics: {
        totalAccesses: accesses.length,
        hits: accesses.filter(a => a.hit).length,
        misses: accesses.filter(a => !a.hit).length,
        prefetchHits: 0,
        uselessPrefetches: 0,
        hitRate: parseFloat((accesses.filter(a => a.hit).length / accesses.length * 100).toFixed(1)),
        prefetchAccuracy: 0
      }
    })
  }, [config])

  // Simulate prefetching
  const simulatePrefetching = async () => {
    setIsRunning(true)
    setProgress(0)
    
    const newAccesses = [...prefetching.accesses]
    const hits = prefetching.statistics.hits
    const misses = prefetching.statistics.misses
    const prefetchHits = prefetching.statistics.prefetchHits
    let uselessPrefetches = prefetching.statistics.uselessPrefetches
    const prefetchQueue: any[] = []
    
    // Simulate memory accesses
    for (let i = 0; i < newAccesses.length; i++) {
      setProgress((i / newAccesses.length) * 100)
      
      const access = newAccesses[i]
      
      // Simulate prefetching based on access pattern
      if (i >= config.prefetchThreshold) {
        // Check for sequential pattern
        let isSequential = true
        for (let j = 1; j <= config.prefetchThreshold; j++) {
          const prevAccess = newAccesses[i - j]
          const currentAccess = newAccesses[i - j + 1]
          if (currentAccess.address - prevAccess.address !== config.blockSize) {
            isSequential = false
            break
          }
        }
        
        if (isSequential) {
          // Issue prefetch for next blocks
          for (let j = 1; j <= config.prefetchDepth; j++) {
            const prefetchAddress = access.address + j * config.blockSize
            prefetchQueue.push({
              address: prefetchAddress,
              issued: true,
              completed: false
            })
          }
        }
      }
      
      // Complete some prefetches
      if (prefetchQueue.length > 0 && Math.random() > 0.3) {
        const completedPrefetch = prefetchQueue.shift()
        if (completedPrefetch) {
          completedPrefetch.completed = true
          
          // Check if this prefetch was useful
          const isUseful = newAccesses.some(a => 
            a.address === completedPrefetch.address && !a.hit
          )
          
          if (!isUseful) {
            uselessPrefetches++
          }
        }
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 10))
    }
    
    // Update statistics
    const totalAccesses = hits + misses
    const hitRate = totalAccesses > 0 ? parseFloat((hits / totalAccesses * 100).toFixed(1)) : 0
    const prefetchAccuracy = prefetchHits + uselessPrefetches > 0 
      ? parseFloat((prefetchHits / (prefetchHits + uselessPrefetches) * 100).toFixed(1)) 
      : 0
    
    setPrefetching(prev => ({
      ...prev,
      accesses: newAccesses,
      prefetchQueue: [...prefetchQueue],
      statistics: {
        totalAccesses,
        hits,
        misses,
        prefetchHits,
        uselessPrefetches,
        hitRate,
        prefetchAccuracy
      }
    }))
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    
    // Reset prefetching state
    setPrefetching(prev => ({
      ...prev,
      statistics: {
        totalAccesses: 0,
        hits: 0,
        misses: 0,
        prefetchHits: 0,
        uselessPrefetches: 0,
        hitRate: 0,
        prefetchAccuracy: 0
      }
    }))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Prefetching de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo el prefetching mejora el rendimiento al anticipar accesos a memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Prefetching</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cacheSize">Tamaño de Caché (KB)</Label>
              <Input
                id="cacheSize"
                type="number"
                value={config.cacheSize / 1024}
                onChange={(e) => setConfig({...config, cacheSize: Number(e.target.value) * 1024})}
                min="4"
                step="4"
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
              <Label htmlFor="prefetchDepth">Profundidad de Prefetch</Label>
              <Input
                id="prefetchDepth"
                type="range"
                min="1"
                max="16"
                value={config.prefetchDepth}
                onChange={(e) => setConfig({...config, prefetchDepth: Number(e.target.value)})}
              />
              <div className="text-center">{config.prefetchDepth} bloques</div>
            </div>

            <div>
              <Label htmlFor="prefetchThreshold">Umbral de Prefetch</Label>
              <Input
                id="prefetchThreshold"
                type="range"
                min="1"
                max="10"
                value={config.prefetchThreshold}
                onChange={(e) => setConfig({...config, prefetchThreshold: Number(e.target.value)})}
              />
              <div className="text-center">{config.prefetchThreshold} accesos</div>
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

            <div>
              <Label className="block text-sm font-medium mb-1">
                Patrón de Acceso
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={prefetching.pattern === "sequential" ? "default" : "outline"}
                  onClick={() => setPrefetching({...prefetching, pattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={prefetching.pattern === "strided" ? "default" : "outline"}
                  onClick={() => setPrefetching({...prefetching, pattern: "strided"})}
                >
                  Saltos
                </Button>
                <Button
                  variant={prefetching.pattern === "random" ? "default" : "outline"}
                  onClick={() => setPrefetching({...prefetching, pattern: "random"})}
                >
                  Aleatorio
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulatePrefetching} 
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
            <CardTitle>Estado de Prefetching</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Aciertos</div>
                  <div className="text-2xl font-bold text-blue-600">{prefetching.statistics.hitRate}%</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Precisión de Prefetch</div>
                  <div className="text-2xl font-bold text-green-600">{prefetching.statistics.prefetchAccuracy}%</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Prefetch Inútiles</div>
                  <div className="text-2xl font-bold text-red-600">{prefetching.statistics.uselessPrefetches}</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Aciertos de Prefetch</div>
                  <div className="text-2xl font-bold text-purple-600">{prefetching.statistics.prefetchHits}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Accesos a Memoria</div>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                  {prefetching.accesses.slice(-30).map((access, index) => (
                    <div
                      key={index}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${access.hit 
                          ? access.prefetched 
                            ? "bg-green-500 text-white" 
                            : "bg-blue-500 text-white"
                          : "bg-red-500 text-white"}
                      `}
                      title={
                        `Dirección: 0x${access.address.toString(16).toUpperCase()}
` +
                        `Latencia: ${access.latency} ns
` +
                        `${access.hit ? "Acierto" : "Fallo"} ${access.prefetched ? "(prefetched)" : ""}`
                      }
                    >
                      {access.hit ? (access.prefetched ? "P" : "A") : "F"}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Cola de Prefetch</div>
                <div className="flex flex-wrap gap-1">
                  {prefetching.prefetchQueue.slice(-10).map((prefetch, index) => (
                    <div
                      key={index}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${prefetch.completed 
                          ? "bg-green-300" 
                          : prefetch.issued 
                            ? "bg-yellow-300" 
                            : "bg-gray-300"}
                      `}
                      title={
                        `Dirección: 0x${prefetch.address.toString(16).toUpperCase()}
` +
                        `Estado: ${prefetch.completed ? "Completado" : prefetch.issued ? "En progreso" : "Pendiente"}`
                      }
                    >
                      {prefetch.completed ? "✓" : prefetch.issued ? "↻" : "?"}
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
          <CardTitle>Cómo Funciona el Prefetching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Mecanismo de Prefetching</div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">1</div>
                  <div>
                    <div className="font-medium">Detección de Patrones</div>
                    <div className="text-sm text-gray-600">El procesador detecta patrones de acceso secuencial o con saltos</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">2</div>
                  <div>
                    <div className="font-medium">Solicitud de Prefetch</div>
                    <div className="text-sm text-gray-600">Se solicitan bloques de memoria futuros antes de que se necesiten</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">3</div>
                  <div>
                    <div className="font-medium">Carga en Caché</div>
                    <div className="text-sm text-gray-600">Los datos se cargan en caché mientras la CPU ejecuta otras instrucciones</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">4</div>
                  <div>
                    <div className="font-medium">Uso Eficiente</div>
                    <div className="text-sm text-gray-600">Cuando la CPU necesita los datos, ya están en caché (acierto de prefetch)</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Tipos de Prefetching</div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium mb-1">Prefetching por Hardware</div>
                  <div className="text-sm text-gray-600">
                    Circuitos especializados detectan patrones y cargan datos automáticamente
                  </div>
                  <div className="mt-2 text-xs p-2 bg-blue-100 rounded">
                    Ejemplo: Prefetchers de flujo en procesadores Intel/AMD
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium mb-1">Prefetching por Software</div>
                  <div className="text-sm text-gray-600">
                    Instrucciones explícitas en el código para cargar datos anticipadamente
                  </div>
                  <div className="mt-2 text-xs p-2 bg-green-100 rounded">
                    Ejemplo: __builtin_prefetch() en GCC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}