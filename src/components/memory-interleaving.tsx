import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InterleavingTypeProps {
  type: "bit" | "word" | "page" | "bank"
  name: string
  description: string
  interleavingFactor: number
  bandwidthImprovement: number
  latencyImpact: string
  useCases: string[]
}

export function InterleavingType({ 
  type,
  name,
  description,
  interleavingFactor,
  bandwidthImprovement,
  latencyImpact,
  useCases
}: InterleavingTypeProps) {
  // Type icons and colors
  const typeInfo = {
    "bit": {
      icon: "🔬",
      color: "#3b82f6"
    },
    "word": {
      icon: "📝",
      color: "#10b981"
    },
    "page": {
      icon: "📄",
      color: "#8b5cf6"
    },
    "bank": {
      icon: "🏦",
      color: "#f59e0b"
    }
  }

  const currentType = typeInfo[type]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentType.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentType.color }}
      >
        <span className="mr-2 text-xl">{currentType.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Factor de interleaving</div>
            <div className="font-semibold">{interleavingFactor}:1</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Mejora de ancho de banda</div>
            <div className="font-semibold">{bandwidthImprovement}%</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Impacto en latencia</div>
            <div className="font-semibold">{latencyImpact}</div>
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Casos de uso:</div>
          <ul className="space-y-1">
            {useCases.map((useCase, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="mr-1">•</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

interface MemoryInterleavingProps {
  interleavingTypes: {
    type: "bit" | "word" | "page" | "bank"
    name: string
    description: string
    interleavingFactor: number
    bandwidthImprovement: number
    latencyImpact: string
    useCases: string[]
  }[]
}

export function MemoryInterleaving({ interleavingTypes }: MemoryInterleavingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🔀</span>
          Interleaving de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es el interleaving?</div>
          <div className="text-sm text-blue-700 mt-1">
            El interleaving distribuye los datos entre múltiples módulos de 
            memoria para mejorar el ancho de banda y reducir la latencia.
          </div>
        </div>
        
        <div className="space-y-3">
          {interleavingTypes.map((interleavingType, index) => (
            <InterleavingType
              key={index}
              type={interleavingType.type}
              name={interleavingType.name}
              description={interleavingType.description}
              interleavingFactor={interleavingType.interleavingFactor}
              bandwidthImprovement={interleavingType.bandwidthImprovement}
              latencyImpact={interleavingType.latencyImpact}
              useCases={interleavingType.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface InterleavingVisualizationProps {
  modules: number
  accessPattern: number[]
  interleavedPattern: number[]
  currentTime: number
  onTimeChange: (time: number) => void
}

export function InterleavingVisualization({ 
  modules,
  accessPattern,
  interleavedPattern,
  currentTime,
  onTimeChange
}: InterleavingVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">📊</span>
          Visualización de Interleaving
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Patrones de acceso</div>
          <div className="text-sm text-green-700 mt-1">
            Visualiza cómo el interleaving distribuye los accesos entre módulos.
          </div>
        </div>
        
        <div className="mb-6">
          <div className="font-semibold mb-2">Patrón secuencial:</div>
          <div className="flex flex-wrap gap-2">
            {accessPattern.map((address, index) => (
              <div
                key={index}
                className={`
                  w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                  ${index <= currentTime 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700"}
                `}
              >
                {address}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="font-semibold mb-2">Patrón interleaved:</div>
          <div className="flex flex-wrap gap-2">
            {interleavedPattern.map((address, index) => (
              <div
                key={index}
                className={`
                  w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                  ${index <= currentTime 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-700"}
              `}
              >
                {address}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold mb-2">Módulos de memoria:</div>
            <div className="space-y-2">
              {Array.from({ length: modules }).map((_, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="font-semibold mb-1">Módulo {index}</div>
                  <div className="flex flex-wrap gap-1">
                    {interleavedPattern
                      .filter((_, i) => i % modules === index)
                      .slice(0, Math.floor(currentTime / modules) + 1)
                      .map((address, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center text-xs"
                        >
                          {address}
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Ventajas del interleaving:</div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Mejora el ancho de banda al paralelizar accesos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Reduce la latencia promedio</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Mejora el rendimiento en accesos secuenciales</span>
              </li>
            </ul>
            
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">
                <span className="font-semibold">Factor de interleaving:</span> {modules}:1
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max={accessPattern.length - 1}
            value={currentTime}
            onChange={(e) => onTimeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-500 mt-1">
            Accesos: {currentTime + 1} / {accessPattern.length}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface BankInterleavingProps {
  banks: number
  rows: number
  columns: number
  accessPattern: {
    bank: number
    row: number
    column: number
  }[]
  currentTime: number
  onTimeChange: (time: number) => void
}

export function BankInterleaving({ 
  banks,
  rows,
  columns,
  accessPattern,
  currentTime,
  onTimeChange
}: BankInterleavingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">🏦</span>
          Interleaving de Bancos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">Organización de bancos</div>
          <div className="text-sm text-purple-700 mt-1">
            El interleaving de bancos distribuye accesos entre múltiples bancos 
            de memoria para maximizar el paralelismo.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="font-semibold mb-2">Configuración:</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-gray-50 rounded text-center">
                <div className="text-xs text-gray-500">Bancos</div>
                <div className="font-semibold">{banks}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center">
                <div className="text-xs text-gray-500">Filas</div>
                <div className="font-semibold">{rows}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center">
                <div className="text-xs text-gray-500">Columnas</div>
                <div className="font-semibold">{columns}</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Acceso actual:</div>
            {accessPattern[currentTime] && (
              <div className="p-3 bg-gray-50 rounded">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Banco</div>
                    <div className="font-semibold text-lg">#{accessPattern[currentTime].bank}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Fila</div>
                    <div className="font-semibold text-lg">{accessPattern[currentTime].row}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Columna</div>
                    <div className="font-semibold text-lg">{accessPattern[currentTime].column}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-semibold mb-2">Secuencia de accesos:</div>
          <div className="flex flex-wrap gap-2">
            {accessPattern.map((access, index) => (
              <div
                key={index}
                className={`
                  w-12 h-12 rounded flex flex-col items-center justify-center text-xs
                  ${index <= currentTime 
                    ? "bg-purple-500 text-white" 
                    : "bg-gray-200 text-gray-700"}
                `}
              >
                <div>B{access.bank}</div>
                <div>{access.row},{access.column}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: banks }).map((_, bankIndex) => (
            <div key={bankIndex} className="p-3 bg-gray-50 rounded">
              <div className="font-semibold mb-2">Banco {bankIndex}</div>
              <div className="space-y-1">
                {accessPattern
                  .slice(0, currentTime + 1)
                  .filter(access => access.bank === bankIndex)
                  .map((access, index) => (
                    <div
                      key={index}
                      className="text-xs p-1 bg-white rounded"
                    >
                      {access.row},{access.column}
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max={accessPattern.length - 1}
            value={currentTime}
            onChange={(e) => onTimeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-500 mt-1">
            Accesos: {currentTime + 1} / {accessPattern.length}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PerformanceComparisonProps {
  technique: string
  sequentialBandwidth: number
  randomBandwidth: number
  sequentialLatency: number
  randomLatency: number
}

export function PerformanceComparison({ 
  technique,
  sequentialBandwidth,
  randomBandwidth,
  sequentialLatency,
  randomLatency
}: PerformanceComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <span className="mr-2">⚡</span>
          Comparación de Rendimiento: {technique}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-3 text-center">Ancho de Banda</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Secuencial</span>
                  <span>{sequentialBandwidth} GB/s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-blue-600" 
                    style={{ width: `${(sequentialBandwidth / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Aleatorio</span>
                  <span>{randomBandwidth} GB/s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-green-600" 
                    style={{ width: `${(randomBandwidth / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-3 text-center">Latencia</div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Secuencial</span>
                  <span>{sequentialLatency} ns</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-red-600" 
                    style={{ width: `${(sequentialLatency / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Aleatorio</span>
                  <span>{randomLatency} ns</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-orange-600" 
                    style={{ width: `${(randomLatency / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800 text-center">
            Mejora en ancho de banda secuencial: {((sequentialBandwidth / 20) * 100).toFixed(0)}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface InterleavingPerformanceProps {
  techniques: {
    technique: string
    sequentialBandwidth: number
    randomBandwidth: number
    sequentialLatency: number
    randomLatency: number
  }[]
}

export function InterleavingPerformance({ techniques }: InterleavingPerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <span className="mr-2">📈</span>
          Rendimiento del Interleaving
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800">¿Cómo mejora el rendimiento?</div>
          <div className="text-sm text-red-700 mt-1">
            El interleaving mejora significativamente el rendimiento en accesos 
            secuenciales al paralelizar operaciones entre múltiples módulos.
          </div>
        </div>
        
        <div className="space-y-4">
          {techniques.map((technique, index) => (
            <PerformanceComparison
              key={index}
              technique={technique.technique}
              sequentialBandwidth={technique.sequentialBandwidth}
              randomBandwidth={technique.randomBandwidth}
              sequentialLatency={technique.sequentialLatency}
              randomLatency={technique.randomLatency}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}