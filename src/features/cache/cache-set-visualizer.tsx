import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CacheLine } from "@/components/cache-line"

export default function CacheSetVisualizer() {
  const [address, setAddress] = useState<number>(0)
  const [config, setConfig] = useState({
    lineSize: 64,
    sets: 4,
    ways: 2,
  })

  // Calculate cache set index from address
  const getCacheSet = (addr: number) => {
    const offsetBits = Math.log2(config.lineSize)
    const indexBits = Math.log2(config.sets)
    return (addr >> offsetBits) & ((1 << indexBits) - 1)
  }

  const cacheSet = getCacheSet(address)

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualizador de Conjunto de Caché</h1>
        <p className="text-gray-600 mt-2">
          Entiende cómo se mapean las direcciones a conjuntos de caché
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Dirección (decimal)</Label>
              <Input
                id="address"
                type="number"
                value={address}
                onChange={(e) => setAddress(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="lineSize">Tamaño de línea (bytes)</Label>
              <Input
                id="lineSize"
                type="number"
                value={config.lineSize}
                onChange={(e) => setConfig({...config, lineSize: Number(e.target.value)})}
              />
            </div>

            <div>
              <Label htmlFor="sets">Número de conjuntos</Label>
              <Input
                id="sets"
                type="number"
                value={config.sets}
                onChange={(e) => setConfig({...config, sets: Number(e.target.value)})}
              />
            </div>

            <div>
              <Label htmlFor="ways">Vías (asociatividad)</Label>
              <Input
                id="ways"
                type="number"
                value={config.ways}
                onChange={(e) => setConfig({...config, ways: Number(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="font-mono">
                Dirección: 0x{address.toString(16).toUpperCase().padStart(8, '0')}
              </div>
              <div className="mt-2">
                Conjunto: <span className="font-bold">{cacheSet}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: config.sets }).map((_, index) => (
                <Card 
                  key={index} 
                  className={index === cacheSet ? "ring-2 ring-blue-500" : ""}
                >
                  <CardHeader>
                    <CardTitle>Conjunto {index}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from({ length: config.ways }).map((_, way) => (
                        <CacheLine 
                          key={way} 
                          tag={index === cacheSet ? 0x1234 : null} 
                          index={way} 
                          valid={index === cacheSet} 
                          dirty={false} 
                          lastAccessed={0} 
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}