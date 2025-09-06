import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function MemoryBandwidthVisualization() {
  const [config, setConfig] = useState({
    memoryChannels: 2,
    channelWidth: 64, // bits
    memoryFrequency: 3200, // MHz
    burstLength: 8,
    casLatency: 16,
    banksPerChannel: 8,
    rowsPerBank: 32768,
    colsPerRow: 1024,
    accessPattern: "sequential" as "sequential" | "random" | "stride",
    strideSize: 64, // bytes
    simulationSpeed: 200 // ms
  })
  
  const [bandwidth, setBandwidth] = useState({
    theoreticalPeak: 0, // GB/s
    achievedBandwidth: 0, // GB/s
    utilization: 0, // percentage
    latency: 0, // ns
    efficiency: 0, // percentage
    banks: [] as {
      id: number,
      active: boolean,
      rowBufferHits: number,
      rowBufferMisses: number,
      utilization: number
    }[]
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [_history, setHistory] = useState<any[]>([])

  // Calculate theoretical peak bandwidth
  useState(() => {
    // Theoretical peak bandwidth = (channels × frequency × width) / 8 (convert to bytes)
    const peakBandwidth = (config.memoryChannels * config.memoryFrequency * config.channelWidth) / 8 / 1000 // Convert to GB/s
    
    // Initialize banks
    const banks = []
    for (let i = 0; i < config.memoryChannels * config.banksPerChannel; i++) {
      banks.push({
        id: i,
        active: false,
        rowBufferHits: 0,
        rowBufferMisses: 0,
        utilization: 0
      })
    }
    
    setBandwidth({
      theoreticalPeak: peakBandwidth,
      achievedBandwidth: 0,
      utilization: 0,
      latency: 0,
      efficiency: 0,
      banks
    })
  })

  // Simulate memory bandwidth
  const simulateMemoryBandwidth = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset bandwidth stats
    setBandwidth(prev => ({
      ...prev,
      achievedBandwidth: 0,
      utilization: 0,
      latency: 0,
      efficiency: 0,
      banks: prev.banks.map(bank => ({
        ...bank,
        rowBufferHits: 0,
        rowBufferMisses: 0,
        utilization: 0
      }))
    }))
    
    // Calculate theoretical peak bandwidth
    const theoreticalPeak = (config.memoryChannels * config.memoryFrequency * config.channelWidth) / 8 / 1000 // GB/s
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current bandwidth state
      let currentBandwidth = JSON.parse(JSON.stringify(bandwidth))
      let currentBanks = [...currentBandwidth.banks]
      
      // Simulate memory accesses based on pattern
      let totalBytesTransferred = 0
      let totalLatency = 0
      const bankUtilizations = Array(config.memoryChannels * config.banksPerChannel).fill(0)
      
      // Generate accesses
      const accessesPerStep = 1000
      for (let i = 0; i < accessesPerStep; i++) {
        // Determine access address based on pattern
        let address: number
        if (config.accessPattern === "sequential") {
          address = step * accessesPerStep + i
        } else if (config.accessPattern === "random") {
          address = Math.floor(Math.random() * 1000000)
        } else {
          // Stride pattern
          address = (step * accessesPerStep + i) * config.strideSize
        }
        
        // Calculate which bank this address maps to
        const bankId = address % (config.memoryChannels * config.banksPerChannel)
        const bank = currentBanks[bankId]
        
        if (bank) {
          // Simulate row buffer hit/miss
          const isRowBufferHit = Math.random() > 0.3 // 70% row buffer hit rate
          
          if (isRowBufferHit) {
            bank.rowBufferHits++
            // Row buffer hit - faster access
            totalLatency += config.casLatency * 0.5 // Reduced latency
            totalBytesTransferred += 64 // Cache line size
          } else {
            bank.rowBufferMisses++
            // Row buffer miss - full activation
            totalLatency += config.casLatency + 10 // Additional activation time
            totalBytesTransferred += 64 // Cache line size
          }
          
          // Update bank utilization
          bankUtilizations[bankId] += 1
        }
      }
      
      // Calculate achieved bandwidth for this step
      const timeForStep = (totalLatency / config.memoryFrequency) * 1000 // Convert to nanoseconds
      const bandwidthForStep = (totalBytesTransferred / (timeForStep / 1000000000)) / (1024 * 1024 * 1024) // GB/s
      
      // Update bank stats
      currentBanks = currentBanks.map((bank, index) => {
        const totalAccesses = bank.rowBufferHits + bank.rowBufferMisses
        return {
          ...bank,
          utilization: totalAccesses > 0 ? (bankUtilizations[index] / totalAccesses) * 100 : 0
        }
      })
      
      // Update overall bandwidth stats
      const utilization = (bandwidthForStep / theoreticalPeak) * 100
      const efficiency = utilization * (currentBanks.reduce((sum, bank) => 
        sum + (bank.rowBufferHits / (bank.rowBufferHits + bank.rowBufferMisses || 1)), 0) / currentBanks.length)
      
      currentBandwidth = {
        theoreticalPeak,
        achievedBandwidth: bandwidthForStep,
        utilization: Math.min(100, utilization),
        latency: timeForStep / accessesPerStep,
        efficiency: Math.min(100, efficiency),
        banks: currentBanks
      }
      
      // Update state
      setBandwidth(currentBandwidth)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          achievedBandwidth: bandwidthForStep,
          utilization: Math.min(100, utilization),
          latency: timeForStep / accessesPerStep,
          efficiency: Math.min(100, efficiency),
          banks: [...currentBanks]
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
    
    // Reset bandwidth state
    const theoreticalPeak = (config.memoryChannels * config.memoryFrequency * config.channelWidth) / 8 / 1000 // GB/s
    
    const banks = []
    for (let i = 0; i < config.memoryChannels * config.banksPerChannel; i++) {
      banks.push({
        id: i,
        active: false,
        rowBufferHits: 0,
        rowBufferMisses: 0,
        utilization: 0
      })
    }
    
    setBandwidth({
      theoreticalPeak,
      achievedBandwidth: 0,
      utilization: 0,
      latency: 0,
      efficiency: 0,
      banks
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Ancho de Banda de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo diferentes factores afectan el rendimiento de la memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memoryChannels">Canales de Memoria</Label>
              <Input
                id="memoryChannels"
                type="number"
                value={config.memoryChannels}
                onChange={(e) => setConfig({...config, memoryChannels: Number(e.target.value)})}
                min="1"
                max="4"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="channelWidth">Ancho de Canal (bits)</Label>
              <select
                id="channelWidth"
                value={config.channelWidth}
                onChange={(e) => setConfig({...config, channelWidth: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={32}>32 bits</option>
                <option value={64}>64 bits</option>
                <option value={128}>128 bits</option>
              </select>
            </div>

            <div>
              <Label htmlFor="memoryFrequency">Frecuencia (MHz)</Label>
              <Input
                id="memoryFrequency"
                type="number"
                value={config.memoryFrequency}
                onChange={(e) => setConfig({...config, memoryFrequency: Number(e.target.value)})}
                min="800"
                max="8000"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="casLatency">Latencia CAS (ciclos)</Label>
              <Input
                id="casLatency"
                type="number"
                value={config.casLatency}
                onChange={(e) => setConfig({...config, casLatency: Number(e.target.value)})}
                min="8"
                max="32"
                step="1"
              />
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
                  variant={config.accessPattern === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "stride"})}
                >
                  Stride
                </Button>
              </div>
            </div>

            {config.accessPattern === "stride" && (
              <div>
                <Label htmlFor="strideSize">Tamaño de Stride (bytes)</Label>
                <Input
                  id="strideSize"
                  type="number"
                  value={config.strideSize}
                  onChange={(e) => setConfig({...config, strideSize: Number(e.target.value)})}
                  min="8"
                  max="128"
                  step="8"
                />
              </div>
            )}

            <div>
              <Label htmlFor="banksPerChannel">Bancos por Canal</Label>
              <Input
                id="banksPerChannel"
                type="number"
                value={config.banksPerChannel}
                onChange={(e) => setConfig({...config, banksPerChannel: Number(e.target.value)})}
                min="4"
                max="16"
                step="1"
              />
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
                onClick={simulateMemoryBandwidth} 
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
            <CardTitle>Rendimiento de Memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Pico Teórico</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {bandwidth.theoreticalPeak.toFixed(2)} GB/s
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ancho de Banda Logrado</div>
                  <div className="text-2xl font-bold text-green-600">
                    {bandwidth.achievedBandwidth.toFixed(2)} GB/s
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Utilización</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {bandwidth.utilization.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Eficiencia</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {bandwidth.efficiency.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Bancos de Memoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {bandwidth.banks.slice(0, 8).map(bank => (
                        <div key={bank.id} className="p-2 border rounded">
                          <div className="text-xs text-gray-500 mb-1">Banco {bank.id}</div>
                          <div className="text-center">
                            <div className="font-semibold text-sm">Util: {bank.utilization.toFixed(0)}%</div>
                            <div className="text-xs">
                              Hits: {bank.rowBufferHits}
                            </div>
                            <div className="text-xs">
                              Misses: {bank.rowBufferMisses}
                            </div>
                          </div>
                          <div className="mt-1">
                            <Progress 
                              value={
                                bank.rowBufferHits + bank.rowBufferMisses > 0 
                                  ? (bank.rowBufferHits / (bank.rowBufferHits + bank.rowBufferMisses)) * 100 
                                  : 0
                              } 
                              className="w-full" 
                              color="green"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Métricas de Rendimiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Latencia Promedio</span>
                          <span>{bandwidth.latency.toFixed(1)} ns</span>
                        </div>
                        <Progress 
                          value={Math.min(100, bandwidth.latency / 100 * 100)} 
                          className="w-full" 
                          color={bandwidth.latency > 50 ? "red" : bandwidth.latency > 25 ? "yellow" : "green"}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Eficiencia de Row Buffer</span>
                          <span>
                            {bandwidth.banks.reduce((sum, bank) => 
                              sum + (bank.rowBufferHits / (bank.rowBufferHits + bank.rowBufferMisses || 1)), 0) / 
                              bandwidth.banks.length * 100
                            }%
                          </span>
                        </div>
                        <Progress 
                          value={
                            bandwidth.banks.reduce((sum, bank) => 
                              sum + (bank.rowBufferHits / (bank.rowBufferHits + bank.rowBufferMisses || 1)), 0) / 
                              bandwidth.banks.length * 100
                          } 
                          className="w-full" 
                          color="blue"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Ancho de Banda Relativo</span>
                          <span>
                            {bandwidth.theoreticalPeak > 0 
                              ? ((bandwidth.achievedBandwidth / bandwidth.theoreticalPeak) * 100).toFixed(1) 
                              : "0.0"}%
                          </span>
                        </div>
                        <Progress 
                          value={
                            bandwidth.theoreticalPeak > 0 
                              ? (bandwidth.achievedBandwidth / bandwidth.theoreticalPeak) * 100 
                              : 0
                          } 
                          className="w-full" 
                          color={
                            (bandwidth.achievedBandwidth / bandwidth.theoreticalPeak) > 0.8 
                              ? "green" 
                              : (bandwidth.achievedBandwidth / bandwidth.theoreticalPeak) > 0.6 
                                ? "yellow" 
                                : "red"
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Visualización de Canales</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: Math.min(config.memoryChannels, 2) }).map((_, channelIndex) => (
                    <Card key={channelIndex}>
                      <CardHeader>
                        <CardTitle className="text-sm">Canal {channelIndex}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: config.banksPerChannel }).map((_, bankIndex) => {
                            const bankId = channelIndex * config.banksPerChannel + bankIndex
                            const bank = bandwidth.banks[bankId]
                            
                            if (!bank) return null
                            
                            return (
                              <div
                                key={bankIndex}
                                className={`
                                  w-8 h-8 rounded flex items-center justify-center text-xs
                                  ${bank.utilization > 80 
                                    ? "bg-red-500 text-white" 
                                    : bank.utilization > 50 
                                      ? "bg-yellow-500 text-white" 
                                      : "bg-green-500 text-white"}
                                `}
                                title={`
                                  Banco ${bankId}
                                  Utilización: ${bank.utilization.toFixed(1)}%
                                  Hits: ${bank.rowBufferHits}
                                  Misses: ${bank.rowBufferMisses}
                                  Ratio: ${(bank.rowBufferHits / (bank.rowBufferHits + bank.rowBufferMisses || 1) * 100).toFixed(1)}%
                                `}
                              >
                                {bank.utilization > 0 ? Math.floor(bank.utilization / 10) : ""}
                              </div>
                            )
                          })}
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
          <CardTitle>Factores que Afectan el Ancho de Banda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Factores de Hardware</div>
              <p className="text-sm text-blue-700 mb-3">
                Características físicas de la memoria que determinan el ancho de banda máximo teórico.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>Canales:</strong> Más canales = mayor ancho de banda</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>Ancho de Canal:</strong> Bits transferidos por ciclo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>Frecuencia:</strong> Ciclos por segundo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>Latencia CAS:</strong> Ciclos para la primera transferencia</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Optimizaciones de Software</div>
              <p className="text-sm text-green-700 mb-3">
                Técnicas de programación que maximizan el uso del ancho de banda disponible.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>Prefetching:</strong> Carga anticipada de datos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>Streaming:</strong> Acceso secuencial optimizado</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>Vectorización:</strong> Instrucciones SIMD</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>Alineación:</strong> Datos alineados a límites de caché</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Patrones de Acceso</div>
              <p className="text-sm text-purple-700 mb-3">
                Cómo se accede a los datos afecta significativamente el rendimiento real.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Secuencial:</strong> Mejor localidad espacial</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Aleatorio:</strong> Mayor latencia promedio</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Stride:</strong> Patrón predecible optimizable</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span><strong>Temporal:</strong> Reuso de datos recientes</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Fórmula del Ancho de Banda:</div>
            <div className="font-mono text-sm p-3 bg-gray-800 text-green-400 rounded">
              Ancho de Banda = (Canales × Frecuencia × Ancho de Canal) / 8
            </div>
            <div className="mt-2 text-sm">
              Donde:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>Canales:</strong> Número de canales de memoria</li>
                <li><strong>Frecuencia:</strong> Frecuencia de reloj en MHz</li>
                <li><strong>Ancho de Canal:</strong> Bits por transferencia</li>
                <li><strong>/ 8:</strong> Conversión de bits a bytes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
