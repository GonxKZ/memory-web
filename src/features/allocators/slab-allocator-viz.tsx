import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function SlabAllocatorViz() {
  const [config, setConfig] = useState({
    cacheSize: 1024, // objects
    objectSize: 64, // bytes
    slabs: 4,
    allocationPattern: "sequential" as "sequential" | "random" | "burst",
    simulationSpeed: 200 // ms
  })
  
  const [allocator, setAllocator] = useState({
    slabs: [] as {id: number, size: number, objects: boolean[], freeList: number[]}[],
    cache: [] as {id: number, slabId: number, allocated: boolean}[],
    stats: {
      allocated: 0,
      free: 0,
      utilization: 0,
      fragmentation: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize slab allocator
  const initializeAllocator = () => {
    const objectsPerSlab = Math.floor(config.cacheSize / config.slabs)
    const newSlabs = []
    
    for (let i = 0; i < config.slabs; i++) {
      const objects = Array(objectsPerSlab).fill(false)
      const freeList = Array.from({ length: objectsPerSlab }, (_, j) => j)
      
      newSlabs.push({
        id: i,
        size: objectsPerSlab,
        objects,
        freeList
      })
    }
    
    const newCache = []
    for (let i = 0; i < config.cacheSize; i++) {
      const slabId = Math.floor(i / objectsPerSlab)
      newCache.push({
        id: i,
        slabId,
        allocated: false
      })
    }
    
    setAllocator({
      slabs: newSlabs,
      cache: newCache,
      stats: {
        allocated: 0,
        free: config.cacheSize,
        utilization: 0,
        fragmentation: 0
      }
    })
  }

  // Simulate slab allocator operations
  const simulateSlabAllocator = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Initialize allocator
    initializeAllocator()
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress(step + 1)
      
      // Create a copy of current allocator state
      const currentAllocator = JSON.parse(JSON.stringify(allocator))
      
      // Decide what operation to perform based on allocation pattern
      if (config.allocationPattern === "sequential") {
        // Sequential allocation/deallocation
        if (step % 2 === 0 && currentAllocator.stats.free > 0) {
          // Allocate
          const freeObjects = currentAllocator.cache.filter((obj: { allocated: boolean; }) => !obj.allocated)
          if (freeObjects.length > 0) {
            const objToAllocate = freeObjects[0]
            const index = currentAllocator.cache.findIndex((obj: { id: any; }) => obj.id === objToAllocate.id)
            
            if (index !== -1) {
              currentAllocator.cache[index].allocated = true
              currentAllocator.stats.allocated++
              currentAllocator.stats.free--
            }
          }
        } else if (currentAllocator.stats.allocated > 0) {
          // Deallocate
          const allocatedObjects = currentAllocator.cache.filter((obj: { allocated: boolean; }) => obj.allocated)
          if (allocatedObjects.length > 0) {
            const objToDeallocate = allocatedObjects[0]
            const index = currentAllocator.cache.findIndex((obj: { id: any; }) => obj.id === objToDeallocate.id)
            
            if (index !== -1) {
              currentAllocator.cache[index].allocated = false
              currentAllocator.stats.allocated--
              currentAllocator.stats.free++
            }
          }
        }
      } else if (config.allocationPattern === "random") {
        // Random allocation/deallocation
        if (Math.random() > 0.5 && currentAllocator.stats.free > 0) {
          // Allocate random object
          const freeIndices = currentAllocator.cache
            .map((obj: { allocated: boolean; }, index: any) => obj.allocated ? -1 : index)
            .filter((index: number) => index !== -1)
            
          if (freeIndices.length > 0) {
            const randomIndex = freeIndices[Math.floor(Math.random() * freeIndices.length)]
            currentAllocator.cache[randomIndex].allocated = true
            currentAllocator.stats.allocated++
            currentAllocator.stats.free--
          }
        } else if (currentAllocator.stats.allocated > 0) {
          // Deallocate random object
          const allocatedIndices = currentAllocator.cache
            .map((obj: { allocated: boolean; }, index: any) => obj.allocated ? index : -1)
            .filter((index: number) => index !== -1)
            
          if (allocatedIndices.length > 0) {
            const randomIndex = allocatedIndices[Math.floor(Math.random() * allocatedIndices.length)]
            currentAllocator.cache[randomIndex].allocated = false
            currentAllocator.stats.allocated--
            currentAllocator.stats.free++
          }
        }
      } else if (config.allocationPattern === "burst") {
        // Burst allocation/deallocation
        if (step < 50) {
          // Allocation burst
          const freeObjects = currentAllocator.cache.filter((obj: { allocated: boolean; }) => !obj.allocated)
          const burstSize = Math.min(5, freeObjects.length)
          
          for (let i = 0; i < burstSize; i++) {
            const objToAllocate = freeObjects[i]
            const index = currentAllocator.cache.findIndex((obj: { id: any; }) => obj.id === objToAllocate.id)
            
            if (index !== -1) {
              currentAllocator.cache[index].allocated = true
              currentAllocator.stats.allocated++
              currentAllocator.stats.free--
            }
          }
        } else {
          // Deallocation burst
          const allocatedObjects = currentAllocator.cache.filter((obj: { allocated: boolean; }) => obj.allocated)
          const burstSize = Math.min(5, allocatedObjects.length)
          
          for (let i = 0; i < burstSize; i++) {
            const objToDeallocate = allocatedObjects[i]
            const index = currentAllocator.cache.findIndex((obj: { id: any; }) => obj.id === objToDeallocate.id)
            
            if (index !== -1) {
              currentAllocator.cache[index].allocated = false
              currentAllocator.stats.allocated--
              currentAllocator.stats.free++
            }
          }
        }
      }
      
      // Update utilization and fragmentation
      currentAllocator.stats.utilization = 
        currentAllocator.stats.allocated / config.cacheSize * 100
      
      // Calculate fragmentation (simplified)
      const slabUtilization = currentAllocator.slabs.map((slab: { id: any; }) => {
        const slabObjects = currentAllocator.cache.filter((obj: { slabId: any; }) => obj.slabId === slab.id)
        const allocatedInSlab = slabObjects.filter((obj: { allocated: boolean; }) => obj.allocated).length
        return slabObjects.length > 0 ? allocatedInSlab / slabObjects.length : 0
      })
      
      const avgSlabUtilization = slabUtilization.reduce((sum: any, util: any) => sum + util, 0) / slabUtilization.length
      currentAllocator.stats.fragmentation = Math.max(0, (1 - avgSlabUtilization) * 100)
      
      // Update state
      setAllocator(currentAllocator)
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 100))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    initializeAllocator()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualizador de Slab Allocator</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo el Slab Allocator gestiona objetos de tamaño fijo en el kernel de Linux
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cacheSize">Tamaño de Caché (objetos)</Label>
              <Input
                id="cacheSize"
                type="number"
                value={config.cacheSize}
                onChange={(e) => setConfig({...config, cacheSize: Number(e.target.value)})}
                min="64"
                step="64"
              />
            </div>

            <div>
              <Label htmlFor="objectSize">Tamaño de Objeto (bytes)</Label>
              <Input
                id="objectSize"
                type="number"
                value={config.objectSize}
                onChange={(e) => setConfig({...config, objectSize: Number(e.target.value)})}
                min="8"
                step="8"
              />
            </div>

            <div>
              <Label htmlFor="slabs">Número de Slabs</Label>
              <Input
                id="slabs"
                type="number"
                value={config.slabs}
                onChange={(e) => setConfig({...config, slabs: Number(e.target.value)})}
                min="2"
                max="16"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="allocationPattern">Patrón de Asignación</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.allocationPattern === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.allocationPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.allocationPattern === "burst" ? "default" : "outline"}
                  onClick={() => setConfig({...config, allocationPattern: "burst"})}
                >
                  Ráfaga
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
                onClick={simulateSlabAllocator} 
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
            <CardTitle>Estado del Slab Allocator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Asignados</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {allocator.stats.allocated}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Libres</div>
                  <div className="text-2xl font-bold text-green-600">
                    {allocator.stats.free}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Utilización</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {allocator.stats.utilization.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fragmentación</div>
                  <div className="text-2xl font-bold text-red-600">
                    {allocator.stats.fragmentation.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Slabs</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allocator.slabs.map((slab: { id: any; }) => {
                    const slabObjects = allocator.cache.filter((obj: { slabId: any; }) => obj.slabId === slab.id)
                    const allocatedInSlab = slabObjects.filter((obj: { allocated: boolean; }) => obj.allocated).length
                    const utilization = slabObjects.length > 0 ? 
                      (allocatedInSlab / slabObjects.length) * 100 : 0
                    
                    return (
                      <Card key={slab.id}>
                        <CardHeader>
                          <CardTitle className="text-sm flex justify-between">
                            <span>Slab {slab.id}</span>
                            <Badge variant="secondary">
                              {allocatedInSlab}/{slabObjects.length}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Utilización</span>
                                <span>{utilization.toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={utilization} 
                                className="w-full" 
                                color={utilization > 80 ? "green" : utilization > 50 ? "yellow" : "blue"}
                              />
                            </div>
                            
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Objetos ({slabObjects.length} total)
                              </div>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                                {slabObjects.map((obj: { id: any; allocated: any; slabId: any; }) => (
                                  <div
                                    key={obj.id}
                                    className={`
                                      w-5 h-5 rounded text-xs flex items-center justify-center
                                      ${obj.allocated 
                                        ? "bg-green-500 text-white" 
                                        : "bg-gray-200 text-gray-700"}
                                    `}
                                    title={`
                                      Objeto ${obj.id}
                                      Slab: ${obj.slabId}
                                      ${obj.allocated ? "Asignado" : "Libre"}
                                    `}
                                  >
                                    {obj.allocated ? "A" : "L"}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Caché Completa</div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex flex-wrap gap-1">
                    {allocator.cache.map((obj: { id: any; allocated: any; slabId: any; }) => (
                      <div
                        key={obj.id}
                        className={`
                          w-6 h-6 rounded text-xs flex items-center justify-center
                          ${obj.allocated 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200 text-gray-700"}
                        `}
                        title={`
                          Objeto ${obj.id}
                          Slab: ${obj.slabId}
                          ${obj.allocated ? "Asignado" : "Libre"}
                        `}
                      >
                        {obj.id % 10}
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
          <CardTitle>Conceptos de Slab Allocator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es Slab Allocator?</div>
              <p className="text-sm text-blue-700">
                El Slab Allocator es un gestor de memoria del kernel de Linux diseñado 
                para asignar eficientemente objetos de tamaño fijo. Pre-asigna grandes 
                bloques de memoria (slabs) y los divide en objetos del tamaño requerido.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Ventajas</div>
              <p className="text-sm text-green-700">
                Reduce la fragmentación, elimina la sobrecarga de inicialización, 
                mejora la localidad de caché y proporciona estadísticas detalladas 
                de uso de memoria para cada tipo de objeto.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Componentes</div>
              <p className="text-sm text-purple-700">
                <strong>Slabs:</strong> Bloques grandes de memoria contigua.
                <strong>Cachés:</strong> Estructuras que gestionan slabs de un tipo específico.
                <strong>Objetos:</strong> Instancias individuales dentro de los slabs.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Estados de Objetos:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Vacio (Empty)</div>
                <p>Todos los objetos están libres</p>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Parcial (Partial)</div>
                <p>Algunos objetos asignados, otros libres</p>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Lleno (Full)</div>
                <p>Todos los objetos están asignados</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}