import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function DataOrientedDesign() {
  const [config, setConfig] = useState({
    entities: 1000,
    components: 3,
    updatePattern: "sequential" as "sequential" | "random" | "batch",
    cacheLineSize: 64, // bytes
    simulationSpeed: 200 // ms
  })
  
  const [performance, setPerformance] = useState({
    cacheEfficiency: 0,
    processingTime: 0,
    memoryUsage: 0,
    throughput: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Simulate data-oriented design principles
  const simulateDataOrientedDesign = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset performance stats
    setPerformance({
      cacheEfficiency: 0,
      processingTime: 0,
      memoryUsage: 0,
      throughput: 0
    })
    
    // Run simulation
    for (let step = 0; step < 50; step++) {
      setProgress((step + 1) * 2)
      
      // Create a copy of current performance state
      const currentPerformance = { ...performance }
      
      // Simulate processing based on update pattern
      let cacheEfficiency = 0
      let processingTime = 0
      let memoryUsage = 0
      let throughput = 0
      
      // Compare traditional object-oriented vs data-oriented approaches
      if (config.updatePattern === "sequential") {
        // Sequential updates - data-oriented shines here
        cacheEfficiency = 90 // 90% cache efficiency
        processingTime = config.entities * 0.5 // 0.5 cycles per entity
        memoryUsage = config.entities * config.components * 8 // 8 bytes per component
        throughput = config.entities / (processingTime / 1000) // entities per millisecond
      } else if (config.updatePattern === "random") {
        // Random updates - object-oriented struggles here
        cacheEfficiency = 30 // 30% cache efficiency for OO
        processingTime = config.entities * 3 // 3 cycles per entity due to cache misses
        memoryUsage = config.entities * config.components * 12 // 12 bytes per component with padding
        throughput = config.entities / (processingTime / 1000)
      } else if (config.updatePattern === "batch") {
        // Batch updates - both can be efficient, but data-oriented is better
        cacheEfficiency = 85 // 85% cache efficiency
        processingTime = config.entities * 0.7 // 0.7 cycles per entity
        memoryUsage = config.entities * config.components * 8 // 8 bytes per component
        throughput = config.entities / (processingTime / 1000)
      }
      
      // Apply data-oriented design benefits (20-40% improvement)
      const improvementFactor = 1.3; // 30% improvement
      cacheEfficiency = Math.min(100, cacheEfficiency * improvementFactor)
      processingTime = processingTime / improvementFactor
      throughput = throughput * improvementFactor
      
      // Update performance stats
      currentPerformance.cacheEfficiency = Math.min(100, cacheEfficiency)
      currentPerformance.processingTime = Math.floor(processingTime)
      currentPerformance.memoryUsage = Math.floor(memoryUsage)
      currentPerformance.throughput = Math.floor(throughput)
      
      // Update state
      setPerformance(currentPerformance)
      
      // Add to history every 5 steps
      if (step % 5 === 0) {
        setHistory(prev => [...prev, {
          step,
          cacheEfficiency: Math.min(100, cacheEfficiency),
          processingTime: Math.floor(processingTime),
          memoryUsage: Math.floor(memoryUsage),
          throughput: Math.floor(throughput)
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
      cacheEfficiency: 0,
      processingTime: 0,
      memoryUsage: 0,
      throughput: 0
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Diseño Orientado a Datos (Data-Oriented Design)</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo organizar datos y algoritmos para maximizar el rendimiento de la caché
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="entities">Número de Entidades</Label>
              <Input
                id="entities"
                type="number"
                value={config.entities}
                onChange={(e) => setConfig({...config, entities: Number(e.target.value)})}
                min="100"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="components">Número de Componentes</Label>
              <Input
                id="components"
                type="number"
                value={config.components}
                onChange={(e) => setConfig({...config, components: Number(e.target.value)})}
                min="1"
                max="10"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="updatePattern">Patrón de Actualización</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.updatePattern === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, updatePattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.updatePattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, updatePattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.updatePattern === "batch" ? "default" : "outline"}
                  onClick={() => setConfig({...config, updatePattern: "batch"})}
                >
                  Lote
                </Button>
              </div>
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
                onClick={simulateDataOrientedDesign} 
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
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Eficiencia de Caché</div>
                  <div className="text-2xl font-bold text-green-600">
                    {performance.cacheEfficiency.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Procesamiento</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {performance.processingTime.toLocaleString()} ciclos
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Uso de Memoria</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {(performance.memoryUsage / 1024).toFixed(1)} KB
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Rendimiento</div>
                  <div className="text-2xl font-bold text-red-600">
                    {performance.throughput.toLocaleString()} ent/ms
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <span className="mr-2">_orientado_objetos</span>
                      Diseño Orientado a Objetos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded font-mono text-sm">
                        <div>class Entity &#123;</div>
                        <div className="ml-4">Transform transform;</div>
                        <div className="ml-4">Physics physics;</div>
                        <div className="ml-4">Render render;</div>
                        <div className="ml-4">void update() &#123;...&#125;</div>
                        <div>&#125;;</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Organización</div>
                        <div className="font-semibold">Datos + Funciones en objetos</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Encapsulación y abstracción</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Fácil de entender y mantener</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Desventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Pobre localidad de datos</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Difícil de paralelizar</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <span className="mr-2">_orientado_datos</span>
                      Diseño Orientado a Datos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded font-mono text-sm">
                        <div>struct TransformComponent &#123;</div>
                        <div className="ml-4">float x, y, z;</div>
                        <div>&#125;;</div>
                        <div>TransformComponent* transforms;</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Organización</div>
                        <div className="font-semibold">Datos separados, funciones procesan lotes</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Excelente localidad de datos</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            <span>Fácil de paralelizar y vectorizar</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Desventajas</div>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Mayor complejidad en gestión</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-red-500">✗</span>
                            <span>Menos intuitivo para nuevos desarrolladores</span>
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
                      <span>Rendimiento Relativo</span>
                      <span>
                        {config.updatePattern === "sequential" ? "DOD 3x más rápido" : 
                         config.updatePattern === "random" ? "DOD 2x más rápido" : 
                         "DOD 2.5x más rápido"}
                      </span>
                    </div>
                    <Progress 
                      value={
                        config.updatePattern === "sequential" ? 90 : 
                        config.updatePattern === "random" ? 70 : 
                        80
                      } 
                      className="w-full" 
                      color="green"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Complejidad de Implementación</span>
                      <span>
                        OO: Media - DOD: Alta
                      </span>
                    </div>
                    <Progress 
                      value={70} 
                      className="w-full" 
                      color="yellow"
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
          <CardTitle>Principios del Diseño Orientado a Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">1. Estructuras de Datos</div>
              <p className="text-sm text-blue-700">
                Organiza los datos para maximizar la localidad espacial y temporal, 
                manteniendo datos relacionados juntos en memoria.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">2. Procesamiento por Lotes</div>
              <p className="text-sm text-green-700">
                Procesa grandes cantidades de datos similares juntos para 
                aprovechar al máximo la caché y las instrucciones SIMD.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">3. Separación de Datos y Código</div>
              <p className="text-sm text-yellow-700">
                Separa los datos de las funciones que los operan, 
                permitiendo optimizaciones específicas para cada tarea.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">4. Transformaciones de Datos</div>
              <p className="text-sm text-red-700">
                Concéntrate en transformar flujos de datos de una representación 
                a otra, en lugar de modelar objetos del mundo real.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Cuándo Usar DOD:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Aplicaciones con grandes conjuntos de datos (juegos, simulaciones, procesamiento de datos)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Sistemas con requisitos de rendimiento extremo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Problemas que se pueden dividir en operaciones paralelizables</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                <span>Proyectos pequeños con requisitos de rendimiento estándar</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                <span>Equipos sin experiencia en optimización de bajo nivel</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}