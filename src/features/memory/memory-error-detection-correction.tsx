import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export default function MemoryErrorDetectionCorrection() {
  const [config, setConfig] = useState({
    errorDetectionMethod: "ecc" as "parity" | "ecc" | "crc" | "checksum",
    memorySize: 1024, // MB
    errorRate: 0.01, // 1% error rate
    blockSize: 64, // bytes
    correctionCapability: 1, // Single error correction
    simulationSpeed: 200 // ms
  })
  
  const [errors, setErrors] = useState({
    detected: 0,
    corrected: 0,
    uncorrected: 0,
    total: 0,
    detectionRate: 0,
    correctionRate: 0
  })
  
  const [memoryBlocks, setMemoryBlocks] = useState<{
    id: number,
    data: number[],
    ecc: number[],
    hasError: boolean,
    errorPosition: number | null,
    corrected: boolean
  }[]>([])
  
  const [history, setHistory] = useState<{
    time: number,
    detected: number,
    corrected: number,
    uncorrected: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize memory blocks
  useState(() => {
    const blocks = []
    const numBlocks = config.memorySize * 1024 * 1024 / config.blockSize
    
    for (let i = 0; i < Math.min(numBlocks, 64); i++) {
      // Generate random data for block
      const data = Array(config.blockSize / 8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      // Generate ECC codes
      const ecc = Array(8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      blocks.push({
        id: i,
        data,
        ecc,
        hasError: false,
        errorPosition: null,
        corrected: false
      })
    }
    
    setMemoryBlocks(blocks)
  })

  // Simulate error detection and correction
  const simulateErrorDetection = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setErrors({
      detected: 0,
      corrected: 0,
      uncorrected: 0,
      total: 0,
      detectionRate: 0,
      correctionRate: 0
    })
    
    const newHistory = []
    let detected = 0
    let corrected = 0
    let uncorrected = 0
    let total = 0
    
    // Simulate memory accesses with error detection
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Select random block
      const blockIndex = Math.floor(Math.random() * memoryBlocks.length)
      const block = memoryBlocks[blockIndex]
      
      // Generate random error based on error rate
      const hasError = Math.random() < config.errorRate
      
      if (hasError) {
        total++
        
        // Determine number of errors to inject
        const numErrors = config.correctionCapability > 1 && Math.random() > 0.7 
          ? 2 
          : 1
        
        // Inject error(s)
        const newBlocks = [...memoryBlocks]
        const updatedBlock = {...newBlocks[blockIndex]}
        
        if (numErrors === 1) {
          // Single error
          const errorPosition = Math.floor(Math.random() * updatedBlock.data.length)
          updatedBlock.data[errorPosition] ^= 1 // Flip one bit
          updatedBlock.hasError = true
          updatedBlock.errorPosition = errorPosition
          updatedBlock.corrected = false
        } else {
          // Multiple errors
          const errorPositions: number[] = []
          for (let j = 0; j < numErrors; j++) {
            const pos = Math.floor(Math.random() * updatedBlock.data.length)
            if (!errorPositions.includes(pos)) {
              updatedBlock.data[pos] ^= 1 // Flip one bit
              errorPositions.push(pos)
            }
          }
          updatedBlock.hasError = true
          updatedBlock.errorPosition = errorPositions[0]
          updatedBlock.corrected = false
        }
        
        newBlocks[blockIndex] = updatedBlock
        setMemoryBlocks(newBlocks)
        
        // Try to detect and correct error based on method
        let errorDetected = false
        let errorCorrected = false
        
        switch (config.errorDetectionMethod) {
          case "parity":
            // Simple parity check - can detect single bit errors
            if (numErrors === 1) {
              errorDetected = true
              errorCorrected = false // Parity can't correct errors
            }
            break
            
          case "ecc":
            // ECC can detect and correct single bit errors
            if (numErrors === 1) {
              errorDetected = true
              errorCorrected = true
              
              // Correct the error
              const correctedBlocks = [...newBlocks]
              const correctedBlock = {...correctedBlocks[blockIndex]}
              correctedBlock.data[correctedBlock.errorPosition!] ^= 1 // Flip bit back
              correctedBlock.hasError = false
              correctedBlock.errorPosition = null
              correctedBlock.corrected = true
              correctedBlocks[blockIndex] = correctedBlock
              setMemoryBlocks(correctedBlocks)
            } else if (numErrors === 2) {
              // ECC can detect double bit errors but can't correct them
              errorDetected = true
              errorCorrected = false
            }
            break
            
          case "crc":
            // CRC can detect burst errors
            errorDetected = true
            errorCorrected = false // CRC typically can't correct errors
            break
            
          case "checksum":
            // Checksum can detect some errors
            errorDetected = Math.random() > 0.3 // 70% detection rate
            errorCorrected = false // Checksum typically can't correct errors
            break
        }
        
        if (errorDetected) {
          detected++
          if (errorCorrected) {
            corrected++
          } else {
            uncorrected++
          }
        } else {
          uncorrected++
        }
      }
      
      // Update error stats
      const detectionRate = total > 0 ? (detected / total) * 100 : 0
      const correctionRate = detected > 0 ? (corrected / detected) * 100 : 0
      
      setErrors({
        detected,
        corrected,
        uncorrected,
        total,
        detectionRate: parseFloat(detectionRate.toFixed(2)),
        correctionRate: parseFloat(correctionRate.toFixed(2))
      })
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          detected,
          corrected,
          uncorrected
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
    setErrors({
      detected: 0,
      corrected: 0,
      uncorrected: 0,
      total: 0,
      detectionRate: 0,
      correctionRate: 0
    })
    
    // Reinitialize memory blocks
    const blocks = []
    const numBlocks = config.memorySize * 1024 * 1024 / config.blockSize
    
    for (let i = 0; i < Math.min(numBlocks, 64); i++) {
      // Generate random data for block
      const data = Array(config.blockSize / 8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      // Generate ECC codes
      const ecc = Array(8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      blocks.push({
        id: i,
        data,
        ecc,
        hasError: false,
        errorPosition: null,
        corrected: false
      })
    }
    
    setMemoryBlocks(blocks)
  }

  // Error detection method information
  const methodInfo = {
    "parity": {
      name: "Bit de Paridad",
      description: "Agrega un bit adicional para detectar errores de un solo bit",
      color: "#3b82f6",
      icon: "🔍"
    },
    "ecc": {
      name: "Código de Corrección de Errores",
      description: "Puede detectar y corregir errores de un solo bit",
      color: "#10b981",
      icon: "🔧"
    },
    "crc": {
      name: "Código de Redundancia Cíclica",
      description: "Detecta errores en bloques de datos mediante polinomios",
      color: "#8b5cf6",
      icon: "🔄"
    },
    "checksum": {
      name: "Suma de Verificación",
      description: "Verifica la integridad de datos mediante suma aritmética",
      color: "#f59e0b",
      icon: "✅"
    }
  }

  const currentMethod = methodInfo[config.errorDetectionMethod]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Detección y Corrección de Errores de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo diferentes técnicas protegen la integridad de los datos en memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="errorDetectionMethod">Método de Detección</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(methodInfo).map(([key, method]) => (
                  <Button
                    key={key}
                    variant={config.errorDetectionMethod === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, errorDetectionMethod: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{method.icon}</span>
                    <span className="text-xs">{method.name.split(" ")[1]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (MB)</Label>
              <Input
                id="memorySize"
                type="number"
                value={config.memorySize}
                onChange={(e) => setConfig({...config, memorySize: Number(e.target.value)})}
                min="512"
                step="512"
              />
            </div>

            <div>
              <Label htmlFor="errorRate">Tasa de Errores (%)</Label>
              <Input
                id="errorRate"
                type="range"
                min="0"
                max="10"
                value={config.errorRate * 100}
                onChange={(e) => setConfig({...config, errorRate: Number(e.target.value) / 100})}
              />
              <div className="text-center">{(config.errorRate * 100).toFixed(1)}%</div>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="16"
                step="16"
              />
            </div>

            <div>
              <Label htmlFor="correctionCapability">Capacidad de Corrección</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.correctionCapability === 1 ? "default" : "outline"}
                  onClick={() => setConfig({...config, correctionCapability: 1})}
                >
                  Simple
                </Button>
                <Button
                  variant={config.correctionCapability === 2 ? "default" : "outline"}
                  onClick={() => setConfig({...config, correctionCapability: 2})}
                >
                  Doble
                </Button>
                <Button
                  variant={config.correctionCapability === 0 ? "default" : "outline"}
                  onClick={() => setConfig({...config, correctionCapability: 0})}
                >
                  Ninguna
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
                onClick={simulateErrorDetection} 
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
              style={{ color: currentMethod.color }}
            >
              <span className="mr-2 text-2xl">{currentMethod.icon}</span>
              {currentMethod.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{currentMethod.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentMethod.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Errores Detectados</div>
                  <div className="text-2xl font-bold text-blue-600">{errors.detected}</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Errores Corregidos</div>
                  <div className="text-2xl font-bold text-green-600">{errors.corrected}</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Errores No Corregidos</div>
                  <div className="text-2xl font-bold text-red-600">{errors.uncorrected}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Detección</div>
                  <div className="text-2xl font-bold text-purple-600">{errors.detectionRate}%</div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Corrección</div>
                  <div className="text-2xl font-bold text-yellow-600">{errors.correctionRate}%</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Bloques de Memoria</div>
                <div className="flex flex-wrap gap-1">
                  {memoryBlocks.map(block => (
                    <div
                      key={block.id}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${block.hasError 
                          ? block.corrected 
                            ? "bg-green-500 text-white" 
                            : "bg-red-500 text-white"
                          : "bg-gray-200"}
                      `}
                      title={
                        `Bloque ${block.id}
` +
                        `${block.hasError 
                          ? block.corrected 
                            ? "Error corregido" 
                            : "Error no corregido"
                          : "Sin errores"}
` +
                        `${block.data.length} bytes`
                      }
                    >
                      {block.hasError ? (block.corrected ? "✓" : "✗") : block.id}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Errores Recientes</div>
                <div className="flex flex-wrap gap-1">
                  {memoryBlocks
                    .filter(block => block.hasError)
                    .slice(-20)
                    .map(block => (
                      <div
                        key={block.id}
                        className={`
                          w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                          ${block.corrected 
                            ? "bg-green-500 text-white" 
                            : "bg-red-500 text-white"}
                        `}
                        title={
                          `Bloque ${block.id}
` +
                          `${block.corrected ? "Corregido" : "No corregido"}
` +
                          `Posición: ${block.errorPosition}
` +
                          `Bytes: ${block.data.length}`
                        }
                      >
                        {block.corrected ? "C" : "E"}
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
          <CardTitle>Historial de Detección</CardTitle>
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
                    label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Tasa (%)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="detected" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Detectados"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="corrected" 
                    stroke="#10b981" 
                    name="Corregidos"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="uncorrected" 
                    stroke="#ef4444" 
                    name="No Corregidos"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="detectionRate" 
                    stroke="#8b5cf6" 
                    name="Tasa de Detección"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="correctionRate" 
                    stroke="#f59e0b" 
                    name="Tasa de Corrección"
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
          <CardTitle>Comparativa de Métodos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(methodInfo).map(([key, method]) => (
              <Card 
                key={key}
                className={config.errorDetectionMethod === key ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center text-sm"
                    style={{ color: method.color }}
                  >
                    <span className="mr-2 text-lg">{method.icon}</span>
                    {method.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      {method.description}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Ventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "parity" && "Simple de implementar"}
                            {key === "ecc" && "Corrige errores automáticamente"}
                            {key === "crc" && "Detecta errores de ráfaga"}
                            {key === "checksum" && "Verificación rápida"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "parity" && "Bajo overhead"}
                            {key === "ecc" && "Alta fiabilidad"}
                            {key === "crc" && "Robusto contra errores"}
                            {key === "checksum" && "Fácil de calcular"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Desventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "parity" && "No corrige errores"}
                            {key === "ecc" && "Complejidad de implementación"}
                            {key === "crc" && "Overhead computacional"}
                            {key === "checksum" && "Detección limitada"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "parity" && "Solo detecta errores impares"}
                            {key === "ecc" && "Requiere más bits"}
                            {key === "crc" && "No corrige errores"}
                            {key === "checksum" && "No corrige errores"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Implementación:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use ECC para aplicaciones críticas donde la integridad es fundamental</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use paridad para aplicaciones con restricciones de recursos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use CRC para verificar integridad de bloques de datos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use checksum para verificaciones rápidas de integridad</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
