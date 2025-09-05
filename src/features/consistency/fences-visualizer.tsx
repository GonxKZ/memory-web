import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function FencesVisualizer() {
  const [operations, setOperations] = useState<{id: number, type: "load" | "store" | "fence", executed: boolean}[]>([
    { id: 1, type: "load", executed: false },
    { id: 2, type: "store", executed: false },
    { id: 3, type: "fence", executed: false },
    { id: 4, type: "load", executed: false },
    { id: 5, type: "store", executed: false }
  ])
  
  const [reorderedOps, setReorderedOps] = useState<{id: number, type: "load" | "store" | "fence", executed: boolean}[]>([])
  const [fenceType, setFenceType] = useState<"mfence" | "lfence" | "sfence">("mfence")
  const [model, setModel] = useState<"sc" | "tso" | "weak">("tso")

  const executeNext = () => {
    setOperations(prev => {
      const nextOp = prev.find(op => !op.executed)
      if (!nextOp) return prev
      
      // Move to reordered list
      const updated = prev.map(op => 
        op.id === nextOp.id ? { ...op, executed: true } : op
      )
      
      setReorderedOps(prevReordered => [...prevReordered, { ...nextOp, executed: true }])
      return updated
    })
  }

  const resetSimulation = () => {
    setOperations([
      { id: 1, type: "load", executed: false },
      { id: 2, type: "store", executed: false },
      { id: 3, type: "fence", executed: false },
      { id: 4, type: "load", executed: false },
      { id: 5, type: "store", executed: false }
    ])
    setReorderedOps([])
  }

  const getTypeColor = (type: "load" | "store" | "fence") => {
    switch (type) {
      case "load": return "bg-blue-500"
      case "store": return "bg-red-500"
      case "fence": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getTypeName = (type: "load" | "store" | "fence") => {
    switch (type) {
      case "load": return "Load"
      case "store": return "Store"
      case "fence": return "Fence"
      default: return "Unknown"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualizador de Fences</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo las barreras de memoria previenen reordenamientos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de Fence</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={fenceType === "mfence" ? "default" : "outline"}
                  onClick={() => setFenceType("mfence")}
                >
                  MFENCE
                </Button>
                <Button
                  variant={fenceType === "lfence" ? "default" : "outline"}
                  onClick={() => setFenceType("lfence")}
                >
                  LFENCE
                </Button>
                <Button
                  variant={fenceType === "sfence" ? "default" : "outline"}
                  onClick={() => setFenceType("sfence")}
                >
                  SFENCE
                </Button>
              </div>
            </div>

            <div>
              <Label>Modelo de Consistencia</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={model === "sc" ? "default" : "outline"}
                  onClick={() => setModel("sc")}
                >
                  SC
                </Button>
                <Button
                  variant={model === "tso" ? "default" : "outline"}
                  onClick={() => setModel("tso")}
                >
                  TSO
                </Button>
                <Button
                  variant={model === "weak" ? "default" : "outline"}
                  onClick={() => setModel("weak")}
                >
                  Débil
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={executeNext} className="flex-1">
                Ejecutar Siguiente
              </Button>
              <Button onClick={resetSimulation} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Secuencia de Operaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="font-semibold mb-2">Program Order:</div>
              <div className="flex flex-wrap gap-2">
                {operations.map(op => (
                  <div
                    key={op.id}
                    className={`
                      px-4 py-2 rounded flex items-center gap-2
                      ${getTypeColor(op.type)} text-white
                      ${op.executed ? "opacity-50" : ""}
                    `}
                  >
                    <span>{op.id}</span>
                    <span>{getTypeName(op.type)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Execution Order:</div>
              <div className="flex flex-wrap gap-2">
                {reorderedOps.length > 0 ? (
                  reorderedOps.map(op => (
                    <div
                      key={op.id}
                      className={`
                        px-4 py-2 rounded flex items-center gap-2
                        ${getTypeColor(op.type)} text-white
                      `}
                    >
                      <span>{op.id}</span>
                      <span>{getTypeName(op.type)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No se han ejecutado operaciones todavía
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-2">Análisis:</div>
              <p className="text-sm text-gray-600">
                {model === "sc" && 
                  "En SC, las operaciones se ejecutan en orden secuencial sin reordenamiento."}
                {model === "tso" && 
                  "En TSO, los stores pueden reordenarse con loads posteriores, pero no entre sí."}
                {model === "weak" && 
                  "En modelos débiles, hay pocas garantías de orden excepto las impuestas por fences."}
              </p>
              
              <p className="text-sm text-gray-600 mt-2">
                {fenceType === "mfence" && 
                  "MFENCE previene cualquier reordenamiento antes y después de la barrera."}
                {fenceType === "lfence" && 
                  "LFENCE previene que loads posteriores se reordenen antes de la barrera."}
                {fenceType === "sfence" && 
                  "SFENCE previene que stores posteriores se reordenen antes de la barrera."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tipos de Fences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">MFENCE</div>
              <p className="text-sm text-blue-700">
                Serializes all load and store operations that precede the MFENCE 
                instruction with all load and store operations that follow it.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">LFENCE</div>
              <p className="text-sm text-green-700">
                Serializes all load operations that precede the LFENCE instruction 
                with all load operations that follow it.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">SFENCE</div>
              <p className="text-sm text-yellow-700">
                Serializes all store operations that precede the SFENCE instruction 
                with all store operations that follow it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
