import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

export default function DRAMBankMatrix() {
  const [config, setConfig] = useState({
    banks: 4,
    rows: 8,
    cols: 8,
    pageSize: 4096
  })
  
  const [accesses, setAccesses] = useState<{bank: number, row: number, col: number, type: string}[]>([])
  const [_currentAccess, setCurrentAccess] = useState(0)

  // Simulate memory access pattern
  const simulateAccess = () => {
    const bank = Math.floor(Math.random() * config.banks)
    const row = Math.floor(Math.random() * config.rows)
    const col = Math.floor(Math.random() * config.cols)
    const type = Math.random() > 0.7 ? "write" : "read"
    
    setAccesses(prev => [...prev, {bank, row, col, type}])
    setCurrentAccess(prev => prev + 1)
  }

  const resetSimulation = () => {
    setAccesses([])
    setCurrentAccess(0)
  }

  // Calculate bank conflicts
  const bankConflicts = accesses.reduce((conflicts, access, index) => {
    if (index === 0) return conflicts
    
    const prev = accesses[index - 1]
    if (prev.bank === access.bank) {
      return conflicts + 1
    }
    return conflicts
  }, 0)

  const conflictRate = accesses.length > 1 
    ? ((bankConflicts / (accesses.length - 1)) * 100).toFixed(1)
    : "0"

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Matriz de Bancos DRAM</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo se organizan los bancos de memoria DRAM
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="banks">Número de Bancos</Label>
              <Input
                id="banks"
                type="number"
                value={config.banks}
                onChange={(e) => setConfig({...config, banks: Number(e.target.value)})}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="rows">Número de Filas</Label>
              <Input
                id="rows"
                type="number"
                value={config.rows}
                onChange={(e) => setConfig({...config, rows: Number(e.target.value)})}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="cols">Número de Columnas</Label>
              <Input
                id="cols"
                type="number"
                value={config.cols}
                onChange={(e) => setConfig({...config, cols: Number(e.target.value)})}
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={simulateAccess} className="flex-1">
                Simular Acceso
              </Button>
              <Button onClick={resetSimulation} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualización de Bancos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: config.banks }).map((_, bankIndex) => (
                <Card key={bankIndex}>
                  <CardHeader>
                    <CardTitle className="text-sm">Banco {bankIndex}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: config.rows * config.cols }).map((_, cellIndex) => {
                        const row = Math.floor(cellIndex / config.cols)
                        const col = cellIndex % config.cols
                        
                        // Check if this cell was recently accessed
                        const recentAccess = accesses.slice(-5).find(access => 
                          access.bank === bankIndex && 
                          access.row === row && 
                          access.col === col
                        )
                        
                        return (
                          <div
                            key={cellIndex}
                            className={`
                              w-6 h-6 rounded text-xs flex items-center justify-center
                              ${recentAccess 
                                ? recentAccess.type === "write" 
                                  ? "bg-red-500 text-white" 
                                  : "bg-blue-500 text-white"
                                : "bg-gray-100"}
                            `}
                            title={`Fila: ${row}, Col: ${col}`}
                          >
                            {recentAccess ? (recentAccess.type === "write" ? "W" : "R") : ""}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500">Accesos</div>
                <div className="text-xl font-bold">{accesses.length}</div>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="text-xs text-gray-500">Conflictos</div>
                <div className="text-xl font-bold">{bankConflicts}</div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-xs text-gray-500">Tasa de Conflictos</div>
                <div className="text-xl font-bold">{conflictRate}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Accesos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {accesses.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {accesses.slice(-10).map((access, index) => (
                <Badge 
                  key={index} 
                  className={access.type === "write" ? "bg-red-500" : "bg-blue-500"}
                >
                  B{access.bank}:R{access.row}:C{access.col} ({access.type})
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay accesos simulados todavía. Haz clic en "Simular Acceso" para comenzar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
