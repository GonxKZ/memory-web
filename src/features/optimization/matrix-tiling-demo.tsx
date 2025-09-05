import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function MatrixTilingDemo() {
  const [matrixA, setMatrixA] = useState<number[][]>([])
  const [matrixB, setMatrixB] = useState<number[][]>([])
  const [matrixC, setMatrixC] = useState<number[][]>([])
  
  const [config, setConfig] = useState({
    matrixSize: 8,
    tileSize: 4,
    method: "tiled" as "naive" | "tiled"
  })
  
  const [stats, setStats] = useState({
    cacheMisses: 0,
    accesses: 0,
    time: 0
  })
  
  const [isComputing, setIsComputing] = useState(false)

  // Initialize matrices
  useEffect(() => {
    const size = config.matrixSize
    const newMatrixA = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => Math.floor(Math.random() * 10))
    )
    const newMatrixB = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => Math.floor(Math.random() * 10))
    )
    const newMatrixC = Array(size).fill(0).map(() => Array(size).fill(0))
    
    setMatrixA(newMatrixA)
    setMatrixB(newMatrixB)
    setMatrixC(newMatrixC)
  }, [config.matrixSize])

  // Matrix multiplication with tiling
  const multiplyMatrices = () => {
    setIsComputing(true)
    setStats({ cacheMisses: 0, accesses: 0, time: 0 })
    
    const startTime = performance.now()
    let accesses = 0
    let cacheMisses = 0
    
    const size = config.matrixSize
    const tileSize = config.tileSize
    const newMatrixC = Array(size).fill(0).map(() => Array(size).fill(0))
    
    if (config.method === "tiled") {
      // Tiled matrix multiplication
      for (let ii = 0; ii < size; ii += tileSize) {
        for (let jj = 0; jj < size; jj += tileSize) {
          for (let kk = 0; kk < size; kk += tileSize) {
            // Compute tile C[ii:ii+tileSize, jj:jj+tileSize]
            for (let i = ii; i < Math.min(ii + tileSize, size); i++) {
              for (let j = jj; j < Math.min(jj + tileSize, size); j++) {
                for (let k = kk; k < Math.min(kk + tileSize, size); k++) {
                  newMatrixC[i][j] += matrixA[i][k] * matrixB[k][j]
                  accesses += 2
                  
                  // Simulate cache behavior
                  if (Math.random() < 0.1) {
                    cacheMisses++
                  }
                }
              }
            }
          }
        }
      }
    } else {
      // Naive matrix multiplication
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          for (let k = 0; k < size; k++) {
            newMatrixC[i][j] += matrixA[i][k] * matrixB[k][j]
            accesses += 2
            
            // Simulate cache behavior
            if (Math.random() < 0.3) {
              cacheMisses++
            }
          }
        }
      }
    }
    
    const endTime = performance.now()
    
    setMatrixC(newMatrixC)
    setStats({
      cacheMisses,
      accesses,
      time: endTime - startTime
    })
    setIsComputing(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setStats({ cacheMisses: 0, accesses: 0, time: 0 })
    setIsComputing(false)
    
    // Reinitialize matrices
    const size = config.matrixSize
    const newMatrixA = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => Math.floor(Math.random() * 10))
    )
    const newMatrixB = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => Math.floor(Math.random() * 10))
    )
    const newMatrixC = Array(size).fill(0).map(() => Array(size).fill(0))
    
    setMatrixA(newMatrixA)
    setMatrixB(newMatrixB)
    setMatrixC(newMatrixC)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Demo de Tiling Matricial</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo el tiling mejora el acceso a memoria en operaciones matriciales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="matrixSize">Tamaño de Matriz</Label>
              <Input
                id="matrixSize"
                type="number"
                value={config.matrixSize}
                onChange={(e) => setConfig({...config, matrixSize: Number(e.target.value)})}
                min="4"
                max="16"
                step="2"
              />
            </div>

            <div>
              <Label htmlFor="tileSize">Tamaño de Tile</Label>
              <Input
                id="tileSize"
                type="number"
                value={config.tileSize}
                onChange={(e) => setConfig({...config, tileSize: Number(e.target.value)})}
                min="2"
                max={config.matrixSize}
                step="2"
              />
            </div>

            <div>
              <Label>Método de Multiplicación</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.method === "naive" ? "default" : "outline"}
                  onClick={() => setConfig({...config, method: "naive"})}
                >
                  Naive
                </Button>
                <Button
                  variant={config.method === "tiled" ? "default" : "outline"}
                  onClick={() => setConfig({...config, method: "tiled"})}
                >
                  Tiled
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={multiplyMatrices} 
                disabled={isComputing}
                className="flex-1"
              >
                {isComputing ? "Calculando..." : "Multiplicar"}
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
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500">Tiempo</div>
                <div className="font-bold text-blue-600">{stats.time.toFixed(2)} ms</div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-xs text-gray-500">Accesos</div>
                <div className="font-bold text-green-600">{stats.accesses}</div>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="text-xs text-gray-500">Fallos de Caché</div>
                <div className="font-bold text-red-600">{stats.cacheMisses}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="font-semibold mb-2">Matriz Resultante (C = A × B)</div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {matrixC.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((value, colIndex) => (
                          <td 
                            key={colIndex} 
                            className="border p-1 text-center font-mono text-sm"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold mb-2">Matriz A</div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {matrixA.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((value, colIndex) => (
                            <td 
                              key={colIndex} 
                              className="border p-1 text-center font-mono text-sm bg-gray-50"
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2">Matriz B</div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {matrixB.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((value, colIndex) => (
                            <td 
                              key={colIndex} 
                              className="border p-1 text-center font-mono text-sm bg-gray-50"
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Análisis de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-2">Método Naive</div>
              <p className="text-sm text-gray-600">
                {config.method === "naive" 
                  ? "Este método recorre las matrices en orden secuencial, causando muchos fallos de caché." 
                  : "Este método recorre las matrices en orden secuencial, causando muchos fallos de caché."}
              </p>
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Fallos de caché esperados</div>
                <Progress value={80} className="w-full" />
                <div className="text-right text-xs mt-1">Alto</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-2">Método Tiled</div>
              <p className="text-sm text-gray-600">
                {config.method === "tiled" 
                  ? "Este método divide las matrices en tiles pequeños para mejorar la localidad espacial." 
                  : "Este método divide las matrices en tiles pequeños para mejorar la localidad espacial."}
              </p>
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Fallos de caché esperados</div>
                <Progress value={30} className="w-full" />
                <div className="text-right text-xs mt-1">Bajo</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-2">Comparativa</div>
              <p className="text-sm text-gray-600">
                El tiling puede mejorar significativamente el rendimiento al reducir los fallos de caché.
              </p>
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Mejora esperada</div>
                <div className="text-2xl font-bold text-green-600">
                  {config.method === "tiled" 
                    ? stats.cacheMisses > 0 
                      ? `${Math.round((1 - stats.cacheMisses / (stats.accesses * 0.3)) * 100)}%` 
                      : "0%"
                    : "60%"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="font-semibold text-blue-800 mb-2">Consejo de Optimización:</div>
            <p className="text-sm text-blue-700">
              Elige un tamaño de tile que quepa en tu caché L1 para maximizar la eficiencia. 
              Generalmente, tiles de 32x32 o 64x64 elementos funcionan bien para la mayoría de arquitecturas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}