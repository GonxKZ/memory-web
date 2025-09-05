import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

export default function EPTVisualization() {
  const [config, setConfig] = useState({
    guestMemorySize: 4096, // 4GB
    hostMemorySize: 16384, // 16GB
    eptEnabled: true,
    nestedPaging: true,
    inveptSupport: true
  })
  
  const [translation, setTranslation] = useState({
    guestVirtualAddress: 0x1000,
    guestPhysicalAddress: 0x2000,
    hostPhysicalAddress: 0x3000,
    eptTranslationTime: 0,
    traditionalTranslationTime: 0
  })
  
  const [performance, setPerformance] = useState({
    eptHits: 0,
    eptMisses: 0,
    inveptOperations: 0,
    pageWalks: 0
  })
  
  const [history, setHistory] = useState<{
    time: number,
    eptHits: number,
    eptMisses: number,
    translationTime: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate EPT translation
  const simulateEPTTranslation = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setPerformance({
      eptHits: 0,
      eptMisses: 0,
      inveptOperations: 0,
      pageWalks: 0
    })
    
    let eptHits = 0
    let eptMisses = 0
    let pageWalks = 0
    let inveptOperations = 0
    const newHistory = []
    
    // Simulate memory accesses
    for (let i = 0; i < 1000; i++) {
      setProgress((i / 1000) * 100)
      
      // Generate random virtual address
      const virtualAddress = Math.floor(Math.random() * config.guestMemorySize * 1024 * 1024)
      
      // Determine if EPT translation is needed
      const needsEPT = config.eptEnabled && config.nestedPaging
      
      // Simulate translation time
      let translationTime = 0
      
      if (needsEPT) {
        // EPT enabled - faster translation
        if (Math.random() > 0.1) { // 90% hit rate
          eptHits++
          translationTime = 50 // ns
        } else {
          eptMisses++
          translationTime = 200 // ns
          pageWalks++
        }
      } else {
        // Traditional translation - slower
        translationTime = 500 // ns
        pageWalks++
      }
      
      // Occasionally simulate INVEPT operation
      if (Math.random() < 0.01 && config.inveptSupport) {
        inveptOperations++
        translationTime += 1000 // Extra time for invalidation
      }
      
      // Update translation state
      setTranslation({
        guestVirtualAddress: virtualAddress,
        guestPhysicalAddress: virtualAddress + 0x1000,
        hostPhysicalAddress: virtualAddress + 0x2000,
        eptTranslationTime: needsEPT ? translationTime : 0,
        traditionalTranslationTime: needsEPT ? 0 : translationTime
      })
      
      // Update performance stats
      setPerformance({
        eptHits,
        eptMisses,
        inveptOperations,
        pageWalks
      })
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          eptHits,
          eptMisses,
          translationTime
        })
        setHistory(newHistory)
      }
      
      // Add small delay for visualization
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setPerformance({
      eptHits: 0,
      eptMisses: 0,
      inveptOperations: 0,
      pageWalks: 0
    })
    setTranslation({
      guestVirtualAddress: 0x1000,
      guestPhysicalAddress: 0x2000,
      hostPhysicalAddress: 0x3000,
      eptTranslationTime: 0,
      traditionalTranslationTime: 0
    })
  }

  // Calculate performance improvement
  const performanceImprovement = translation.traditionalTranslationTime > 0 
    ? ((translation.traditionalTranslationTime - translation.eptTranslationTime) / translation.traditionalTranslationTime) * 100
    : 0

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de EPT (Extended Page Tables)</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo EPT acelera la traducción de direcciones en virtualización
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración EPT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="guestMemorySize">Memoria del Invitado (MB)</Label>
              <Input
                id="guestMemorySize"
                type="number"
                value={config.guestMemorySize}
                onChange={(e) => setConfig({...config, guestMemorySize: Number(e.target.value)})}
                min="512"
                step="512"
              />
            </div>

            <div>
              <Label htmlFor="hostMemorySize">Memoria del Host (MB)</Label>
              <Input
                id="hostMemorySize"
                type="number"
                value={config.hostMemorySize}
                onChange={(e) => setConfig({...config, hostMemorySize: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="eptEnabled">EPT Habilitado</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="eptEnabled"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.eptEnabled}
                    onChange={(e) => setConfig({...config, eptEnabled: e.target.checked})}
                  />
                  <label
                    htmlFor="eptEnabled"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="nestedPaging">Paginación Anidada</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="nestedPaging"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.nestedPaging}
                    onChange={(e) => setConfig({...config, nestedPaging: e.target.checked})}
                  />
                  <label
                    htmlFor="nestedPaging"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="inveptSupport">Soporte INVEPT</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="inveptSupport"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.inveptSupport}
                    onChange={(e) => setConfig({...config, inveptSupport: e.target.checked})}
                  />
                  <label
                    htmlFor="inveptSupport"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateEPTTranslation} 
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
            <CardTitle>Traducción de Direcciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Dirección Virtual del Invitado</div>
                  <div className="font-mono text-lg">0x{translation.guestVirtualAddress.toString(16).toUpperCase()}</div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Dirección Física del Invitado</div>
                  <div className="font-mono text-lg">0x{translation.guestPhysicalAddress.toString(16).toUpperCase()}</div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 mb-1">Dirección Física del Host</div>
                  <div className="font-mono text-lg">0x{translation.hostPhysicalAddress.toString(16).toUpperCase()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <span className="mr-2">🔧</span>
                      Traducción Tradicional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tiempo de Traducción</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {translation.traditionalTranslationTime} ns
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Page Walks</div>
                        <div className="text-lg font-semibold">
                          {performance.pageWalks}
                        </div>
                      </div>
                      
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">Proceso</div>
                        <div className="text-sm">
                          Traducción de 2 niveles: GVA → GPA → HPA
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <span className="mr-2">🔌</span>
                      Traducción con EPT
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tiempo de Traducción</div>
                        <div className="text-2xl font-bold text-green-600">
                          {translation.eptTranslationTime} ns
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500">Aciertos EPT</div>
                          <div className="font-semibold text-green-600">
                            {performance.eptHits}
                          </div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500">Fallos EPT</div>
                          <div className="font-semibold text-red-600">
                            {performance.eptMisses}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">Proceso</div>
                        <div className="text-sm">
                          Traducción acelerada por hardware
                        </div>
                      </div>
                      
                      {translation.eptTranslationTime > 0 && translation.traditionalTranslationTime > 0 && (
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-xs text-gray-500 mb-1">Mejora de Rendimiento</div>
                          <div className="font-semibold text-blue-600">
                            {performanceImprovement.toFixed(1)}% más rápido
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Historial de Traducciones</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 20 }).map((_, index) => {
                    const isEPT = config.eptEnabled && config.nestedPaging
                    return (
                      <div
                        key={index}
                        className={`
                          w-8 h-8 rounded flex items-center justify-center text-xs font-mono
                          ${isEPT 
                            ? "bg-green-500 text-white" 
                            : "bg-blue-500 text-white"}
                        `}
                      >
                        {isEPT ? "E" : "T"}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Comparativa de Rendimiento</CardTitle>
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
                    label={{ value: "Iteraciones", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Contador", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Tiempo (ns)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="eptHits" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Aciertos EPT"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="eptMisses" 
                    stroke="#ef4444" 
                    name="Fallos EPT"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="translationTime" 
                    stroke="#3b82f6" 
                    name="Tiempo de Traducción"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay datos de simulación todavía. Ejecute una simulación para ver la comparativa.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de EPT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es EPT?</div>
              <p className="text-sm text-blue-700 mb-3">
                Extended Page Tables es una característica de hardware que acelera 
                la traducción de direcciones en entornos virtualizados.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Acelera la virtualización</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Reduce el overhead de traducción</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mejora el rendimiento de VMs</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Funcionamiento</div>
              <p className="text-sm text-green-700 mb-3">
                EPT proporciona una tabla de traducción adicional para mapear 
                direcciones físicas de invitado a direcciones físicas de host.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Traducción de 2 niveles</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Caché de traducciones</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Invalidate con INVEPT</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Beneficios</div>
              <p className="text-sm text-purple-700 mb-3">
                EPT elimina la necesidad de software para manejar la traducción 
                de direcciones en entornos virtualizados.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mayor velocidad de traducción</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Menor consumo de CPU</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mejor escalabilidad</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Limitaciones</div>
              <p className="text-sm text-yellow-700 mb-3">
                Aunque EPT mejora el rendimiento, tiene algunas limitaciones 
                en ciertos escenarios.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Complejidad de implementación</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Requiere hardware compatible</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Overhead en invalidaciones</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Habilita EPT en configuraciones de virtualización para mejor rendimiento</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa INVEPT estratégicamente para invalidar solo cuando sea necesario</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Considera el tamaño de página para minimizar las entradas EPT</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Monitorea las estadísticas de fallos EPT para identificar problemas de localidad</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
