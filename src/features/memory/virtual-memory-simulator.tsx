import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
export default function VirtualMemorySimulator() {
  const [config, setConfig] = useState({
    virtualAddressBits: 32,
    pageSize: 4096, // 4KB
    pageTableLevels: 4,
    physicalMemorySize: 1024 * 1024 * 1024, // 1GB
    tlbSize: 64
  })
  
  const [process, setProcess] = useState({
    pid: 1234,
    virtualMemoryUsed: 0,
    pageFaults: 0,
    tlbHits: 0,
    tlbMisses: 0
  })
  
  const [memory, setMemory] = useState({
    physicalPages: 0,
    freePages: 0,
    allocatedPages: 0
  })
  
  const [tlb, setTlb] = useState<{vpn: number, ppn: number, valid: boolean}[]>([])
  const [pageTable, setPageTable] = useState<{vpn: number, ppn: number | null, valid: boolean, dirty: boolean}[]>([])
  
  const [accessLog, setAccessLog] = useState<{address: number, result: "tlb_hit" | "tlb_miss" | "page_fault", time: number}[]>([])
  const [isRunning, setIsRunning] = useState(false)

  // Initialize memory structures
  useEffect(() => {
    const totalPages = Math.pow(2, config.virtualAddressBits) / config.pageSize
    const physicalPages = config.physicalMemorySize / config.pageSize
    
    // Initialize page table
    const newPageTable = []
    for (let i = 0; i < Math.min(totalPages, 1000); i++) { // Limit for demo
      newPageTable.push({
        vpn: i,
        ppn: null,
        valid: false,
        dirty: false
      })
    }
    setPageTable(newPageTable)
    
    // Initialize TLB
    const newTlb = []
    for (let i = 0; i < config.tlbSize; i++) {
      newTlb.push({
        vpn: 0,
        ppn: 0,
        valid: false
      })
    }
    setTlb(newTlb)
    
    // Initialize memory stats
    setMemory({
      physicalPages,
      freePages: physicalPages,
      allocatedPages: 0
    })
  }, [config])

  // Simulate memory access
  const simulateAccess = (virtualAddress: number) => {
    const vpn = Math.floor(virtualAddress / config.pageSize)
    const offset = virtualAddress % config.pageSize
    
    // Check TLB first
    const tlbEntry = tlb.find(entry => entry.valid && entry.vpn === vpn)
    
    if (tlbEntry) {
      // TLB hit
      setProcess(prev => ({
        ...prev,
        tlbHits: prev.tlbHits + 1
      }))
      
      setAccessLog(prev => [...prev.slice(-19), {
        address: virtualAddress,
        result: "tlb_hit",
        time: Date.now()
      }])
      
      return {
        physicalAddress: tlbEntry.ppn * config.pageSize + offset,
        type: "tlb_hit"
      }
    } else {
      // TLB miss - check page table
      setProcess(prev => ({
        ...prev,
        tlbMisses: prev.tlbMisses + 1
      }))
      
      const pageEntry = pageTable.find(entry => entry.vpn === vpn)
      
      if (pageEntry && pageEntry.valid) {
        // Page table hit - update TLB
        const newTlb = [...tlb]
        // Simple replacement - replace first invalid or first entry
        const replaceIndex = newTlb.findIndex(entry => !entry.valid) || 0
        newTlb[replaceIndex] = {
          vpn,
          ppn: pageEntry.ppn!,
          valid: true
        }
        setTlb(newTlb)
        
        setAccessLog(prev => [...prev.slice(-19), {
          address: virtualAddress,
          result: "tlb_miss",
          time: Date.now()
        }])
        
        return {
          physicalAddress: pageEntry.ppn! * config.pageSize + offset,
          type: "tlb_miss"
        }
      } else {
        // Page fault - allocate new page
        setProcess(prev => ({
          ...prev,
          pageFaults: prev.pageFaults + 1
        }))
        
        // Check if we have free physical pages
        if (memory.freePages > 0) {
          // Allocate new page
          const newPpn = memory.allocatedPages
          const newPageTable = [...pageTable]
          const pageIndex = newPageTable.findIndex(entry => entry.vpn === vpn)
          
          if (pageIndex !== -1) {
            newPageTable[pageIndex] = {
              ...newPageTable[pageIndex],
              ppn: newPpn,
              valid: true
            }
            setPageTable(newPageTable)
          }
          
          // Update TLB
          const newTlb = [...tlb]
          const replaceIndex = newTlb.findIndex(entry => !entry.valid) || 0
          newTlb[replaceIndex] = {
            vpn,
            ppn: newPpn,
            valid: true
          }
          setTlb(newTlb)
          
          // Update memory stats
          setMemory(prev => ({
            ...prev,
            freePages: prev.freePages - 1,
            allocatedPages: prev.allocatedPages + 1
          }))
          
          setAccessLog(prev => [...prev.slice(-19), {
            address: virtualAddress,
            result: "page_fault",
            time: Date.now()
          }])
          
          return {
            physicalAddress: newPpn * config.pageSize + offset,
            type: "page_fault"
          }
        } else {
          // No free pages - need to evict (not implemented in this demo)
          setAccessLog(prev => [...prev.slice(-19), {
            address: virtualAddress,
            result: "page_fault",
            time: Date.now()
          }])
          
          return {
            physicalAddress: null,
            type: "page_fault"
          }
        }
      }
    }
  }

  // Generate random accesses
  const generateRandomAccesses = () => {
    setIsRunning(true)
    
    // Generate 20 random accesses
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const address = Math.floor(Math.random() * Math.pow(2, config.virtualAddressBits))
        simulateAccess(address)
        
        if (i === 19) {
          setIsRunning(false)
        }
      }, i * 200)
    }
  }

  // Reset simulation
  const resetSimulation = () => {
    setProcess({
      pid: 1234,
      virtualMemoryUsed: 0,
      pageFaults: 0,
      tlbHits: 0,
      tlbMisses: 0
    })
    
    setAccessLog([])
    setIsRunning(false)
    
    // Reinitialize page table
    const totalPages = Math.pow(2, config.virtualAddressBits) / config.pageSize
    const newPageTable = []
    for (let i = 0; i < Math.min(totalPages, 1000); i++) { // Limit for demo
      newPageTable.push({
        vpn: i,
        ppn: null,
        valid: false,
        dirty: false
      })
    }
    setPageTable(newPageTable)
  }

  // Calculate TLB hit rate
  const tlbHitRate = process.tlbHits + process.tlbMisses > 0 
    ? (process.tlbHits / (process.tlbHits + process.tlbMisses) * 100).toFixed(1)
    : "0"

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Simulador de Memoria Virtual</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo funciona la traducción de direcciones virtuales a físicas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="virtualAddressBits">Bits de Dirección Virtual</Label>
              <Input
                id="virtualAddressBits"
                type="number"
                value={config.virtualAddressBits}
                onChange={(e) => setConfig({...config, virtualAddressBits: Number(e.target.value)})}
                min="16"
                max="64"
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

            <div>
              <Label htmlFor="pageTableLevels">Niveles de Tabla de Páginas</Label>
              <Input
                id="pageTableLevels"
                type="number"
                value={config.pageTableLevels}
                onChange={(e) => setConfig({...config, pageTableLevels: Number(e.target.value)})}
                min="1"
                max="5"
              />
            </div>

            <div>
              <Label htmlFor="physicalMemorySize">Tamaño de Memoria Física (bytes)</Label>
              <Input
                id="physicalMemorySize"
                type="number"
                value={config.physicalMemorySize}
                onChange={(e) => setConfig({...config, physicalMemorySize: Number(e.target.value)})}
                min="65536"
                step="65536"
              />
            </div>

            <div>
              <Label htmlFor="tlbSize">Tamaño de TLB</Label>
              <Input
                id="tlbSize"
                type="number"
                value={config.tlbSize}
                onChange={(e) => setConfig({...config, tlbSize: Number(e.target.value)})}
                min="4"
                max="512"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateRandomAccesses} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Generando..." : "Generar Accesos"}
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
            <CardTitle>Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded">
                <div className="text-xs text-blue-600 mb-1">Proceso</div>
                <div className="font-semibold">PID: {process.pid}</div>
                <div className="text-sm mt-2">
                  <div>Fallos de página: {process.pageFaults}</div>
                  <div>TLB Hits: {process.tlbHits}</div>
                  <div>TLB Misses: {process.tlbMisses}</div>
                  <div>Tasa de aciertos TLB: {tlbHitRate}%</div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded">
                <div className="text-xs text-green-600 mb-1">Memoria Física</div>
                <div className="font-semibold">
                  {Math.round(memory.physicalPages / 1024 / 1024)} MB
                </div>
                <div className="text-sm mt-2">
                  <div>Páginas totales: {memory.physicalPages.toLocaleString()}</div>
                  <div>Páginas libres: {memory.freePages.toLocaleString()}</div>
                  <div>Páginas asignadas: {memory.allocatedPages.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">TLB (primeras 8 entradas)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {tlb.slice(0, 8).map((entry, index) => (
                      <div 
                        key={index} 
                        className="p-2 bg-gray-50 rounded flex justify-between items-center"
                      >
                        <div>
                          <div className="text-xs">VPN: {entry.vpn}</div>
                          {entry.valid && <div className="text-xs">PPN: {entry.ppn}</div>}
                        </div>
                        <Badge 
                          variant={entry.valid ? "default" : "outline"}
                          className="text-xs"
                        >
                          {entry.valid ? "Válido" : "Inválido"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tabla de Páginas (primeras 8 entradas)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {pageTable.slice(0, 8).map((entry, index) => (
                      <div 
                        key={index} 
                        className="p-2 bg-gray-50 rounded flex justify-between items-center"
                      >
                        <div>
                          <div className="text-xs">VPN: {entry.vpn}</div>
                          {entry.valid && <div className="text-xs">PPN: {entry.ppn}</div>}
                        </div>
                        <div className="flex gap-1">
                          <Badge 
                            variant={entry.valid ? "default" : "outline"}
                            className="text-xs"
                          >
                            {entry.valid ? "Válido" : "Inválido"}
                          </Badge>
                          {entry.dirty && (
                            <Badge variant="destructive" className="text-xs">
                              Sucio
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Registro de Accesos</CardTitle>
        </CardHeader>
        <CardContent>
          {accessLog.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {accessLog.map((access, index) => (
                <div 
                  key={index} 
                  className={`
                    p-3 rounded flex flex-col items-center justify-center
                    ${access.result === "tlb_hit" 
                      ? "bg-green-50 border border-green-200" 
                      : access.result === "tlb_miss" 
                        ? "bg-yellow-50 border border-yellow-200" 
                        : "bg-red-50 border border-red-200"}
                  `}
                >
                  <div className="font-mono text-sm">0x{access.address.toString(16).toUpperCase()}</div>
                  <div className="text-xs mt-1">
                    {access.result === "tlb_hit" && (
                      <span className="text-green-600">TLB Hit</span>
                    )}
                    {access.result === "tlb_miss" && (
                      <span className="text-yellow-600">TLB Miss</span>
                    )}
                    {access.result === "page_fault" && (
                      <span className="text-red-600">Page Fault</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(access.time).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay accesos registrados todavía. Genere algunos accesos para ver el registro.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Proceso de Traducción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded text-center">
              <div className="font-semibold text-blue-800 mb-2">1. Dirección Virtual</div>
              <div className="text-sm text-blue-700">
                El procesador genera una dirección virtual para acceder a memoria.
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded text-center">
              <div className="font-semibold text-green-800 mb-2">2. TLB Lookup</div>
              <div className="text-sm text-green-700">
                Se busca en el TLB (Translation Lookaside Buffer) para una traducción rápida.
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded text-center">
              <div className="font-semibold text-yellow-800 mb-2">3. Page Table Walk</div>
              <div className="text-sm text-yellow-700">
                Si no hay TLB hit, se realiza un recorrido por las tablas de páginas.
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded text-center">
              <div className="font-semibold text-red-800 mb-2">4. Page Fault</div>
              <div className="text-sm text-red-700">
                Si la página no está en memoria, se genera un fallo de página y se carga.
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Minimizar los fallos de página manteniendo las estructuras de datos en memoria</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Mejorar la tasa de aciertos de TLB organizando los datos para mejorar la localidad</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Utilizar grandes páginas (huge pages) para reducir la sobrecarga de TLB</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}