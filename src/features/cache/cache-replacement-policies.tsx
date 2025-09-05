import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function CacheReplacementPolicies() {
  const [config, setConfig] = useState({
    cacheSets: 64,
    cacheWays: 4,
    replacementPolicy: "lru" as "lru" | "fifo" | "random" | "lfu" | "mru",
    accessPattern: "sequential" as "sequential" | "random" | "loop" | "hotCold",
    loopSize: 32,
    hotDataPercentage: 20,
    cacheSize: 32768, // 32KB
    blockSize: 64, // 64 bytes
    simulationSpeed: 200 // ms
  })
  
  const [replacement, setReplacement] = useState({
    cache: [] as {
      setId: number,
      ways: {
        id: number,
        tag: number,
        valid: boolean,
        dirty: boolean,
        lastAccessed: number,
        accessCount: number,
        frequency: number
      }[]
    }[],
    statistics: {
      hits: 0,
      misses: 0,
      compulsoryMisses: 0,
      conflictMisses: 0,
      capacityMisses: 0,
      hitRate: 0,
      missRate: 0,
      averageAccessTime: 0
    },
    policyMetadata: {
      lruTimestamps: [] as number[],
      fifoInsertionOrder: [] as number[],
      lfuCounters: [] as number[],
      mruLastAccess: [] as number[]
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize cache structure
  useState(() => {
    const cache = []
    
    for (let setId = 0; setId < config.cacheSets; setId++) {
      const ways = []
      for (let wayId = 0; wayId < config.cacheWays; wayId++) {
        ways.push({
          id: wayId,
          tag: 0,
          valid: false,
          dirty: false,
          lastAccessed: 0,
          accessCount: 0,
          frequency: 0
        })
      }
      cache.push({
        setId,
        ways
      })
    }
    
    setReplacement({
      cache,
      statistics: {
        hits: 0,
        misses: 0,
        compulsoryMisses: 0,
        conflictMisses: 0,
        capacityMisses: 0,
        hitRate: 0,
        missRate: 0,
        averageAccessTime: 0
      },
      policyMetadata: {
        lruTimestamps: Array(config.cacheSets * config.cacheWays).fill(0),
        fifoInsertionOrder: Array(config.cacheSets * config.cacheWays).fill(0),
        lfuCounters: Array(config.cacheSets * config.cacheWays).fill(0),
        mruLastAccess: Array(config.cacheSets * config.cacheWays).fill(0)
      }
    })
  })

  // Simulate cache replacement
  const simulateCacheReplacement = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Reset statistics
    setReplacement(prev => ({
      ...prev,
      statistics: {
        hits: 0,
        misses: 0,
        compulsoryMisses: 0,
        conflictMisses: 0,
        capacityMisses: 0,
        hitRate: 0,
        missRate: 0,
        averageAccessTime: 0
      }
    }))
    
    // Run simulation
    let totalAccesses = 0
    let totalLatency = 0
    const newHistory = []
    
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current replacement state
      const currentReplacement = JSON.parse(JSON.stringify(replacement))
      const currentStatistics = { ...replacement.statistics }
      
      // Generate memory access based on pattern
      let address: number
      if (config.accessPattern === "sequential") {
        address = step
      } else if (config.accessPattern === "random") {
        address = Math.floor(Math.random() * 1000)
      } else if (config.accessPattern === "loop") {
        // Loop pattern - repeatedly access a small set of addresses
        address = step % config.loopSize
      } else {
        // Hot/cold pattern - mix of frequently and infrequently accessed data
        if (Math.random() * 100 < config.hotDataPercentage) {
          // Hot data - frequently accessed small range
          address = Math.floor(Math.random() * 10) // Addresses 0-9
        } else {
          // Cold data - infrequently accessed large range
          address = Math.floor(Math.random() * 1000) + 100 // Addresses 100-1100
        }
      }
      
      // Calculate cache set and tag
      const cacheSetId = address % config.cacheSets
      const tag = Math.floor(address / config.cacheSets)
      
      // Find cache set
      const cacheSet = currentReplacement.cache.find((set: any) => set.setId === cacheSetId)
      
      if (cacheSet) {
        // Check for cache hit
        const hitWay = cacheSet.ways.find((way: any) => way.valid && way.tag === tag)
        
        if (hitWay) {
          // Cache hit
          hitWay.lastAccessed = step
          hitWay.accessCount++
          hitWay.frequency++
          currentStatistics.hits++
          totalLatency += 1 // 1 cycle for cache hit
        } else {
          // Cache miss
          currentStatistics.misses++
          totalLatency += 100 // 100 cycles for cache miss
          
          // Check for compulsory miss (block never seen before)
          const isCompulsoryMiss = !cacheSet.ways.some((way: any) => way.tag === tag)
          if (isCompulsoryMiss) {
            currentStatistics.compulsoryMisses++
          }
          
          // Check for conflict miss (block was previously evicted)
          const isConflictMiss = cacheSet.ways.some((way: any) => way.valid && way.tag !== tag)
          if (isConflictMiss && !isCompulsoryMiss) {
            currentStatistics.conflictMisses++
          }
          
          // Check for capacity miss (cache is full)
          const validWays = cacheSet.ways.filter((way: any) => way.valid)
          if (validWays.length === config.cacheWays && !isCompulsoryMiss) {
            currentStatistics.capacityMisses++
          }
          
          // Find an empty way or evict according to replacement policy
          const emptyWayIndex = cacheSet.ways.findIndex((way: any) => !way.valid)
          
          if (emptyWayIndex !== -1) {
            // Use empty way
            cacheSet.ways[emptyWayIndex] = {
              id: emptyWayIndex,
              tag,
              valid: true,
              dirty: false,
              lastAccessed: step,
              accessCount: 1,
              frequency: 1
            }
          } else {
            // Need to evict - apply replacement policy
            let evictionIndex = 0
            
            switch (config.replacementPolicy) {
              case "lru": {
                // Least Recently Used - evict the least recently accessed block
                const lruWay = cacheSet.ways.reduce((lru: any, way: any) => 
                  way.lastAccessed < lru.lastAccessed ? way : lru
                )
                evictionIndex = cacheSet.ways.findIndex((way: any) => way.id === lruWay.id)
                break
              }
              case "fifo": {
                // First In First Out - evict the oldest block
                const fifoWay = cacheSet.ways.reduce((oldest: any, way: any) => 
                  way.lastAccessed < oldest.lastAccessed ? way : oldest
                )
                evictionIndex = cacheSet.ways.findIndex((way: any) => way.id === fifoWay.id)
                break
              }
              case "random": {
                // Random - evict a random block
                evictionIndex = Math.floor(Math.random() * config.cacheWays)
                break
              }
              case "lfu": {
                // Least Frequently Used - evict the least frequently accessed block
                const lfuWay = cacheSet.ways.reduce((lfu: any, way: any) => 
                  way.frequency < lfu.frequency ? way : lfu
                )
                evictionIndex = cacheSet.ways.findIndex((way: any) => way.id === lfuWay.id)
                break
              }
              case "mru": {
                // Most Recently Used - evict the most recently accessed block
                const mruWay = cacheSet.ways.reduce((mru: any, way: any) => 
                  way.lastAccessed > mru.lastAccessed ? way : mru
                )
                evictionIndex = cacheSet.ways.findIndex((way: any) => way.id === mruWay.id)
                break
              }
            }
            
            // Evict block and load new one
            cacheSet.ways[evictionIndex] = {
              id: evictionIndex,
              tag,
              valid: true,
              dirty: false,
              lastAccessed: step,
              accessCount: 1,
              frequency: 1
            }
          }
        }
      }
      
      // Update statistics
      totalAccesses++
      currentStatistics.hitRate = (currentStatistics.hits / totalAccesses) * 100
      currentStatistics.missRate = (currentStatistics.misses / totalAccesses) * 100
      currentStatistics.averageAccessTime = totalLatency / totalAccesses
      
      // Update replacement state
      setReplacement(currentReplacement)
      setReplacement(prev => ({...prev, statistics: currentStatistics}))
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        newHistory.push({
          step,
          hits: currentStatistics.hits,
          misses: currentStatistics.misses,
          hitRate: currentStatistics.hitRate,
          missRate: currentStatistics.missRate,
          averageAccessTime: currentStatistics.averageAccessTime,
          compulsoryMisses: currentStatistics.compulsoryMisses,
          conflictMisses: currentStatistics.conflictMisses,
          capacityMisses: currentStatistics.capacityMisses
        })
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
    
    // Reset replacement state
    const cache = []
    
    for (let setId = 0; setId < config.cacheSets; setId++) {
      const ways = []
      for (let wayId = 0; wayId < config.cacheWays; wayId++) {
        ways.push({
          id: wayId,
          tag: 0,
          valid: false,
          dirty: false,
          lastAccessed: 0,
          accessCount: 0,
          frequency: 0
        })
      }
      cache.push({
        setId,
        ways
      })
    }
    
    setReplacement({
      cache,
      statistics: {
        hits: 0,
        misses: 0,
        compulsoryMisses: 0,
        conflictMisses: 0,
        capacityMisses: 0,
        hitRate: 0,
        missRate: 0,
        averageAccessTime: 0
      },
      policyMetadata: {
        lruTimestamps: Array(config.cacheSets * config.cacheWays).fill(0),
        fifoInsertionOrder: Array(config.cacheSets * config.cacheWays).fill(0),
        lfuCounters: Array(config.cacheSets * config.cacheWays).fill(0),
        mruLastAccess: Array(config.cacheSets * config.cacheWays).fill(0)
      }
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Políticas de Reemplazo de Caché</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo diferentes políticas de reemplazo afectan el rendimiento de la caché
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cacheSets">Conjuntos de Caché</Label>
              <select
                id="cacheSets"
                value={config.cacheSets}
                onChange={(e) => setConfig({...config, cacheSets: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={16}>16 conjuntos</option>
                <option value={32}>32 conjuntos</option>
                <option value={64}>64 conjuntos</option>
                <option value={128}>128 conjuntos</option>
              </select>
            </div>

            <div>
              <Label htmlFor="cacheWays">Vías Asociativas</Label>
              <select
                id="cacheWays"
                value={config.cacheWays}
                onChange={(e) => setConfig({...config, cacheWays: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={1}>Directamente mapeada</option>
                <option value={2}>2-vías</option>
                <option value={4}>4-vías</option>
                <option value={8}>8-vías</option>
                <option value={16}>16-vías</option>
              </select>
            </div>

            <div>
              <Label htmlFor="replacementPolicy">Política de Reemplazo</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
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
                  Random
                </Button>
                <Button
                  variant={config.replacementPolicy === "lfu" ? "default" : "outline"}
                  onClick={() => setConfig({...config, replacementPolicy: "lfu"})}
                >
                  LFU
                </Button>
                <Button
                  variant={config.replacementPolicy === "mru" ? "default" : "outline"}
                  onClick={() => setConfig({...config, replacementPolicy: "mru"})}
                >
                  MRU
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
                  variant={config.accessPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.accessPattern === "loop" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "loop"})}
                >
                  Loop
                </Button>
                <Button
                  variant={config.accessPattern === "hotCold" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "hotCold"})}
                >
                  Hot/Cold
                </Button>
              </div>
            </div>

            {config.accessPattern === "loop" && (
              <div>
                <Label htmlFor="loopSize">Tamaño del Loop</Label>
                <Input
                  id="loopSize"
                  type="number"
                  value={config.loopSize}
                  onChange={(e) => setConfig({...config, loopSize: Number(e.target.value)})}
                  min="4"
                  max="128"
                  step="1"
                />
              </div>
            )}

            {config.accessPattern === "hotCold" && (
              <div>
                <Label htmlFor="hotDataPercentage">Porcentaje de Datos Calientes (%)</Label>
                <Input
                  id="hotDataPercentage"
                  type="range"
                  min="5"
                  max="50"
                  value={config.hotDataPercentage}
                  onChange={(e) => setConfig({...config, hotDataPercentage: Number(e.target.value)})}
                />
                <div className="text-center">{config.hotDataPercentage}%</div>
              </div>
            )}

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
                <option value={131072}>128 KB</option>
              </select>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <select
                id="blockSize"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={32}>32 bytes</option>
                <option value={64}>64 bytes</option>
                <option value={128}>128 bytes</option>
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
                onClick={simulateCacheReplacement} 
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
            <CardTitle>Estado de Caché y Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Aciertos</div>
                  <div className="text-2xl font-bold text-green-600">
                    {replacement.statistics.hits}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {replacement.statistics.misses}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Aciertos</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {replacement.statistics.hitRate.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo Promedio</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {replacement.statistics.averageAccessTime.toFixed(1)} ciclos
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos Compulsorios</div>
                  <div className="text-xl font-bold text-yellow-600">
                    {replacement.statistics.compulsoryMisses}
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos de Conflicto</div>
                  <div className="text-xl font-bold text-orange-600">
                    {replacement.statistics.conflictMisses}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos de Capacidad</div>
                  <div className="text-xl font-bold text-red-600">
                    {replacement.statistics.capacityMisses}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Visualización de Caché</div>
                <div className="max-h-96 overflow-y-auto p-2 bg-gray-50 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {replacement.cache.slice(0, 16).map(set => (
                      <Card key={set.setId}>
                        <CardHeader>
                          <CardTitle className="text-sm">Conjunto {set.setId}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1">
                            {set.ways.map(way => (
                              <div
                                key={way.id}
                                className={`
                                  w-10 h-10 rounded flex items-center justify-center text-xs
                                  ${way.valid 
                                    ? way.dirty 
                                      ? "bg-red-500 text-white" 
                                      : "bg-green-500 text-white"
                                    : "bg-gray-200"}
                                `}
                                title={`
                                  Vía: ${way.id}
                                  Tag: ${way.tag}
                                  Válida: ${way.valid ? "Sí" : "No"}
                                  Sucia: ${way.dirty ? "Sí" : "No"}
                                  Último acceso: ${way.lastAccessed}
                                  Veces accedida: ${way.accessCount}
                                  Frecuencia: ${way.frequency}
                                `}
                              >
                                {way.valid ? way.tag % 100 : " "}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Comparativa de Políticas</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div 
                    className={`
                      p-2 rounded text-center text-xs
                      ${config.replacementPolicy === "lru" 
                        ? "ring-2 ring-blue-500 bg-blue-50" 
                        : "bg-gray-50"}
                    `}
                  >
                    <div className="font-semibold">LRU</div>
                    <div className="text-blue-600">
                      {config.replacementPolicy === "lru" ? "Seleccionada" : "No seleccionada"}
                    </div>
                  </div>
                  <div 
                    className={`
                      p-2 rounded text-center text-xs
                      ${config.replacementPolicy === "fifo" 
                        ? "ring-2 ring-green-500 bg-green-50" 
                        : "bg-gray-50"}
                    `}
                  >
                    <div className="font-semibold">FIFO</div>
                    <div className="text-green-600">
                      {config.replacementPolicy === "fifo" ? "Seleccionada" : "No seleccionada"}
                    </div>
                  </div>
                  <div 
                    className={`
                      p-2 rounded text-center text-xs
                      ${config.replacementPolicy === "random" 
                        ? "ring-2 ring-purple-500 bg-purple-50" 
                        : "bg-gray-50"}
                    `}
                  >
                    <div className="font-semibold">Random</div>
                    <div className="text-purple-600">
                      {config.replacementPolicy === "random" ? "Seleccionada" : "No seleccionada"}
                    </div>
                  </div>
                  <div 
                    className={`
                      p-2 rounded text-center text-xs
                      ${config.replacementPolicy === "lfu" 
                        ? "ring-2 ring-yellow-500 bg-yellow-50" 
                        : "bg-gray-50"}
                    `}
                  >
                    <div className="font-semibold">LFU</div>
                    <div className="text-yellow-600">
                      {config.replacementPolicy === "lfu" ? "Seleccionada" : "No seleccionada"}
                    </div>
                  </div>
                  <div 
                    className={`
                      p-2 rounded text-center text-xs
                      ${config.replacementPolicy === "mru" 
                        ? "ring-2 ring-red-500 bg-red-50" 
                        : "bg-gray-50"}
                    `}
                  >
                    <div className="font-semibold">MRU</div>
                    <div className="text-red-600">
                      {config.replacementPolicy === "mru" ? "Seleccionada" : "No seleccionada"}
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
          <CardTitle>Políticas de Reemplazo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">LRU (Least Recently Used)</div>
              <p className="text-sm text-blue-700 mb-3">
                Reemplaza el bloque que no ha sido accedido por más tiempo.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Excelente para patrones temporales</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Baja tasa de fallos en general</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Alto overhead de implementación</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">FIFO (First In First Out)</div>
              <p className="text-sm text-green-700 mb-3">
                Reemplaza el bloque que ha estado en caché por más tiempo.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Fácil de implementar</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Bajo overhead</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Puede eliminar datos frecuentes</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Random</div>
              <p className="text-sm text-purple-700 mb-3">
                Reemplaza un bloque seleccionado aleatoriamente.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Muy simple de implementar</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Sin overhead de seguimiento</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Tasa de fallos alta en patrones predecibles</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">LFU (Least Frequently Used)</div>
              <p className="text-sm text-yellow-700 mb-3">
                Reemplaza el bloque que ha sido accedido con menor frecuencia.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Excelente para datos estáticos</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Buen rendimiento con patrones frecuentes</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Problemas con cambios de patrón</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">MRU (Most Recently Used)</div>
              <p className="text-sm text-red-700 mb-3">
                Reemplaza el bloque que fue accedido más recientemente.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Buen rendimiento en patrones cíclicos</span>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Efectivo para datos recientes irrelevantes</span>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Mal rendimiento en acceso secuencial</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Tipos de Fallos de Caché:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Compulsorios (Cold Misses)</div>
                <p>
                  Ocurren cuando se accede a un bloque por primera vez. También llamados fallos de arranque.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Conflictivos (Collision Misses)</div>
                <p>
                  Ocurren en cachés asociativas cuando múltiples bloques compiten por el mismo conjunto.
                </p>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Capacidad (Capacity Misses)</div>
                <p>
                  Ocurren cuando la caché está llena y se necesita reemplazar bloques, incluso si son útiles.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
