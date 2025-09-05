import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EndiannessVisualizationProps {
  value: number
  endian: "little" | "big"
  bytes: number[]
  description: string
}

export function EndiannessVisualization({ 
  value, 
  endian, 
  bytes,
  description
}: EndiannessVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: endian === "little" ? "#3b82f6" : "#10b981" }}
        >
          <span className="mr-2 text-2xl">
            {endian === "little" ? "🔢" : "🔢"}
          </span>
          {endian === "little" ? "Little Endian" : "Big Endian"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-gray-600">
          {description}
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="font-semibold mb-2">Valor: 0x{value.toString(16).toUpperCase().padStart(8, '0')}</div>
          <div className="flex gap-2">
            {bytes.map((byte, index) => (
              <div key={index} className="text-center">
                <div className="font-mono bg-white border rounded p-2">
                  0x{byte.toString(16).toUpperCase().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 mt-1">Byte {index}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-3 bg-gray-800 text-white rounded font-mono">
          <div className="text-xs text-gray-400 mb-1">Representación en memoria:</div>
          {bytes.map((byte, index) => (
            <span key={index} className="mr-1">
              {byte.toString(16).toUpperCase().padStart(2, '0')}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface EndiannessComparisonProps {
  endianness: {
    value: number
    endian: "little" | "big"
    bytes: number[]
    description: string
  }[]
}

export function EndiannessComparison({ endianness }: EndiannessComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Endianness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es el endianness?</div>
          <div className="text-sm text-blue-700 mt-1">
            El endianness determina el orden en que los bytes se almacenan en memoria. 
            Es crucial para la interoperabilidad entre sistemas.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endianness.map((endian, index) => (
            <EndiannessVisualization
              key={index}
              value={endian.value}
              endian={endian.endian}
              bytes={endian.bytes}
              description={endian.description}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Implicaciones del endianness:</div>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Transferencia de datos entre sistemas</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Formatos de archivo y protocolos de red</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Depuración y análisis de memoria</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

interface EndiannessExampleProps {
  architecture: string
  endian: "little" | "big"
  examples: string[]
}

export function EndiannessExample({ 
  architecture, 
  endian, 
  examples
}: EndiannessExampleProps) {
  return (
    <div 
      className="p-4 rounded-lg border transition-all duration-200"
      style={{ 
        borderLeftColor: endian === "little" ? "#3b82f6" : "#10b981", 
        borderLeftWidth: '4px' 
      }}
    >
      <div className="font-semibold mb-2">{architecture}</div>
      <div className="text-sm text-gray-600 mb-3">
        {endian === "little" ? "Little Endian" : "Big Endian"}
      </div>
      <div>
        <div className="font-semibold text-sm mb-1">Ejemplos:</div>
        <ul className="space-y-1">
          {examples.map((example, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="mr-1">•</span>
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface ArchitectureEndiannessProps {
  architectures: {
    architecture: string
    endian: "little" | "big"
    examples: string[]
  }[]
}

export function ArchitectureEndianness({ architectures }: ArchitectureEndiannessProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endianness en Arquitecturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {architectures.map((arch, index) => (
            <EndiannessExample
              key={index}
              architecture={arch.architecture}
              endian={arch.endian}
              examples={arch.examples}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}