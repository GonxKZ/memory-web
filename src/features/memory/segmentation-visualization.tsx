import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function SegmentationVisualization() {
  const [config, setConfig] = useState({
    addressSpaceSize: 1048576, // 1MB
    segmentationType: "flat" as "flat" | "segmented" | "protected",
    segments: [
      { id: 0, name: "Code", base: 0x000000, limit: 0x20000, type: "code" },
      { id: 1, name: "Data", base: 0x20000, limit: 0x10000, type: "data" },
      { id: 2, name: "Heap", base: 0x30000, limit: 0x20000, type: "data" },
      { id: 3, name: "Stack", base: 0x50000, limit: 0x10000, type: "data" }
    ],
    accessPattern: "sequential" as "sequential" | "random" | "interleaved",
    protectionEnabled: true,
    simulationSpeed: 300 // ms
  })
  
  const [segmentation, setSegmentation] = useState({
    segments: [] as {
      id: number,
      name: string,
      base: number,
      limit: number,
      type: "code" | "data" | "stack" | "heap",
      present: boolean,
      writable: boolean,
      executable: boolean,
      accessed: boolean,
      dirty: boolean
    }[],
    addressSpace: [] as {
      address: number,
      segmentId: number | null,
      accessible: boolean,
      protected: boolean,
      accessed: boolean
    }[],
    registers: {
      cs: { base: 0, limit: 0, selector: 0 },
      ds: { base: 0, limit: 0, selector: 0 },
      ss: { base: 0, limit: 0, selector: 0 },
      es: { base: 0, limit: 0, selector: 0 }
    },
    statistics: {
      validAccesses: 0,
      invalidAccesses: 0,
      protectionFaults: 0,
      segmentFaults: 0,
      accessEfficiency: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Initialize segmentation
  useState(() => {
    // Create segments
    const segments = [
      {
        id: 0,
        name: "Code",
        base: 0x000000,
        limit: 0x20000, // 128KB
        type: "code" as const,
        present: true,
        writable: false,
        executable: true,
        accessed: false,
        dirty: false
      },
      {
        id: 1,
        name: "Data",
        base: 0x20000,
        limit: 0x10000, // 64KB
        type: "data" as const,
        present: true,
        writable: true,
        executable: false,
        accessed: false,
        dirty: false
      },
      {
        id: 2,
        name: "Heap",
        base: 0x30000,
        limit: 0x20000, // 128KB
        type: "heap" as const,
        present: true,
        writable: true,
        executable: false,
        accessed: false,
        dirty: false
      },
      {
        id: 3,
        name: "Stack",
        base: 0x50000,
        limit: 0x10000, // 64KB
        type: "stack" as const,
        present: true,
        writable: true,
        executable: false,
        accessed: false,
        dirty: false
      }
    ]
    
    // Create address space representation
    const addressSpace = []
    const addressGranularity = 1024 // Show every 1KB
    for (let addr = 0; addr < config.addressSpaceSize; addr += addressGranularity) {
      // Find which segment contains this address
      const segment = segments.find(seg => 
        addr >= seg.base && addr < seg.base + seg.limit
      )
      
      addressSpace.push({
        address: addr,
        segmentId: segment ? segment.id : null,
        accessible: segment ? segment.present : false,
        protected: config.protectionEnabled,
        accessed: false
      })
    }
    
    // Initialize segment registers
    const registers = {
      cs: { base: segments[0].base, limit: segments[0].limit, selector: 0 },
      ds: { base: segments[1].base, limit: segments[1].limit, selector: 1 },
      ss: { base: segments[3].base, limit: segments[3].limit, selector: 3 },
      es: { base: segments[1].base, limit: segments[1].limit, selector: 1 }
    }
    
    setSegmentation({
      segments,
      addressSpace,
      registers,
      statistics: {
        validAccesses: 0,
        invalidAccesses: 0,
        protectionFaults: 0,
        segmentFaults: 0,
        accessEfficiency: 0
      }
    })
  })

  // Simulate segmentation
  const simulateSegmentation = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset statistics
    setSegmentation(prev => ({
      ...prev,
      statistics: {
        validAccesses: 0,
        invalidAccesses: 0,
        protectionFaults: 0,
        segmentFaults: 0,
        accessEfficiency: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current segmentation state
      const currentSegmentation = JSON.parse(JSON.stringify(segmentation))
      const currentStatistics = { ...segmentation.statistics }
      
      // Generate memory access based on pattern
      let address: number
      if (config.accessPattern === "sequential") {
        address = step * 1024 // Access every 1KB sequentially
      } else if (config.accessPattern === "random") {
        address = Math.floor(Math.random() * config.addressSpaceSize)
      } else {
        // Interleaved pattern - alternate between segments
        const segmentIndex = step % config.segments.length
        const segment = currentSegmentation.segments[segmentIndex]
        address = segment.base + Math.floor(Math.random() * segment.limit)
      }
      
      // Find which segment contains this address
      const segment = currentSegmentation.segments.find((seg: any) => 
        address >= seg.base && address < seg.base + seg.limit
      )
      
      // Check if access is valid
      if (segment && segment.present) {
        // Valid segment access
        currentStatistics.validAccesses++
        
        // Update segment stats
        segment.accessed = true
        if (segment.type !== "code") {
          segment.dirty = true
        }
        
        // Update address space
        const addressIndex = Math.floor(address / 1024)
        if (currentSegmentation.addressSpace[addressIndex]) {
          currentSegmentation.addressSpace[addressIndex].accessed = true
        }
        
        // Check protection (simplified)
        if (config.protectionEnabled) {
          // In protected mode, check segment permissions
          if (segment.type === "code" && segment.writable) {
            currentStatistics.protectionFaults++
          } else if (segment.type !== "code" && segment.executable) {
            currentStatistics.protectionFaults++
          }
        }
      } else {
        // Invalid access
        currentStatistics.invalidAccesses++
        
        // Check if it's a segment fault (address outside any segment)
        if (!segment) {
          currentStatistics.segmentFaults++
        }
        
        // Update address space
        const addressIndex = Math.floor(address / 1024)
        if (currentSegmentation.addressSpace[addressIndex]) {
          currentSegmentation.addressSpace[addressIndex].accessed = false
        }
      }
      
      // Update access efficiency
      const totalAccesses = currentStatistics.validAccesses + currentStatistics.invalidAccesses
      currentStatistics.accessEfficiency = totalAccesses > 0 
        ? (currentStatistics.validAccesses / totalAccesses) * 100 
        : 0
      
      // Update state
      currentSegmentation.statistics = currentStatistics
      setSegmentation(currentSegmentation)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          statistics: {...currentStatistics},
          segments: currentSegmentation.segments.length,
          address
        }])
      }
      
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
    setHistory([])
    
    // Reset segmentation state
    const segments = [
      {
        id: 0,
        name: "Code",
        base: 0x000000,
        limit: 0x20000,
        type: "code" as const,
        present: true,
        writable: false,
        executable: true,
        accessed: false,
        dirty: false
      },
      {
        id: 1,
        name: "Data",
        base: 0x20000,
        limit: 0x10000,
        type: "data" as const,
        present: true,
        writable: true,
        executable: false,
        accessed: false,
        dirty: false
      },
      {
        id: 2,
        name: "Heap",
        base: 0x30000,
        limit: 0x20000,
        type: "heap" as const,
        present: true,
        writable: true,
        executable: false,
        accessed: false,
        dirty: false
      },
      {
        id: 3,
        name: "Stack",
        base: 0x50000,
        limit: 0x10000,
        type: "stack" as const,
        present: true,
        writable: true,
        executable: false,
        accessed: false,
        dirty: false
      }
    ]
    
    const addressSpace = []
    const addressGranularity = 1024
    for (let addr = 0; addr < config.addressSpaceSize; addr += addressGranularity) {
      const segment = segments.find(seg => 
        addr >= seg.base && addr < seg.base + seg.limit
      )
      
      addressSpace.push({
        address: addr,
        segmentId: segment ? segment.id : null,
        accessible: segment ? segment.present : false,
        protected: config.protectionEnabled,
        accessed: false
      })
    }
    
    const registers = {
      cs: { base: segments[0].base, limit: segments[0].limit, selector: 0 },
      ds: { base: segments[1].base, limit: segments[1].limit, selector: 1 },
      ss: { base: segments[3].base, limit: segments[3].limit, selector: 3 },
      es: { base: segments[1].base, limit: segments[1].limit, selector: 1 }
    }
    
    setSegmentation({
      segments,
      addressSpace,
      registers,
      statistics: {
        validAccesses: 0,
        invalidAccesses: 0,
        protectionFaults: 0,
        segmentFaults: 0,
        accessEfficiency: 0
      }
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Segmentación</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo la segmentación organiza el espacio de direcciones de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="addressSpaceSize">Tamaño del Espacio de Direcciones (bytes)</Label>
              <select
                id="addressSpaceSize"
                value={config.addressSpaceSize}
                onChange={(e) => setConfig({...config, addressSpaceSize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={262144}>256 KB</option>
                <option value={524288}>512 KB</option>
                <option value={1048576}>1 MB</option>
                <option value={2097152}>2 MB</option>
                <option value={4194304}>4 MB</option>
              </select>
            </div>

            <div>
              <Label htmlFor="segmentationType">Tipo de Segmentación</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.segmentationType === "flat" ? "default" : "outline"}
                  onClick={() => setConfig({...config, segmentationType: "flat"})}
                >
                  Plana
                </Button>
                <Button
                  variant={config.segmentationType === "segmented" ? "default" : "outline"}
                  onClick={() => setConfig({...config, segmentationType: "segmented"})}
                >
                  Segmentada
                </Button>
                <Button
                  variant={config.segmentationType === "protected" ? "default" : "outline"}
                  onClick={() => setConfig({...config, segmentationType: "protected"})}
                >
                  Protegida
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
                  variant={config.accessPattern === "interleaved" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "interleaved"})}
                >
                  Interleaved
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="protectionEnabled">Protección Habilitada</Label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="protectionEnabled"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked={config.protectionEnabled}
                  onChange={(e) => setConfig({...config, protectionEnabled: e.target.checked})}
                />
                <label
                  htmlFor="protectionEnabled"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
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
                onClick={simulateSegmentation} 
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
            <CardTitle>Estado de Segmentación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Válidos</div>
                  <div className="text-2xl font-bold text-green-600">
                    {segmentation.statistics.validAccesses}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Inválidos</div>
                  <div className="text-2xl font-bold text-red-600">
                    {segmentation.statistics.invalidAccesses}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Fallos de Protección</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {segmentation.statistics.protectionFaults}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Eficiencia de Acceso</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {segmentation.statistics.accessEfficiency.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Segmentos</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {segmentation.segments.map(segment => (
                    <Card key={segment.id}>
                      <CardHeader>
                        <CardTitle className="text-sm flex justify-between items-center">
                          <span>{segment.name}</span>
                          <Badge 
                            variant={
                              segment.type === "code" ? "default" : 
                              segment.type === "data" ? "secondary" : 
                              segment.type === "heap" ? "outline" : "destructive"
                            }
                          >
                            {segment.type}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Base</div>
                              <div className="font-mono text-sm">0x{segment.base.toString(16).toUpperCase()}</div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Límite</div>
                              <div className="font-mono text-sm">0x{segment.limit.toString(16).toUpperCase()}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Presente</div>
                              <div className="font-semibold text-green-600">
                                {segment.present ? "Sí" : "No"}
                              </div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Escribible</div>
                              <div className="font-semibold">
                                {segment.writable ? "Sí" : "No"}
                              </div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Ejecutable</div>
                              <div className="font-semibold">
                                {segment.executable ? "Sí" : "No"}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Accesos</span>
                              <span>{segment.accessed ? "Sí" : "No"}</span>
                            </div>
                            <Progress 
                              value={segment.accessed ? 100 : 0} 
                              className="w-full" 
                              color={segment.accessed ? "green" : "gray"}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Espacio de Direcciones</div>
                <div className="max-h-48 overflow-y-auto p-2 bg-gray-50 rounded">
                  <div className="flex flex-wrap gap-1">
                    {segmentation.addressSpace.map((addr, index) => (
                      <div
                        key={index}
                        className={`
                          w-4 h-4 rounded text-xs flex items-center justify-center
                          ${addr.segmentId !== null 
                            ? addr.accessed 
                              ? "bg-green-500 text-white" 
                              : "bg-blue-500 text-white"
                            : "bg-gray-200"}
                          ${!addr.accessible ? "opacity-50" : ""}
                        `}
                        title={`
                          Dirección: 0x${addr.address.toString(16).toUpperCase()}
                          Segmento: ${addr.segmentId !== null 
                            ? segmentation.segments.find(s => s.id === addr.segmentId)?.name 
                            : "Ninguno"}
                          Accesible: ${addr.accessible ? "Sí" : "No"}
                          Protegido: ${addr.protected ? "Sí" : "No"}
                          Accedido: ${addr.accessed ? "Sí" : "No"}
                        `}
                      >
                        {addr.segmentId !== null ? addr.segmentId : ""}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Registros de Segmento</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs">CS (Code Segment)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-xs">
                        <div>Base: 0x{segmentation.registers.cs.base.toString(16).toUpperCase()}</div>
                        <div>Límite: 0x{segmentation.registers.cs.limit.toString(16).toUpperCase()}</div>
                        <div>Selector: {segmentation.registers.cs.selector}</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs">DS (Data Segment)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-xs">
                        <div>Base: 0x{segmentation.registers.ds.base.toString(16).toUpperCase()}</div>
                        <div>Límite: 0x{segmentation.registers.ds.limit.toString(16).toUpperCase()}</div>
                        <div>Selector: {segmentation.registers.ds.selector}</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs">SS (Stack Segment)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-xs">
                        <div>Base: 0x{segmentation.registers.ss.base.toString(16).toUpperCase()}</div>
                        <div>Límite: 0x{segmentation.registers.ss.limit.toString(16).toUpperCase()}</div>
                        <div>Selector: {segmentation.registers.ss.selector}</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs">ES (Extra Segment)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-xs">
                        <div>Base: 0x{segmentation.registers.es.base.toString(16).toUpperCase()}</div>
                        <div>Límite: 0x{segmentation.registers.es.limit.toString(16).toUpperCase()}</div>
                        <div>Selector: {segmentation.registers.es.selector}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tipos de Segmentación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Segmentación Plana</div>
              <p className="text-sm text-blue-700 mb-3">
                Modelo donde todo el espacio de direcciones se trata como un único segmento.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Simple:</strong> Fácil de entender e implementar</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Compatible:</strong> Funciona con la mayoría de sistemas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Sin protección:</strong> No aisla diferentes tipos de datos</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Segmentación Segmentada</div>
              <p className="text-sm text-green-700 mb-3">
                Divide el espacio de direcciones en múltiples segmentos lógicos.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Organización:</strong> Agrupa datos relacionados lógicamente</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Flexibilidad:</strong> Permite diferentes tamaños de segmento</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Complejidad:</strong> Mayor complejidad en gestión de direcciones</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Segmentación Protegida</div>
              <p className="text-sm text-purple-700 mb-3">
                Segmentación con controles de protección de memoria y privilegios.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Seguridad:</strong> Protege contra accesos no autorizados</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Privilegios:</strong> Controla niveles de acceso (anillo de protección)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Overhead:</strong> Mayor overhead debido a comprobaciones de protección</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Ventajas de la Segmentación:</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Organización Lógica:</strong> Permite una organización natural de programas y datos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Compartición:</strong> Facilita el compartir segmentos entre procesos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Protección:</strong> Permite proteger diferentes tipos de datos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span><strong>Crecimiento Dinámico:</strong> Algunos segmentos pueden crecer dinámicamente</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
