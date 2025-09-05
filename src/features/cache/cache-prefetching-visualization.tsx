import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface CacheLine {
  id: number;
  tag: number;
  valid: boolean;
  dirty: boolean;
  lastAccessed: number;
  prefetched: boolean;
  accessed: boolean;
}

interface StreamBufferEntry {
  address: number;
  valid: boolean;
  accessed: boolean;
}

export default function CachePrefetchingVisualization() {
  const [config, setConfig] = useState({
    cacheSize: 32768, // 32KB
    cacheLineSize: 64, // bytes
    prefetchType: "sequential" as "sequential" | "stride" | "stream" | "none",
    strideDistance: 2,
    streamWindowSize: 4,
    memoryAccessPattern: "sequential" as "sequential" | "random" | "stride" | "pointerChase",
    pointerChaseLength: 16,
    simulationSpeed: 200 // ms
  })
  
  const [prefetching, setPrefetching] = useState({
    cache: [] as CacheLine[],
    prefetcher: {
      streamBuffer: [] as StreamBufferEntry[],
      stridePredictor: {
        lastAddress: 0,
        stride: 0,
        confidence: 0
      },
      sequentialPredictor: {
        nextAddress: 0,
        enabled: true
      }
    },
    statistics: {
      hits: 0,
      misses: 0,
      prefetchHits: 0,
      prefetchMisses: 0,
      uselessPrefetches: 0,
      accuracy: 0,
      coverage: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize cache
  useEffect(() => {
    const numLines = config.cacheSize / config.cacheLineSize
    const cache = []
    
    for (let i = 0; i < numLines; i++) {
      cache.push({
        id: i,
        tag: Math.floor(Math.random() * 1000),
        valid: false,
        dirty: false,
        lastAccessed: 0,
        prefetched: false,
        accessed: false
      })
    }
    
    setPrefetching({
      cache,
      prefetcher: {
        streamBuffer: Array(8).fill(null).map(() => ({
          address: 0,
          valid: false,
          accessed: false
        })),
        stridePredictor: {
          lastAddress: 0,
          stride: 0,
          confidence: 0
        },
        sequentialPredictor: {
          nextAddress: 0,
          enabled: true
        }
      },
      statistics: {
        hits: 0,
        misses: 0,
        prefetchHits: 0,
        prefetchMisses: 0,
        uselessPrefetches: 0,
        accuracy: 0,
        coverage: 0
      }
    })
  }, [config.cacheSize, config.cacheLineSize])

  // Simulate cache prefetching
  const simulateCachePrefetching = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Reset statistics
    setPrefetching(prev => ({
      ...prev,
      statistics: {
        hits: 0,
        misses: 0,
        prefetchHits: 0,
        prefetchMisses: 0,
        uselessPrefetches: 0,
        accuracy: 0,
        coverage: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current prefetching state
      const currentPrefetching = JSON.parse(JSON.stringify(prefetching))
      const currentStatistics = { ...prefetching.statistics }
      
      // Generate memory access based on pattern
      let address: number
      if (config.memoryAccessPattern === "sequential") {
        address = step * config.cacheLineSize
      } else if (config.memoryAccessPattern === "random") {
        address = Math.floor(Math.random() * 10000) * config.cacheLineSize
      } else if (config.memoryAccessPattern === "stride") {
        address = step * config.strideDistance * config.cacheLineSize
      } else {
        // Pointer chase - create a chain of pointers
        address = (step % config.pointerChaseLength) * config.cacheLineSize
      }
      
      // Calculate cache line tag
      const tag = Math.floor(address / config.cacheLineSize)
      
      // Check if address is in cache
      const cacheLineIndex = currentPrefetching.cache.findIndex((line: { tag: number; valid: boolean; }) => line.tag === tag && line.valid)
      
      if (cacheLineIndex !== -1) {
        // Cache hit
        currentPrefetching.cache[cacheLineIndex].lastAccessed = step
        currentPrefetching.cache[cacheLineIndex].accessed = true
        currentStatistics.hits++
        
        // If prefetched, count as prefetch hit
        if (currentPrefetching.cache[cacheLineIndex].prefetched) {
          currentStatistics.prefetchHits++
        }
      } else {
        // Cache miss
        currentStatistics.misses++
        
        // If prefetched but not accessed, count as useless prefetch
        const prefetchedLineIndex = currentPrefetching.cache.findIndex((line: { tag: number; prefetched: boolean; accessed: boolean; }) => line.tag === tag && line.prefetched && !line.accessed)
        if (prefetchedLineIndex !== -1) {
          currentStatistics.uselessPrefetches++
          currentPrefetching.cache[prefetchedLineIndex].valid = false
          currentPrefetching.cache[prefetchedLineIndex].prefetched = false
        }
        
        // Find an empty cache line or evict LRU
        let emptyLineIndex = currentPrefetching.cache.findIndex((line: { valid: boolean; }) => !line.valid)
        if (emptyLineIndex === -1) {
          // Evict LRU line
          const lruLine = currentPrefetching.cache.reduce((lru: { lastAccessed: number; }, line: { lastAccessed: number; }) => 
            line.lastAccessed < lru.lastAccessed ? line : lru
          )
          emptyLineIndex = currentPrefetching.cache.findIndex((line: { id: any; }) => line.id === lruLine.id)
        }
        
        // Load data into cache
        if (emptyLineIndex !== -1) {
          currentPrefetching.cache[emptyLineIndex] = {
            id: emptyLineIndex,
            tag,
            valid: true,
            dirty: false,
            lastAccessed: step,
            prefetched: false,
            accessed: true
          }
        }
        
        // Trigger prefetch based on type
        if (config.prefetchType !== "none") {
          // Prefetch next addresses
          const numPrefetches = config.prefetchType === "stream" ? config.streamWindowSize : 
                               config.prefetchType === "stride" ? 2 : 1
          
          for (let i = 1; i <= numPrefetches; i++) {
            let prefetchAddress: number
            
            if (config.prefetchType === "sequential") {
              prefetchAddress = (tag + i) * config.cacheLineSize
            } else if (config.prefetchType === "stride") {
              prefetchAddress = (tag + i * config.strideDistance) * config.cacheLineSize
            } else {
              // Stream prefetch
              prefetchAddress = (tag + i) * config.cacheLineSize
            }
            
            const prefetchTag = Math.floor(prefetchAddress / config.cacheLineSize)
            
            // Check if prefetch address is already in cache
            const prefetchLineIndex = currentPrefetching.cache.findIndex((line: { tag: number; valid: boolean; }) => line.tag === prefetchTag && line.valid)
            
            if (prefetchLineIndex === -1) {
              // Not in cache, allocate prefetch line
              let prefetchLineIndex = currentPrefetching.cache.findIndex((line: { valid: boolean; }) => !line.valid)
              if (prefetchLineIndex === -1) {
                // Evict LRU line for prefetch
                const lruLine = currentPrefetching.cache.reduce((lru: { lastAccessed: number; }, line: { lastAccessed: number; }) => 
                  line.lastAccessed < lru.lastAccessed ? line : lru
                )
                prefetchLineIndex = currentPrefetching.cache.findIndex((line: { id: any; }) => line.id === lruLine.id)
              }
              
              if (prefetchLineIndex !== -1) {
                currentPrefetching.cache[prefetchLineIndex] = {
                  id: prefetchLineIndex,
                  tag: prefetchTag,
                  valid: true,
                  dirty: false,
                  lastAccessed: step,
                  prefetched: true,
                  accessed: false
                }
                currentStatistics.prefetchMisses++
              }
            }
          }
        }
      }
      
      // Update prefetcher state
      if (config.prefetchType === "stride") {
        // Update stride predictor
        const stride = tag - currentPrefetching.prefetcher.stridePredictor.lastAddress
        if (stride === currentPrefetching.prefetcher.stridePredictor.stride) {
          currentPrefetching.prefetcher.stridePredictor.confidence = 
            Math.min(100, currentPrefetching.prefetcher.stridePredictor.confidence + 10)
        } else {
          currentPrefetching.prefetcher.stridePredictor.confidence = 
            Math.max(0, currentPrefetching.prefetcher.stridePredictor.confidence - 5)
        }
        currentPrefetching.prefetcher.stridePredictor.lastAddress = tag
        currentPrefetching.prefetcher.stridePredictor.stride = stride
      } else if (config.prefetchType === "sequential") {
        // Update sequential predictor
        currentPrefetching.prefetcher.sequentialPredictor.nextAddress = tag + 1
      } else if (config.prefetchType === "stream") {
        // Update stream buffer
        // Simple stream buffer update
        currentPrefetching.prefetcher.streamBuffer = currentPrefetching.prefetcher.streamBuffer.map((entry: any, index: number) => ({
          ...entry,
          address: tag + index,
          valid: true,
          accessed: false
        }))
      }
      
      // Calculate statistics
      const totalAccesses = currentStatistics.hits + currentStatistics.misses
      currentStatistics.accuracy = totalAccesses > 0 
        ? (currentStatistics.hits / totalAccesses) * 100 
        : 0
        
      const totalPrefetches = currentStatistics.prefetchHits + currentStatistics.prefetchMisses
      currentStatistics.coverage = totalPrefetches > 0 
        ? (currentStatistics.prefetchHits / totalPrefetches) * 100 
        : 0
      
      // Update state
      setPrefetching(currentPrefetching)
      setPrefetching(prev => ({...prev, statistics: currentStatistics}))
      
      // Add to history every 10 steps (historial desactivado por ahora)
      
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
    
    // Reset prefetching state
    const numLines = config.cacheSize / config.cacheLineSize
    const cache = []
    
    for (let i = 0; i < numLines; i++) {
      cache.push({
        id: i,
        tag: Math.floor(Math.random() * 1000),
        valid: false,
        dirty: false,
        lastAccessed: 0,
        prefetched: false,
        accessed: false
      })
    }
    
    setPrefetching({
      cache,
      prefetcher: {
        streamBuffer: Array(8).fill(null).map(() => ({
          address: 0,
          valid: false,
          accessed: false
        })),
        stridePredictor: {
          lastAddress: 0,
          stride: 0,
          confidence: 0
        },
        sequentialPredictor: {
          nextAddress: 0,
          enabled: true
        }
      },
      statistics: {
        hits: 0,
        misses: 0,
        prefetchHits: 0,
        prefetchMisses: 0,
        uselessPrefetches: 0,
        accuracy: 0,
        coverage: 0
      }
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Prefetching de Caché</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo el prefetching mejora el rendimiento al anticipar accesos a memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="cacheLineSize">Tamaño de Línea de Caché (bytes)</Label>
              <select
                id="cacheLineSize"
                value={config.cacheLineSize}
                onChange={(e) => setConfig({...config, cacheLineSize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={32}>32 bytes</option>
                <option value={64}>64 bytes</option>
                <option value={128}>128 bytes</option>
              </select>
            </div>

            <div>
              <Label htmlFor="prefetchType">Tipo de Prefetching</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.prefetchType === "none" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetchType: "none"})}
                >
                  Ninguno
                </Button>
                <Button
                  variant={config.prefetchType === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetchType: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.prefetchType === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetchType: "stride"})}
                >
                  Stride
                </Button>
                <Button
                  variant={config.prefetchType === "stream" ? "default" : "outline"}
                  onClick={() => setConfig({...config, prefetchType: "stream"})}
                >
                  Stream
                </Button>
              </div>
            </div>

            {config.prefetchType === "stride" && (
              <div>
                <Label htmlFor="strideDistance">Distancia de Stride</Label>
                <Input
                  id="strideDistance"
                  type="number"
                  value={config.strideDistance}
                  onChange={(e) => setConfig({...config, strideDistance: Number(e.target.value)})}
                  min="1"
                  max="16"
                  step="1"
                />
              </div>
            )}

            {config.prefetchType === "stream" && (
              <div>
                <Label htmlFor="streamWindowSize">Tamaño de Ventana Stream</Label>
                <Input
                  id="streamWindowSize"
                  type="number"
                  value={config.streamWindowSize}
                  onChange={(e) => setConfig({...config, streamWindowSize: Number(e.target.value)})}
                  min="1"
                  max="16"
                  step="1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="memoryAccessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.memoryAccessPattern === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryAccessPattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.memoryAccessPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryAccessPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.memoryAccessPattern === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryAccessPattern: "stride"})}
                >
                  Stride
                </Button>
                <Button
                  variant={config.memoryAccessPattern === "pointerChase" ? "default" : "outline"}
                  onClick={() => setConfig({...config, memoryAccessPattern: "pointerChase"})}
                >
                  Pointer Chase
                </Button>
              </div>
            </div>

            {config.memoryAccessPattern === "pointerChase" && (
              <div>
                <Label htmlFor="pointerChaseLength">Longitud de Pointer Chase</Label>
                <Input
                  id="pointerChaseLength"
                  type="number"
                  value={config.pointerChaseLength}
                  onChange={(e) => setConfig({...config, pointerChaseLength: Number(e.target.value)})}
                  min="4"
                  max="64"
                  step="1"
                />
              </div>
            )}

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
                onClick={simulateCachePrefetching} 
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
            <CardTitle>Estado de Caché y Prefetching</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Aciertos</div>
                  <div className="text-2xl font-bold text-green-600">
                    {prefetching.statistics.hits}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {prefetching.statistics.misses}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Precisión</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {prefetching.statistics.accuracy.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Cobertura</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {prefetching.statistics.coverage.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Caché ({prefetching.cache.length} líneas)</div>
                <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded">
                  {prefetching.cache.map(line => (
                    <div
                      key={line.id}
                      className={`
                        w-8 h-8 rounded flex items-center justify-center text-xs
                        ${line.valid 
                          ? line.prefetched 
                            ? line.accessed 
                              ? "bg-purple-500 text-white" 
                              : "bg-blue-500 text-white"
                            : line.accessed 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300"
                          : "bg-gray-200"}
                      `}
                      title={`
                        Línea: ${line.id}
                        Tag: ${line.tag}
                        Válida: ${line.valid ? "Sí" : "No"}
                        Sucia: ${line.dirty ? "Sí" : "No"}
                        Prefetched: ${line.prefetched ? "Sí" : "No"}
                        Accedida: ${line.accessed ? "Sí" : "No"}
                        Último acceso: ${line.lastAccessed}
                      `}
                    >
                      {line.valid ? (line.prefetched ? "P" : "C") : ""}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Prefetching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-blue-50 rounded text-center">
                          <div className="text-xs text-gray-500">Prefetch Hits</div>
                          <div className="font-semibold text-blue-600">
                            {prefetching.statistics.prefetchHits}
                          </div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500">Prefetch Misses</div>
                          <div className="font-semibold text-red-600">
                            {prefetching.statistics.prefetchMisses}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-yellow-50 rounded text-center">
                        <div className="text-xs text-gray-500">Prefetch Inútiles</div>
                        <div className="font-semibold text-yellow-600">
                          {prefetching.statistics.uselessPrefetches}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Buffer de Stream</div>
                        <div className="flex flex-wrap gap-1">
                          {prefetching.prefetcher.streamBuffer.map((entry, index) => (
                            <div
                              key={index}
                              className={`
                                w-6 h-6 rounded flex items-center justify-center text-xs
                                ${entry.valid 
                                  ? entry.accessed 
                                    ? "bg-green-500 text-white" 
                                    : "bg-blue-500 text-white"
                                  : "bg-gray-200"}
                              `}
                              title={`
                                Dirección: ${entry.address}
                                Válida: ${entry.valid ? "Sí" : "No"}
                                Accedida: ${entry.accessed ? "Sí" : "No"}
                              `}
                            >
                              {entry.valid ? (entry.accessed ? "A" : "P") : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Predictor de Stride</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Última Dirección</div>
                          <div className="font-semibold">
                            0x{(prefetching.prefetcher.stridePredictor.lastAddress * config.cacheLineSize).toString(16).toUpperCase()}
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Stride</div>
                          <div className="font-semibold">
                            {prefetching.prefetcher.stridePredictor.stride}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Confianza</span>
                          <span>{prefetching.prefetcher.stridePredictor.confidence.toFixed(0)}%</span>
                        </div>
                        <Progress 
                          value={prefetching.prefetcher.stridePredictor.confidence} 
                          className="w-full" 
                          color={prefetching.prefetcher.stridePredictor.confidence > 70 ? "green" : "yellow"}
                        />
                      </div>
                      
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">Predictor Secuencial</div>
                        <div className="font-semibold">
                          Siguiente: 0x{(prefetching.prefetcher.sequentialPredictor.nextAddress * config.cacheLineSize).toString(16).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Habilitado: {prefetching.prefetcher.sequentialPredictor.enabled ? "Sí" : "No"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  )
}
