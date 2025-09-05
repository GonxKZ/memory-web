import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function StrideLab() {
  const [stride, setStride] = useState<number>(1)
  const [workingSet, setWorkingSet] = useState<number>(1024)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [stats, setStats] = useState({
    hits: 0,
    misses: 0,
    totalTime: 0
  })

  // Simulate cache access pattern
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            setIsRunning(false)
            return 100
          }
          return newProgress
        })
        
        // Simulate cache hit/miss based on stride
        if (Math.random() > 0.5) {
          setStats(prev => ({
            ...prev,
            hits: prev.hits + 1,
            totalTime: prev.totalTime + 1
          }))
        } else {
          setStats(prev => ({
            ...prev,
            misses: prev.misses + 1,
            totalTime: prev.totalTime + 10
          }))
        }
      }, 100)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setStats({
      hits: 0,
      misses: 0,
      totalTime: 0
    })
  }

  const hitRate = stats.hits + stats.misses > 0 
    ? (stats.hits / (stats.hits + stats.misses) * 100).toFixed(1)
    : "0"

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Laboratorio de Stride</h1>
        <p className="text-gray-600 mt-2">
          Experimenta con diferentes patrones de acceso y su impacto en la caché
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Parámetros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="stride">Stride (saltos)</Label>
              <Input
                id="stride"
                type="number"
                value={stride}
                onChange={(e) => setStride(Number(e.target.value))}
                min="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Distancia entre accesos consecutivos
              </p>
            </div>

            <div>
              <Label htmlFor="workingSet">Tamaño del Working Set (bytes)</Label>
              <Input
                id="workingSet"
                type="number"
                value={workingSet}
                onChange={(e) => setWorkingSet(Number(e.target.value))}
                min="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Cantidad total de datos accedidos
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1"
              >
                {isRunning ? "Pausar" : "Iniciar"}
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
            <CardTitle>Simulación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded text-center">
                <div className="text-2xl font-bold text-green-600">{stats.hits}</div>
                <div className="text-sm text-gray-600">Aciertos</div>
              </div>
              <div className="p-4 bg-red-50 rounded text-center">
                <div className="text-2xl font-bold text-red-600">{stats.misses}</div>
                <div className="text-sm text-gray-600">Fallos</div>
              </div>
              <div className="p-4 bg-blue-50 rounded text-center">
                <div className="text-2xl font-bold text-blue-600">{hitRate}%</div>
                <div className="text-sm text-gray-600">Tasa de aciertos</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Análisis</h3>
              <p className="text-sm text-gray-600">
                {stride === 1 
                  ? "Stride 1 (acceso secuencial) generalmente tiene la mejor tasa de aciertos." 
                  : stride < 8 
                    ? "Stride medio puede tener buen rendimiento dependiendo del tamaño de línea." 
                    : "Stride grande puede provocar muchos fallos de caché debido a saltos amplios."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}