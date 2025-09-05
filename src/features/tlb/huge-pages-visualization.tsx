import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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

export default function HugePagesVisualization() {
  const [config, setConfig] = useState({
    pageSize: 2048, // KB
    totalMemory: 64 * 1024 * 1024, // 64GB in KB
    applicationMemory: 8 * 1024 * 1024, // 8GB in KB
    tlbEntries: 64,
    simulationSpeed: 200 // ms
  })
  
  const [hugePages, setHugePages] = useState({
    allocated: 0,
    used: 0,
    fragmentation: 0,
    tlbMisses: 0,
    performanceGain: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [, setHistory] = useState<any[]>([])

  // Initialize huge pages simulation
  useEffect(() => {
    // Calculate initial huge page stats
    const totalPages = Math.floor(config.totalMemory / config.pageSize)
    const appPages = Math.floor(config.applicationMemory / config.pageSize)
    
    setHugePages({
      allocated: appPages,
      used: Math.floor(appPages * 0.8),
      fragmentation: parseFloat((100 - (appPages / totalPages * 100)).toFixed(2)),
      tlbMisses: Math.floor(Math.random() * 1000),
      performanceGain: parseFloat((Math.random() * 50).toFixed(2))
    })
  }, [config])

  // Simulate huge pages
  const simulateHugePages = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    const newHistory = []
    let tlbMisses = hugePages.tlbMisses
    let performanceGain = hugePages.performanceGain
    
    // Simulate memory operations
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Simulate TLB behavior
      if (Math.random() > 0.7) {
        tlbMisses += Math.floor(Math.random() * 10)
      }
      
      // Simulate performance gain
      performanceGain = Math.min(100, performanceGain + (Math.random() * 2 - 0.5))
      
      // Update huge pages state
      setHugePages(prev => ({
        ...prev,
        tlbMisses,
        performanceGain: parseFloat(performanceGain.toFixed(2))
      }))
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          tlbMisses,
          performanceGain: parseFloat(performanceGain.toFixed(2))
        })
        setHistory(newHistory)
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 10))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    
    // Reset huge pages state
    setHugePages(prev => ({
      ...prev,
      tlbMisses: 0,
      performanceGain: 0
    }))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Huge Pages</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo las huge pages reducen las fallas de TLB y mejoran el rendimiento de aplicaciones intensivas en memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Huge Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pageSize">Tamaño de Página (KB)</Label>
              <Input
                id="pageSize"
                type="number"
                value={config.pageSize}
                onChange={(e) => setConfig({...config, pageSize: Number(e.target.value)})}
                min="4"
                step="4"
              />
            </div>

            <div>
              <Label htmlFor="totalMemory">Memoria Total (GB)</Label>
              <Input
                id="totalMemory"
                type="number"
                value={config.totalMemory / (1024 * 1024)}
                onChange={(e) => setConfig({...config, totalMemory: Number(e.target.value) * 1024 * 1024})}
                min="1"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="applicationMemory">Memoria de Aplicación (GB)</Label>
              <Input
                id="applicationMemory"
                type="number"
                value={config.applicationMemory / (1024 * 1024)}
                onChange={(e) => setConfig({...config, applicationMemory: Number(e.target.value) * 1024 * 1024})}
                min="1"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="tlbEntries">Entradas de TLB</Label>
              <Input
                id="tlbEntries"
                type="range"
                min="32"
                max="512"
                value={config.tlbEntries}
                onChange={(e) => setConfig({...config, tlbEntries: Number(e.target.value)})}
              />
              <div className="text-center">{config.tlbEntries} entradas</div>
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
                onClick={simulateHugePages} 
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
            <CardTitle>Estado de Huge Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Páginas Asignadas</div>
                  <div className="text-2xl font-bold text-blue-600">{hugePages.allocated}</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Páginas Usadas</div>
                  <div className="text-2xl font-bold text-green-600">{hugePages.used}</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fragmentación</div>
                  <div className="text-2xl font-bold text-red-600">{hugePages.fragmentation}%</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ganancia de Rendimiento</div>
                  <div className="text-2xl font-bold text-purple-600">{hugePages.performanceGain}%</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Comparativa de TLB Misses</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "4KB Pages", misses: hugePages.tlbMisses * 5 },
                        { name: "2MB Pages", misses: hugePages.tlbMisses },
                        { name: "1GB Pages", misses: Math.floor(hugePages.tlbMisses * 0.1) }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="misses" fill="#3b82f6" name="TLB Misses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Visualización de Memoria</div>
                <div className="relative h-64 bg-gray-50 rounded p-4 overflow-hidden">
                  {/* Memory visualization with huge pages */}
                  <div className="grid grid-cols-8 gap-2 h-full">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className={`
                          rounded flex items-center justify-center text-xs
                          ${i < hugePages.allocated 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200 text-gray-700"}
                        `}
                        title={`Page ${i} (${config.pageSize}KB)`}
                      >
                        {i < 10 ? `P${i}` : `P${i}`}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-gray-500">
                    Cada rectángulo representa una página de {config.pageSize}KB
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cómo Funcionan las Huge Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Problema que Resuelven</div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">1</div>
                  <div>
                    <div className="font-medium">Limitaciones de TLB</div>
                    <div className="text-sm text-gray-600">
                      Las TLBs (Translation Lookaside Buffers) tienen un número limitado de entradas. 
                      Con páginas pequeñas (4KB), se llena rápidamente para aplicaciones grandes.
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">2</div>
                  <div>
                    <div className="font-medium">Fallas de TLB Costosas</div>
                    <div className="text-sm text-gray-600">
                      Cada fallo de TLB requiere una caminata por la tabla de páginas, 
                      que puede tomar decenas o cientos de ciclos de CPU.
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">3</div>
                  <div>
                    <div className="font-medium">Mejora con Huge Pages</div>
                    <div className="text-sm text-gray-600">
                      Al usar páginas más grandes (2MB/1GB), se necesitan menos entradas en la TLB 
                      para cubrir la misma cantidad de memoria, reduciendo drásticamente las fallos.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Visualización Comparativa</div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium mb-1">Páginas Tradicionales de 4KB</div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-[8px] text-white">
                        4K
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    Para 32KB de datos: 8 páginas → 8 entradas en TLB
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium mb-1">Huge Pages de 2MB</div>
                  <div className="flex gap-1 mb-2">
                    <div className="w-12 h-6 bg-green-500 rounded flex items-center justify-center text-xs text-white">
                      2MB
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Para 32KB de datos: 1 página → 1 entrada en TLB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Configuración y Uso de Huge Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Configuración del Sistema</div>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium mb-1">1. Configurar en el Kernel</div>
                  <div className="text-sm font-mono p-2 bg-gray-800 text-green-400 rounded">
                    # echo 1024 &gt; /proc/sys/vm/nr_hugepages
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Esto reserva 1024 huge pages de 2MB (2GB total)
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium mb-1">2. Montar hugetlbfs</div>
                  <div className="text-sm font-mono p-2 bg-gray-800 text-green-400 rounded">
                    # mount -t hugetlbfs none /mnt/huge
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium mb-1">3. Usar en Aplicaciones</div>
                  <div className="text-sm font-mono p-2 bg-gray-800 text-green-400 rounded">
                    void *ptr = mmap(NULL, size,<br/>
                    &nbsp;&nbsp;PROT_READ|PROT_WRITE,<br/>
                    &nbsp;&nbsp;MAP_PRIVATE|MAP_HUGETLB,<br/>
                    &nbsp;&nbsp;-1, 0);
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Cuándo usar Huge Pages</div>
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <div className="font-semibold mb-2">Cuándo usar Huge Pages:</div>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Aplicaciones con grandes working sets (&gt;1GB)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Workloads sensibles a latencia de memoria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Bases de datos y aplicaciones HPC</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-red-500">✗</span>
                    <span>Aplicaciones con patrones de acceso aleatorios dispersos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-red-500">✗</span>
                    <span>Sistemas con memoria limitada</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
