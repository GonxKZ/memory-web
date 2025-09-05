import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function RowhammerConcept() {
  const [config, setConfig] = useState({
    dramBanks: 8,
    rowsPerBank: 32768,
    columnsPerRow: 1024,
    refreshInterval: 64, // ms
    hammerCount: 1000000, // Number of activations
    rowPairSpacing: 2, // Rows between aggressor and victim
    simulationSpeed: 200 // ms
  })
  
  const [rowhammer, setRowhammer] = useState({
    banks: [] as {
      id: number,
      rows: {
        id: number,
        activated: number,
        refreshed: number,
        hammered: boolean,
        flipped: boolean,
        lastAccess: number,
        neighbors: number[]
      }[],
      hammerActivity: {
        aggressorRows: number[],
        victimRows: number[],
        flipEvents: {
          aggressorRow: number,
          victimRow: number,
          bitPosition: number,
          timestamp: number
        }[]
      }
    }[],
    memory: {
      cells: [] as {
        row: number,
        col: number,
        bank: number,
        value: number,
        flipped: boolean,
        lastFlip: number,
        accessCount: number
      }[],
      bitFlips: 0,
      totalHammerCount: 0,
      flipRate: 0
    },
    statistics: {
      aggressorActivations: 0,
      victimActivations: 0,
      rowBufferConflicts: 0,
      bitFlips: 0,
      flipRate: 0,
      hammerRate: 0,
      refreshMisses: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize Rowhammer simulation
  useEffect(() => {
    // Create DRAM banks
    const banks = []
    
    for (let bankId = 0; bankId < config.dramBanks; bankId++) {
      // Create rows for this bank
      const rows = []
      for (let rowId = 0; rowId < config.rowsPerBank; rowId++) {
        // Determine neighbors (rows that can influence this row)
        const neighbors = []
        for (let i = 1; i <= config.rowPairSpacing; i++) {
          if (rowId - i >= 0) neighbors.push(rowId - i)
          if (rowId + i < config.rowsPerBank) neighbors.push(rowId + i)
        }
        
        rows.push({
          id: rowId,
          activated: 0,
          refreshed: 0,
          hammered: false,
          flipped: false,
          lastAccess: 0,
          neighbors
        })
      }
      
      banks.push({
        id: bankId,
        rows,
        hammerActivity: {
          aggressorRows: [],
          victimRows: [],
          flipEvents: []
        }
      })
    }
    
    // Initialize memory cells
    const cells = []
    for (let bankId = 0; bankId < config.dramBanks; bankId++) {
      for (let rowId = 0; rowId < Math.min(100, config.rowsPerBank); rowId++) { // Limit for performance
        for (let colId = 0; colId < Math.min(100, config.columnsPerRow); colId++) {
          cells.push({
            row: rowId,
            col: colId,
            bank: bankId,
            value: Math.random() > 0.5 ? 1 : 0,
            flipped: false,
            lastFlip: 0,
            accessCount: 0
          })
        }
      }
    }
    
    setRowhammer({
      banks,
      memory: {
        cells,
        bitFlips: 0,
        totalHammerCount: 0,
        flipRate: 0
      },
      statistics: {
        aggressorActivations: 0,
        victimActivations: 0,
        rowBufferConflicts: 0,
        bitFlips: 0,
        flipRate: 0,
        hammerRate: 0,
        refreshMisses: 0
      }
    })
  }, [config])

  // Simulate Rowhammer attack
  const simulateRowhammer = async () => {
    setIsRunning(true)
    setProgress(0)
    
    let bitFlips = 0
    let aggressorActivations = 0
    let victimActivations = 0
    const flipEvents = []
    
    // Select random aggressor and victim rows
    const bankId = Math.floor(Math.random() * config.dramBanks)
    const aggressorRowId = Math.floor(Math.random() * config.rowsPerBank)
    const victimRowId = aggressorRowId + config.rowPairSpacing
    
    if (victimRowId >= config.rowsPerBank) {
      setIsRunning(false)
      return
    }
    
    // Hammer the aggressor row
    for (let i = 0; i < config.hammerCount; i++) {
      setProgress((i / config.hammerCount) * 100)
      
      // Activate aggressor row
      setRowhammer(prev => {
        const newBanks = [...prev.banks]
        const bank = newBanks[bankId]
        if (bank) {
          const row = bank.rows[aggressorRowId]
          if (row) {
            row.activated++
            row.lastAccess = Date.now()
            aggressorActivations++
          }
        }
        return { ...prev, banks: newBanks }
      })
      
      // Occasionally access victim row
      if (Math.random() < 0.1) {
        setRowhammer(prev => {
          const newBanks = [...prev.banks]
          const bank = newBanks[bankId]
          if (bank) {
            const row = bank.rows[victimRowId]
            if (row) {
              row.activated++
              row.lastAccess = Date.now()
              victimActivations++
            }
          }
          return { ...prev, banks: newBanks }
        })
      }
      
      // Simulate bit flips with a small probability
      if (Math.random() < 0.0001 && i > config.hammerCount * 0.8) {
        bitFlips++
        flipEvents.push({
          aggressorRow: aggressorRowId,
          victimRow: victimRowId,
          bitPosition: Math.floor(Math.random() * 64),
          timestamp: Date.now()
        })
        
        // Flip a random bit in memory
        setRowhammer(prev => {
          const newMemory = { ...prev.memory }
          if (newMemory.cells.length > 0) {
            const cellIndex = Math.floor(Math.random() * newMemory.cells.length)
            const cell = newMemory.cells[cellIndex]
            newMemory.cells[cellIndex] = {
              ...cell,
              value: 1 - cell.value,
              flipped: true,
              lastFlip: Date.now()
            }
          }
          return { ...prev, memory: newMemory }
        })
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 1000))
    }
    
    // Update final statistics
    setRowhammer(prev => ({
      ...prev,
      statistics: {
        aggressorActivations,
        victimActivations,
        rowBufferConflicts: Math.floor(Math.random() * 100),
        bitFlips,
        flipRate: parseFloat((bitFlips / config.hammerCount * 1000000).toFixed(2)),
        hammerRate: parseFloat((config.hammerCount / (config.hammerCount / 1000)).toFixed(2)),
        refreshMisses: Math.floor(Math.random() * 50)
      }
    }))
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    
    // Reset rowhammer state
    setRowhammer(prev => ({
      ...prev,
      statistics: {
        aggressorActivations: 0,
        victimActivations: 0,
        rowBufferConflicts: 0,
        bitFlips: 0,
        flipRate: 0,
        hammerRate: 0,
        refreshMisses: 0
      }
    }))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Rowhammer: Ataques de Seguridad en DRAM</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo el acceso repetido a filas de memoria puede causar cambios no deseados en otras filas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Simulación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dramBanks">Bancos de DRAM</Label>
              <Input
                id="dramBanks"
                type="number"
                value={config.dramBanks}
                onChange={(e) => setConfig({...config, dramBanks: Number(e.target.value)})}
                min="1"
                max="16"
              />
            </div>

            <div>
              <Label htmlFor="rowsPerBank">Filas por Banco</Label>
              <Input
                id="rowsPerBank"
                type="number"
                value={config.rowsPerBank}
                onChange={(e) => setConfig({...config, rowsPerBank: Number(e.target.value)})}
                min="1024"
                step="1024"
              />
            </div>

            <div>
              <Label htmlFor="hammerCount">Conteo de Hammer</Label>
              <Input
                id="hammerCount"
                type="number"
                value={config.hammerCount}
                onChange={(e) => setConfig({...config, hammerCount: Number(e.target.value)})}
                min="1000"
                step="1000"
              />
            </div>

            <div>
              <Label htmlFor="rowPairSpacing">Espaciado entre Filas</Label>
              <Input
                id="rowPairSpacing"
                type="number"
                value={config.rowPairSpacing}
                onChange={(e) => setConfig({...config, rowPairSpacing: Number(e.target.value)})}
                min="1"
                max="10"
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
                onClick={simulateRowhammer} 
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
            <CardTitle>Estado de la Simulación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Activaciones Agresoras</div>
                  <div className="text-2xl font-bold text-blue-600">{rowhammer.statistics.aggressorActivations}</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Activaciones Víctimas</div>
                  <div className="text-2xl font-bold text-green-600">{rowhammer.statistics.victimActivations}</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Bit Flips</div>
                  <div className="text-2xl font-bold text-red-600">{rowhammer.statistics.bitFlips}</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Tasa de Flip</div>
                  <div className="text-2xl font-bold text-purple-600">{rowhammer.statistics.flipRate}/M</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Visualización de DRAM</div>
                <div className="relative h-64 bg-gray-50 rounded p-4 overflow-hidden">
                  {/* Simplified DRAM visualization */}
                  <div className="grid grid-cols-8 gap-1 h-full">
                    {rowhammer.banks.slice(0, 8).map(bank => (
                      <div key={bank.id} className="flex flex-col gap-1">
                        {bank.rows.slice(0, 8).map(row => (
                          <div
                            key={row.id}
                            className={`
                              rounded flex items-center justify-center text-xs
                              ${row.id === 0 || row.id === 2 
                                ? "bg-red-500 text-white" 
                                : row.id === 1 
                                  ? "bg-blue-500 text-white" 
                                  : "bg-gray-200 text-gray-700"}
                            `}
                            title={`Banco ${bank.id}, Fila ${row.id}`}
                          >
                            {row.id}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Eventos de Bit Flip</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {rowhammer.banks.slice(0, 1).map(bank => 
                    bank.hammerActivity.flipEvents.slice(-5).map((event, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded flex justify-between">
                        <div>
                          <span className="font-mono">A:{event.aggressorRow}→V:{event.victimRow}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Bit {event.bitPosition}
                        </div>
                      </div>
                    ))
                  )}
                  {rowhammer.banks[0]?.hammerActivity.flipEvents.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No se han detectado bit flips. Ejecute la simulación.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Cómo Funciona Rowhammer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2">Mecanismo de Ataque</div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">1</div>
                  <div>
                    <div className="font-medium">Acceso Repeated a Filas</div>
                    <div className="text-sm text-gray-600">El atacante accede repetidamente a una fila "agresora" de memoria</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">2</div>
                  <div>
                    <div className="font-medium">Interferencia Electromagnética</div>
                    <div className="text-sm text-gray-600">Los accesos repetidos causan interferencia en filas adyacentes</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">3</div>
                  <div>
                    <div className="font-medium">Cambio de Bits</div>
                    <div className="text-sm text-gray-600">La interferencia puede cambiar bits en una fila "víctima"</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">4</div>
                  <div>
                    <div className="font-medium">Explotación</div>
                    <div className="text-sm text-gray-600">El atacante puede usar los cambios para eludir seguridad</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2">Visualización del Proceso</div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium mb-1">Fila Agresora (A)</div>
                  <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white">
                        A
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Accedida repetidamente</div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-medium mb-1">Fila Víctima (V)</div>
                  <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
                        V
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Bits pueden cambiar</div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium mb-1">Efecto:</div>
                  <div className="p-2 bg-red-50 rounded">
                    Los accesos repetidos a la fila A pueden causar cambios en la fila V
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Mitigaciones y Protecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="font-semibold mb-2">Técnicas de Mitigación</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>TRR (Targeted Row Refresh):</strong> Refresca filas vecinas cuando se detectan accesos repetidos.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Refresh más frecuente:</strong> Reduce el intervalo de refresco para minimizar el riesgo.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Usa TRR:</strong> Habilita Targeted Row Refresh en BIOS si está disponible.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Memoria ECC:</strong> Usa memoria con corrección de errores para 
                    detectar y corregir bit flips.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>
                    <strong>Monitoreo:</strong> Implementa monitoreo de accesos a memoria 
                    para detectar patrones de Rowhammer.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}