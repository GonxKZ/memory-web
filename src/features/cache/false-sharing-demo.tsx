import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function FalseSharingDemo() {
  const [cores, setCores] = useState([
    { id: 0, counter: 0, lastAccess: 0 },
    { id: 1, counter: 0, lastAccess: 0 },
    { id: 2, counter: 0, lastAccess: 0 },
    { id: 3, counter: 0, lastAccess: 0 }
  ])
  
  const [cacheLines, setCacheLines] = useState([
    { id: 0, data: [0, 0, 0, 0], owners: [] as number[] },
    { id: 1, data: [0, 0, 0, 0], owners: [] as number[] }
  ])
  
  const [stats, setStats] = useState({
    falseSharingEvents: 0,
    cacheInvalidations: 0,
    performanceImpact: 0
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(500)

  // Simulate false sharing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        // Randomly select a core to increment its counter
        const coreId = Math.floor(Math.random() * cores.length)
        
        setCores(prev => 
          prev.map(core => 
            core.id === coreId 
              ? { ...core, counter: core.counter + 1, lastAccess: Date.now() } 
              : core
          )
        )
        
        // Update cache lines
        setCacheLines(prev => {
          // Determine which cache line contains this core's counter
          const lineIndex = Math.floor(coreId / 2)
          const line = prev[lineIndex]
          
          if (line) {
            // Update the counter in the cache line
            const newData = [...line.data]
            newData[coreId % 2] = cores[coreId].counter + 1
            
            // Check for false sharing (if other cores are accessing the same line)
            const otherCoresInLine = cores.filter(
              c => c.id !== coreId && Math.floor(c.id / 2) === lineIndex
            )
            
            if (otherCoresInLine.length > 0) {
              setStats(prevStats => ({
                ...prevStats,
                falseSharingEvents: prevStats.falseSharingEvents + 1,
                cacheInvalidations: prevStats.cacheInvalidations + otherCoresInLine.length
              }))
            }
            
            return prev.map((l, idx) => 
              idx === lineIndex 
                ? { 
                    ...l, 
                    data: newData,
                    owners: [...l.owners, coreId]
                  } 
                : l
            )
          }
          
          return prev
        })
      }, speed)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, speed, cores])

  const startSimulation = () => setIsRunning(true)
  const pauseSimulation = () => setIsRunning(false)
  const resetSimulation = () => {
    setIsRunning(false)
    setCores([
      { id: 0, counter: 0, lastAccess: 0 },
      { id: 1, counter: 0, lastAccess: 0 },
      { id: 2, counter: 0, lastAccess: 0 },
      { id: 3, counter: 0, lastAccess: 0 }
    ])
    setCacheLines([
      { id: 0, data: [0, 0, 0, 0], owners: [] },
      { id: 1, data: [0, 0, 0, 0], owners: [] }
    ])
    setStats({
      falseSharingEvents: 0,
      cacheInvalidations: 0,
      performanceImpact: 0
    })
  }

  // Calculate performance impact
  useEffect(() => {
    if (stats.falseSharingEvents > 0) {
      const impact = Math.min((stats.cacheInvalidations / stats.falseSharingEvents) * 10, 100)
      setStats(prev => ({ ...prev, performanceImpact: impact }))
    }
  }, [stats.falseSharingEvents, stats.cacheInvalidations])

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Demo de False Sharing</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo el false sharing puede impactar negativamente el rendimiento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número de Cores</label>
              <div className="text-center text-lg font-semibold">
                {cores.length}
              </div>
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
            <CardTitle>Estado de Cores y Caché</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {cores.map(core => (
                <Card key={core.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Core {core.id}</span>
                      <Badge variant="secondary">
                        Contador: {core.counter}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">Último acceso</div>
                      <div className="font-mono">
                        {core.lastAccess ? new Date(core.lastAccess).toLocaleTimeString() : "Nunca"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mb-6">
              <div className="font-semibold mb-2">Líneas de Caché</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cacheLines.map(line => (
                  <Card key={line.id}>
                    <CardHeader>
                      <CardTitle>Línea de Caché {line.id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {line.data.map((value, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-center">
                            <div className="text-xs text-gray-500">Core {line.id * 2 + index}</div>
                            <div className="font-mono text-lg">{value}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Dueños actuales</div>
                        <div className="flex flex-wrap gap-1">
                          {line.owners.slice(-3).map(owner => (
                            <Badge key={owner} variant="outline">
                              Core {owner}
                            </Badge>
                          ))}
                          {line.owners.length > 3 && (
                            <Badge variant="outline">
                              +{line.owners.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Estadísticas de False Sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-red-50 rounded text-center">
              <div className="text-xs text-gray-500 mb-1">Eventos de False Sharing</div>
              <div className="text-3xl font-bold text-red-600">{stats.falseSharingEvents}</div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded text-center">
              <div className="text-xs text-gray-500 mb-1">Invalidaciones de Caché</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.cacheInvalidations}</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded text-center">
              <div className="text-xs text-gray-500 mb-1">Impacto en Rendimiento</div>
              <div className="text-3xl font-bold text-purple-600">{stats.performanceImpact.toFixed(1)}%</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Impacto en rendimiento</span>
              <span>{stats.performanceImpact.toFixed(1)}%</span>
            </div>
            <Progress 
              value={stats.performanceImpact} 
              className="w-full" 
              color={stats.performanceImpact > 50 ? "red" : "yellow"}
            />
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Análisis:</div>
            <p className="text-sm text-gray-600">
              {stats.falseSharingEvents === 0 
                ? "No se han detectado eventos de false sharing todavía." 
                : stats.performanceImpact < 20 
                  ? "El impacto del false sharing es bajo. Considera agrupar variables de acceso frecuente juntas." 
                  : stats.performanceImpact < 50 
                    ? "Hay un impacto moderado del false sharing. Considera reorganizar la estructura de datos." 
                    : "Alto impacto del false sharing detectado. Se recomienda reorganizar las variables para evitar compartir líneas de caché entre cores."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}