import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

type CacheState = "M" | "E" | "S" | "O" | "I"
type CacheLine = { id: number; state: CacheState; data: number; owner: number | null }
type Core = { id: number; name: string; cache: CacheLine[] }
type Transaction = {
  id: number
  from: number
  to: number
  type: "read" | "write" | "invalidate" | "flush"
  address: number
  data: number
  timestamp: number
}

export default function CacheCoherencyVisualizer() {
  const [cores, setCores] = useState<Core[]>([
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
    },
    {
      id: 2,
      name: "Core 2",
      cache: [
        { id: 0, state: "I", data: 0, owner: null },
        { id: 1, state: "I", data: 0, owner: null }
      ]
    },
    {
      id: 3,
      name: "Core 3",
      cache: [
        { id: 0, state: "I", data: 0, owner: null },
        { id: 1, state: "I", data: 0, owner: null }
      ]
    }
  ])
  
  const [memory, setMemory] = useState<{address: number, value: number}[]>([
    { address: 0, value: 100 },
    { address: 1, value: 200 }
  ])
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  
  const [stats, setStats] = useState({
    hits: 0,
    misses: 0,
    invalidations: 0,
    flushes: 0
  })
  
  const [protocol, setProtocol] = useState<"mesi" | "moesi">("mesi")
  const [nextId, setNextId] = useState(1)

  // Get state color for visualization
  const getStateColor = (state: CacheState) => {
    switch (state) {
      case "M": return "bg-red-500"
      case "E": return "bg-yellow-500"
      case "S": return "bg-green-500"
      case "O": return "bg-purple-500"
      case "I": return "bg-gray-500"
      default: return "bg-gray-300"
    }
  }

  // Get state name
  const getStateName = (state: CacheState) => {
    switch (state) {
      case "M": return "Modified"
      case "E": return "Exclusive"
      case "S": return "Shared"
      case "O": return "Owned"
      case "I": return "Invalid"
      default: return "Unknown"
    }
  }

  // Perform read operation
  const performRead = (coreId: number, cacheLineId: number) => {
    setCores(prev => {
      const newCores = [...prev]
      const core = newCores.find(c => c.id === coreId)
      if (!core) return prev
      
      const cacheLine = core.cache.find(cl => cl.id === cacheLineId)
      if (!cacheLine) return prev
      
      // Check if valid data exists in cache
      if (cacheLine.state !== "I") {
        // Cache hit
        setStats(stats => ({...stats, hits: stats.hits + 1}))
        return prev
      }
      
      // Cache miss - read from memory or other caches
      const memoryValue = memory.find(m => m.address === cacheLineId)?.value || 0
      cacheLine.data = memoryValue
      cacheLine.state = protocol === "mesi" ? "E" : "E"
      cacheLine.owner = coreId
      
      // Add transaction
      const newTransaction: Transaction = {
        id: nextId,
        from: -1, // From memory
        to: coreId,
        type: "read",
        address: cacheLineId,
        data: memoryValue,
        timestamp: Date.now()
      }
      
      setTransactions(transactions => [...transactions.slice(-9), newTransaction])
      setNextId(id => id + 1)
      setStats(stats => ({...stats, misses: stats.misses + 1}))
      
      return newCores
    })
  }

  // Perform write operation
  const performWrite = (coreId: number, cacheLineId: number) => {
    setCores(prev => {
      const newCores = [...prev]
      const core = newCores.find(c => c.id === coreId)
      if (!core) return prev
      
      const cacheLine = core.cache.find(cl => cl.id === cacheLineId)
      if (!cacheLine) return prev
      
      // Invalidate other copies
      newCores.forEach(otherCore => {
        if (otherCore.id !== coreId) {
          const otherLine = otherCore.cache.find(cl => cl.id === cacheLineId)
          if (otherLine && otherLine.state !== "I") {
            otherLine.state = "I"
            otherLine.owner = null
            
            // Add invalidate transaction
            const newTransaction: Transaction = {
              id: nextId,
              from: coreId,
              to: otherCore.id,
              type: "invalidate",
              address: cacheLineId,
              data: 0,
              timestamp: Date.now()
            }
            
            setTransactions(transactions => [...transactions.slice(-9), newTransaction])
            setNextId(id => id + 1)
            setStats(stats => ({...stats, invalidations: stats.invalidations + 1}))
          }
        }
      })
      
      // Set this core's line to Modified
      cacheLine.state = "M"
      cacheLine.data = cacheLine.data + 1
      cacheLine.owner = coreId
      
      // Add write transaction
      const newTransaction: Transaction = {
        id: nextId,
        from: coreId,
        to: -1, // To memory eventually
        type: "write",
        address: cacheLineId,
        data: cacheLine.data,
        timestamp: Date.now()
      }
      
      setTransactions(transactions => [...transactions.slice(-9), newTransaction])
      setNextId(id => id + 1)
      
      return newCores
    })
  }

  // Flush data to memory
  const flushToMemory = (coreId: number, cacheLineId: number) => {
    setCores(prev => {
      const newCores = [...prev]
      const core = newCores.find(c => c.id === coreId)
      if (!core) return prev
      
      const cacheLine = core.cache.find(cl => cl.id === cacheLineId)
      if (!cacheLine) return prev
      
      // Update memory with new value
      setMemory(prevMemory => 
        prevMemory.map(m => 
          m.address === cacheLineId 
            ? { ...m, value: cacheLine.data } 
            : m
        )
      )
      
      // Add flush transaction
      const newTransaction: Transaction = {
        id: nextId,
        from: coreId,
        to: -1, // To memory
        type: "flush",
        address: cacheLineId,
        data: cacheLine.data,
        timestamp: Date.now()
      }
      
      setTransactions(transactions => [...transactions.slice(-9), newTransaction])
      setNextId(id => id + 1)
      setStats(stats => ({...stats, flushes: stats.flushes + 1}))
      
      return newCores
    })
  }

  // Reset simulation
  const resetSimulation = () => {
    setCores(prev => 
      prev.map(core => ({
        ...core,
        cache: core.cache.map(cl => ({
          ...cl,
          state: "I",
          data: 0,
          owner: null
        }))
      }))
    )
    
    setTransactions([])
    setStats({
      hits: 0,
      misses: 0,
      invalidations: 0,
      flushes: 0
    })
    setNextId(1)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualizador de Coherencia de Caché</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo los protocolos de coherencia mantienen consistencia entre caches
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Protocolo de Coherencia</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={protocol === "mesi" ? "default" : "outline"}
                  onClick={() => setProtocol("mesi")}
                >
                  MESI
                </Button>
                <Button
                  variant={protocol === "moesi" ? "default" : "outline"}
                  onClick={() => setProtocol("moesi")}
                >
                  MOESI
                </Button>
              </div>
            </div>

            <div>
              <Label>Operaciones</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button 
                  onClick={() => performRead(0, 0)} 
                  variant="outline"
                >
                  Core 0 Read
                </Button>
                <Button 
                  onClick={() => performWrite(0, 0)} 
                  variant="outline"
                >
                  Core 0 Write
                </Button>
                <Button 
                  onClick={() => performRead(1, 0)} 
                  variant="outline"
                >
                  Core 1 Read
                </Button>
                <Button 
                  onClick={() => performWrite(1, 0)} 
                  variant="outline"
                >
                  Core 1 Write
                </Button>
                <Button 
                  onClick={() => performRead(2, 1)} 
                  variant="outline"
                >
                  Core 2 Read
                </Button>
                <Button 
                  onClick={() => performWrite(2, 1)} 
                  variant="outline"
                >
                  Core 2 Write
                </Button>
                <Button 
                  onClick={() => performRead(3, 1)} 
                  variant="outline"
                >
                  Core 3 Read
                </Button>
                <Button 
                  onClick={() => performWrite(3, 1)} 
                  variant="outline"
                >
                  Core 3 Write
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetSimulation} 
                variant="outline" 
                className="flex-1"
              >
                Reset
              </Button>
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
                    <CardTitle>{core.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {core.cache.map(cacheLine => (
                        <div 
                          key={cacheLine.id} 
                          className="p-3 bg-gray-50 rounded"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-mono">Línea {cacheLine.id}</div>
                            <Badge 
                              className={`${getStateColor(cacheLine.state)} text-white`}
                            >
                              {getStateName(cacheLine.state)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-gray-500">Datos</div>
                              <div className="font-mono">{cacheLine.data}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Dueño</div>
                              <div>
                                {cacheLine.owner !== null ? `Core ${cacheLine.owner}` : "Ninguno"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => performRead(core.id, cacheLine.id)}
                            >
                              Read
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => performWrite(core.id, cacheLine.id)}
                            >
                              Write
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => flushToMemory(core.id, cacheLine.id)}
                            >
                              Flush
                            </Button>
                          </div>
                        </div>
                      ))}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {memory.map(mem => (
                    <div 
                      key={mem.address} 
                      className="p-3 bg-gray-50 rounded text-center"
                    >
                      <div className="text-xs text-gray-500">Dirección {mem.address}</div>
                      <div className="font-mono text-lg">{mem.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-xs text-gray-500">Aciertos</div>
                <div className="text-2xl font-bold text-green-600">{stats.hits}</div>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="text-xs text-gray-500">Fallos</div>
                <div className="text-2xl font-bold text-red-600">{stats.misses}</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded text-center">
                <div className="text-xs text-gray-500">Invalidaciones</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.invalidations}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500">Flushes</div>
                <div className="text-2xl font-bold text-blue-600">{stats.flushes}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Tasa de Aciertos</span>
                <span>
                  {stats.hits + stats.misses > 0 
                    ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
              <Progress 
                value={stats.hits + stats.misses > 0 
                  ? (stats.hits / (stats.hits + stats.misses)) * 100 
                  : 0} 
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {transactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="p-2 bg-gray-50 rounded flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm">
                        {transaction.type === "read" && "Read"}
                        {transaction.type === "write" && "Write"}
                        {transaction.type === "invalidate" && "Invalidate"}
                        {transaction.type === "flush" && "Flush"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.from === -1 
                          ? "Memory" 
                          : `Core ${transaction.from}`} → 
                        {transaction.to === -1 
                          ? "Memory" 
                          : `Core ${transaction.to}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">
                        Addr: {transaction.address}
                      </div>
                      <div className="text-xs text-gray-500">
                        Data: {transaction.data}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay transacciones registradas todavía</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Protocolos de Coherencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Protocolo MESI</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>M (Modified)</strong>: Datos modificados, único en esta caché</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>E (Exclusive)</strong>: Datos limpios, únicos en esta caché</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>S (Shared)</strong>: Datos limpios, compartidos con otras cachés</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span><strong>I (Invalid)</strong>: Datos inválidos</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Protocolo MOESI</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>M (Modified)</strong>: Datos modificados, único en esta caché</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>O (Owned)</strong>: Datos modificados, pero compartidos con otras cachés</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>E (Exclusive)</strong>: Datos limpios, únicos en esta caché</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>S (Shared)</strong>: Datos limpios, compartidos con otras cachés</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>I (Invalid)</strong>: Datos inválidos</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Ventajas y Diferencias:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>MOESI agrega el estado Owned para manejar datos modificados pero compartidos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>MESI es más simple y usado en muchas implementaciones</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Ambos garantizan coherencia de caché en sistemas multiprocesador</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
