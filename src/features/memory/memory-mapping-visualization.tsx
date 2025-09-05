import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"

export default function MemoryMappingVisualization() {
  const [config, setConfig] = useState({
    virtualAddressSpace: 4096, // MB
    physicalMemory: 16384, // MB
    pageSize: 4096, // bytes
    mappingStrategy: "demand" as "demand" | "prefetch" | "streaming",
    accessPattern: "sequential" as "sequential" | "random" | "localized",
    simulationSpeed: 300 // ms
  })
  
  const [mapping, setMapping] = useState({
    virtualPages: [] as {
      id: number,
      vpn: number,
      ppn: number | null,
      present: boolean,
      accessed: boolean,
      dirty: boolean,
      referenceCount: number
    }[],
    physicalFrames: [] as {
      id: number,
      ppn: number,
      vpn: number | null,
      allocated: boolean,
      accessed: boolean,
      dirty: boolean
    }[],
    pageTable: {
      entries: [] as {
        vpn: number,
        ppn: number | null,
        present: boolean,
        writable: boolean,
        user: boolean,
        accessed: boolean,
        dirty: boolean
      }[]
    },
    translationLookasideBuffer: {
      entries: [] as {
        vpn: number,
        ppn: number,
        valid: boolean
      }[],
      hits: 0,
      misses: 0
    },
    performance: {
      pageFaults: 0,
      tlbHits: 0,
      tlbMisses: 0,
      memoryAccessTime: 0,
      pageTableWalks: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [guided, setGuided] = useState(false)

  // Initialize memory mapping
  useState(() => {
    // Create virtual pages
    const virtualPages = []
    const numVirtualPages = (config.virtualAddressSpace * 1024 * 1024) / config.pageSize
    
    for (let i = 0; i < Math.min(numVirtualPages, 1024); i++) {
      virtualPages.push({
        id: i,
        vpn: i,
        ppn: null,
        present: false,
        accessed: false,
        dirty: false,
        referenceCount: 0
      })
    }
    
    // Create physical frames
    const physicalFrames = []
    const numPhysicalFrames = (config.physicalMemory * 1024 * 1024) / config.pageSize
    
    for (let i = 0; i < Math.min(numPhysicalFrames, 4096); i++) {
      physicalFrames.push({
        id: i,
        ppn: i,
        vpn: null,
        allocated: false,
        accessed: false,
        dirty: false
      })
    }
    
    // Initialize page table
    const pageTableEntries = []
    for (let i = 0; i < Math.min(numVirtualPages, 1024); i++) {
      pageTableEntries.push({
        vpn: i,
        ppn: null,
        present: false,
        writable: true,
        user: true,
        accessed: false,
        dirty: false
      })
    }
    
    // Initialize TLB
    const tlbEntries = []
    for (let i = 0; i < 64; i++) { // 64-entry TLB
      tlbEntries.push({
        vpn: 0,
        ppn: 0,
        valid: false
      })
    }
    
    setMapping({
      virtualPages,
      physicalFrames,
      pageTable: {
        entries: pageTableEntries
      },
      translationLookasideBuffer: {
        entries: tlbEntries,
        hits: 0,
        misses: 0
      },
      performance: {
        pageFaults: 0,
        tlbHits: 0,
        tlbMisses: 0,
        memoryAccessTime: 0,
        pageTableWalks: 0
      }
    })
  })

  // Simulate memory mapping
  const simulateMemoryMapping = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Reset performance counters
    setMapping(prev => ({
      ...prev,
      translationLookasideBuffer: {
        ...prev.translationLookasideBuffer,
        hits: 0,
        misses: 0
      },
      performance: {
        pageFaults: 0,
        tlbHits: 0,
        tlbMisses: 0,
        memoryAccessTime: 0,
        pageTableWalks: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current mapping state (keep typing)
      const currentMapping = JSON.parse(JSON.stringify(mapping)) as typeof mapping
      const currentPerformance = { ...mapping.performance }
      
      // Simulate memory access based on access pattern
      const accessedVPNs: number[] = []
      
      if (config.accessPattern === "sequential") {
        // Sequential access pattern
        for (let i = 0; i < 10; i++) {
          const vpn = (step * 10 + i) % currentMapping.virtualPages.length
          accessedVPNs.push(vpn)
        }
      } else if (config.accessPattern === "random") {
        // Random access pattern
        for (let i = 0; i < 10; i++) {
          const vpn = Math.floor(Math.random() * currentMapping.virtualPages.length)
          accessedVPNs.push(vpn)
        }
      } else if (config.accessPattern === "localized") {
        // Localized access pattern (working set)
        const workingSetStart = Math.floor(Math.random() * (currentMapping.virtualPages.length - 100))
        for (let i = 0; i < 10; i++) {
          const vpn = workingSetStart + Math.floor(Math.random() * 100)
          accessedVPNs.push(vpn)
        }
      }
      
      // Process each accessed VPN
      for (const vpn of accessedVPNs) {
        // Check TLB first
        const tlbEntry = currentMapping.translationLookasideBuffer.entries.find(entry => entry.vpn === vpn && entry.valid)
        
        if (tlbEntry) {
          // TLB hit
          currentPerformance.tlbHits++
          currentPerformance.memoryAccessTime += 1 // 1 cycle for TLB hit
        } else {
          // TLB miss
          currentPerformance.tlbMisses++
          currentPerformance.pageTableWalks++
          currentPerformance.memoryAccessTime += 10 // 10 cycles for page table walk
          
          // Check page table
          const pageTableEntry = currentMapping.pageTable.entries.find(entry => entry.vpn === vpn)
          
          if (pageTableEntry && pageTableEntry.present) {
            // Page is present in physical memory
            // Add to TLB (replace random entry)
            const tlbIndex = Math.floor(Math.random() * currentMapping.translationLookasideBuffer.entries.length)
            currentMapping.translationLookasideBuffer.entries[tlbIndex] = {
              vpn,
              ppn: pageTableEntry.ppn || 0,
              valid: true
            }
          } else {
            // Page fault - need to allocate physical frame
            currentPerformance.pageFaults++
            currentPerformance.memoryAccessTime += 1000 // 1000 cycles for page fault handling
            
            // Find free physical frame or evict one
            let freeFrame = currentMapping.physicalFrames.find(frame => !frame.allocated)
            
            if (!freeFrame) {
              // Need to evict a frame (simple FIFO for demo)
              const evictIndex = Math.floor(Math.random() * currentMapping.physicalFrames.length)
              freeFrame = currentMapping.physicalFrames[evictIndex]
              
              // Clear old mapping
              const vpnToClear = freeFrame?.vpn
              if (vpnToClear !== null && vpnToClear !== undefined) {
                const oldPageTableEntry = currentMapping.pageTable.entries.find(entry => entry.vpn === vpnToClear)
                if (oldPageTableEntry) {
                  oldPageTableEntry.present = false
                  oldPageTableEntry.ppn = null
                }
              }
            }
            
            if (!freeFrame) {
              // If still not available, skip this access (typing safety)
              continue
            }
            // Map virtual page to physical frame
            freeFrame.allocated = true
            freeFrame.vpn = vpn
            freeFrame.accessed = true
            
            // Update page table
            if (pageTableEntry) {
              pageTableEntry.present = true
              pageTableEntry.ppn = freeFrame.ppn
              pageTableEntry.accessed = true
            }
            
            // Add to TLB
            const tlbIndex = Math.floor(Math.random() * currentMapping.translationLookasideBuffer.entries.length)
            currentMapping.translationLookasideBuffer.entries[tlbIndex] = {
              vpn,
              ppn: freeFrame.ppn,
              valid: true
            }
          }
        }
        
        // Update virtual page stats
        const virtualPage = currentMapping.virtualPages.find(page => page.vpn === vpn)
        if (virtualPage) {
          virtualPage.accessed = true
          virtualPage.referenceCount++
        }
      }
      
      // Apply mapping strategy optimizations
      if (config.mappingStrategy === "prefetch") {
        // Prefetch adjacent pages
        for (const vpn of accessedVPNs) {
          for (let i = 1; i <= 3; i++) {
            const prefetchVPN = vpn + i
            if (prefetchVPN < currentMapping.virtualPages.length) {
              const pageTableEntry = currentMapping.pageTable.entries.find(entry => entry.vpn === prefetchVPN)
              if (pageTableEntry && !pageTableEntry.present) {
                // Simulate prefetch - reduce probability of future page fault
                if (Math.random() > 0.7) {
                  const freeFrame = currentMapping.physicalFrames.find(frame => !frame.allocated)
                  if (freeFrame) {
                    freeFrame.allocated = true
                    freeFrame.vpn = prefetchVPN
                    pageTableEntry.present = true
                    pageTableEntry.ppn = freeFrame.ppn
                  }
                }
              }
            }
          }
        }
      } else if (config.mappingStrategy === "streaming") {
        // Streaming optimizations for sequential access
        if (config.accessPattern === "sequential") {
          // Prefetch ahead for sequential access
          const lastVPN = accessedVPNs[accessedVPNs.length - 1]
          for (let i = 1; i <= 5; i++) {
            const prefetchVPN = lastVPN + i
            if (prefetchVPN < currentMapping.virtualPages.length) {
              const pageTableEntry = currentMapping.pageTable.entries.find(entry => entry.vpn === prefetchVPN)
              if (pageTableEntry && !pageTableEntry.present) {
                if (Math.random() > 0.5) {
                  const freeFrame = currentMapping.physicalFrames.find(frame => !frame.allocated)
                  if (freeFrame) {
                    freeFrame.allocated = true
                    freeFrame.vpn = prefetchVPN
                    pageTableEntry.present = true
                    pageTableEntry.ppn = freeFrame.ppn
                  }
                }
              }
            }
          }
        }
      }
      
      // Update state
      currentMapping.performance = currentPerformance
      setMapping(currentMapping)
      
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
    
    // Reset mapping state
    const virtualPages = []
    const numVirtualPages = (config.virtualAddressSpace * 1024 * 1024) / config.pageSize
    
    for (let i = 0; i < Math.min(numVirtualPages, 1024); i++) {
      virtualPages.push({
        id: i,
        vpn: i,
        ppn: null,
        present: false,
        accessed: false,
        dirty: false,
        referenceCount: 0
      })
    }
    
    const physicalFrames = []
    const numPhysicalFrames = (config.physicalMemory * 1024 * 1024) / config.pageSize
    
    for (let i = 0; i < Math.min(numPhysicalFrames, 4096); i++) {
      physicalFrames.push({
        id: i,
        ppn: i,
        vpn: null,
        allocated: false,
        accessed: false,
        dirty: false
      })
    }
    
    const pageTableEntries = []
    for (let i = 0; i < Math.min(numVirtualPages, 1024); i++) {
      pageTableEntries.push({
        vpn: i,
        ppn: null,
        present: false,
        writable: true,
        user: true,
        accessed: false,
        dirty: false
      })
    }
    
    const tlbEntries = []
    for (let i = 0; i < 64; i++) {
      tlbEntries.push({
        vpn: 0,
        ppn: 0,
        valid: false
      })
    }
    
    setMapping({
      virtualPages,
      physicalFrames,
      pageTable: {
        entries: pageTableEntries
      },
      translationLookasideBuffer: {
        entries: tlbEntries,
        hits: 0,
        misses: 0
      },
      performance: {
        pageFaults: 0,
        tlbHits: 0,
        tlbMisses: 0,
        memoryAccessTime: 0,
        pageTableWalks: 0
      }
    })
  }

  // Calculate utilization percentages
  const virtualUtilization = (mapping.virtualPages.filter(page => page.present).length / mapping.virtualPages.length) * 100
  const physicalUtilization = (mapping.physicalFrames.filter(frame => frame.allocated).length / mapping.physicalFrames.length) * 100
  const tlbUtilization = (mapping.translationLookasideBuffer.entries.filter(entry => entry.valid).length / mapping.translationLookasideBuffer.entries.length) * 100

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Mapeo de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo se mapea la memoria virtual a física en sistemas modernos
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Traducción rápida"
        metaphor="TLB como guía telefónica: si está el número, llamas directo; si no, recorres el directorio completo (tablas)."
        idea="Un TLB hit evita un page walk de 4–5 niveles. Las páginas grandes reducen entradas y fallos del TLB."
        bullets={["Bits del VA → índices de niveles", "Hit/miss TLB", "Páginas grandes"]}
        board={{ title: "Coste de acceso efectivo", content: "T = HitTLB + MissTLB × (PageWalk)\nPageWalk ≈ Niveles × Latencia memoria caché" }}
        metrics={[{ label: "TLB entries", value: 64 }, { label: "PageSize", value: `${config.pageSize} B` }]}
      />

      {guided && (
        <GuidedFlow
          title="De VA a PA"
          steps={[
            { title: "VA recibido", content: "Dividimos la dirección virtual en: offset + índices de niveles." },
            { title: "Consultar TLB", content: "Si está la traducción, accedemos directamente al marco físico." },
            { title: "Page walk", content: "Recorremos PML4→PDPT→PD→PT y resolvemos PPN. Marcamos la entrada como 'present'." },
            { title: "Cargar en TLB", content: "Insertamos la traducción en el TLB para acelerar el siguiente acceso." },
            { title: "Optimización", content: "Activa páginas grandes para reducir misses del TLB." }
          ]}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="virtualAddressSpace">Espacio de Direcciones Virtual (MB)</Label>
              <Input
                id="virtualAddressSpace"
                type="number"
                value={config.virtualAddressSpace}
                onChange={(e) => setConfig({...config, virtualAddressSpace: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="physicalMemory">Memoria Física (MB)</Label>
              <Input
                id="physicalMemory"
                type="number"
                value={config.physicalMemory}
                onChange={(e) => setConfig({...config, physicalMemory: Number(e.target.value)})}
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

            <div>
              <Label htmlFor="mappingStrategy">Estrategia de Mapeo</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.mappingStrategy === "demand" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mappingStrategy: "demand"})}
                >
                  Bajo Demanda
                </Button>
                <Button
                  variant={config.mappingStrategy === "prefetch" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mappingStrategy: "prefetch"})}
                >
                  Prefetch
                </Button>
                <Button
                  variant={config.mappingStrategy === "streaming" ? "default" : "outline"}
                  onClick={() => setConfig({...config, mappingStrategy: "streaming"})}
                >
                  Streaming
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
                  variant={config.accessPattern === "localized" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "localized"})}
                >
                  Localizado
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
                onClick={simulateMemoryMapping} 
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
            <CardTitle>Estado del Mapeo de Memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos de Página</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {mapping.performance.pageFaults}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">TLB Hits</div>
                  <div className="text-2xl font-bold text-green-600">
                    {mapping.performance.tlbHits}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">TLB Misses</div>
                  <div className="text-2xl font-bold text-red-600">
                    {mapping.performance.tlbMisses}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Acceso</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {mapping.performance.memoryAccessTime} ciclos
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <span className="mr-2">📘</span>
                      Espacio Virtual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{virtualUtilization.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={virtualUtilization} 
                          className="w-full" 
                          color={virtualUtilization > 80 ? "red" : virtualUtilization > 60 ? "yellow" : "blue"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Total</div>
                          <div className="font-semibold">{mapping.virtualPages.length.toLocaleString()}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Presentes</div>
                          <div className="font-semibold">
                            {mapping.virtualPages.filter(page => page.present).length.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Páginas Virtuales (muestra)</div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                          {mapping.virtualPages.slice(0, 100).map(page => (
                            <div
                              key={page.vpn}
                              className={`
                                w-4 h-4 rounded text-xs flex items-center justify-center
                                ${page.present 
                                  ? page.accessed 
                                    ? "bg-green-500 text-white" 
                                    : "bg-blue-500 text-white"
                                  : "bg-gray-200"}
                              `}
                              title={`
                                VPN: ${page.vpn}
                                Presente: ${page.present ? "Sí" : "No"}
                                Accedida: ${page.accessed ? "Sí" : "No"}
                                Referencias: ${page.referenceCount}
                              `}
                            >
                              {page.present ? (page.accessed ? "A" : "P") : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <span className="mr-2">💾</span>
                      Memoria Física
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{physicalUtilization.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={physicalUtilization} 
                          className="w-full" 
                          color={physicalUtilization > 80 ? "red" : physicalUtilization > 60 ? "yellow" : "green"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Total</div>
                          <div className="font-semibold">{mapping.physicalFrames.length.toLocaleString()}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Asignadas</div>
                          <div className="font-semibold">
                            {mapping.physicalFrames.filter(frame => frame.allocated).length.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Marcos Físicos (muestra)</div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                          {mapping.physicalFrames.slice(0, 100).map(frame => (
                            <div
                              key={frame.ppn}
                              className={`
                                w-4 h-4 rounded text-xs flex items-center justify-center
                                ${frame.allocated 
                                  ? frame.accessed 
                                    ? "bg-green-500 text-white" 
                                    : "bg-blue-500 text-white"
                                  : "bg-gray-200"}
                              `}
                              title={`
                                PPN: ${frame.ppn}
                                Asignado: ${frame.allocated ? "Sí" : "No"}
                                VPN: ${frame.vpn !== null ? frame.vpn : "Ninguno"}
                                Accedido: ${frame.accessed ? "Sí" : "No"}
                              `}
                            >
                              {frame.allocated ? (frame.accessed ? "A" : "F") : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-600">
                      <span className="mr-2">🔍</span>
                      TLB
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{tlbUtilization.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={tlbUtilization} 
                          className="w-full" 
                          color={tlbUtilization > 80 ? "red" : tlbUtilization > 60 ? "yellow" : "purple"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Entradas</div>
                          <div className="font-semibold">{mapping.translationLookasideBuffer.entries.length}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Válidas</div>
                          <div className="font-semibold">
                            {mapping.translationLookasideBuffer.entries.filter(entry => entry.valid).length}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500">Hits</div>
                          <div className="font-semibold text-green-600">
                            {mapping.performance.tlbHits}
                          </div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500">Misses</div>
                          <div className="font-semibold text-red-600">
                            {mapping.performance.tlbMisses}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Entradas TLB</div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                          {mapping.translationLookasideBuffer.entries.map((entry, index) => (
                            <div
                              key={index}
                              className={`
                                w-4 h-4 rounded text-xs flex items-center justify-center
                                ${entry.valid ? "bg-purple-500 text-white" : "bg-gray-200"}
                              `}
                              title={`
                                VPN: ${entry.vpn}
                                PPN: ${entry.ppn}
                                Válida: ${entry.valid ? "Sí" : "No"}
                              `}
                            >
                              {entry.valid ? "V" : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Tabla de Páginas</div>
                <div className="max-h-48 overflow-y-auto p-2 bg-gray-50 rounded">
                  <div className="grid grid-cols-8 gap-1">
                    {mapping.pageTable.entries.slice(0, 64).map(entry => (
                      <div
                        key={entry.vpn}
                        className={`
                          p-1 rounded text-xs text-center
                          ${entry.present 
                            ? entry.accessed 
                              ? "bg-green-500 text-white" 
                              : "bg-blue-500 text-white"
                            : "bg-gray-200"}
                        `}
                        title={`
                          VPN: ${entry.vpn}
                          PPN: ${entry.ppn !== null ? entry.ppn : "Ninguno"}
                          Presente: ${entry.present ? "Sí" : "No"}
                          Accedida: ${entry.accessed ? "Sí" : "No"}
                          Sucia: ${entry.dirty ? "Sí" : "No"}
                        `}
                      >
                        {entry.vpn}
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
          <CardTitle>Conceptos de Mapeo de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Paginación</div>
              <p className="text-sm text-blue-700 mb-3">
                La paginación divide la memoria en bloques fijos llamados páginas 
                que se mapean a marcos de memoria física.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span><strong>Ventajas:</strong> Elimina fragmentación externa</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">✓</span>
                  <span><strong>Desventajas:</strong> Fragmentación interna, overhead de TLB</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">TLB (Translation Lookaside Buffer)</div>
              <p className="text-sm text-green-700 mb-3">
                Caché especializado que almacena las traducciones más recientes 
                de direcciones virtuales a físicas para acelerar el acceso.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Función:</strong> Reduce accesos a tabla de páginas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Tipo:</strong> Asociativa totalmente o parcialmente</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Estrategias de Reemplazo</div>
              <p className="text-sm text-purple-700 mb-3">
                Algoritmos que determinan qué páginas deben reemplazarse cuando 
                se necesita memoria física.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>FIFO:</strong> Primera en entrar, primera en salir</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>LRU:</strong> Menos recientemente usada</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Óptima:</strong> Reemplaza página que no se usará por más tiempo</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Optimizaciones Modernas:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Técnicas de Hardware</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>EPT/NPT:</strong> Traducción acelerada por hardware</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>1GB Pages:</strong> Reducen entradas TLB en 512x</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>PCID:</strong> Identificadores de contexto de proceso</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Técnicas de Software</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Prefetching:</strong> Carga anticipada de páginas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Working Set:</strong> Mantener páginas activas en memoria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Swapping:</strong> Mover páginas inactivas a disco</span>
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
