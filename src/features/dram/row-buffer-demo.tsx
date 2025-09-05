import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function RowBufferDemo() {
  const [config, setConfig] = useState({
    banks: 4,
    rows: 8,
    openPagePolicy: true
  })
  
  const [rowBuffers, setRowBuffers] = useState<{[key: number]: number | null}>({})
  const [accessHistory, setAccessHistory] = useState<{bank: number, row: number, hit: boolean}[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1000) // ms between accesses

  // Initialize row buffers
  useEffect(() => {
    const buffers: {[key: number]: number | null} = {}
    for (let i = 0; i < config.banks; i++) {
      buffers[i] = null
    }
    setRowBuffers(buffers)
  }, [config.banks])

  // Simulate memory access
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        // Generate random access
        const bank = Math.floor(Math.random() * config.banks)
        const row = Math.floor(Math.random() * config.rows)
        
        // Check for row buffer hit
        const hit = rowBuffers[bank] === row
        
        // Update row buffer
        setRowBuffers(prev => ({
          ...prev,
          [bank]: row
        }))
        
        // Add to history
        setAccessHistory(prev => [...prev.slice(-19), {bank, row, hit}])
      }, speed)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, speed, config.banks, config.rows, rowBuffers])

  const startSimulation = () => setIsRunning(true)
  const pauseSimulation = () => setIsRunning(false)
  const resetSimulation = () => {
    setIsRunning(false)
    setAccessHistory([])
    
    // Reset row buffers
    const buffers: {[key: number]: number | null} = {}
    for (let i = 0; i < config.banks; i++) {
      buffers[i] = null
    }
    setRowBuffers(buffers)
  }

  // Calculate statistics
  const totalAccesses = accessHistory.length
  const hits = accessHistory.filter(a => a.hit).length
  const hitRate = totalAccesses > 0 ? (hits / totalAccesses) * 100 : 0

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Demo de Row Buffer</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo funciona el row buffer en memorias DRAM
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número de Bancos</label>
              <input
                type="range"
                min="1"
                max="8"
                value={config.banks}
                onChange={(e) => setConfig({...config, banks: Number(e.target.value)})}
                className="w-full"
              />
              <div className="text-center">{config.banks}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número de Filas</label>
              <input
                type="range"
                min="4"
                max="16"
                value={config.rows}
                onChange={(e) => setConfig({...config, rows: Number(e.target.value)})}
                className="w-full"
              />
              <div className="text-center">{config.rows}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Velocidad (ms)</label>
              <input
                type="range"
                min="100"
                max="2000"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center">{speed} ms</div>
            </div>

            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={startSimulation} className="flex-1">
                  Iniciar
                </Button>
              ) : (
                <Button onClick={pauseSimulation} variant="outline" className="flex-1">
                  Pausar
                </Button>
              )}
              <Button onClick={resetSimulation} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estado de Row Buffers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: config.banks }).map((_, bankIndex) => (
                <Card key={bankIndex}>
                  <CardHeader>
                    <CardTitle className="text-sm">Banco {bankIndex}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4">
                      {rowBuffers[bankIndex] !== null ? (
                        <>
                          <div className="text-xs text-gray-500 mb-1">Fila Abierta</div>
                          <div className="text-2xl font-bold">{rowBuffers[bankIndex]}</div>
                        </>
                      ) : (
                        <div className="text-gray-500">Sin fila abierta</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500">Total Accesos</div>
                <div className="text-2xl font-bold">{totalAccesses}</div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-xs text-gray-500">Aciertos</div>
                <div className="text-2xl font-bold">{hits}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded text-center">
                <div className="text-xs text-gray-500">Tasa de Aciertos</div>
                <div className="text-2xl font-bold">{hitRate.toFixed(1)}%</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span>
                <span>{totalAccesses}/20</span>
              </div>
              <Progress value={(totalAccesses / 20) * 100} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Accesos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {accessHistory.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {accessHistory.map((access, index) => (
                <div 
                  key={index} 
                  className={`
                    p-2 rounded text-center
                    ${access.hit 
                      ? "bg-green-100 border border-green-300" 
                      : "bg-red-100 border border-red-300"}
                  `}
                >
                  <div className="text-xs">B{access.bank}:R{access.row}</div>
                  <div className="text-xs">
                    {access.hit ? (
                      <span className="text-green-600">HIT</span>
                    ) : (
                      <span className="text-red-600">MISS</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay accesos simulados todavía. Haz clic en "Iniciar" para comenzar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
