import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"

export default function MemoryErrorCorrectionVisualization() {
  const [config, setConfig] = useState({
    eccType: "hamming" as "hamming" | "reedSolomon" | "bch",
    memorySize: 1024, // MB
    errorRate: 0.01, // 1% error rate
    blockSize: 64, // bytes
    correctionCapability: 1, // Single error correction
    simulationSpeed: 200 // ms
  })
  
  const [errorCorrection, setErrorCorrection] = useState({
    dataBits: 0,
    eccBits: 0,
    totalBits: 0,
    errorsDetected: 0,
    errorsCorrected: 0,
    uncorrectableErrors: 0,
    reliability: 0
  })
  
  const [blocks, setBlocks] = useState<{
    id: number,
    data: number[],
    ecc: number[],
    hasError: boolean,
    errorPosition: number | null,
    corrected: boolean,
    uncorrectable: boolean
  }[]>([])
  
  const [history, setHistory] = useState<{
    time: number,
    errorsDetected: number,
    errorsCorrected: number,
    uncorrectableErrors: number,
    reliability: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [guided, setGuided] = useState(false)

  // Initialize memory blocks
  useState(() => {
    const numBlocks = config.memorySize * 1024 * 1024 / config.blockSize
    const newBlocks = []
    
    for (let i = 0; i < Math.min(numBlocks, 64); i++) {
      // Generate random data for block
      const data = Array(config.blockSize / 8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      // Generate ECC codes
      const ecc = Array(8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      newBlocks.push({
        id: i,
        data,
        ecc,
        hasError: false,
        errorPosition: null,
        corrected: false,
        uncorrectable: false
      })
    }
    
    setBlocks(newBlocks)
  })

  // Simulate error correction
  const simulateErrorCorrection = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setErrorCorrection({
      dataBits: 0,
      eccBits: 0,
      totalBits: 0,
      errorsDetected: 0,
      errorsCorrected: 0,
      uncorrectableErrors: 0,
      reliability: 0
    })
    
    const newHistory = []
    let errorsDetected = 0
    let errorsCorrected = 0
    let uncorrectableErrors = 0
    let totalBits = 0
    let dataBits = 0
    let eccBits = 0
    
    // Simulate memory accesses with error correction
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Select random block
      const blockIndex = Math.floor(Math.random() * blocks.length)
      const block = blocks[blockIndex]
      
      // Generate random error based on error rate
      const hasError = Math.random() < config.errorRate
      
      if (hasError) {
        // Determine number of errors to inject
        const numErrors = config.correctionCapability > 1 && Math.random() > 0.7 
          ? 2 
          : 1
        
        // Inject error(s)
        const newData = [...block.data]
        const newEcc = [...block.ecc]
        let errorPosition = null
        
        if (numErrors === 1) {
          // Single error
          errorPosition = Math.floor(Math.random() * newData.length)
          newData[errorPosition] ^= 1 // Flip one bit
        } else {
          // Multiple errors
          const errorPositions: number[] = []
          for (let j = 0; j < numErrors; j++) {
            const pos = Math.floor(Math.random() * newData.length)
            if (!errorPositions.includes(pos)) {
              newData[pos] ^= 1 // Flip one bit
              errorPositions.push(pos)
            }
          }
          errorPosition = errorPositions[0]
        }
        
        // Update block with error
        const newBlocks = [...blocks]
        newBlocks[blockIndex] = {
          ...block,
          data: newData,
          ecc: newEcc,
          hasError: true,
          errorPosition,
          corrected: false,
          uncorrectable: false
        }
        setBlocks(newBlocks)
        
        // Try to detect and correct error based on ECC type
        let errorDetected = false
        let errorCorrected = false
        let uncorrectable = false
        
        switch (config.eccType) {
          case "hamming":
            // Hamming code can detect and correct single bit errors
            if (numErrors === 1) {
              errorDetected = true
              errorCorrected = true
              
              // Correct the error
              newData[errorPosition!] ^= 1 // Flip bit back
              newBlocks[blockIndex] = {
                ...newBlocks[blockIndex],
                data: newData,
                hasError: false,
                errorPosition: null,
                corrected: true
              }
              setBlocks(newBlocks)
            } else if (numErrors === 2) {
              // Hamming can detect double bit errors but can't correct them
              errorDetected = true
              errorCorrected = false
              uncorrectable = true
              
              newBlocks[blockIndex] = {
                ...newBlocks[blockIndex],
                uncorrectable: true
              }
              setBlocks(newBlocks)
            }
            break
            
          case "reedSolomon":
            // Reed-Solomon can detect and correct multiple errors
            if (numErrors <= config.correctionCapability) {
              errorDetected = true
              errorCorrected = true
              
              // Correct the errors
              for (let j = 0; j < numErrors; j++) {
                const pos = Math.floor(Math.random() * newData.length)
                newData[pos] ^= 1 // Flip bit back
              }
              
              newBlocks[blockIndex] = {
                ...newBlocks[blockIndex],
                data: newData,
                hasError: false,
                errorPosition: null,
                corrected: true
              }
              setBlocks(newBlocks)
            } else {
              errorDetected = true
              errorCorrected = false
              uncorrectable = true
              
              newBlocks[blockIndex] = {
                ...newBlocks[blockIndex],
                uncorrectable: true
              }
              setBlocks(newBlocks)
            }
            break
            
          case "bch":
            // BCH codes can detect and correct multiple errors with configurable capability
            if (numErrors <= config.correctionCapability) {
              errorDetected = true
              errorCorrected = true
              
              // Correct the errors
              for (let j = 0; j < numErrors; j++) {
                const pos = Math.floor(Math.random() * newData.length)
                newData[pos] ^= 1 // Flip bit back
              }
              
              newBlocks[blockIndex] = {
                ...newBlocks[blockIndex],
                data: newData,
                hasError: false,
                errorPosition: null,
                corrected: true
              }
              setBlocks(newBlocks)
            } else {
              errorDetected = true
              errorCorrected = false
              uncorrectable = true
              
              newBlocks[blockIndex] = {
                ...newBlocks[blockIndex],
                uncorrectable: true
              }
              setBlocks(newBlocks)
            }
            break
        }
        
        // Update error correction stats
        if (errorDetected) {
          errorsDetected++
        }
        if (errorCorrected) {
          errorsCorrected++
        }
        if (uncorrectable) {
          uncorrectableErrors++
        }
        
        totalBits += newData.length * 8 + newEcc.length * 8
        dataBits += newData.length * 8
        eccBits += newEcc.length * 8
        
        const reliability = totalBits > 0 
          ? ((totalBits - (errorsDetected * 8)) / totalBits) * 100 
          : 100
        
        setErrorCorrection({
          dataBits,
          eccBits,
          totalBits,
          errorsDetected,
          errorsCorrected,
          uncorrectableErrors,
          reliability: parseFloat(reliability.toFixed(2))
        })
        
        // Add to history every 10 iterations
        if (i % 10 === 0) {
          newHistory.push({
            time: i,
            errorsDetected,
            errorsCorrected,
            uncorrectableErrors,
            reliability: parseFloat(reliability.toFixed(2))
          })
          setHistory(newHistory)
        }
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
    setErrorCorrection({
      dataBits: 0,
      eccBits: 0,
      totalBits: 0,
      errorsDetected: 0,
      errorsCorrected: 0,
      uncorrectableErrors: 0,
      reliability: 0
    })
    
    // Reinitialize memory blocks
    const numBlocks = config.memorySize * 1024 * 1024 / config.blockSize
    const newBlocks = []
    
    for (let i = 0; i < Math.min(numBlocks, 64); i++) {
      // Generate random data for block
      const data = Array(config.blockSize / 8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      // Generate ECC codes
      const ecc = Array(8).fill(0).map(() => 
        Math.floor(Math.random() * 256)
      )
      
      newBlocks.push({
        id: i,
        data,
        ecc,
        hasError: false,
        errorPosition: null,
        corrected: false,
        uncorrectable: false
      })
    }
    
    setBlocks(newBlocks)
  }

  // ECC type information
  const eccInfo = {
    "hamming": {
      name: "Código Hamming",
      description: "Detecta y corrige errores de un solo bit",
      color: "#3b82f6",
      icon: "🔍"
    },
    "reedSolomon": {
      name: "Código Reed-Solomon",
      description: "Detecta y corrige múltiples errores de bits",
      color: "#10b981",
      icon: "🔧"
    },
    "bch": {
      name: "Código BCH",
      description: "Detecta y corrige errores con capacidad configurable",
      color: "#8b5cf6",
      icon: "🛠️"
    }
  }

  const currentEcc = eccInfo[config.eccType]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Corrección de Errores de Memoria</h1>
        <p className="text-gray-600 mt-2">Comprende cómo los códigos ECC protegen la integridad de los datos en memoria</p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Cómo piensa ECC"
        metaphor="Como un número con dígitos de control: si algo cambia, lo notamos y sabemos dónde."
        idea="Los códigos SECDED corrigen 1 bit y detectan 2; el síndrome señala el bit a invertir. El scrubbing evita que se acumulen errores."
        bullets={["Paridades por posiciones de potencia de 2", "Síndrome ≠ 0 → índice del bit", "Scrubbing periódico"]}
        board={{ title: "Síndrome (intuición)", content: "S = H × c^T\nSi S = 0 ⇒ OK\nSi S ≠ 0 ⇒ índice del bit a voltear" }}
        metrics={[{ label: "Bloque", value: `${config.blockSize} B` }, { label: "Tasa error", value: `${(config.errorRate*100).toFixed(1)}%` }]}
      />

      {guided && (
        <GuidedFlow
          title="De error a corrección"
          steps={[
            { title: "Datos + ECC", content: "Calculamos bits de control y los guardamos junto a los datos." },
            { title: "Fallo aleatorio", content: "Inyectamos 1 bit alterado para simular un error blando." },
            { title: "Detectar", content: "Recalculamos el síndrome: si es 0 no hubo error; si no, se enciende la alerta." },
            { title: "Corregir", content: "Con SECDED invertimos el bit indicado por el síndrome y recuperamos el dato." },
            { title: "Scrubbing", content: "Barrido periódico que corrige silenciosamente antes de que se acumulen dos errores." }
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
              <Label htmlFor="eccType">Tipo de ECC</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(eccInfo).map(([key, ecc]) => (
                  <Button
                    key={key}
                    variant={config.eccType === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, eccType: key as any})}
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <span className="text-xl mb-1">{ecc.icon}</span>
                    <span className="text-xs">{ecc.name.split(" ")[1]}</span>
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
              <Input
                id="correctionCapability"
                type="range"
                min="1"
                max="8"
                value={config.correctionCapability}
                onChange={(e) => setConfig({...config, correctionCapability: Number(e.target.value)})}
              />
              <div className="text-center">{config.correctionCapability} error(es)</div>
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
                onClick={simulateErrorCorrection} 
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
              style={{ color: currentEcc.color }}
            >
              <span className="mr-2 text-2xl">{currentEcc.icon}</span>
              {currentEcc.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{currentEcc.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentEcc.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Bits de Datos</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {errorCorrection.dataBits.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Bits ECC</div>
                  <div className="text-2xl font-bold text-green-600">
                    {errorCorrection.eccBits.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Bits Totales</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {errorCorrection.totalBits.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Errores Detectados</div>
                  <div className="text-2xl font-bold text-red-600">
                    {errorCorrection.errorsDetected}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Errores Corregidos</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {errorCorrection.errorsCorrected}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Errores Irrecuperables</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {errorCorrection.uncorrectableErrors}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Confiabilidad</div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{errorCorrection.reliability.toFixed(2)}%</span>
                </div>
                <Progress 
                  value={errorCorrection.reliability} 
                  className="w-full" 
                  color={errorCorrection.reliability > 99 ? "green" : errorCorrection.reliability > 95 ? "yellow" : "red"}
                />
              </div>

              <div>
                <div className="font-semibold mb-2">Bloques de Memoria</div>
                <div className="flex flex-wrap gap-1">
                  {blocks.map(block => (
                    <div
                      key={block.id}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${block.hasError 
                          ? block.corrected 
                            ? "bg-green-500 text-white ring-2 ring-green-300" 
                            : block.uncorrectable 
                              ? "bg-red-500 text-white ring-2 ring-red-300" 
                              : "bg-yellow-500 text-white ring-2 ring-yellow-300"
                          : "bg-gray-200"}
                      `}
                      title={
                        `Bloque ${block.id}
` +
                        `${block.hasError 
                          ? block.corrected 
                            ? "Error corregido" 
                            : block.uncorrectable 
                              ? "Error irrecuperable" 
                              : "Error detectado"
                          : "Sin errores"}
` +
                        `Posición del error: ${block.errorPosition !== null ? block.errorPosition : "N/A"}`
                      }
                    >
                      {block.hasError 
                        ? block.corrected 
                          ? "✓" 
                          : block.uncorrectable 
                            ? "✗" 
                            : "⚠️"
                        : block.id % 10}
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
          <CardTitle>Historial de Detección de Errores</CardTitle>
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
                    label={{ value: "Confiabilidad (%)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="errorsDetected" 
                    stroke="#ef4444" 
                    activeDot={{ r: 8 }} 
                    name="Errores Detectados"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="errorsCorrected" 
                    stroke="#10b981" 
                    name="Errores Corregidos"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="uncorrectableErrors" 
                    stroke="#6b7280" 
                    name="Errores Irrecuperables"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="reliability" 
                    stroke="#3b82f6" 
                    name="Confiabilidad"
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
          <CardTitle>Comparativa de Códigos ECC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(eccInfo).map(([key, ecc]) => (
              <Card 
                key={key}
                className={config.eccType === key ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center"
                    style={{ color: ecc.color }}
                  >
                    <span className="mr-2 text-xl">{ecc.icon}</span>
                    {ecc.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      {ecc.description}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Ventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "hamming" && "Corrección de errores de un solo bit"}
                            {key === "reedSolomon" && "Corrección de múltiples errores"}
                            {key === "bch" && "Capacidad configurable de corrección"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "hamming" && "Bajo overhead"}
                            {key === "reedSolomon" && "Alto rendimiento en almacenamiento"}
                            {key === "bch" && "Eficiente para comunicaciones"}
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
                            {key === "hamming" && "Solo corrige un solo bit"}
                            {key === "reedSolomon" && "Complejidad de implementación"}
                            {key === "bch" && "Overhead variable"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "hamming" && "No detecta errores dobles"}
                            {key === "reedSolomon" && "Mayor latencia"}
                            {key === "bch" && "Complejidad en decodificación"}
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
                <span>Use Hamming para aplicaciones con bajo overhead requerido</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use Reed-Solomon para almacenamiento masivo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use BCH para comunicaciones donde se requiere corrección configurable</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Balancee corrección vs. overhead según las necesidades de fiabilidad</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
