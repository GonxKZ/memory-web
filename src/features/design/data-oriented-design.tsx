import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"

export default function DataOrientedDesign() {
  const [config, setConfig] = useState({
    arraySize: 10000,
    structSize: 64, // bytes
    cacheLineSize: 64,
    accessPattern: "aos" as "aos" | "soa",
    computationType: "transform" as "transform" | "reduce" | "search"
  })
  
  const [performance, setPerformance] = useState({
    aosTime: 0,
    soaTime: 0,
    aosCacheMisses: 0,
    soaCacheMisses: 0,
    aosBandwidth: 0,
    soaBandwidth: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any[]>([])

  // Simulate data-oriented processing
  const simulateProcessing = async () => {
    setIsRunning(true)
    setResults([])
    
    // Simulate both AOS and SOA approaches
    const aosResults: any[] = []
    const soaResults: any[] = []
    
    for (let i = 0; i < 5; i++) {
      // Simulate AOS (Array of Structures)
      const aosStartTime = window.performance.now()
      let aosCacheMisses = 0
      let aosProcessed = 0
      
      // Simulate processing with AOS pattern
      for (let j = 0; j < config.arraySize; j++) {
        // Simulate cache behavior
        if (Math.random() < 0.3) { // 30% cache miss rate for AOS
          aosCacheMisses++
        }
        
        aosProcessed++
        
        // Add some processing delay
        if (j % 1000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1))
        }
      }
      
      const aosEndTime = window.performance.now()
      const aosTime = aosEndTime - aosStartTime
      
      // Simulate SOA (Structure of Arrays)
      const soaStartTime = window.performance.now()
      let soaCacheMisses = 0
      let soaProcessed = 0
      
      // Simulate processing with SOA pattern
      for (let j = 0; j < config.arraySize; j++) {
        // Simulate better cache behavior
        if (Math.random() < 0.1) { // 10% cache miss rate for SOA
          soaCacheMisses++
        }
        
        soaProcessed++
        
        // Add some processing delay
        if (j % 1000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1))
        }
      }
      
      const soaEndTime = window.performance.now()
      const soaTime = soaEndTime - soaStartTime
      
      // Calculate bandwidth (simplified)
      const aosBandwidth = (aosProcessed * config.structSize) / (aosTime / 1000) // bytes/sec
      const soaBandwidth = (soaProcessed * config.structSize) / (soaTime / 1000) // bytes/sec
      
      // Store results
      aosResults.push({
        iteration: i + 1,
        time: aosTime,
        cacheMisses: aosCacheMisses,
        bandwidth: aosBandwidth,
        approach: "AOS"
      })
      
      soaResults.push({
        iteration: i + 1,
        time: soaTime,
        cacheMisses: soaCacheMisses,
        bandwidth: soaBandwidth,
        approach: "SOA"
      })
      
      // Update performance
      setPerformance({
        aosTime: aosTime,
        soaTime: soaTime,
        aosCacheMisses: aosCacheMisses,
        soaCacheMisses: soaCacheMisses,
        aosBandwidth: aosBandwidth,
        soaBandwidth: soaBandwidth
      })
      
      // Add to results
      setResults(prev => [...prev, ...aosResults, ...soaResults])
      
      // Add delay to visualize
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setResults([])
    setPerformance({
      aosTime: 0,
      soaTime: 0,
      aosCacheMisses: 0,
      soaCacheMisses: 0,
      aosBandwidth: 0,
      soaBandwidth: 0
    })
  }

  // Calculate performance improvements
  const timeImprovement = performance.aosTime > 0 
    ? (((performance.aosTime - performance.soaTime) / performance.aosTime) * 100).toFixed(1)
    : "0"
    
  const missRateImprovement = performance.aosCacheMisses > 0 
    ? (((performance.aosCacheMisses - performance.soaCacheMisses) / performance.aosCacheMisses) * 100).toFixed(1)
    : "0"

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Diseño Orientado a Datos</h1>
        <p className="text-gray-600 mt-2">
          Comparando patrones AOS (Array of Structures) vs SOA (Structure of Arrays)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="arraySize">Tamaño del Array</Label>
              <Input
                id="arraySize"
                type="number"
                value={config.arraySize}
                onChange={(e) => setConfig({...config, arraySize: Number(e.target.value)})}
                min="1000"
                step="1000"
              />
            </div>

            <div>
              <Label htmlFor="structSize">Tamaño de Estructura (bytes)</Label>
              <Input
                id="structSize"
                type="number"
                value={config.structSize}
                onChange={(e) => setConfig({...config, structSize: Number(e.target.value)})}
                min="8"
                step="8"
              />
            </div>

            <div>
              <Label htmlFor="cacheLineSize">Tamaño de Línea de Caché (bytes)</Label>
              <Input
                id="cacheLineSize"
                type="number"
                value={config.cacheLineSize}
                onChange={(e) => setConfig({...config, cacheLineSize: Number(e.target.value)})}
                min="32"
                step="32"
              />
            </div>

            <div>
              <Label>Patrón de Acceso</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.accessPattern === "aos" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "aos"})}
                >
                  AOS
                </Button>
                <Button
                  variant={config.accessPattern === "soa" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "soa"})}
                >
                  SOA
                </Button>
              </div>
            </div>

            <div>
              <Label>Tipo de Computación</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.computationType === "transform" ? "default" : "outline"}
                  onClick={() => setConfig({...config, computationType: "transform"})}
                >
                  Transform
                </Button>
                <Button
                  variant={config.computationType === "reduce" ? "default" : "outline"}
                  onClick={() => setConfig({...config, computationType: "reduce"})}
                >
                  Reduce
                </Button>
                <Button
                  variant={config.computationType === "search" ? "default" : "outline"}
                  onClick={() => setConfig({...config, computationType: "search"})}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateProcessing} 
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comparación de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <span className="mr-2">📦</span>
                    AOS (Array of Structures)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tiempo de Ejecución</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {performance.aosTime.toFixed(2)} ms
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Fallos de Caché</div>
                      <div className="text-2xl font-bold text-red-600">
                        {performance.aosCacheMisses.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                      <div className="text-2xl font-bold text-green-600">
                        {(performance.aosBandwidth / 1024 / 1024).toFixed(2)} MB/s
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <span className="mr-2">🗄️</span>
                    SOA (Structure of Arrays)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tiempo de Ejecución</div>
                      <div className="text-2xl font-bold text-green-600">
                        {performance.soaTime.toFixed(2)} ms
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Fallos de Caché</div>
                      <div className="text-2xl font-bold text-red-600">
                        {performance.soaCacheMisses.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                      <div className="text-2xl font-bold text-green-600">
                        {(performance.soaBandwidth / 1024 / 1024).toFixed(2)} MB/s
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500 mb-1">Mejora de Tiempo</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Number(timeImprovement) > 0 ? "+" : ""}{timeImprovement}%
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="text-xs text-gray-500 mb-1">Reducción de Fallos</div>
                <div className="text-2xl font-bold text-red-600">
                  {Number(missRateImprovement) > 0 ? "+" : ""}{missRateImprovement}%
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-2">Layout en Memoria</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-mono text-sm mb-2">AOS (Array of Structures)</div>
                  <div className="flex">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center text-xs border border-white">
                        S{i}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Estructura completa: [x][y][z][w]...
                  </div>
                </div>
                
                <div>
                  <div className="font-mono text-sm mb-2">SOA (Structure of Arrays)</div>
                  <div className="space-y-1">
                    <div className="flex">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-8 h-4 bg-green-500 text-white flex items-center justify-center text-xs border border-white">
                          x
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-8 h-4 bg-green-500 text-white flex items-center justify-center text-xs border border-white">
                          y
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Arrays separados: [x][x][x]... [y][y][y]...
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
          <CardTitle>Resultados Detallados</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="iteration" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" fill="#3b82f6" name="Tiempo (ms)" />
                  <Bar dataKey="cacheMisses" fill="#ef4444" name="Fallos de Caché" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay resultados de simulación todavía. Ejecute una simulación para ver los resultados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Diseño Orientado a Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Array of Structures (AOS)</div>
              <p className="text-sm text-blue-700 mb-3">
                Organiza los datos como un arreglo de estructuras completas. 
                Cada elemento contiene todos los campos de la estructura.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-sm">Intuitivo y fácil de entender</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-sm">Buena localidad para operaciones completas</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span className="text-sm">Mala localidad para acceso parcial</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span className="text-sm">Mayor fragmentación de caché</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Structure of Arrays (SOA)</div>
              <p className="text-sm text-green-700 mb-3">
                Organiza los datos como estructuras separadas de arreglos. 
                Cada campo se almacena en su propio arreglo.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span className="text-sm">Excelente localidad para acceso parcial</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span className="text-sm">Mejor utilización de caché</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span className="text-sm">Mayor ancho de banda efectivo</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-red-500">•</span>
                  <span className="text-sm">Menos intuitivo para operaciones completas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Principios del Diseño Orientado a Datos:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Organización de Datos:</strong> Estructura los datos según cómo se van a usar</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Localidad Espacial:</strong> Agrupa datos que se usan juntos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Localidad Temporal:</strong> Accede a datos con alta frecuencia</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Vectorización:</strong> Estructura datos para SIMD y paralelización</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
