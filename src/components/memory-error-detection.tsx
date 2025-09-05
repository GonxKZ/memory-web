import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorDetectionProps {
  technique: "parity" | "ecc" | "checksum" | "crc"
  name: string
  description: string
  errorDetection: string
  errorCorrection: string
  overhead: string
  useCases: string[]
}

export function ErrorDetection({ 
  technique,
  name,
  description,
  errorDetection,
  errorCorrection,
  overhead,
  useCases
}: ErrorDetectionProps) {
  // Technique icons and colors
  const techInfo = {
    "parity": {
      icon: "🔍",
      color: "#3b82f6"
    },
    "ecc": {
      icon: "🔧",
      color: "#10b981"
    },
    "checksum": {
      icon: "✅",
      color: "#8b5cf6"
    },
    "crc": {
      icon: "🔄",
      color: "#f59e0b"
    }
  }

  const currentTech = techInfo[technique]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentTech.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentTech.color }}
      >
        <span className="mr-2 text-xl">{currentTech.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Detección</div>
            <div className="font-semibold">{errorDetection}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Corrección</div>
            <div className="font-semibold">{errorCorrection}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Overhead</div>
            <div className="font-semibold">{overhead}</div>
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

interface ErrorDetectionTechniquesProps {
  techniques: {
    technique: "parity" | "ecc" | "checksum" | "crc"
    name: string
    description: string
    errorDetection: string
    errorCorrection: string
    overhead: string
    useCases: string[]
  }[]
}

export function ErrorDetectionTechniques({ techniques }: ErrorDetectionTechniquesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🛡️</span>
          Detección de Errores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Por qué detectar errores?</div>
          <div className="text-sm text-blue-700 mt-1">
            La detección y corrección de errores es crucial para mantener 
            la integridad de los datos en sistemas de memoria.
          </div>
        </div>
        
        <div className="space-y-3">
          {techniques.map((technique, index) => (
            <ErrorDetection
              key={index}
              technique={technique.technique}
              name={technique.name}
              description={technique.description}
              errorDetection={technique.errorDetection}
              errorCorrection={technique.errorCorrection}
              overhead={technique.overhead}
              useCases={technique.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface ErrorVisualizationProps {
  data: number[]
  parity: number
  hasError: boolean
  errorPosition: number | null
  corrected: boolean
}

export function ErrorVisualization({ 
  data,
  parity,
  hasError,
  errorPosition,
  corrected
}: ErrorVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">🔬</span>
          Visualización de Errores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">Detección de errores con paridad</div>
          <div className="text-sm text-green-700 mt-1">
            Visualiza cómo se detectan y corrigen errores en datos binarios.
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-semibold mb-2">Datos:</div>
          <div className="flex flex-wrap gap-2">
            {data.map((bit, index) => (
              <div
                key={index}
                className={`
                  w-10 h-10 rounded flex items-center justify-center text-lg font-mono
                  ${errorPosition === index 
                    ? "bg-red-500 text-white ring-2 ring-red-300" 
                    : "bg-gray-200 text-gray-700"}
                `}
              >
                {bit}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-semibold mb-2">Bit de paridad:</div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded flex items-center justify-center text-lg font-mono bg-gray-200 text-gray-700">
              {parity}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {hasError ? (
                <span className="text-red-600">Error detectado</span>
              ) : (
                <span className="text-green-600">Sin errores</span>
              )}
            </div>
          </div>
        </div>
        
        {hasError && errorPosition !== null && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-semibold text-red-800 mb-1">
              {corrected ? "Error corregido" : "Error detectado"} en posición {errorPosition}
            </div>
            <div className="text-sm text-red-700">
              {corrected 
                ? "El bit ha sido corregido automáticamente" 
                : "Se requiere acción manual para corregir el error"}
            </div>
          </div>
        )}
        
        {corrected && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-semibold text-green-800">Corrección completada</div>
            <div className="text-sm text-green-700">
              Los datos han sido restaurados a su estado original.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ECCVisualizationProps {
  dataBits: number[]
  eccBits: number[]
  syndrome: number[]
  errorPosition: number | null
  corrected: boolean
}

export function ECCVisualization({ 
  dataBits,
  eccBits,
  syndrome,
  errorPosition,
  corrected
}: ECCVisualizationProps) {
  const hasError = syndrome.some(bit => bit !== 0)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">🔧</span>
          Visualización de ECC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">Código de Corrección de Errores</div>
          <div className="text-sm text-purple-700 mt-1">
            El ECC puede detectar y corregir errores de un solo bit automáticamente.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="font-semibold mb-2">Datos ({dataBits.length} bits):</div>
            <div className="flex flex-wrap gap-1">
              {dataBits.map((bit, index) => (
                <div
                  key={index}
                  className={`
                    w-8 h-8 rounded flex items-center justify-center text-sm font-mono
                    ${errorPosition !== null && errorPosition === index 
                      ? "bg-red-500 text-white ring-2 ring-red-300" 
                      : "bg-gray-200 text-gray-700"}
                  `}
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">ECC ({eccBits.length} bits):</div>
            <div className="flex flex-wrap gap-1">
              {eccBits.map((bit, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded flex items-center justify-center text-sm font-mono bg-gray-200 text-gray-700"
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Síndrome:</div>
            <div className="flex flex-wrap gap-1">
              {syndrome.map((bit, index) => (
                <div
                  key={index}
                  className={`
                    w-8 h-8 rounded flex items-center justify-center text-sm font-mono
                    ${bit === 1 
                      ? "bg-red-500 text-white" 
                      : "bg-gray-200 text-gray-700"}
                  `}
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {hasError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded mb-4">
            <div className="font-semibold text-red-800 mb-1">
              Error detectado
            </div>
            <div className="text-sm text-red-700">
              {errorPosition !== null 
                ? `Error en posición ${errorPosition} del dato` 
                : "Error múltiple detectado (no corregible)"}
            </div>
          </div>
        )}
        
        {corrected && errorPosition !== null && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-semibold text-green-800">Error corregido</div>
            <div className="text-sm text-green-700">
              El bit en posición {errorPosition} ha sido corregido automáticamente.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ReliabilityMetricProps {
  metric: "mtbf" | "ber" | "ser" | "durability"
  name: string
  value: number
  unit: string
  description: string
  industryStandard: number
}

export function ReliabilityMetric({ 
  metric,
  name,
  value,
  unit,
  description,
  industryStandard
}: ReliabilityMetricProps) {
  // Metric icons and colors
  const metricInfo = {
    "mtbf": {
      icon: "⏱️",
      color: "#3b82f6"
    },
    "ber": {
      icon: "📡",
      color: "#10b981"
    },
    "ser": {
      icon: "📊",
      color: "#8b5cf6"
    },
    "durability": {
      icon: "💪",
      color: "#f59e0b"
    }
  }

  const currentMetric = metricInfo[metric]
  const ratio = value / industryStandard

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentMetric.color }}
        >
          <span className="mr-2 text-xl">{currentMetric.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="p-3 bg-gray-800 text-white rounded text-center">
            <div className="text-2xl font-bold">{value.toLocaleString()} {unit}</div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Comparación con estándar</span>
              <span>{(ratio * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 rounded-full" 
                style={{ 
                  width: `${Math.min(ratio * 100, 100)}%`,
                  backgroundColor: currentMetric.color
                }}
              ></div>
            </div>
          </div>
          
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Estándar de la industria:</div>
            <div className="font-mono">{industryStandard.toLocaleString()} {unit}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryReliabilityProps {
  metrics: {
    metric: "mtbf" | "ber" | "ser" | "durability"
    name: string
    value: number
    unit: string
    description: string
    industryStandard: number
  }[]
}

export function MemoryReliability({ metrics }: MemoryReliabilityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <span className="mr-2">🛡️</span>
          Confiabilidad de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <div className="font-semibold text-orange-800">¿Qué es la confiabilidad?</div>
          <div className="text-sm text-orange-700 mt-1">
            La confiabilidad mide la capacidad de la memoria para mantener 
            la integridad de los datos durante su vida útil.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <ReliabilityMetric
              key={index}
              metric={metric.metric}
              name={metric.name}
              value={metric.value}
              unit={metric.unit}
              description={metric.description}
              industryStandard={metric.industryStandard}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}