import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function GPUMemoryVisualization() {
  const [config, setConfig] = useState({
    gpuMemory: 8192, // MB
    cpuMemory: 16384, // MB
    transferRate: 16000, // MB/s (PCIe 3.0 x16)
    kernelSize: 1024, // KB
    blockSize: 256, // threads per block
    simulationSpeed: 300 // ms
  })
  
  const [memory, setMemory] = useState({
    gpu: {
      total: 8192,
      used: 0,
      allocated: [] as {id: number, size: number, type: string}[]
    },
    cpu: {
      total: 16384,
      used: 0,
      allocated: [] as {id: number, size: number, type: string}[]
    },
    transfers: [] as {id: number, size: number, direction: string, time: number}[]
  })
  
  const [performance, setPerformance] = useState({
    kernelExecutionTime: 0,
    memoryTransferTime: 0,
    utilization: 0,
    bandwidth: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate GPU memory operations
  const simulateGPUMemory = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Reset memory state
    setMemory({
      gpu: {
        total: config.gpuMemory,
        used: 0,
        allocated: []
      },
      cpu: {
        total: config.cpuMemory,
        used: 0,
        allocated: []
      },
      transfers: []
    })
    
    // Reset performance stats
    setPerformance({
      kernelExecutionTime: 0,
      memoryTransferTime: 0,
      utilization: 0,
      bandwidth: 0
    })
    
    // Run simulation
    for (let step = 0; step < 50; step++) {
      setProgress((step + 1) * 2)
      
      // Create a copy of current memory state
      const currentMemory = JSON.parse(JSON.stringify(memory))
      const currentPerformance = { ...performance }
      
      // Simulate memory operations
      if (step % 5 === 0) {
        // Every 5 steps, perform a memory operation
        const operation = Math.floor(Math.random() * 4)
        
        switch (operation) {
          case 0: { // CPU allocation
            const cpuAllocSize = Math.floor(Math.random() * 1024) + 256 // 256KB-1.25MB
            if (currentMemory.cpu.used + cpuAllocSize <= currentMemory.cpu.total) {
              currentMemory.cpu.allocated.push({
                id: step,
                size: cpuAllocSize,
                type: "data"
              })
              currentMemory.cpu.used += cpuAllocSize
            }
            break
          }
          case 1: { // GPU allocation
            const gpuAllocSize = Math.floor(Math.random() * 512) + 128 // 128KB-640KB
            if (currentMemory.gpu.used + gpuAllocSize <= currentMemory.gpu.total) {
              currentMemory.gpu.allocated.push({
                id: step,
                size: gpuAllocSize,
                type: "kernel"
              })
              currentMemory.gpu.used += gpuAllocSize
            }
            break
          }
          case 2: { // CPU to GPU transfer
            if (currentMemory.cpu.allocated.length > 0) {
              const transferSize = Math.min(
                config.transferRate / 10, // Limit transfer size for visualization
                currentMemory.cpu.used
              )
              
              if (transferSize > 0) {
                currentMemory.transfers.push({
                  id: step,
                  size: transferSize,
                  direction: "cpu->gpu",
                  time: (transferSize / config.transferRate) * 1000 // ms
                })
                
                currentPerformance.memoryTransferTime += (transferSize / config.transferRate) * 1000
              }
            }
            break
          }
          case 3: { // GPU kernel execution
            const kernelTime = (config.kernelSize / 100) * (1000 / config.blockSize) // Simulated time
            currentPerformance.kernelExecutionTime += kernelTime
            
            // Simulate GPU memory usage during kernel
            if (currentMemory.gpu.used + config.kernelSize <= currentMemory.gpu.total) {
              currentMemory.gpu.allocated.push({
                id: step + 1000,
                size: config.kernelSize,
                type: "kernel_temp"
              })
              currentMemory.gpu.used += config.kernelSize
            }
            break
          }
        }
      }
      
      // Calculate performance metrics
      const totalMemory = currentMemory.gpu.total + currentMemory.cpu.total
      const usedMemory = currentMemory.gpu.used + currentMemory.cpu.used
      currentPerformance.utilization = (usedMemory / totalMemory) * 100
      
      // Calculate bandwidth utilization
      if (currentPerformance.memoryTransferTime > 0) {
        currentPerformance.bandwidth = (
          currentMemory.transfers.reduce((sum: number, t: any) => sum + t.size, 0) / 
          (currentPerformance.memoryTransferTime / 1000)
        ) / 1024 // GB/s
      }
      
      // Update state
      setMemory(currentMemory)
      setPerformance(currentPerformance)
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 50))
    }
    
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setMemory({
      gpu: {
        total: config.gpuMemory,
        used: 0,
        allocated: []
      },
      cpu: {
        total: config.cpuMemory,
        used: 0,
        allocated: []
      },
      transfers: []
    })
    setPerformance({
      kernelExecutionTime: 0,
      memoryTransferTime: 0,
      utilization: 0,
      bandwidth: 0
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Memoria GPU</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo se gestiona la memoria en arquitecturas GPU y su relación con la CPU
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gpuMemory">Memoria GPU (MB)</Label>
              <Input
                id="gpuMemory"
                type="number"
                value={config.gpuMemory}
                onChange={(e) => setConfig({...config, gpuMemory: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="cpuMemory">Memoria CPU (MB)</Label>
              <Input
                id="cpuMemory"
                type="number"
                value={config.cpuMemory}
                onChange={(e) => setConfig({...config, cpuMemory: Number(e.target.value)})}
                min="2048"
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="transferRate">Tasa de Transferencia (MB/s)</Label>
              <select
                id="transferRate"
                value={config.transferRate}
                onChange={(e) => setConfig({...config, transferRate: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={2000}>PCIe 2.0 x16 (2 GB/s)</option>
                <option value={16000}>PCIe 3.0 x16 (16 GB/s)</option>
                <option value={32000}>PCIe 4.0 x16 (32 GB/s)</option>
                <option value={64000}>PCIe 5.0 x16 (64 GB/s)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="kernelSize">Tamaño de Kernel (KB)</Label>
              <Input
                id="kernelSize"
                type="number"
                value={config.kernelSize}
                onChange={(e) => setConfig({...config, kernelSize: Number(e.target.value)})}
                min="256"
                step="256"
              />
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (hilos)</Label>
              <select
                id="blockSize"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={32}>32 (Warps)</option>
                <option value={64}>64</option>
                <option value={128}>128</option>
                <option value={256}>256</option>
                <option value={512}>512</option>
                <option value={1024}>1024 (Máximo)</option>
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
                onClick={simulateGPUMemory} 
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
            <CardTitle>Estado de Memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Kernel</div>
                  <div className="text-2xl font-bold text-green-600">
                    {performance.kernelExecutionTime.toFixed(1)} ms
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Transferencia</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {performance.memoryTransferTime.toFixed(1)} ms
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Utilización</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {performance.utilization.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda</div>
                  <div className="text-2xl font-bold text-red-600">
                    {performance.bandwidth.toFixed(2)} GB/s
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <span className="mr-2">💻</span>
                      Memoria CPU
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{((memory.cpu.used / memory.cpu.total) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(memory.cpu.used / memory.cpu.total) * 100} 
                          className="w-full" 
                          color={(memory.cpu.used / memory.cpu.total) > 0.8 ? "red" : "blue"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Total</div>
                          <div className="font-semibold">{memory.cpu.total.toLocaleString()} MB</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Usada</div>
                          <div className="font-semibold">{memory.cpu.used.toLocaleString()} MB</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Asignaciones</div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                          {memory.cpu.allocated.slice(-20).map((alloc) => (
                            <div
                              key={alloc.id}
                              className="w-6 h-6 rounded flex items-center justify-center text-xs bg-blue-500 text-white"
                              title={`ID: ${alloc.id}, Tamaño: ${alloc.size} KB, Tipo: ${alloc.type}`}
                            >
                              {Math.min(9, Math.floor(alloc.size / 100))}
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
                      <span className="mr-2">🎮</span>
                      Memoria GPU
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{((memory.gpu.used / memory.gpu.total) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(memory.gpu.used / memory.gpu.total) * 100} 
                          className="w-full" 
                          color={(memory.gpu.used / memory.gpu.total) > 0.8 ? "red" : "green"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Total</div>
                          <div className="font-semibold">{memory.gpu.total.toLocaleString()} MB</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500">Usada</div>
                          <div className="font-semibold">{memory.gpu.used.toLocaleString()} MB</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Asignaciones</div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                          {memory.gpu.allocated.slice(-20).map((alloc) => (
                            <div
                              key={alloc.id}
                              className="w-6 h-6 rounded flex items-center justify-center text-xs bg-green-500 text-white"
                              title={`ID: ${alloc.id}, Tamaño: ${alloc.size} KB, Tipo: ${alloc.type}`}
                            >
                              {Math.min(9, Math.floor(alloc.size / 100))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Transferencias de Memoria</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {memory.transfers.slice(-6).map((transfer) => (
                    <div 
                      key={transfer.id} 
                      className={`
                        p-2 rounded text-center text-xs
                        ${transfer.direction === "cpu->gpu" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"}
                      `}
                    >
                      <div className="font-semibold">
                        {transfer.direction === "cpu->gpu" ? "CPU→GPU" : "GPU→CPU"}
                      </div>
                      <div>{transfer.size.toFixed(0)} KB</div>
                      <div>{transfer.time.toFixed(1)} ms</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Arquitectura de Memoria GPU</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Jerarquía de Memoria</div>
              <p className="text-sm text-blue-700 mb-3">
                Las GPUs tienen una jerarquía de memoria compleja optimizada para 
                acceso paralelo masivo, desde registros hasta memoria global.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">1.</span>
                  <span><strong>Registros:</strong> Por hilo, más rápidos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">2.</span>
                  <span><strong>Memoria Compartida:</strong> Por bloque, muy rápida</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">3.</span>
                  <span><strong>Memoria Global:</strong> Toda la GPU, más lenta</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Patrones de Acceso</div>
              <p className="text-sm text-green-700 mb-3">
                El rendimiento de la memoria GPU depende enormemente de los 
                patrones de acceso y la coalescencia de accesos.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Coalescencia:</strong> Hilos acceden a direcciones contiguas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Banda Ancha:</strong> Aprovecha todo el ancho de banda</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Banca Conflito:</strong> Accesos que compiten por recursos</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Optimización de Memoria</div>
              <p className="text-sm text-purple-700 mb-3">
                Técnicas clave para maximizar el rendimiento de memoria en GPUs.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Prefetching:</strong> Traer datos antes de necesitarlos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Tiling:</strong> Dividir datos en bloques óptimos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Overlap:</strong> Solapar computación y transferencia</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Diferencias Clave CPU vs GPU:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">CPU (General Purpose)</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Pocos núcleos complejos (4-32)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Mucha caché (MBs)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Optimizada para latencia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Control de flujo complejo</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">GPU (Massively Parallel)</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Muchos núcleos simples (1000s)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Poca caché (KBs)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Optimizada para throughput</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Acceso paralelo masivo</span>
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
