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

export default function SIMDVisualization() {
  const [config, setConfig] = useState({
    instructionSet: "sse" as "sse" | "avx" | "avx2" | "avx512",
    dataType: "float32" as "float32" | "float64" | "int32" | "int64",
    vectorLength: 4,
    operation: "add" as "add" | "mul" | "div" | "sqrt",
    elements: 16
  })
  
  const [simd, setSimd] = useState({
    registers: [] as {id: number, values: number[]}[],
    memory: [] as number[],
    result: [] as number[]
  })
  
  const [performance, setPerformance] = useState({
    scalarTime: 0,
    simdTime: 0,
    speedup: 0,
    efficiency: 0
  })
  
  const [history, setHistory] = useState<{
    iteration: number,
    scalarTime: number,
    simdTime: number,
    speedup: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize SIMD state
  useState(() => {
    // Initialize registers
    const registers = []
    for (let i = 0; i < 8; i++) {
      const values = Array(config.vectorLength).fill(0).map(() => Math.floor(Math.random() * 100))
      registers.push({ id: i, values })
    }
    
    // Initialize memory
    const memory = Array(config.elements).fill(0).map(() => Math.floor(Math.random() * 100))
    
    // Initialize result
    const result = Array(config.elements).fill(0)
    
    setSimd({ registers, memory, result })
  })

  // Execute SIMD operation
  const executeSIMDOperation = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset result
    const newResult = Array(config.elements).fill(0)
    
    // Measure scalar time
    const scalarStartTime = window.performance.now()
    
    // Scalar execution
    for (let i = 0; i < config.elements; i++) {
      setProgress((i / config.elements) * 50)
      
      switch (config.operation) {
        case "add":
          newResult[i] = simd.memory[i] + simd.memory[(i + 1) % config.elements]
          break
        case "mul":
          newResult[i] = simd.memory[i] * simd.memory[(i + 1) % config.elements]
          break
        case "div":
          newResult[i] = simd.memory[i] / (simd.memory[(i + 1) % config.elements] || 1)
          break
        case "sqrt":
          newResult[i] = Math.sqrt(Math.abs(simd.memory[i]))
          break
      }
      
      // Add small delay to visualize
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    const scalarEndTime = window.performance.now()
    const scalarTime = scalarEndTime - scalarStartTime
    
    // Measure SIMD time
    const simdStartTime = window.performance.now()
    
    // SIMD execution
    for (let i = 0; i < config.elements; i += config.vectorLength) {
      setProgress(50 + (i / config.elements) * 50)
      
      // Process vectorLength elements at once
      for (let j = 0; j < config.vectorLength && i + j < config.elements; j++) {
        switch (config.operation) {
          case "add":
            newResult[i + j] = simd.memory[i + j] + simd.memory[(i + j + 1) % config.elements]
            break
          case "mul":
            newResult[i + j] = simd.memory[i + j] * simd.memory[(i + j + 1) % config.elements]
            break
          case "div":
            newResult[i + j] = simd.memory[i + j] / (simd.memory[(i + j + 1) % config.elements] || 1)
            break
          case "sqrt":
            newResult[i + j] = Math.sqrt(Math.abs(simd.memory[i + j]))
            break
        }
      }
      
      // Add small delay to visualize
      await new Promise(resolve => setTimeout(resolve, 5))
    }
    
    const simdEndTime = window.performance.now()
    const simdTime = simdEndTime - simdStartTime
    
    // Calculate speedup and efficiency
    const speedup = scalarTime / simdTime
    const efficiency = (speedup / config.vectorLength) * 100
    
    // Update state
    setSimd(prev => ({ ...prev, result: newResult }))
    setPerformance({
      scalarTime: parseFloat(scalarTime.toFixed(2)),
      simdTime: parseFloat(simdTime.toFixed(2)),
      speedup: parseFloat(speedup.toFixed(2)),
      efficiency: parseFloat(efficiency.toFixed(2))
    })
    
    // Add to history
    setHistory(prev => [...prev.slice(-19), {
      iteration: prev.length + 1,
      scalarTime,
      simdTime,
      speedup
    }])
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    
    // Reinitialize SIMD state
    const registers = []
    for (let i = 0; i < 8; i++) {
      const values = Array(config.vectorLength).fill(0).map(() => Math.floor(Math.random() * 100))
      registers.push({ id: i, values })
    }
    
    const memory = Array(config.elements).fill(0).map(() => Math.floor(Math.random() * 100))
    const result = Array(config.elements).fill(0)
    
    setSimd({ registers, memory, result })
    setPerformance({
      scalarTime: 0,
      simdTime: 0,
      speedup: 0,
      efficiency: 0
    })
  }

  // Update vector length based on instruction set
  useState(() => {
    switch (config.instructionSet) {
      case "sse":
        setConfig(prev => ({ ...prev, vectorLength: 4 }))
        break
      case "avx":
        setConfig(prev => ({ ...prev, vectorLength: 8 }))
        break
      case "avx2":
        setConfig(prev => ({ ...prev, vectorLength: 8 }))
        break
      case "avx512":
        setConfig(prev => ({ ...prev, vectorLength: 16 }))
        break
    }
  })

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Instrucciones SIMD</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo las instrucciones SIMD aceleran operaciones paralelas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instructionSet">Conjunto de Instrucciones</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.instructionSet === "sse" ? "default" : "outline"}
                  onClick={() => setConfig({...config, instructionSet: "sse"})}
                >
                  SSE
                </Button>
                <Button
                  variant={config.instructionSet === "avx" ? "default" : "outline"}
                  onClick={() => setConfig({...config, instructionSet: "avx"})}
                >
                  AVX
                </Button>
                <Button
                  variant={config.instructionSet === "avx2" ? "default" : "outline"}
                  onClick={() => setConfig({...config, instructionSet: "avx2"})}
                >
                  AVX2
                </Button>
                <Button
                  variant={config.instructionSet === "avx512" ? "default" : "outline"}
                  onClick={() => setConfig({...config, instructionSet: "avx512"})}
                >
                  AVX-512
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="dataType">Tipo de Datos</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.dataType === "float32" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataType: "float32"})}
                >
                  Float32
                </Button>
                <Button
                  variant={config.dataType === "float64" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataType: "float64"})}
                >
                  Float64
                </Button>
                <Button
                  variant={config.dataType === "int32" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataType: "int32"})}
                >
                  Int32
                </Button>
                <Button
                  variant={config.dataType === "int64" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataType: "int64"})}
                >
                  Int64
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="operation">Operación</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.operation === "add" ? "default" : "outline"}
                  onClick={() => setConfig({...config, operation: "add"})}
                >
                  ADD
                </Button>
                <Button
                  variant={config.operation === "mul" ? "default" : "outline"}
                  onClick={() => setConfig({...config, operation: "mul"})}
                >
                  MUL
                </Button>
                <Button
                  variant={config.operation === "div" ? "default" : "outline"}
                  onClick={() => setConfig({...config, operation: "div"})}
                >
                  DIV
                </Button>
                <Button
                  variant={config.operation === "sqrt" ? "default" : "outline"}
                  onClick={() => setConfig({...config, operation: "sqrt"})}
                >
                  SQRT
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="elements">Número de Elementos</Label>
              <Input
                id="elements"
                type="number"
                value={config.elements}
                onChange={(e) => setConfig({...config, elements: Number(e.target.value)})}
                min="8"
                max="1024"
                step="8"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={executeSIMDOperation} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Ejecutando..." : "Ejecutar Operación"}
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
            <CardTitle>Resultados de Ejecución</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo Escalar</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {performance.scalarTime} ms
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo SIMD</div>
                  <div className="text-2xl font-bold text-green-600">
                    {performance.simdTime} ms
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Aceleración</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {performance.speedup}x
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Eficiencia</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {performance.efficiency}%
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Registros SIMD</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {simd.registers.map(register => (
                    <Card key={register.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">Registro {register.id}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {register.values.map((value, index) => (
                            <div 
                              key={index} 
                              className="w-10 h-10 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-mono"
                            >
                              {value}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Memoria</div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex flex-wrap gap-1">
                    {simd.memory.slice(0, 32).map((value, index) => (
                      <div 
                        key={index} 
                        className="w-10 h-10 bg-green-500 text-white rounded flex items-center justify-center text-xs font-mono"
                      >
                        {value}
                      </div>
                    ))}
                    {simd.memory.length > 32 && (
                      <div className="w-10 h-10 bg-gray-300 text-gray-700 rounded flex items-center justify-center text-xs">
                        +{simd.memory.length - 32}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Resultado</div>
                <div className="p-3 bg-purple-50 rounded">
                  <div className="flex flex-wrap gap-1">
                    {simd.result.slice(0, 32).map((value, index) => (
                      <div 
                        key={index} 
                        className="w-10 h-10 bg-purple-500 text-white rounded flex items-center justify-center text-xs font-mono"
                      >
                        {Math.round(value)}
                      </div>
                    ))}
                    {simd.result.length > 32 && (
                      <div className="w-10 h-10 bg-gray-300 text-gray-700 rounded flex items-center justify-center text-xs">
                        +{simd.result.length - 32}
                      </div>
                    )}
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
                    dataKey="iteration" 
                    label={{ value: "Iteración", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Tiempo (ms)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Aceleración (x)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="scalarTime" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Tiempo Escalar (ms)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="simdTime" 
                    stroke="#10b981" 
                    name="Tiempo SIMD (ms)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="speedup" 
                    stroke="#8b5cf6" 
                    name="Aceleración (x)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay datos de rendimiento todavía. Ejecute una operación para ver el historial.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de SIMD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es SIMD?</div>
              <p className="text-sm text-blue-700">
                SIMD (Single Instruction, Multiple Data) permite ejecutar una instrucción 
                en múltiples elementos de datos simultáneamente.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Beneficios</div>
              <ul className="space-y-1 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="mr-1 text-green-500">✓</span>
                  <span>Aceleración paralela significativa</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1 text-green-500">✓</span>
                  <span>Mejor uso del ancho de banda de memoria</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1 text-green-500">✓</span>
                  <span>Menor consumo energético por operación</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Desafíos</div>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="mr-1 text-yellow-500">✗</span>
                  <span>Complejidad en programación</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1 text-yellow-500">✗</span>
                  <span>Requiere alineación de datos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1 text-yellow-500">✗</span>
                  <span>Dificultad con ramificaciones</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Conjuntos de Instrucciones</div>
              <ul className="space-y-1 text-sm text-purple-700">
                <li className="flex items-start">
                  <span className="mr-1 text-purple-500">•</span>
                  <span>SSE: 128 bits</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1 text-purple-500">•</span>
                  <span>AVX: 256 bits</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1 text-purple-500">•</span>
                  <span>AVX-512: 512 bits</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Organiza los datos para maximizar la localidad espacial</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Evita ramificaciones dentro de bucles SIMD</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Asegura alineación de datos en límites de 16/32/64 bytes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Utiliza bibliotecas optimizadas como Intel MKL o OpenBLAS</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
