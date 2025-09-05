import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type CacheState = "M" | "E" | "S" | "I"

interface CacheLine {
  id: number
  state: CacheState
  data: number
  owner: number | null
}
interface Core { id: number; name: string; cache: CacheLine[] }

export default function MESISimulator() {
  const [cores, setCores] = useState<Core[]>([
    {
      id: 0,
      name: "Core 0",
      cache: [
        { id: 0, state: "I" as CacheState, data: 0, owner: null },
        { id: 1, state: "I" as CacheState, data: 0, owner: null }
      ]
    },
    {
      id: 1,
      name: "Core 1",
      cache: [
        { id: 0, state: "I" as CacheState, data: 0, owner: null },
        { id: 1, state: "I" as CacheState, data: 0, owner: null }
      ]
    }
  ])

  const getStateColor = (state: CacheState) => {
    switch (state) {
      case "M": return "bg-red-500"
      case "E": return "bg-yellow-500"
      case "S": return "bg-green-500"
      case "I": return "bg-gray-500"
      default: return "bg-gray-500"
    }
  }

  const getStateName = (state: CacheState) => {
    switch (state) {
      case "M": return "Modified"
      case "E": return "Exclusive"
      case "S": return "Shared"
      case "I": return "Invalid"
      default: return "Unknown"
    }
  }

  const performRead = (coreId: number, lineId: number) => {
    setCores(prev => {
      const newCores = [...prev]
      const core = newCores.find(c => c.id === coreId)
      if (!core) return prev
      
      const line = core.cache.find(l => l.id === lineId)
      if (!line) return prev
      
      // If line is invalid, load from memory (simulate)
      if (line.state === "I") {
        line.state = "E" // Exclusive state after load
        line.data = Math.floor(Math.random() * 100)
        line.owner = coreId
      } else if (line.state === "M" || line.state === "E") {
        // Already have exclusive access (no-op)
      } else if (line.state === "S") {
        // Already shared (no-op)
      }
      
      return newCores
    })
  }

  const performWrite = (coreId: number, lineId: number) => {
    setCores(prev => {
      const newCores = [...prev]
      const core = newCores.find(c => c.id === coreId)
      if (!core) return prev
      
      const line = core.cache.find(l => l.id === lineId)
      if (!line) return prev
      
      // Invalidate other copies if needed
      newCores.forEach(otherCore => {
        if (otherCore.id !== coreId) {
          const otherLine = otherCore.cache.find(l => l.id === lineId)
          if (otherLine && otherLine.state !== "I") {
            otherLine.state = "I"
            otherLine.owner = null
          }
        }
      })
      
      // Set this core's line to Modified
      line.state = "M"
      line.data = line.data + 1
      line.owner = coreId
      
      return newCores
    })
  }

  const resetSimulation = () => {
    setCores([
      {
        id: 0,
        name: "Core 0",
        cache: [
          { id: 0, state: "I", data: 0, owner: null },
          { id: 1, state: "I", data: 0, owner: null }
        ]
      },
      {
        id: 1,
        name: "Core 1",
        cache: [
          { id: 0, state: "I", data: 0, owner: null },
          { id: 1, state: "I", data: 0, owner: null }
        ]
      }
    ])
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Simulador MESI</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo funciona el protocolo de coherencia de caché MESI
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-4">
        <Button onClick={resetSimulation}>Resetear Simulación</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cores.map(core => (
          <Card key={core.id}>
            <CardHeader>
              <CardTitle>{core.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {core.cache.map(line => (
                  <div 
                    key={line.id} 
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-mono">Línea {line.id}</div>
                      <Badge 
                        className={`${getStateColor(line.state as CacheState)} text-white`}
                      >
                        {getStateName(line.state as CacheState)}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Datos</div>
                      <div className="font-mono text-lg">{line.data}</div>
                    </div>
                    
                    {line.owner !== null && (
                      <div className="text-sm text-gray-500 mb-3">
                        Dueño: Core {line.owner}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => performRead(core.id, line.id)}
                      >
                        Leer
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => performWrite(core.id, line.id)}
                      >
                        Escribir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Leyenda de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Modified (M): Datos modificados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Exclusive (E): Datos exclusivos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Shared (S): Datos compartidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>Invalid (I): Datos inválidos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
