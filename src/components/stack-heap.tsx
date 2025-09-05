import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/lib/memory-utils"

interface StackFrameProps {
  functionName: string
  variables: {
    name: string
    value: string
    address: number
  }[]
  returnAddress: number
  basePointer: number
  stackPointer: number
  highlighted?: boolean
}

export function StackFrame({ 
  functionName,
  variables,
  returnAddress,
  basePointer,
  stackPointer,
  highlighted
}: StackFrameProps) {
  return (
    <div 
      className={`
        border rounded p-4 transition-all duration-200
        ${highlighted ? "ring-2 ring-blue-500 bg-blue-50" : "bg-gray-50 border-gray-200"}
      `}
    >
      <div className="font-semibold mb-2">{functionName}</div>
      
      <div className="mb-3 p-2 bg-white border rounded">
        <div className="text-xs text-gray-500">Dirección de retorno</div>
        <div className="font-mono text-sm">{formatAddress(returnAddress)}</div>
      </div>
      
      <div className="mb-3 p-2 bg-white border rounded">
        <div className="text-xs text-gray-500">Puntero base</div>
        <div className="font-mono text-sm">{formatAddress(basePointer)}</div>
      </div>
      
      <div className="mb-3 p-2 bg-white border rounded">
        <div className="text-xs text-gray-500">Puntero de pila</div>
        <div className="font-mono text-sm">{formatAddress(stackPointer)}</div>
      </div>
      
      <div>
        <div className="font-semibold text-sm mb-1">Variables locales:</div>
        <div className="space-y-2">
          {variables.map((variable, index) => (
            <div key={index} className="p-2 bg-white border rounded">
              <div className="font-mono text-sm">{variable.name} = {variable.value}</div>
              <div className="text-xs text-gray-500">{formatAddress(variable.address)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface StackVisualizationProps {
  frames: {
    functionName: string
    variables: {
      name: string
      value: string
      address: number
    }[]
    returnAddress: number
    basePointer: number
    stackPointer: number
  }[]
  currentFrame?: number | null
}

export function StackVisualization({ frames, currentFrame }: StackVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">スタッガ</span>
          Memoria de Pila (Stack)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la pila?</div>
          <div className="text-sm text-blue-700 mt-1">
            La pila es una región de memoria que almacena variables locales, parámetros 
            de función y direcciones de retorno. Crece hacia direcciones más bajas.
          </div>
        </div>
        
        <div className="space-y-4">
          {frames.map((frame, index) => (
            <StackFrame
              key={index}
              functionName={frame.functionName}
              variables={frame.variables}
              returnAddress={frame.returnAddress}
              basePointer={frame.basePointer}
              stackPointer={frame.stackPointer}
              highlighted={currentFrame === index}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Características de la pila:</div>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Asignación y liberación automática</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Acceso rápido</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Tamaño limitado</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Organización LIFO (último en entrar, primero en salir)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

interface HeapBlockProps {
  id: number
  size: number
  address: number
  allocated: boolean
  highlighted?: boolean
  onClick?: () => void
}

export function HeapBlock({ 
  id,
  size,
  address,
  allocated,
  highlighted,
  onClick
}: HeapBlockProps) {
  return (
    <div
      className={`
        border rounded p-2 cursor-pointer transition-all duration-200
        ${highlighted ? "ring-2 ring-blue-500" : ""}
        ${allocated 
          ? "bg-red-100 border-red-300" 
          : "bg-green-100 border-green-300"}
      `}
      onClick={onClick}
    >
      <div className="font-mono text-xs">Bloque {id}</div>
      <div className="font-mono text-sm">{size} bytes</div>
      <div className="text-xs text-gray-500 mt-1">{formatAddress(address)}</div>
      <div className="text-xs mt-1">
        {allocated ? "Asignado" : "Libre"}
      </div>
    </div>
  )
}

interface HeapVisualizationProps {
  blocks: {
    id: number
    size: number
    address: number
    allocated: boolean
  }[]
  highlightedBlock?: number | null
  onBlockClick?: (id: number) => void
}

export function HeapVisualization({ 
  blocks, 
  highlightedBlock,
  onBlockClick
}: HeapVisualizationProps) {
  // Sort blocks by address
  const sortedBlocks = [...blocks].sort((a, b) => a.address - b.address)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <span className="mr-2">ヒープ</span>
          Memoria de Montículo (Heap)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800">¿Qué es el montículo?</div>
          <div className="text-sm text-red-700 mt-1">
            El montículo es una región de memoria para asignaciones dinámicas. 
            El programador controla la asignación y liberación de memoria.
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Dirección</span>
            <span>Tamaño</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 relative">
            {sortedBlocks.map((block, index) => {
              // Calculate width percentage based on block size
              const totalSize = sortedBlocks.reduce((sum, b) => sum + b.size, 0)
              const widthPercent = (block.size / totalSize) * 100
              const leftPercent = sortedBlocks
                .slice(0, index)
                .reduce((sum, b) => sum + (b.size / totalSize) * 100, 0)
              
              return (
                <div
                  key={block.id}
                  className={`
                    absolute top-0 h-6 transition-all duration-200
                    ${block.allocated 
                      ? "bg-red-500" 
                      : "bg-green-500"}
                    ${highlightedBlock === block.id ? "ring-2 ring-blue-500" : ""}
                  `}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                  onClick={() => onBlockClick?.(block.id)}
                >
                  <div className="text-xs text-white text-center leading-6">
                    {block.size}B
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sortedBlocks.map(block => (
            <HeapBlock
              key={block.id}
              id={block.id}
              size={block.size}
              address={block.address}
              allocated={block.allocated}
              highlighted={highlightedBlock === block.id}
              onClick={() => onBlockClick?.(block.id)}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Características del montículo:</div>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Memoria dinámica</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Tamaño flexible</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-500">✗</span>
              <span>Requiere gestión manual</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-500">✗</span>
              <span>Fragmentación posible</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

interface StackHeapComparisonProps {
  comparison: {
    aspect: string
    stack: string
    heap: string
  }[]
}

export function StackHeapComparison({ comparison }: StackHeapComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación: Stack vs Heap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Aspecto</th>
                <th className="p-2 text-left text-blue-600">Stack</th>
                <th className="p-2 text-left text-red-600">Heap</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-semibold">{item.aspect}</td>
                  <td className="p-2">{item.stack}</td>
                  <td className="p-2">{item.heap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}