import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"

export default function VirtualizationConcepts() {
  const [config, setConfig] = useState({
    guestMemory: 4096, // MB
    hostMemory: 16384, // MB
    pageSize: 4096, // bytes
    eptEnabled: true,
    ballooning: true,
    overcommit: false,
    simulationSpeed: 300 // ms
  })
  
  const [virtualization, setVirtualization] = useState({
    guests: [] as {
      id: number,
      name: string,
      memory: number,
      balloonSize: number,
      swapped: number,
      allocated: number,
      resident: number
    }[],
    host: {
      totalMemory: 16384,
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
        allocated: config.guestMemory / 2,
        resident: config.guestMemory / 2
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

  // Simulate virtualization
  const simulateVirtualization = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Reset performance counters
    setVirtualization(prev => ({
      ...prev,
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
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Update guest memory usage
      const newGuests = [...virtualization.guests]
      
      newGuests.forEach(guest => {
        // Simulate memory allocation/deallocation
        const change = (Math.random() - 0.5) * 100 // +/- 50MB
        guest.allocated = Math.max(0, Math.min(guest.memory, guest.allocated + change))
        
        // Simulate balloon inflation/deflation
        if (config.ballooning) {
          const balloonChange = (Math.random() - 0.5) * 50 // +/- 25MB
          guest.balloonSize = Math.max(0, Math.min(guest.memory - guest.allocated, guest.balloonSize + balloonChange))
        }
        
        // Simulate swapping
        if (config.overcommit) {
          const swapChange = Math.random() > 0.8 ? 10 : 0 // 10MB swap
          guest.swapped = Math.max(0, guest.swapped + swapChange)
        }
        
        // Update resident memory
        guest.resident = guest.allocated - guest.balloonSize - guest.swapped
      })
      
      // Update translation stats
      const guestAccesses = newGuests.reduce((sum, guest) => sum + guest.allocated, 0)
      const hostUsed = newGuests.reduce((sum, guest) => sum + guest.memory, 0)
      
      // Simulate TLB/EPT behavior
      let tlbHits = 0
      let tlbMisses = 0
      let pageFaults = 0
      let eptHits = 0
      let eptMisses = 0
      let translationLatency = 0
      
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
      const memoryOverhead = (hostUsed / config.hostMemory) * 100
      
      // Update balloon inflation
      const balloonInflation = newGuests.reduce((sum, guest) => sum + guest.balloonSize, 0)
      
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
        allocated: config.guestMemory / 2,
        resident: config.guestMemory / 2
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

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Conceptos de Virtualización de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo se gestiona la memoria en entornos virtualizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <select
                id="pageSize"
                value={config.pageSize}
                onChange={(e) => setConfig({...config, pageSize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={4096}>4 KB</option>
                <option value={2097152}>2 MB (Huge Page)</option>
                <option value={1073741824}>1 GB (Huge Page)</option>
              </select>
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
                <Label htmlFor="ballooning">Ballooning</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="ballooning"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.ballooning}
                    onChange={(e) => setConfig({...config, ballooning: e.target.checked})}
                  />
                  <label
                    htmlFor="ballooning"
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
            <CardTitle>Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Overcommit</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {virtualization.host.overcommitted ? "Sí" : "No"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Máquina Virtual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uso de Memoria</span>
                          <span>{virtualization.guests[0]?.allocated || 0} MB / {config.guestMemory} MB</span>
                        </div>
                        <Progress 
                          value={virtualization.guests[0] ? (virtualization.guests[0].allocated / config.guestMemory) * 100 : 0} 
                          className="w-full" 
                          color={(virtualization.guests[0]?.allocated / config.guestMemory) > 0.8 ? "red" : "blue"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Balloon</div>
                          <div className="font-semibold">{virtualization.guests[0]?.balloonSize || 0} MB</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Swapped</div>
                          <div className="font-semibold">{virtualization.guests[0]?.swapped || 0} MB</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Residente</div>
                        <div className="font-semibold">
                          {virtualization.guests[0]?.resident || 0} MB
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full bg-green-600" 
                            style={{ 
                              width: `${virtualization.guests[0] ? (virtualization.guests[0].resident / config.guestMemory) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Traducción de Direcciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500">TLB Hits</div>
                          <div className="font-semibold text-green-600">{virtualization.translation.tlbHits}</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500">TLB Misses</div>
                          <div className="font-semibold text-red-600">{virtualization.translation.tlbMisses}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-blue-50 rounded text-center">
                          <div className="text-xs text-gray-500">Page Faults</div>
                          <div className="font-semibold text-blue-600">{virtualization.translation.pageFaults}</div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded text-center">
                          <div className="text-xs text-gray-500">EPT Hits</div>
                          <div className="font-semibold text-purple-600">{virtualization.translation.eptHits}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-yellow-50 rounded text-center">
                          <div className="text-xs text-gray-500">EPT Misses</div>
                          <div className="font-semibold text-yellow-600">{virtualization.translation.eptMisses}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Latencia</div>
                          <div className="font-semibold">{virtualization.performance.translationLatency} ns</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                            <div className="text-xs text-gray-500 mb-1">Residente</div>
                            <div className="font-semibold">{guest.resident} MB</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="h-2 rounded-full bg-green-600" 
                                style={{ width: `${(guest.resident / guest.memory) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Utilización</span>
                              <span>{((guest.allocated / guest.memory) * 100).toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={(guest.allocated / guest.memory) * 100} 
                              className="w-full" 
                              color={(guest.allocated / guest.memory) > 0.8 ? "red" : "green"}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Virtualización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Virtualización Completa</div>
              <p className="text-sm text-blue-700 mb-3">
                El hipervisor emula completamente el hardware para cada máquina virtual.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Compatibilidad completa</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Aislamiento total</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Mayor overhead</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Paravirtualización</div>
              <p className="text-sm text-green-700 mb-3">
                El sistema operativo invitado colabora con el hipervisor para mejor rendimiento.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Rendimiento mejorado</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Menor overhead</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Requiere modificaciones</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Virtualización por Hardware</div>
              <p className="text-sm text-purple-700 mb-3">
                Extensiones de CPU que aceleran la virtualización (Intel VT-x, AMD-V).
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Aceleración por hardware</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Rendimiento cercano a nativo</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Requiere soporte específico</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Contenedores</div>
              <p className="text-sm text-yellow-700 mb-3">
                Aislamiento a nivel de sistema operativo sin virtualización de hardware.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Bajo overhead</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Rápido arranque</span>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Menos aislamiento</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Técnicas Avanzadas:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>EPT/NPT:</strong> Traducción de direcciones acelerada por hardware</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Ballooning:</strong> Técnica para reclamar memoria del invitado</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Memory Overcommit:</strong> Asignar más memoria de la disponible físicamente</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Dirty Page Tracking:</strong> Seguimiento de páginas modificadas para migración</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
