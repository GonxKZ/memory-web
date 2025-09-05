import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StoreLoadLab() {
  const [cores, setCores] = useState([
    { id: 0, value: 0, lastOp: null as "store" | "load" | null },
    { id: 1, value: 0, lastOp: null as "store" | "load" | null }
  ])
  
  const [memory, setMemory] = useState<{[key: number]: number}>({ 0: 0, 1: 0 })
  const [consistencyModel, setConsistencyModel] = useState<"sc" | "tso" | "weak">("sc")
  const [results, setResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const store = (coreId: number, address: number, value: number) => {
    setCores(prev => 
      prev.map(core => 
        core.id === coreId 
          ? { ...core, value, lastOp: "store" } 
          : core
      )
    )
    
    // In SC model, stores are immediately visible
    if (consistencyModel === "sc") {
      setMemory(prev => ({ ...prev, [address]: value }))
      setResults(prev => [...prev, `Core ${coreId} almacenó ${value} en dirección ${address}`])
    } else {
      // In weaker models, stores may not be immediately visible
      setResults(prev => [...prev, `Core ${coreId} almacenó ${value} en dirección ${address} (pendiente de commit)`])
    }
  }

  const load = (coreId: number, address: number) => {
    const value = memory[address] || 0
    setCores(prev => 
      prev.map(core => 
        core.id === coreId 
          ? { ...core, value, lastOp: "load" } 
          : core
      )
    )
    setResults(prev => [...prev, `Core ${coreId} cargó ${value} desde dirección ${address}`])
  }

  const commitStores = () => {
    // Make all pending stores visible
    setResults(prev => [...prev, "Todos los stores pendientes han sido commiteados"])
  }

  const resetSimulation = () => {
    setCores([
      { id: 0, value: 0, lastOp: null },
      { id: 1, value: 0, lastOp: null }
    ])
    setMemory({ 0: 0, 1: 0 })
    setResults([])
    setIsRunning(false)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Laboratorio Store/Load</h1>
        <p className="text-gray-600 mt-2">
          Experimenta con diferentes modelos de consistencia de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Modelo de Consistencia</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={consistencyModel === "sc" ? "default" : "outline"}
                  onClick={() => setConsistencyModel("sc")}
                >
                  SC
                </Button>
                <Button
                  variant={consistencyModel === "tso" ? "default" : "outline"}
                  onClick={() => setConsistencyModel("tso")}
                >
                  TSO
                </Button>
                <Button
                  variant={consistencyModel === "weak" ? "default" : "outline"}
                  onClick={() => setConsistencyModel("weak")}
                >
                  Débil
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={resetSimulation} className="flex-1">
                Reset
              </Button>
              {consistencyModel !== "sc" && (
                <Button onClick={commitStores} variant="outline">
                  Commit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {cores.map(core => (
                <Card key={core.id}>
                  <CardHeader>
                    <CardTitle>Core {core.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500">Última operación</div>
                        <div className="font-semibold">
                          {core.lastOp === "store" ? "Store" : core.lastOp === "load" ? "Load" : "Ninguna"}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500">Valor actual</div>
                        <div className="text-2xl font-mono">{core.value}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          onClick={() => store(core.id, 0, Math.floor(Math.random() * 100))}
                          variant="outline"
                        >
                          Store Dir 0
                        </Button>
                        <Button 
                          onClick={() => load(core.id, 0)}
                          variant="outline"
                        >
                          Load Dir 0
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Memoria Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Dirección 0</div>
                    <div className="text-2xl font-mono">{memory[0]}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Dirección 1</div>
                    <div className="text-2xl font-mono">{memory[1]}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resultados y Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {consistencyModel === "sc" && "Consistencia Secuencial"}
                {consistencyModel === "tso" && "Orden Total de Almacenamiento"}
                {consistencyModel === "weak" && "Consistencia Débil"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {consistencyModel === "sc" && 
                "En SC, todas las operaciones parecen ocurrir en un orden global secuencial."}
              {consistencyModel === "tso" && 
                "En TSO, los stores se ven en orden global, pero pueden reordenarse con loads."}
              {consistencyModel === "weak" && 
                "En modelos débiles, no hay garantías fuertes de orden excepto dentro de un hilo."}
            </p>
          </div>

          <div className="h-48 overflow-y-auto border rounded p-3 bg-gray-50">
            {results.length > 0 ? (
              <ul className="space-y-1">
                {results.map((result, index) => (
                  <li key={index} className="text-sm">
                    <span className="text-gray-500 mr-2">[{index + 1}]</span>
                    {result}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay resultados aún. Realiza algunas operaciones para ver los resultados aquí.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}