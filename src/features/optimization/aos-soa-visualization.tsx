import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AosSoaVisualization() {
  const [config, setConfig] = useState({
    dataSize: 1000, // number of data points
    structureType: "aos" as "aos" | "soa",
    accessPattern: "sequential" as "sequential" | "random" | "stride",
    strideSize: 4,
    cacheLineSize: 64, // bytes
    simulationSpeed: 200 // ms
  })
  
  const [performance, setPerformance] = useState({
    cacheMisses: 0,
    accessTime: 0,
    memoryBandwidth: 0,
    utilization: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Simulate AoS vs SoA access patterns
  const simulateAccessPatterns = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset performance stats
    setPerformance({
      cacheMisses: 0,
      accessTime: 0,
      memoryBandwidth: 0,
      utilization: 0
    })
    
    // Run simulation
    for (let step = 0; step < 50; step++) {
      setProgress((step + 1) * 2)
      
      // Create a copy of current performance state
      const currentPerformance = { ...performance }
      
      // Simulate memory access based on structure type and access pattern
      let cacheMisses = 0
      let accessTime = 0
      let memoryBandwidth = 0
      
      // For AoS (Array of Structures):
      // struct { float x, y, z; int id; } objects[N];
      // Each object is 16 bytes (3 floats + 1 int)
      
      // For SoA (Structure of Arrays):
      // float x[N], y[N], z[N]; int id[N];
      // Each array is contiguous
      
      if (config.structureType === "aos") {
        // Array of Structures
        if (config.accessPattern === "sequential") {
          // Sequential access - good spatial locality for entire objects
          cacheMisses = Math.floor(config.dataSize / (config.cacheLineSize / 16)) * 0.1
          accessTime = config.dataSize * 1 // 1 cycle per access
          memoryBandwidth = (config.dataSize * 16) / (accessTime / 1000) // bytes per millisecond
        } else if (config.accessPattern === "random") {
          // Random access - poor locality
          cacheMisses = Math.floor(config.dataSize * 0.8)
          accessTime = config.dataSize * 5 // 5 cycles per access due to cache misses
          memoryBandwidth = (config.dataSize * 16) / (accessTime / 1000)
        } else if (config.accessPattern === "stride") {
          // Stride access - depends on stride size
          const strideEfficiency = Math.min(1, config.cacheLineSize / (config.strideSize * 16))
          cacheMisses = Math.floor(config.dataSize * (1 - strideEfficiency))
          accessTime = config.dataSize * (2 - strideEfficiency)
          memoryBandwidth = (config.dataSize * 16) / (accessTime / 1000)
        }
      } else {
        // Structure of Arrays
        if (config.accessPattern === "sequential") {
          // Sequential access - excellent spatial locality for selected fields
          cacheMisses = Math.floor(config.dataSize / (config.cacheLineSize / 4)) * 0.05
          accessTime = config.dataSize * 0.8 // 0.8 cycles per access
          memoryBandwidth = (config.dataSize * 4) / (accessTime / 1000)
        } else if (config.accessPattern === "random") {
          // Random access - still good for single field access
          cacheMisses = Math.floor(config.dataSize * 0.5)
          accessTime = config.dataSize * 3 // 3 cycles per access
          memoryBandwidth = (config.dataSize * 4) / (accessTime / 1000)
        } else if (config.accessPattern === "stride") {
          // Stride access - very efficient for single field access
          const strideEfficiency = Math.min(1, config.cacheLineSize / (config.strideSize * 4))
          cacheMisses = Math.floor(config.dataSize * (1 - strideEfficiency) * 0.3)
          accessTime = config.dataSize * (1.5 - strideEfficiency * 0.5)
          memoryBandwidth = (config.dataSize * 4) / (accessTime / 1000)
        }
      }
      
      // Update performance stats
      currentPerformance.cacheMisses = Math.floor(cacheMisses)
      currentPerformance.accessTime = Math.floor(accessTime)
      currentPerformance.memoryBandwidth = Math.floor(memoryBandwidth)
      currentPerformance.utilization = Math.min(100, (memoryBandwidth / 10000) * 100)
      
      // Update state
      setPerformance(currentPerformance)
      
      // Add to history every 5 steps
      if (step % 5 === 0) {
        setHistory(prev => [...prev, {
          step,
          cacheMisses: Math.floor(cacheMisses),
          accessTime: Math.floor(accessTime),
          memoryBandwidth: Math.floor(memoryBandwidth),
          utilization: Math.min(100, (memoryBandwidth / 10000) * 100)
        }])
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 50))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setPerformance({
      cacheMisses: 0,
      accessTime: 0,
      memoryBandwidth: 0,
      utilization: 0
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Estructuras AoS vs SoA</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo la organización de datos afecta el rendimiento de la memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataSize">Tamaño de Datos</Label>
              <Input
                id="dataSize"
                type="number"
                value={config.dataSize}
                onChange={(e) => setConfig({...config, dataSize: Number(e.target.value)})}
                min="100"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="structureType">Tipo de Estructura</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.structureType === "aos" ? "default" : "outline"}
                  onClick={() => setConfig({...config, structureType: "aos"})}
                >
                  AoS
                </Button>
                <Button
                  variant={config.structureType === "soa" ? "default" : "outline"}
                  onClick={() => setConfig({...config, structureType: "soa"})}
                >
                  SoA
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
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
                  variant={config.accessPattern === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "stride"})}
                >
                  Stride
                </Button>
              </div>
            </div>

            {config.accessPattern === "stride" && (
              <div>
                <Label htmlFor="strideSize">Tamaño de Stride</Label>
                <Input
                  id="strideSize"
                  type="number"
                  value={config.strideSize}
                  onChange={(e) => setConfig({...config, strideSize: Number(e.target.value)})}
                  min="1"
                  max="10"
                  step="1"
                />
              </div>
            )}

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
                onClick={simulateAccessPatterns} 
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
            <CardTitle>Resultados de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos de Caché</div>
                  <div className="text-2xl font-bold text-red-600">
                    {performance.cacheMisses.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Acceso</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {performance.accessTime.toLocaleString()} ciclos
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(performance.memoryBandwidth).toLocaleString()} B/ms
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Utilización</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {performance.utilization.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <span className="mr-2">スタッカ</span>
                      Array of Structures (AoS)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded font-mono text-sm">
                        <div>struct Object &#123;</div>
                        <div className="ml-4">float x, y, z;</div>
                        <div className="ml-4">int id;</div>
                        <div>&#125; objects[N];</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tamaño por objeto</div>
                        <div className="font-semibold">16 bytes</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Intuitivo y fácil de entender</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Bueno para acceso completo a objetos</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Desventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Pobre localidad para acceso parcial</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Mayor fragmentación en caché</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <span className="mr-2">ヒープ</span>
                      Structure of Arrays (SoA)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded font-mono text-sm">
                        <div>float x[N], y[N], z[N];</div>
                        <div>int id[N];</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tamaño por array</div>
                        <div className="font-semibold">4 bytes por elemento</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Excelente localidad para acceso parcial</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Perfecto para SIMD y vectorización</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Desventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Menos intuitivo para acceso completo</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Complejidad en gestión de datos</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Comparativa de Rendimiento</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Eficiencia de Caché</span>
                      <span>
                        {config.structureType === "aos" ? 
                          (config.accessPattern === "sequential" ? "Alta" : "Baja") : 
                          (config.accessPattern === "random" ? "Media" : "Muy Alta")}
                      </span>
                    </div>
                    <Progress 
                      value={
                        config.structureType === "aos" ? 
                          (config.accessPattern === "sequential" ? 80 : 30) : 
                          (config.accessPattern === "random" ? 60 : 95)
                      } 
                      className="w-full" 
                      color={
                        config.structureType === "aos" ? 
                          (config.accessPattern === "sequential" ? "green" : "red") : 
                          (config.accessPattern === "random" ? "yellow" : "green")
                      }
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Facilidad de Uso</span>
                      <span>
                        {config.structureType === "aos" ? "Alta" : "Media"}
                      </span>
                    </div>
                    <Progress 
                      value={config.structureType === "aos" ? 90 : 60} 
                      className="w-full" 
                      color={config.structureType === "aos" ? "green" : "yellow"}
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
          <CardTitle>Cuándo Usar Cada Enfoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Usar AoS cuando:</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Necesitas acceder a objetos completos con frecuencia</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>La legibilidad del código es prioritaria</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Los objetos son pequeños y se accede a todos sus campos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>El patrón de acceso es secuencial</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Usar SoA cuando:</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Accedes a campos específicos de muchos objetos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Realizas cálculos numéricos intensivos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Usas SIMD o instrucciones vectoriales</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>El patrón de acceso es paralelo</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Considera híbridos: agrupa campos relacionados en estructuras más pequeñas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa prefetching para patrones de acceso predecibles</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Perfilaa tu aplicación para identificar cuellos de botella de memoria</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Considera bibliotecas como AoS/SoA de Boost o implementaciones personalizadas</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}