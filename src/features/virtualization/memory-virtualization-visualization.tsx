import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
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

export default function MemoryVirtualizationVisualization() {
  const [config, setConfig] = useState({
    virtualizationType: "full" as "full" | "paravirt" | "container",
    guestMemory: 4096, // 4GB
    hostMemory: 16384, // 16GB
    pageSize: 4096, // 4KB
    eptEnabled: true,
    balloonEnabled: true,
    overcommit: false,
    simulationSpeed: 200 // ms
  })
  
  const [virtualization, setVirtualization] = useState({
    guests: [] as {
      id: number,
      name: string,
      memory: number,
      balloonSize: number,
      swapped: number,
      allocated: number
    }[],
    host: {
      totalMemory: 0,
      usedMemory: 0,
      availableMemory: 0,
      overcommitted: false
    },
    translation: {
      tlbHits: 0,
      tlbMisses: 0,
      pageFaults: 0,
      eptHits: 0,
      eptMisses: 0
    },
    performance: {
      memoryOverhead: 0,
      translationLatency: 0,
      balloonInflation: 0
    }
  })
  
  const [history, setHistory] = useState<{
    time: number,
    hostUsed: number,
    guestUsed: number,
    pageFaults: number,
    translationLatency: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize virtualization state
  useState(() => {
    // Create guest VMs
    const guests = []
    const numGuests = Math.floor(config.hostMemory / config.guestMemory)
    
    for (let i = 0; i < Math.min(numGuests, 4); i++) {
      guests.push({
        id: i,
        name: `VM ${i + 1}`,
        memory: config.guestMemory,
        balloonSize: 0,
        swapped: 0,
        allocated: config.guestMemory / 2
      })
    }
    
    setVirtualization({
      guests,
      host: {
        totalMemory: config.hostMemory,
        usedMemory: guests.reduce((sum, guest) => sum + guest.memory, 0),
        availableMemory: config.hostMemory - guests.reduce((sum, guest) => sum + guest.memory, 0),
        overcommitted: false
      },
      translation: {
        tlbHits: 0,
        tlbMisses: 0,
        pageFaults: 0,
        eptHits: 0,
        eptMisses: 0
      },
      performance: {
        memoryOverhead: 0,
        translationLatency: 0,
        balloonInflation: 0
      }
    })
  })

  // Simulate memory virtualization
  const simulateVirtualization = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    const newHistory = []
    let tlbHits = 0
    let tlbMisses = 0
    let pageFaults = 0
    let eptHits = 0
    let eptMisses = 0
    let memoryOverhead = 0
    let translationLatency = 0
    let balloonInflation = 0
    
    // Simulate over time
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Update guest memory usage
      const newGuests = [...virtualization.guests]
      
      newGuests.forEach(guest => {
        // Simulate memory allocation/deallocation
        const change = (Math.random() - 0.5) * 100 // +/- 50MB
        guest.allocated = Math.max(0, Math.min(guest.memory, guest.allocated + change))
        
        // Simulate balloon inflation/deflation
        if (config.balloonEnabled) {
          const balloonChange = (Math.random() - 0.5) * 50 // +/- 25MB
          guest.balloonSize = Math.max(0, Math.min(guest.memory - guest.allocated, guest.balloonSize + balloonChange))
        }
        
        // Simulate swapping
        if (config.overcommit) {
          const swapChange = Math.random() > 0.8 ? 10 : 0 // 10MB swap
          guest.swapped = Math.max(0, guest.swapped + swapChange)
        }
      })
      
      // Update translation stats
      const guestAccesses = newGuests.reduce((sum, guest) => sum + guest.allocated, 0)
      const hostUsed = newGuests.reduce((sum, guest) => sum + guest.memory, 0)
      
      // Simulate TLB/EPT behavior
      if (config.eptEnabled) {
        // With EPT, more hits and fewer page faults
        eptHits += Math.floor(guestAccesses / 1000)
        eptMisses += Math.floor(guestAccesses / 10000)
        pageFaults += Math.floor(guestAccesses / 5000)
        translationLatency = 50 // ns with EPT
      } else {
        // Without EPT, more TLB misses and page faults
        tlbHits += Math.floor(guestAccesses / 2000)
        tlbMisses += Math.floor(guestAccesses / 500)
        pageFaults += Math.floor(guestAccesses / 1000)
        translationLatency = 200 // ns without EPT
      }
      
      // Update memory overhead
      memoryOverhead = (hostUsed / config.hostMemory) * 100
      
      // Update balloon inflation
      balloonInflation = newGuests.reduce((sum, guest) => sum + guest.balloonSize, 0)
      
      // Update host stats
      const hostAvailable = config.hostMemory - hostUsed
      
      setVirtualization(prev => ({
        ...prev,
        guests: newGuests,
        host: {
          ...prev.host,
          usedMemory: hostUsed,
          availableMemory: hostAvailable,
          overcommitted: config.overcommit && hostUsed > config.hostMemory
        },
        translation: {
          tlbHits,
          tlbMisses,
          pageFaults,
          eptHits,
          eptMisses
        },
        performance: {
          memoryOverhead: parseFloat(memoryOverhead.toFixed(2)),
          translationLatency: parseFloat(translationLatency.toFixed(2)),
          balloonInflation: parseFloat(balloonInflation.toFixed(2))
        }
      }))
      
      // Add to history
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          hostUsed,
          guestUsed: guestAccesses,
          pageFaults,
          translationLatency
        })
        setHistory(newHistory)
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    
    // Reset virtualization state
    const guests = []
    const numGuests = Math.floor(config.hostMemory / config.guestMemory)
    
    for (let i = 0; i < Math.min(numGuests, 4); i++) {
      guests.push({
        id: i,
        name: `VM ${i + 1}`,
        memory: config.guestMemory,
        balloonSize: 0,
        swapped: 0,
        allocated: config.guestMemory / 2
      })
    }
    
    setVirtualization({
      guests,
      host: {
        totalMemory: config.hostMemory,
        usedMemory: guests.reduce((sum, guest) => sum + guest.memory, 0),
        availableMemory: config.hostMemory - guests.reduce((sum, guest) => sum + guest.memory, 0),
        overcommitted: false
      },
      translation: {
        tlbHits: 0,
        tlbMisses: 0,
        pageFaults: 0,
        eptHits: 0,
        eptMisses: 0
      },
      performance: {
        memoryOverhead: 0,
        translationLatency: 0,
        balloonInflation: 0
      }
    })
  }

  // Virtualization type information
  const virtualizationInfo = {
    "full": {
      name: "Virtualización Completa",
      description: "Hipervisor emula completamente el hardware",
      color: "#3b82f6",
      icon: "🖥️"
    },
    "paravirt": {
      name: "Paravirtualización",
      description: "SO invitado colabora con hipervisor para mejor rendimiento",
      color: "#10b981",
      icon: "🤝"
    },
    "container": {
      name: "Contenedores",
      description: "Aislamiento a nivel de SO sin virtualización de hardware",
      color: "#8b5cf6",
      icon: "🐳"
    }
  }

  const currentVirtualization = virtualizationInfo[config.virtualizationType]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Virtualización de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo funciona la virtualización de memoria en entornos virtualizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="virtualizationType">Tipo de Virtualización</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(virtualizationInfo).map(([key, virt]) => (
                  <Button
                    key={key}
                    variant={config.virtualizationType === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, virtualizationType: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{virt.icon}</span>
                    <span className="text-xs">{virt.name.split(" ")[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="guestMemory">Memoria por Invitado (MB)</Label>
              <Input
                id="guestMemory"
                type="number"
                value={config.guestMemory}
                onChange={(e) => setConfig({...config, guestMemory: Number(e.target.value)})}
                min="512"
                step="512"
              />
            </div>

            <div>
              <Label htmlFor="hostMemory">Memoria del Host (MB)</Label>
              <Input
                id="hostMemory"
                type="number"
                value={config.hostMemory}
                onChange={(e) => setConfig({...config, hostMemory: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="pageSize">Tamaño de Página (bytes)</Label>
              <Input
                id="pageSize"
                type="number"
                value={config.pageSize}
                onChange={(e) => setConfig({...config, pageSize: Number(e.target.value)})}
                min="256"
                step="256"
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
                <Label htmlFor="balloonEnabled">Balloon Habilitado</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="balloonEnabled"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.balloonEnabled}
                    onChange={(e) => setConfig({...config, balloonEnabled: e.target.checked})}
                  />
                  <label
                    htmlFor="balloonEnabled"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="overcommit">Overcommit</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="overcommit"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.overcommit}
                    onChange={(e) => setConfig({...config, overcommit: e.target.checked})}
                  />
                  <label
                    htmlFor="overcommit"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
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
                onClick={simulateVirtualization} 
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
            <CardTitle 
              className="flex items-center"
              style={{ color: currentVirtualization.color }}
            >
              <span className="mr-2 text-2xl">{currentVirtualization.icon}</span>
              {currentVirtualization.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {currentVirtualization.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Memoria del Host</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {virtualization.host.totalMemory.toLocaleString()} MB
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Memoria Usada</div>
                  <div className="text-2xl font-bold text-green-600">
                    {virtualization.host.usedMemory.toLocaleString()} MB
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Memoria Disponible</div>
                  <div className="text-2xl font-bold text-red-600">
                    {virtualization.host.availableMemory.toLocaleString()} MB
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Overcommit</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {virtualization.host.overcommitted ? "Sí" : "No"}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Overhead de Memoria</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {virtualization.performance.memoryOverhead}%
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Máquinas Virtuales</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {virtualization.guests.map(guest => (
                    <Card key={guest.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">{guest.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Memoria Total</div>
                              <div className="font-semibold">{guest.memory} MB</div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Asignada</div>
                              <div className="font-semibold">{guest.allocated} MB</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-blue-50 rounded text-center">
                              <div className="text-xs text-gray-500">Balloon</div>
                              <div className="font-semibold">{guest.balloonSize} MB</div>
                            </div>
                            <div className="p-2 bg-red-50 rounded text-center">
                              <div className="text-xs text-gray-500">Swapped</div>
                              <div className="font-semibold">{guest.swapped} MB</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Utilización</div>
                            <Progress 
                              value={(guest.allocated / guest.memory) * 100} 
                              className="w-full" 
                              color={(guest.allocated / guest.memory) > 0.8 ? "red" : "green"}
                            />
                            <div className="text-right text-xs mt-1">
                              {((guest.allocated / guest.memory) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Traducción de Direcciones</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div className="p-2 bg-green-50 rounded text-center">
                    <div className="text-xs text-gray-500">TLB Hits</div>
                    <div className="font-semibold text-green-600">{virtualization.translation.tlbHits}</div>
                  </div>
                  <div className="p-2 bg-red-50 rounded text-center">
                    <div className="text-xs text-gray-500">TLB Misses</div>
                    <div className="font-semibold text-red-600">{virtualization.translation.tlbMisses}</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded text-center">
                    <div className="text-xs text-gray-500">Page Faults</div>
                    <div className="font-semibold text-blue-600">{virtualization.translation.pageFaults}</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded text-center">
                    <div className="text-xs text-gray-500">EPT Hits</div>
                    <div className="font-semibold text-purple-600">{virtualization.translation.eptHits}</div>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded text-center">
                    <div className="text-xs text-gray-500">EPT Misses</div>
                    <div className="font-semibold text-yellow-600">{virtualization.translation.eptMisses}</div>
                  </div>
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
                    yAxisId="left" 
                    label={{ value: "Memoria (MB)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Latencia (ns)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="hostUsed" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Memoria Usada (Host)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="guestUsed" 
                    stroke="#10b981" 
                    name="Memoria Usada (Guest)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="translationLatency" 
                    stroke="#8b5cf6" 
                    name="Latencia de Traducción"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="pageFaults" 
                    stroke="#ef4444" 
                    name="Page Faults"
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
          <CardTitle>Comparativa de Virtualización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(virtualizationInfo).map(([key, virt]) => (
              <Card 
                key={key}
                className={config.virtualizationType === key ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center text-sm"
                    style={{ color: virt.color }}
                  >
                    <span className="mr-2 text-lg">{virt.icon}</span>
                    {virt.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      {virt.description}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Overhead</div>
                        <div className="font-semibold">
                          {key === "full" ? "Alto" : key === "paravirt" ? "Medio" : "Bajo"}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Rendimiento</div>
                        <div className="font-semibold">
                          {key === "full" ? "Bajo" : key === "paravirt" ? "Alto" : "Muy Alto"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Aislamiento</div>
                        <div className="font-semibold">
                          {key === "full" ? "Completo" : key === "paravirt" ? "Bueno" : "Parcial"}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <div className="text-xs text-gray-500">Complejidad</div>
                        <div className="font-semibold">
                          {key === "full" ? "Alta" : key === "paravirt" ? "Media" : "Baja"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa paravirtualización para mejor rendimiento cuando sea posible</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Habilita EPT para acelerar la traducción de direcciones</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa ballooning para recuperar memoria de invitados inactivos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Evita overcommit excesivo para prevenir problemas de rendimiento</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
