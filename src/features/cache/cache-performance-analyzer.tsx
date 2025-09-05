import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"

export default function CachePerformanceAnalyzer() {
  const [config, setConfig] = useState({
    cacheSize: 32768, // 32KB
    blockSize: 64, // 64 bytes
    associativity: 8, // 8-way set associative
    replacementPolicy: "lru" as "lru" | "fifo" | "random"
  })
  
  const [simulation, setSimulation] = useState({
    accessPattern: "sequential" as "sequential" | "random" | "stride",
    stride: 1,
    dataSize: 100000,
    iterations: 1000
  })
  
  const [results, setResults] = useState({
    hits: 0,
    misses: 0,
    hitRate: 0,
    missRate: 0,
    totalTime: 0,
    cacheLines: 0,
    sets: 0
  })
  
  const [history, setHistory] = useState<{iteration: number, hitRate: number}[]>([])
  const [isRunning, setIsRunning] = useState(false)

  // Calculate cache parameters
  useEffect(() => {
    const sets = config.cacheSize / (config.blockSize * config.associativity)
    setResults(prev => ({
      ...prev,
      cacheLines: config.cacheSize / config.blockSize,
      sets: sets
    }))
  }, [config])

  // Simulate cache performance
  const simulatePerformance = () => {
    setIsRunning(true)
    setHistory([])
    
    // Initialize cache state
    const cacheSets: {valid: boolean, tag: number | null, lastAccessed: number}[][] = 
      Array(results.sets).fill(0).map(() => 
        Array(config.associativity).fill(0).map(() => ({
          valid: false,
          tag: null,
          lastAccessed: 0
        }))
      )
    
    let hits = 0
    let misses = 0
    const historyData = []
    
    // Simulation loop
    for (let iteration = 0; iteration < simulation.iterations; iteration++) {
      // Generate access pattern
      let address = 0
      if (simulation.accessPattern === "sequential") {
        address = iteration % simulation.dataSize
      } else if (simulation.accessPattern === "random") {
        address = Math.floor(Math.random() * simulation.dataSize)
      } else if (simulation.accessPattern === "stride") {
        address = (iteration * simulation.stride) % simulation.dataSize
      }
      
      // Calculate cache set index
      const blockOffset = Math.log2(config.blockSize)
      const indexBits = Math.log2(results.sets)
      const setIndex = (address >> blockOffset) & ((1 << indexBits) - 1)
      const tag = address >> (blockOffset + indexBits)
      
      // Check for cache hit
      const set = cacheSets[setIndex]
      let hit = false
      
      for (let i = 0; i < set.length; i++) {
        if (set[i].valid && set[i].tag === tag) {
          hit = true
          set[i].lastAccessed = iteration
          break
        }
      }
      
      if (hit) {
        hits++
      } else {
        misses++
        // Handle cache miss - replace a line
        const victimIndex = selectVictim(set, config.replacementPolicy)
        set[victimIndex] = {
          valid: true,
          tag: tag,
          lastAccessed: iteration
        }
      }
      
      // Record history every 10 iterations
      if (iteration % 10 === 0) {
        const hitRate = hits / (hits + misses) * 100
        historyData.push({
          iteration,
          hitRate: parseFloat(hitRate.toFixed(2))
        })
      }
    }
    
    const totalAccesses = hits + misses
    const hitRate = totalAccesses > 0 ? (hits / totalAccesses) * 100 : 0
    const missRate = 100 - hitRate
    
    setResults({
      hits,
      misses,
      hitRate: parseFloat(hitRate.toFixed(2)),
      missRate: parseFloat(missRate.toFixed(2)),
      totalTime: simulation.iterations,
      cacheLines: results.cacheLines,
      sets: results.sets
    })
    
    setHistory(historyData)
    setIsRunning(false)
  }

  // Select victim line for replacement
  const selectVictim = (
    set: {valid: boolean, tag: number | null, lastAccessed: number}[],
    policy: string
  ): number => {
    // Find invalid line first
    for (let i = 0; i < set.length; i++) {
      if (!set[i].valid) {
        return i
      }
    }
    
    // If no invalid lines, use replacement policy
    if (policy === "lru") {
      // Least Recently Used
      let oldest = 0
      for (let i = 1; i < set.length; i++) {
        if (set[i].lastAccessed < set[oldest].lastAccessed) {
          oldest = i
        }
      }
      return oldest
    } else if (policy === "fifo") {
      // First In First Out
      let oldest = 0
      for (let i = 1; i < set.length; i++) {
        if (set[i].lastAccessed < set[oldest].lastAccessed) {
          oldest = i
        }
      }
      return oldest
    } else {
      // Random
      return Math.floor(Math.random() * set.length)
    }
  }

  // Reset simulation
  const resetSimulation = () => {
    setResults({
      hits: 0,
      misses: 0,
      hitRate: 0,
      missRate: 0,
      totalTime: 0,
      cacheLines: config.cacheSize / config.blockSize,
      sets: (config.cacheSize / config.blockSize) / config.associativity
    })
    setHistory([])
    setIsRunning(false)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Analizador de Rendimiento de Caché</h1>
        <p className="text-gray-600 mt-2">
          Evalúa cómo diferentes configuraciones de caché afectan el rendimiento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Caché</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cacheSize">Tamaño de Caché (bytes)</Label>
              <Input
                id="cacheSize"
                type="number"
                value={config.cacheSize}
                onChange={(e) => setConfig({...config, cacheSize: Number(e.target.value)})}
                min="1024"
                step="1024"
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
              <Label htmlFor="associativity">Asociatividad</Label>
              <Input
                id="associativity"
                type="number"
                value={config.associativity}
                onChange={(e) => setConfig({...config, associativity: Number(e.target.value)})}
                min="1"
                max="16"
              />
            </div>

            <div>
              <Label>Política de Reemplazo</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.replacementPolicy === "lru" ? "default" : "outline"}
                  onClick={() => setConfig({...config, replacementPolicy: "lru"})}
                >
                  LRU
                </Button>
                <Button
                  variant={config.replacementPolicy === "fifo" ? "default" : "outline"}
                  onClick={() => setConfig({...config, replacementPolicy: "fifo"})}
                >
                  FIFO
                </Button>
                <Button
                  variant={config.replacementPolicy === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, replacementPolicy: "random"})}
                >
                  Aleatorio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Simulación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Patrón de Acceso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={simulation.accessPattern === "sequential" ? "default" : "outline"}
                  onClick={() => setSimulation({...simulation, accessPattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={simulation.accessPattern === "random" ? "default" : "outline"}
                  onClick={() => setSimulation({...simulation, accessPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={simulation.accessPattern === "stride" ? "default" : "outline"}
                  onClick={() => setSimulation({...simulation, accessPattern: "stride"})}
                >
                  Stride
                </Button>
              </div>
            </div>

            {simulation.accessPattern === "stride" && (
              <div>
                <Label htmlFor="stride">Valor de Stride</Label>
                <Input
                  id="stride"
                  type="number"
                  value={simulation.stride}
                  onChange={(e) => setSimulation({...simulation, stride: Number(e.target.value)})}
                  min="1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="dataSize">Tamaño de Datos (elementos)</Label>
              <Input
                id="dataSize"
                type="number"
                value={simulation.dataSize}
                onChange={(e) => setSimulation({...simulation, dataSize: Number(e.target.value)})}
                min="1000"
                step="1000"
              />
            </div>

            <div>
              <Label htmlFor="iterations">Iteraciones</Label>
              <Input
                id="iterations"
                type="number"
                value={simulation.iterations}
                onChange={(e) => setSimulation({...simulation, iterations: Number(e.target.value)})}
                min="100"
                step="100"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulatePerformance} 
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
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Resultados del Análisis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500">Aciertos</div>
                  <div className="text-2xl font-bold text-green-600">{results.hits.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500">Fallos</div>
                  <div className="text-2xl font-bold text-red-600">{results.misses.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500">Tasa de Aciertos</div>
                  <div className="text-2xl font-bold text-blue-600">{results.hitRate}%</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500">Tasa de Fallos</div>
                  <div className="text-2xl font-bold text-yellow-600">{results.missRate}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500">Líneas de Caché</div>
                  <div className="text-2xl font-bold text-purple-600">{results.cacheLines}</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded text-center">
                  <div className="text-xs text-gray-500">Conjuntos</div>
                  <div className="text-2xl font-bold text-indigo-600">{results.sets}</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500 mb-1">Progreso</div>
                <Progress 
                  value={isRunning ? 50 : results.hitRate} 
                  className="w-full" 
                  color={isRunning ? "blue" : "green"}
                />
                <div className="text-right text-xs mt-1">
                  {isRunning ? "En progreso..." : "Completado"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Simulación</CardTitle>
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
                    dataKey="iteration" 
                    label={{ value: "Iteración", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: "Tasa de Aciertos (%)", angle: -90, position: "insideLeft" }} 
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hitRate" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Tasa de Aciertos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay datos de simulación todavía. Ejecute una simulación para ver los resultados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Configuración Óptima</div>
              <p className="text-sm text-blue-700">
                Para patrones de acceso secuenciales, una caché con líneas de 64 bytes y 
                asociatividad 8-way suele ofrecer buen rendimiento.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Patrones de Acceso</div>
              <p className="text-sm text-green-700">
                Los patrones secuenciales tienen la mejor tasa de aciertos. 
                Los patrones aleatorios tienden a generar más fallos de caché.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Políticas de Reemplazo</div>
              <p className="text-sm text-purple-700">
                LRU es generalmente superior a FIFO y aleatorio, especialmente 
                para patrones de acceso con localidad temporal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}