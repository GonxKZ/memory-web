import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

export default function BranchPredictionVisualization() {
  const [config, setConfig] = useState({
    predictorType: "bht" as "bht" | "pht" | "tournament" | "neural",
    historyLength: 2,
    bufferSize: 1024,
    branchPattern: "alternating" as "alternating" | "loop" | "random" | "sequential"
  })
  
  const [prediction, setPrediction] = useState({
    taken: true,
    predicted: true,
    correct: true,
    history: [] as number[]
  })
  
  const [stats, setStats] = useState({
    totalPredictions: 0,
    correctPredictions: 0,
    mispredictions: 0,
    accuracy: 0,
    branchesTaken: 0,
    branchesNotTaken: 0
  })
  
  const [history, setHistory] = useState<{
    branch: boolean,
    prediction: boolean,
    outcome: boolean,
    correct: boolean
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Branch predictor implementations
  const predictBranch = (history: number[], predictorType: string): boolean => {
    // Simple prediction based on pattern and history
    switch (predictorType) {
      case "bht": {
        // Branch History Table - use last N branches
        const lastBranches = history.slice(-config.historyLength)
        const sum = lastBranches.reduce((acc, val) => acc + val, 0)
        return sum > lastBranches.length / 2 // Predict taken if majority of recent branches were taken
      }
      case "pht": {
        // Pattern History Table - more sophisticated pattern recognition
        if (history.length < config.historyLength) return Math.random() > 0.5
        const pattern = history.slice(-config.historyLength).join('')
        // Simple pattern matching
        return pattern.includes('1') // Predict taken if any recent branch was taken
      }
      case "tournament": {
        // Tournament predictor - combines multiple predictors
        const bhtPred: boolean = predictBranch(history, "bht")
        const phtPred: boolean = predictBranch(history, "pht")
        // Simple tournament - weighted average
        return Math.random() > 0.5 ? bhtPred : phtPred
      }
      case "neural": {
        // Neural predictor - simplified neural network approach
        if (history.length === 0) return Math.random() > 0.5
        // Simple perceptron-like prediction
        const weights = Array(config.historyLength).fill(0.5)
        const inputs = history.slice(-config.historyLength)
        const weightedSum = inputs.reduce((sum, input, index) => sum + input * weights[index], 0)
        return weightedSum > config.historyLength * 0.25
      }
      default:
        return Math.random() > 0.5
    }
  }

  // Generate branch outcome based on pattern
  const generateBranchOutcome = (iteration: number) => {
    switch (config.branchPattern) {
      case "alternating":
        return iteration % 2 === 0 // Alternates between taken/not-taken
        
      case "loop":
        // Simulates loop behavior - mostly taken except last iteration
        return iteration % 10 !== 9 // Taken 9 out of 10 times
        
      case "random":
        return Math.random() > 0.5 // Random pattern
        
      case "sequential":
        // Mostly taken with occasional not-taken
        return Math.random() > 0.2 // 80% taken
        
      default:
        return Math.random() > 0.5
    }
  }

  // Run branch prediction simulation
  const runSimulation = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    setStats({
      totalPredictions: 0,
      correctPredictions: 0,
      mispredictions: 0,
      accuracy: 0,
      branchesTaken: 0,
      branchesNotTaken: 0
    })
    
    const newHistory = []
    const historyBuffer: number[] = []
    let correctPredictions = 0
    let totalPredictions = 0
    let branchesTaken = 0
    let branchesNotTaken = 0
    
    // Simulate branch predictions
    for (let i = 0; i < config.bufferSize; i++) {
      setProgress((i / config.bufferSize) * 100)
      
      // Generate branch outcome
      const branchOutcome = generateBranchOutcome(i)
      if (branchOutcome) {
        branchesTaken++
      } else {
        branchesNotTaken++
      }
      
      // Make prediction
      const prediction = predictBranch(historyBuffer, config.predictorType)
      
      // Check if prediction was correct
      const correct = prediction === branchOutcome
      if (correct) {
        correctPredictions++
      }
      
      totalPredictions++
      
      // Update history buffer
      historyBuffer.push(branchOutcome ? 1 : 0)
      if (historyBuffer.length > config.historyLength) {
        historyBuffer.shift()
      }
      
      // Add to history
      newHistory.push({
        branch: branchOutcome,
        prediction,
        outcome: branchOutcome,
        correct
      })
      
      // Update stats every 10 iterations
      if (i % 10 === 0) {
        const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0
        setStats({
          totalPredictions,
          correctPredictions,
          mispredictions: totalPredictions - correctPredictions,
          accuracy: parseFloat(accuracy.toFixed(2)),
          branchesTaken,
          branchesNotTaken
        })
        
        setHistory(newHistory.slice(-50)) // Keep last 50 entries
      }
      
      // Add small delay to visualize
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    // Final update
    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0
    setStats({
      totalPredictions,
      correctPredictions,
      mispredictions: totalPredictions - correctPredictions,
      accuracy: parseFloat(accuracy.toFixed(2)),
      branchesTaken,
      branchesNotTaken
    })
    
    setHistory(newHistory)
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setStats({
      totalPredictions: 0,
      correctPredictions: 0,
      mispredictions: 0,
      accuracy: 0,
      branchesTaken: 0,
      branchesNotTaken: 0
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Predicción de Saltos</h1>
        <p className="text-gray-600 mt-2">
          Entiende cómo los predictores de saltos mejoran el rendimiento de la CPU
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="predictorType">Tipo de Predictor</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.predictorType === "bht" ? "default" : "outline"}
                  onClick={() => setConfig({...config, predictorType: "bht"})}
                >
                  BHT
                </Button>
                <Button
                  variant={config.predictorType === "pht" ? "default" : "outline"}
                  onClick={() => setConfig({...config, predictorType: "pht"})}
                >
                  PHT
                </Button>
                <Button
                  variant={config.predictorType === "tournament" ? "default" : "outline"}
                  onClick={() => setConfig({...config, predictorType: "tournament"})}
                >
                  Torneo
                </Button>
                <Button
                  variant={config.predictorType === "neural" ? "default" : "outline"}
                  onClick={() => setConfig({...config, predictorType: "neural"})}
                >
                  Red Neuronal
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="historyLength">Longitud del Historial</Label>
              <Input
                id="historyLength"
                type="number"
                value={config.historyLength}
                onChange={(e) => setConfig({...config, historyLength: Number(e.target.value)})}
                min="1"
                max="10"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="bufferSize">Tamaño del Búfer</Label>
              <Input
                id="bufferSize"
                type="number"
                value={config.bufferSize}
                onChange={(e) => setConfig({...config, bufferSize: Number(e.target.value)})}
                min="100"
                max="10000"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="branchPattern">Patrón de Saltos</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.branchPattern === "alternating" ? "default" : "outline"}
                  onClick={() => setConfig({...config, branchPattern: "alternating"})}
                >
                  Alternante
                </Button>
                <Button
                  variant={config.branchPattern === "loop" ? "default" : "outline"}
                  onClick={() => setConfig({...config, branchPattern: "loop"})}
                >
                  Bucle
                </Button>
                <Button
                  variant={config.branchPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, branchPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.branchPattern === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, branchPattern: "sequential"})}
                >
                  Secuencial
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={runSimulation} 
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
            <CardTitle>Resultados de la Simulación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Predicciones Totales</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalPredictions.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Predicciones Correctas</div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.correctPredictions.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Errores de Predicción</div>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.mispredictions.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Precisión</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.accuracy}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-yellow-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Saltos Tomados</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.branchesTaken.toLocaleString()}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Saltos No Tomados</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {stats.branchesNotTaken.toLocaleString()}
                  </div>
                </div>
              </div>

              {history.length > 0 && (
                <div>
                  <div className="font-semibold mb-2">Historial Reciente</div>
                  <div className="flex flex-wrap gap-1">
                    {history.slice(-50).map((entry, index) => (
                      <div
                        key={index}
                        className={`
                          w-6 h-6 rounded flex items-center justify-center text-xs font-mono
                          ${entry.correct 
                            ? entry.prediction 
                              ? "bg-green-500 text-white" 
                              : "bg-blue-500 text-white"
                            : "bg-red-500 text-white"}
                        `}
                        title={
                          `Predicción: ${entry.prediction ? "Tomado" : "No tomado"}
` +
                          `Resultado: ${entry.outcome ? "Tomado" : "No tomado"}
` +
                          `Correcto: ${entry.correct ? "Sí" : "No"}`
                        }
                      >
                        {entry.prediction ? "T" : "N"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="font-semibold mb-2">Precisión por Predictor</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500">BHT</div>
                    <div className="font-semibold text-blue-600">
                      {config.predictorType === "bht" ? `${stats.accuracy}%` : "-"}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500">PHT</div>
                    <div className="font-semibold text-green-600">
                      {config.predictorType === "pht" ? `${stats.accuracy}%` : "-"}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500">Torneo</div>
                    <div className="font-semibold text-purple-600">
                      {config.predictorType === "tournament" ? `${stats.accuracy}%` : "-"}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-500">Neuronal</div>
                    <div className="font-semibold text-red-600">
                      {config.predictorType === "neural" ? `${stats.accuracy}%` : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tipos de Predictores de Saltos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <span className="mr-2 text-xl">📊</span>
                  BHT (Branch History Table)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Utiliza un historial de resultados pasados para predecir futuros saltos
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Simple de implementar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Efectivo para patrones regulares</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Limitado por tamaño del historial</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Puede fallar con patrones complejos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <span className="mr-2 text-xl">🧩</span>
                  PHT (Pattern History Table)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Mantiene patrones de saltos para mejorar la precisión de predicción
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Mejor precisión que BHT</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Reconoce patrones complejos</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Más complejo de implementar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Mayor consumo de recursos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <span className="mr-2 text-xl">🏆</span>
                  Predictor de Torneo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Combina múltiples predictores y selecciona el mejor para cada situación
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Adaptable a diferentes patrones</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Mejor precisión general</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Mayor latencia de predicción</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Complejidad adicional</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <span className="mr-2 text-xl">🤖</span>
                  Predictor Neuronal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Usa redes neuronales para aprender patrones complejos de saltos
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Extremadamente preciso</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Aprende patrones nuevos automáticamente</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Muy complejo de implementar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Alto consumo de energía</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos para Mejorar la Predicción:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Escribe código con patrones de salto predecibles</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Evita saltos condicionales complejos en bucles críticos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa compiladores optimizadores que reorganicen el código</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Considera técnicas como loop unrolling para reducir saltos</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
