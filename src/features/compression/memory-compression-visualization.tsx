import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

export default function MemoryCompressionVisualization() {
  const [config, setConfig] = useState({
    compressionType: "lz" as "lz" | "huffman" | "delta" | "dictionary",
    dataSize: 1024, // KB
    compressibility: 70, // %
    blockSize: 4096, // bytes
    compressionLevel: 6, // 1-9
    simulationSpeed: 200 // ms
  })
  
  const [compression, setCompression] = useState({
    originalSize: 0,
    compressedSize: 0,
    compressionRatio: 0,
    compressionTime: 0,
    decompressionTime: 0,
    memorySavings: 0,
    compressionRate: 0
  })
  
  const [history, setHistory] = useState<{
    time: number,
    originalSize: number,
    compressedSize: number,
    ratio: number,
    savings: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simulate memory compression
  const simulateCompression = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset compression stats
    setCompression({
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      compressionTime: 0,
      decompressionTime: 0,
      memorySavings: 0,
      compressionRate: 0
    })
    
    const newHistory = []
    let totalOriginalSize = 0
    let totalCompressedSize = 0
    let totalCompressionTime = 0
    let totalDecompressionTime = 0
    let totalMemorySavings = 0
    
    // Simulate compression of data blocks
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate data block with specified compressibility
      const blockSize = config.blockSize
      const originalSize = blockSize
      let compressedSize = originalSize
      
      // Apply compression based on algorithm and compressibility
      switch (config.compressionType) {
        case "lz":
          // LZ compression - good for repeated data
          compressedSize = originalSize * (1 - (config.compressibility / 100) * 0.8)
          break
          
        case "huffman":
          // Huffman compression - good for skewed distributions
          compressedSize = originalSize * (1 - (config.compressibility / 100) * 0.6)
          break
          
        case "delta":
          // Delta compression - good for sequential data
          compressedSize = originalSize * (1 - (config.compressibility / 100) * 0.7)
          break
          
        case "dictionary":
          // Dictionary compression - good for repetitive patterns
          compressedSize = originalSize * (1 - (config.compressibility / 100) * 0.9)
          break
      }
      
      // Add some randomness to compression results
      compressedSize *= (0.9 + Math.random() * 0.2)
      compressedSize = Math.max(1, Math.floor(compressedSize))
      
      // Calculate compression ratio
      const _ratio = originalSize / compressedSize
      
      // Calculate time based on algorithm and compression level
      let compressionTime = 0
      let decompressionTime = 0
      
      switch (config.compressionType) {
        case "lz":
          compressionTime = 10 + (9 - config.compressionLevel) * 2
          decompressionTime = 5 + (9 - config.compressionLevel) * 1
          break
          
        case "huffman":
          compressionTime = 15 + (9 - config.compressionLevel) * 3
          decompressionTime = 8 + (9 - config.compressionLevel) * 1.5
          break
          
        case "delta":
          compressionTime = 5 + (9 - config.compressionLevel) * 1
          decompressionTime = 3 + (9 - config.compressionLevel) * 0.5
          break
          
        case "dictionary":
          compressionTime = 20 + (9 - config.compressionLevel) * 4
          decompressionTime = 10 + (9 - config.compressionLevel) * 2
          break
      }
      
      // Update compression stats
      totalOriginalSize += originalSize
      totalCompressedSize += compressedSize
      totalCompressionTime += compressionTime
      totalDecompressionTime += decompressionTime
      totalMemorySavings += (originalSize - compressedSize)
      
      const avgRatio = totalOriginalSize / totalCompressedSize
      const avgSavings = (totalMemorySavings / totalOriginalSize) * 100
      const compressionRate = totalOriginalSize / (totalCompressionTime / 1000) // bytes/sec
      
      setCompression({
        originalSize: totalOriginalSize,
        compressedSize: totalCompressedSize,
        compressionRatio: parseFloat(avgRatio.toFixed(2)),
        compressionTime: parseFloat(totalCompressionTime.toFixed(2)),
        decompressionTime: parseFloat(totalDecompressionTime.toFixed(2)),
        memorySavings: parseFloat(totalMemorySavings.toFixed(2)),
        compressionRate: parseFloat(compressionRate.toFixed(2))
      })
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          originalSize: totalOriginalSize,
          compressedSize: totalCompressedSize,
          ratio: parseFloat(avgRatio.toFixed(2)),
          savings: parseFloat(avgSavings.toFixed(2))
        })
        setHistory(newHistory)
      }
      
      // Add delay to visualize
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
    setCompression({
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      compressionTime: 0,
      decompressionTime: 0,
      memorySavings: 0,
      compressionRate: 0
    })
  }

  // Update vector length based on instruction set
  useState(() => {
    switch (config.compressionType) {
      case "lz":
        setConfig(prev => ({ ...prev, vectorLength: 4 }))
        break
      case "huffman":
        setConfig(prev => ({ ...prev, vectorLength: 8 }))
        break
      case "delta":
        setConfig(prev => ({ ...prev, vectorLength: 8 }))
        break
      case "dictionary":
        setConfig(prev => ({ ...prev, vectorLength: 16 }))
        break
    }
  })

  // Compression algorithm information
  const algorithmInfo = {
    "lz": {
      name: "LZ77/LZ78",
      description: "Algoritmos basados en diccionario que reemplazan cadenas repetidas con referencias",
      color: "#3b82f6",
      icon: "🗜️"
    },
    "huffman": {
      name: "Codificación Huffman",
      description: "Codificación basada en frecuencia que asigna códigos más cortos a símbolos más frecuentes",
      color: "#10b981",
      icon: "🌳"
    },
    "delta": {
      name: "Compresión Delta",
      description: "Almacena diferencias entre valores consecutivos en lugar de los valores originales",
      color: "#8b5cf6",
      icon: "🔺"
    },
    "dictionary": {
      name: "Compresión por Diccionario",
      description: "Reemplaza patrones frecuentes con códigos cortos basados en un diccionario predefinido",
      color: "#f59e0b",
      icon: "📖"
    }
  }

  const currentAlgorithm = algorithmInfo[config.compressionType]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Compresión de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo la compresión de memoria mejora la eficiencia del almacenamiento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="compressionType">Algoritmo de Compresión</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(algorithmInfo).map(([key, algorithm]) => (
                  <Button
                    key={key}
                    variant={config.compressionType === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, compressionType: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{algorithm.icon}</span>
                    <span className="text-xs">{algorithm.name.split(" ")[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="dataSize">Tamaño de Datos (KB)</Label>
              <Input
                id="dataSize"
                type="number"
                value={config.dataSize}
                onChange={(e) => setConfig({...config, dataSize: Number(e.target.value)})}
                min="128"
                step="128"
              />
            </div>

            <div>
              <Label htmlFor="compressibility">Compresibilidad (%)</Label>
              <Input
                id="compressibility"
                type="range"
                min="0"
                max="100"
                value={config.compressibility}
                onChange={(e) => setConfig({...config, compressibility: Number(e.target.value)})}
              />
              <div className="text-center">{config.compressibility}%</div>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="512"
                step="512"
              />
            </div>

            <div>
              <Label htmlFor="compressionLevel">Nivel de Compresión</Label>
              <Input
                id="compressionLevel"
                type="range"
                min="1"
                max="9"
                value={config.compressionLevel}
                onChange={(e) => setConfig({...config, compressionLevel: Number(e.target.value)})}
              />
              <div className="text-center">{config.compressionLevel}</div>
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
                onClick={simulateCompression} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Comprimiendo..." : "Iniciar Compresión"}
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
              style={{ color: currentAlgorithm.color }}
            >
              <span className="mr-2 text-2xl">{currentAlgorithm.icon}</span>
              {currentAlgorithm.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{currentAlgorithm.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentAlgorithm.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tamaño Original</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {compression.originalSize.toLocaleString()} bytes
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tamaño Comprimido</div>
                  <div className="text-2xl font-bold text-green-600">
                    {compression.compressedSize.toLocaleString()} bytes
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ratio de Compresión</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {compression.compressionRatio.toFixed(2)}:1
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Compresión</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {compression.compressionTime.toFixed(2)} ms
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tiempo de Descompresión</div>
                  <div className="text-2xl font-bold text-red-600">
                    {compression.decompressionTime.toFixed(2)} ms
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-indigo-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ahorro de Memoria</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {compression.memorySavings.toLocaleString()} bytes
                  </div>
                </div>
                
                <div className="p-3 bg-teal-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Compresión</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {(compression.compressionRate / 1024 / 1024).toFixed(2)} MB/s
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Visualización de Compresión</div>
                <div className="relative h-32 bg-gray-50 rounded overflow-hidden">
                  {/* Original data */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-500"
                    style={{ width: "50%" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      Original: {compression.originalSize.toLocaleString()} bytes
                    </div>
                  </div>
                  
                  {/* Compressed data */}
                  <div 
                    className="absolute top-0 right-0 h-full bg-green-500"
                    style={{ width: `${(compression.compressedSize / compression.originalSize) * 50}%` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      Comprimido: {compression.compressedSize.toLocaleString()} bytes
                    </div>
                  </div>
                  
                  {/* Savings visualization */}
                  <div 
                    className="absolute top-0 h-full bg-red-500 opacity-30"
                    style={{ 
                      left: "50%", 
                      width: `${((compression.originalSize - compression.compressedSize) / compression.originalSize) * 50}%` 
                    }}
                  ></div>
                </div>
                
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>0 bytes</span>
                  <span>{compression.originalSize.toLocaleString()} bytes</span>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Comparativa de Algoritmos</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(algorithmInfo).map(([key, algorithm]) => (
                    <div key={key} className="p-2 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-500 mb-1">{algorithm.name.split(" ")[0]}</div>
                      <div className="font-semibold">
                        {key === "lz" && "1.5:1"}
                        {key === "huffman" && "1.3:1"}
                        {key === "delta" && "1.4:1"}
                        {key === "dictionary" && "1.8:1"}
                      </div>
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
          <CardTitle>Historial de Compresión</CardTitle>
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
                    label={{ value: "Tamaño (bytes)", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Ratio", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="originalSize" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Tamaño Original"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="compressedSize" 
                    stroke="#10b981" 
                    name="Tamaño Comprimido"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="ratio" 
                    stroke="#8b5cf6" 
                    name="Ratio de Compresión"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#f59e0b" 
                    name="Ahorro (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay datos de compresión todavía. Ejecute una simulación para ver el historial.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Técnicas de Compresión de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(algorithmInfo).map(([key, algorithm]) => (
              <Card 
                key={key}
                className={config.compressionType === key ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center text-sm"
                    style={{ color: algorithm.color }}
                  >
                    <span className="mr-2 text-xl">{algorithm.icon}</span>
                    {algorithm.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      {algorithm.description}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Ventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "lz" && "Buena compresión para datos repetitivos"}
                            {key === "huffman" && "Óptimo para alfabeto fijo"}
                            {key === "delta" && "Muy rápido de calcular"}
                            {key === "dictionary" && "Excelente compresión para patrones conocidos"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "lz" && "Algoritmo establecido y probado"}
                            {key === "huffman" && "Bajo overhead"}
                            {key === "delta" && "Efectivo para datos secuenciales"}
                            {key === "dictionary" && "Rápido para patrones repetitivos"}
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
                            {key === "lz" && "Complejidad de implementación"}
                            {key === "huffman" && "Necesita dos pasadas"}
                            {key === "delta" && "Solo efectivo para datos correlacionados"}
                            {key === "dictionary" && "Necesita diccionario preexistente"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "lz" && "Uso de memoria para ventana deslizante"}
                            {key === "huffman" && "Menos efectivo para distribuciones uniformes"}
                            {key === "delta" && "Error se propaga a valores posteriores"}
                            {key === "dictionary" && "Puede ser inefectivo para datos desconocidos"}
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
            <div className="font-semibold mb-2">Consejos de Optimización:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Elija el algoritmo según el tipo de datos: LZ para texto, Delta para series temporales</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Balancee compresión vs. rendimiento según las necesidades de la aplicación</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use niveles de compresión más altos solo si el ahorro justifica el tiempo adicional</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Considere compresión adaptativa que cambie según el tipo de datos</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
