import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function CopyOnWriteVisualization() {
  const [config, setConfig] = useState({
    initialProcesses: 2,
    maxProcesses: 8,
    memoryPages: 16,
    writeProbability: 0.3,
    forkProbability: 0.1,
    simulationSpeed: 500 // ms
  })
  
  const [processes, setProcesses] = useState<any[]>([])
  const [memory, setMemory] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPages: 0,
    sharedPages: 0,
    copiedPages: 0,
    pageFaults: 0,
    memoryUsage: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Initialize simulation
  useEffect(() => {
    if (!isRunning) return
    
    // Initialize processes
    const initialProcesses = []
    for (let i = 0; i < config.initialProcesses; i++) {
      initialProcesses.push({
        id: i,
        name: `Process ${i}`,
        pages: Array.from({ length: config.memoryPages }, (_, j) => ({
          id: j,
          shared: true,
          dirty: false,
          lastAccessed: 0
        })),
        parent: null
      })
    }
    
    setProcesses(initialProcesses)
    
    // Initialize memory - all pages initially shared
    const initialMemory = Array.from({ length: config.memoryPages }, (_, i) => ({
      id: i,
      owners: Array.from({ length: config.initialProcesses }, (_, j) => j),
      shared: true,
      copies: 0
    }))
    
    setMemory(initialMemory)
    
    // Initialize stats
    setStats({
      totalPages: config.initialProcesses * config.memoryPages,
      sharedPages: config.memoryPages,
      copiedPages: 0,
      pageFaults: 0,
      memoryUsage: config.memoryPages
    })
  }, [isRunning, config.initialProcesses, config.memoryPages])

  // Simulate COW process
  const simulateCOW = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Run simulation for 100 steps
    for (let step = 0; step < 100; step++) {
      setProgress(step + 1)
      
      // Create a copy of current state
      const currentProcesses = [...processes]
      let currentMemory = [...memory]
      const currentStats = { ...stats }
      
      // Randomly decide actions for each process
      for (let i = 0; i < currentProcesses.length; i++) {
        const process = currentProcesses[i]
        
        // Randomly decide to fork a new process
        if (Math.random() < config.forkProbability && currentProcesses.length < config.maxProcesses) {
          const newProcessId = currentProcesses.length
            const newProcess = {
              id: newProcessId,
              name: `Process ${newProcessId}`,
            pages: process.pages.map((page: any) => ({ ...page, shared: true, dirty: false })),
              parent: process.id
            }
          
          currentProcesses.push(newProcess)
          
          // Update memory to reflect new shared pages
          currentMemory = currentMemory.map((page: any) => ({
            ...page,
            owners: [...page.owners, newProcessId]
          }))
        }
        
        // Randomly decide to write to a page
        if (Math.random() < config.writeProbability) {
          // Select a random page to write to
          const pageIndex = Math.floor(Math.random() * config.memoryPages)
          const page = process.pages[pageIndex]
          
          // If page is shared, we need to copy it (COW)
          if (page.shared) {
            // Find the memory page
            const memoryPage = currentMemory.find(p => p.id === pageIndex)
            
            // Create a copy of the page
            const newPage = {
              ...page,
              shared: false,
              dirty: true,
              lastAccessed: step
            }
            
            // Update process page
            currentProcesses[i].pages[pageIndex] = newPage
            
            // Update memory tracking
            if (memoryPage) {
              // Remove this process from owners
              const newOwners = memoryPage.owners.filter((ownerId: number) => ownerId !== process.id)
              
              // Update memory page
              currentMemory = currentMemory.map(p => 
                p.id === pageIndex 
                  ? { 
                      ...p, 
                      owners: newOwners,
                      shared: newOwners.length > 0,
                      copies: p.copies + (newOwners.length === 0 ? 1 : 0)
                    } 
                  : p
              )
              
              // Update stats
              currentStats.copiedPages += 1
              currentStats.sharedPages -= 1
              currentStats.pageFaults += 1
            }
          } else {
            // Page is already private, just mark as dirty
            currentProcesses[i].pages[pageIndex] = {
              ...page,
              dirty: true,
              lastAccessed: step
            }
          }
        }
      }
      
      // Update state
      setProcesses(currentProcesses)
      setMemory(currentMemory)
      
      // Update stats
      const totalPages = currentProcesses.reduce((sum, proc) => sum + proc.pages.length, 0)
      const sharedPages = currentMemory.filter(page => page.shared).length
      const memoryUsage = currentMemory.length
      
      setStats({
        totalPages,
        sharedPages,
        copiedPages: currentStats.copiedPages,
        pageFaults: currentStats.pageFaults,
        memoryUsage
      })
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          processes: currentProcesses.length,
          totalPages,
          sharedPages,
          copiedPages: currentStats.copiedPages,
          pageFaults: currentStats.pageFaults,
          memoryUsage
        }])
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 10))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setProcesses([])
    setMemory([])
    setStats({
      totalPages: 0,
      sharedPages: 0,
      copiedPages: 0,
      pageFaults: 0,
      memoryUsage: 0
    })
  }

  // Calculate memory efficiency
  const memoryEfficiency = stats.totalPages > 0 
    ? ((stats.sharedPages + stats.copiedPages) / stats.totalPages) * 100 
    : 0

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Copy-on-Write (COW)</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo COW optimiza el uso de memoria al compartir páginas entre procesos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="initialProcesses">Procesos Iniciales</Label>
              <Input
                id="initialProcesses"
                type="number"
                value={config.initialProcesses}
                onChange={(e) => setConfig({...config, initialProcesses: Number(e.target.value)})}
                min="1"
                max="8"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="maxProcesses">Máximo de Procesos</Label>
              <Input
                id="maxProcesses"
                type="number"
                value={config.maxProcesses}
                onChange={(e) => setConfig({...config, maxProcesses: Number(e.target.value)})}
                min="2"
                max="16"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="memoryPages">Páginas de Memoria</Label>
              <Input
                id="memoryPages"
                type="number"
                value={config.memoryPages}
                onChange={(e) => setConfig({...config, memoryPages: Number(e.target.value)})}
                min="4"
                max="64"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="writeProbability">Probabilidad de Escritura</Label>
              <Input
                id="writeProbability"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.writeProbability}
                onChange={(e) => setConfig({...config, writeProbability: Number(e.target.value)})}
              />
              <div className="text-center">{(config.writeProbability * 100).toFixed(0)}%</div>
            </div>

            <div>
              <Label htmlFor="forkProbability">Probabilidad de Fork</Label>
              <Input
                id="forkProbability"
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={config.forkProbability}
                onChange={(e) => setConfig({...config, forkProbability: Number(e.target.value)})}
              />
              <div className="text-center">{(config.forkProbability * 100).toFixed(0)}%</div>
            </div>

            <div>
              <Label htmlFor="simulationSpeed">Velocidad de Simulación (ms)</Label>
              <Input
                id="simulationSpeed"
                type="range"
                min="100"
                max="2000"
                value={config.simulationSpeed}
                onChange={(e) => setConfig({...config, simulationSpeed: Number(e.target.value)})}
              />
              <div className="text-center">{config.simulationSpeed} ms</div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateCOW} 
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
            <CardTitle>Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Procesos</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {processes.length}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Páginas Totales</div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalPages}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Páginas Compartidas</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.sharedPages}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Páginas Copiadas</div>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.copiedPages}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Procesos y Páginas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-60 overflow-y-auto">
                      {processes.map(process => (
                        <div key={process.id} className="mb-4 p-3 border rounded">
                          <div className="font-semibold text-sm mb-2">
                            {process.name} {process.parent !== null && `(fork de Process ${process.parent})`}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {process.pages.map((page: any, pageIndex: number) => (
                              <div
                                key={pageIndex}
                                className={`
                                  w-6 h-6 rounded text-xs flex items-center justify-center
                                  ${page.shared 
                                    ? "bg-green-500 text-white" 
                                    : page.dirty 
                                      ? "bg-red-500 text-white" 
                                      : "bg-blue-500 text-white"}
                                `}
                                title={`
                                  Página ${pageIndex}
                                  Compartida: ${page.shared ? "Sí" : "No"}
                                  Modificada: ${page.dirty ? "Sí" : "No"}
                                `}
                              >
                                {pageIndex}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estado de Memoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-4 gap-2">
                        {memory.map(page => (
                          <div
                            key={page.id}
                            className={`
                              p-2 rounded text-center text-xs
                              ${page.shared 
                                ? "bg-green-100 border border-green-300" 
                                : "bg-gray-100 border border-gray-300"}
                            `}
                          >
                            <div className="font-semibold">P{page.id}</div>
                            <div className="mt-1">
                              {page.owners.length > 0 ? (
                                <div className="text-xs">
                                  Compartida por: {page.owners.length}
                                </div>
                              ) : (
                                <div className="text-xs text-red-600">
                                  Copiada
                                </div>
                              )}
                            </div>
                            <div className="mt-1 text-xs">
                              Copias: {page.copies}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Eficiencia de Memoria</div>
                <div className="flex justify-between text-sm mb-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <Progress 
                  value={memoryEfficiency} 
                  className="w-full" 
                  color={memoryEfficiency > 70 ? "green" : memoryEfficiency > 40 ? "yellow" : "red"}
                />
                <div className="text-right text-sm mt-1">
                  {memoryEfficiency.toFixed(1)}% de eficiencia
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Copy-on-Write</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es COW?</div>
              <p className="text-sm text-blue-700">
                Copy-on-Write es una técnica de optimización de memoria donde múltiples procesos 
                comparten las mismas páginas de memoria hasta que uno de ellos intenta modificar 
                una página, momento en el cual se crea una copia privada.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Beneficios</div>
              <p className="text-sm text-green-700">
                Reduce el uso de memoria al compartir páginas entre procesos, 
                mejora el rendimiento de operaciones fork, 
                y minimiza la sobrecarga de copia de memoria.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Cuándo se usa</div>
              <p className="text-sm text-purple-700">
                Común en sistemas Unix/Linux para operaciones fork, 
                en sistemas de archivos con snapshots, 
                y en tecnologías de virtualización como VM.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Cómo funciona COW:</div>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>
                <strong>Fork:</strong> Cuando un proceso se bifurca, el padre y el hijo comparten 
                las mismas páginas de memoria marcadas como solo lectura.
              </li>
              <li>
                <strong>Escritura:</strong> Cuando cualquiera de los procesos intenta escribir 
                en una página compartida, se genera una falla de página.
              </li>
              <li>
                <strong>Copia:</strong> El sistema operativo crea una copia privada de la página 
                para el proceso que está escribiendo.
              </li>
              <li>
                <strong>Continuación:</strong> Cada proceso ahora tiene su propia copia de la página 
                y puede modificarla independientemente.
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
