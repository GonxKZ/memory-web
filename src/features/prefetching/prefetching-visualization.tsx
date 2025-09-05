import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"
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

export default function MemoryPrefetchingVisualization() {
  const [config, setConfig] = useState({
    prefetcherType: "stream" as "stream" | "stride" | "ml" | "none",
    accessPattern: "sequential" as "sequential" | "stride" | "random" | "pointer-chasing",
    stride: 1,
    cacheSize: 32768, // 32KB
    blockSize: 64, // 64 bytes
    prefetchDistance: 2,
    memoryLatency: 100 // ns
  })
  
  const [prefetching, setPrefetching] = useState({
    accesses: [] as {address: number, prefetched: boolean, hit: boolean, latency: number}[],
    prefetchQueue: [] as {address: number, issued: boolean, completed: boolean}[],
    stats: {
      hits: 0,
      misses: 0,
      prefetchedHits: 0,
      uselessPrefetches: 0,
      totalLatency: 0,
      averageLatency: 0
    }
  })
  
  const [history, setHistory] = useState<{
    time: number,
    hits: number,
    misses: number,
    prefetchedHits: number,
    uselessPrefetches: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [guided, setGuided] = useState(false)

  // Simulate prefetching
  const simulatePrefetching = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setPrefetching({
      accesses: [],
      prefetchQueue: [],
      stats: {
        hits: 0,
        misses: 0,
        prefetchedHits: 0,
        uselessPrefetches: 0,
        totalLatency: 0,
        averageLatency: 0
      }
    })
    
    const newHistory = []
    let totalHits = 0
    let totalMisses = 0
    let totalPrefetchedHits = 0
    const totalUselessPrefetches = 0
    let totalLatency = 0
    
    // Simulate memory accesses
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate next memory address based on access pattern
      let address = 0
      if (config.accessPattern === "sequential") {
        address = i * config.blockSize
      } else if (config.accessPattern === "stride") {
        address = i * config.stride * config.blockSize
      } else if (config.accessPattern === "random") {
        address = Math.floor(Math.random() * 1000) * config.blockSize
      } else {
        // Pointer chasing - more complex pattern
        address = (i * 17 + 31) % (1000 * config.blockSize)
      }
      
      // Check if prefetched
      const isPrefetched = prefetching.prefetchQueue.some(p => p.address === address && p.completed)
      
      // Check cache hit/miss
      const isInCache = prefetching.accesses.some(a => 
        Math.floor(a.address / config.blockSize) === Math.floor(address / config.blockSize)
      )
      
      const isHit = isInCache || isPrefetched
      const latency = isHit ? (isPrefetched ? 1 : 5) : config.memoryLatency
      
      // Update stats
      if (isHit) {
        totalHits++
        if (isPrefetched) {
          totalPrefetchedHits++
        }
      } else {
        totalMisses++
      }
      
      totalLatency += latency
      
      // Add to accesses
      const newAccess = {
        address,
        prefetched: isPrefetched,
        hit: isHit,
        latency
      }
      
      setPrefetching(prev => ({
        ...prev,
        accesses: [...prev.accesses.slice(-49), newAccess],
        stats: {
          ...prev.stats,
          hits: totalHits,
          misses: totalMisses,
          prefetchedHits: totalPrefetchedHits,
          uselessPrefetches: totalUselessPrefetches,
          totalLatency,
          averageLatency: totalLatency / (i + 1)
        }
      }))
      
      // Issue prefetches based on pattern and prefetcher type
      if (config.prefetcherType !== "none") {
        const prefetchAddresses: {address: number; issued: boolean; completed: boolean}[] = []
        
        // Generate prefetch addresses
        for (let j = 1; j <= config.prefetchDistance; j++) {
          let prefetchAddress = address + (j * config.blockSize)
          
          if (config.accessPattern === "stride") {
            prefetchAddress = address + (j * config.stride * config.blockSize)
          } else if (config.accessPattern === "random") {
            // Random prefetching is less effective
            prefetchAddress = Math.floor(Math.random() * 1000) * config.blockSize
          } else if (config.accessPattern === "pointer-chasing") {
            // Simulate pointer chasing pattern
            prefetchAddress = (prefetchAddress * 17 + 31) % (1000 * config.blockSize)
          }
          
          prefetchAddresses.push({
            address: prefetchAddress,
            issued: false,
            completed: false
          })
        }
        
        setPrefetching(prev => ({
          ...prev,
          prefetchQueue: [...prev.prefetchQueue, ...prefetchAddresses]
        }))
      }
      
      // Complete some prefetches
      setPrefetching(prev => {
        const updatedQueue = prev.prefetchQueue.map(p => {
          if (!p.completed && Math.random() > 0.7) {
            return { ...p, completed: true }
          }
          return p
        })
        
        // Count useless prefetches (prefetched but not used)
        const usedPrefetches = prev.accesses.filter(a => a.prefetched).length
        const issuedPrefetches = updatedQueue.filter(p => p.issued).length
        const uselessPrefetches = Math.max(0, issuedPrefetches - usedPrefetches)
        
        return {
          ...prev,
          prefetchQueue: updatedQueue,
          stats: {
            ...prev.stats,
            uselessPrefetches
          }
        }
      })
      
      // Add to history
      if (i % 5 === 0) {
        newHistory.push({
          time: i,
          hits: totalHits,
          misses: totalMisses,
          prefetchedHits: totalPrefetchedHits,
          uselessPrefetches: totalUselessPrefetches
        })
        setHistory(newHistory)
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setPrefetching({
      accesses: [],
      prefetchQueue: [],
      stats: {
        hits: 0,
        misses: 0,
        prefetchedHits: 0,
        uselessPrefetches: 0,
        totalLatency: 0,
        averageLatency: 0
      }
    })
  }

  // Calculate hit rate
  const hitRate = prefetching.stats.hits + prefetching.stats.misses > 0 
    ? (prefetching.stats.hits / (prefetching.stats.hits + prefetching.stats.misses) * 100)
    : 0

  // Calculate prefetch effectiveness
  const prefetchEffectiveness = prefetching.stats.prefetchedHits > 0 
    ? (prefetching.stats.prefetchedHits / (prefetching.stats.hits + prefetching.stats.misses) * 100)
    : 0

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Prefetching de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo el prefetching mejora el rendimiento de acceso a memoria
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Pedir por adelantado"
        metaphor="Como pedir el siguiente plato antes de terminar el actual. Gana si hay patrón, pierde si hay ruido."
        idea="Secuencial/stride/streaming pueden elevar el hit‑rate; la distancia y cobertura importan tanto como el coste en ancho de banda."
        bullets={["Patrón → predictor", "Distancia de prefetch", "Polución y tráfico inútil"]}
        board={{ title: "Efecto", content: "HitRate↑ ⇒ latencia media↓\nPero: Prefetch inútil ⇒ BW desperdiciado" }}
      />

      {guided && (
        <GuidedFlow
          title="Cómo decide el prefetcher"
          steps={[
            { title: "Observar patrón", content: "Secuencial, stride, aleatorio o pointer chasing." },
            { title: "Emitir prefetch", content: "Encola direcciones futuras según la distancia." },
            { title: "Completar cola", content: "Marca completados: listos para convertir misses en hits." },
            { title: "Medir", content: "Compara aciertos prefetched vs misses y BW útil." },
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
              <Label htmlFor="prefetcherType">Tipo de Prefetcher</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.prefetcherType === "stream" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetcherType: "stream"})}
                >
                  Stream
                </Button>
                <Button
                  variant={config.prefetcherType === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetcherType: "stride"})}
                >
                  Stride
                </Button>
                <Button
                  variant={config.prefetcherType === "ml" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetcherType: "ml"})}
                >
                  ML
                </Button>
                <Button
                  variant={config.prefetcherType === "none" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetcherType: "none"})}
                >
                  Ninguno
                </Button>
              </div>
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
                  variant={config.accessPattern === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "stride"})}
                >
                  Stride
                </Button>
                <Button
                  variant={config.accessPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.accessPattern === "pointer-chasing" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "pointer-chasing"})}
                >
                  Pointer Chasing
                </Button>
              </div>
            </div>

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

            <div>
              <Label htmlFor="prefetchDistance">Distancia de Prefetch</Label>
              <Input
                id="prefetchDistance"
                type="range"
                min="1"
                max="8"
                value={config.prefetchDistance}
                onChange={(e) => setConfig({...config, prefetchDistance: Number(e.target.value)})}
              />
              <div className="text-center text-sm">{config.prefetchDistance} bloques</div>
            </div>

            <div>
              <Label htmlFor="memoryLatency">Latencia de Memoria (ns)</Label>
              <Input
                id="memoryLatency"
                type="range"
                min="50"
                max="500"
                value={config.memoryLatency}
                onChange={(e) => setConfig({...config, memoryLatency: Number(e.target.value)})}
              />
              <div className="text-center text-sm">{config.memoryLatency} ns</div>
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
            <CardTitle>Resultados de la Simulación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Aciertos</div>
                  <div className="text-2xl font-bold text-green-600">
                    {prefetching.stats.hits}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {prefetching.stats.misses}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Aciertos Prefetch</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {prefetching.stats.prefetchedHits}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Prefetch Inútil</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {prefetching.stats.uselessPrefetches}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Aciertos</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {hitRate.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Efectividad</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {prefetchEffectiveness.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Latencia Media</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {prefetching.stats.averageLatency.toFixed(1)} ns
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Accesos Recientes</div>
                <div className="flex flex-wrap gap-1">
                  {prefetching.accesses.slice(-20).map((access, index) => (
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
                      title={`
                        Dirección: 0x${access.address.toString(16).toUpperCase()}
                        ${access.hit ? "Acierto" : "Fallo"}
                        ${access.prefetched ? " (Prefetch)" : ""}
                        Latencia: ${access.latency} ns
                      `}
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
                      title={`
                        Dirección: 0x${prefetch.address.toString(16).toUpperCase()}
                        Estado: ${prefetch.completed ? "Completado" : prefetch.issued ? "En progreso" : "Pendiente"}
                      `}
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
                    label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hits" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Aciertos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="misses" 
                    stroke="#ef4444" 
                    name="Fallos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prefetchedHits" 
                    stroke="#3b82f6" 
                    name="Aciertos Prefetch"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uselessPrefetches" 
                    stroke="#f59e0b" 
                    name="Prefetch Inútil"
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
          <CardTitle>Tipos de Prefetchers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Prefetcher Stream</div>
              <p className="text-sm text-blue-700 mb-3">
                Detecta patrones secuenciales y prefetchea bloques consecutivos.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Excelente para acceso secuencial</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Bajo overhead</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Inefectivo para patrones aleatorios</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Prefetcher Stride</div>
              <p className="text-sm text-green-700 mb-3">
                Detecta patrones de stride y prefetchea con el mismo stride.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Maneja patrones de stride fijo</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Adaptable a diferentes strides</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Complejidad aumentada</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Prefetcher ML</div>
              <p className="text-sm text-purple-700 mb-3">
                Usa machine learning para predecir futuros accesos.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Patrones complejos detectables</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Adaptación automática</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Mayor overhead computacional</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold text-gray-800 mb-2">Sin Prefetching</div>
              <p className="text-sm text-gray-700 mb-3">
                Sin prefetching, depende completamente del acceso demand-driven.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Sin prefetches inútiles</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Mayor latencia de fallos</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Sin anticipación</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa prefetching para patrones predecibles como bucles</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Evita prefetching para datos aleatorios o impredecibles</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Monitorea la tasa de prefetches útiles vs inútiles</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Ajusta la distancia de prefetch según la latencia de memoria</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
