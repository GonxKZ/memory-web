import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/lib/memory-utils"

interface PageTableEntryProps {
  index: number
  valid: boolean
  frameNumber: number | null
  dirty: boolean
  accessed: boolean
  highlighted?: boolean
  onClick?: () => void
}

export function PageTableEntry({ 
  index,
  valid,
  frameNumber,
  dirty,
  accessed,
  highlighted,
  onClick
}: PageTableEntryProps) {
  return (
    <div
      className={`
        border rounded p-3 cursor-pointer transition-all duration-200
        ${highlighted ? "ring-2 ring-blue-500 bg-blue-50" : ""}
        ${valid ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div className="font-mono text-sm">
          PTE {index}
        </div>
        <div className="flex gap-1">
          {valid && (
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Válido"></span>
          )}
          {dirty && (
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" title="Sucio"></span>
          )}
          {accessed && (
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" title="Accedido"></span>
          )}
        </div>
      </div>
      
      {valid && frameNumber !== null ? (
        <div className="mt-2">
          <div className="text-xs text-gray-500">Marco físico</div>
          <div className="font-mono">{formatAddress(frameNumber)}</div>
        </div>
      ) : (
        <div className="mt-2 text-gray-400 text-sm">
          No asignado
        </div>
      )}
    </div>
  )
}

interface PageTableProps {
  level: number
  entries: {
    index: number
    valid: boolean
    frameNumber: number | null
    dirty: boolean
    accessed: boolean
  }[]
  highlightedEntry?: number | null
  onEntryClick?: (index: number) => void
}

export function PageTable({ 
  level, 
  entries, 
  highlightedEntry,
  onEntryClick
}: PageTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla de Páginas Nivel {level}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {entries.map(entry => (
            <PageTableEntry
              key={entry.index}
              index={entry.index}
              valid={entry.valid}
              frameNumber={entry.frameNumber}
              dirty={entry.dirty}
              accessed={entry.accessed}
              highlighted={highlightedEntry === entry.index}
              onClick={() => onEntryClick?.(entry.index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface VirtualMemoryVisualizationProps {
  pageTables: {
    level: number
    entries: {
      index: number
      valid: boolean
      frameNumber: number | null
      dirty: boolean
      accessed: boolean
    }[]
  }[]
  virtualAddress: number
  physicalAddress: number | null
  pageSize: number
  onEntryClick?: (level: number, index: number) => void
}

export function VirtualMemoryVisualization({ 
  pageTables,
  virtualAddress,
  physicalAddress,
  pageSize,
  onEntryClick
}: VirtualMemoryVisualizationProps) {
  // Calculate page number and offset
  const pageNumber = Math.floor(virtualAddress / pageSize)
  const offset = virtualAddress % pageSize
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualización de Memoria Virtual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la memoria virtual?</div>
          <div className="text-sm text-blue-700 mt-1">
            La memoria virtual permite a los programas usar más memoria de la disponible 
            físicamente mediante el mapeo de direcciones virtuales a direcciones físicas.
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <div className="font-semibold mb-2">Traducción de direcciones:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white border rounded">
              <div className="text-xs text-gray-500">Dirección Virtual</div>
              <div className="font-mono text-lg">{formatAddress(virtualAddress)}</div>
            </div>
            <div className="p-3 bg-white border rounded">
              <div className="text-xs text-gray-500">Número de Página</div>
              <div className="font-mono text-lg">{formatAddress(pageNumber)}</div>
            </div>
            <div className="p-3 bg-white border rounded">
              <div className="text-xs text-gray-500">Offset</div>
              <div className="font-mono text-lg">{formatAddress(offset)}</div>
            </div>
          </div>
          
          {physicalAddress !== null && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-xs text-gray-500">Dirección Física</div>
              <div className="font-mono text-lg">{formatAddress(physicalAddress)}</div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {pageTables.map(table => (
            <PageTable
              key={table.level}
              level={table.level}
              entries={table.entries}
              onEntryClick={(index) => onEntryClick?.(table.level, index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface HugePagesProps {
  sizes: {
    name: string
    size: number
    benefits: string[]
    useCases: string[]
  }[]
}

export function HugePages({ sizes }: HugePagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Páginas Grandes (Huge Pages)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Qué son las páginas grandes?</div>
          <div className="text-sm text-green-700 mt-1">
            Las páginas grandes reducen la sobrecarga de la tabla de páginas y mejoran 
            el rendimiento al reducir las fallas de TLB.
          </div>
        </div>
        
        <div className="space-y-4">
          {sizes.map((size, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded">
              <div className="font-semibold mb-2">{size.name} ({size.size / 1024 / 1024} MB)</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-1 text-green-600">Beneficios:</div>
                  <ul className="space-y-1">
                    {size.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-sm">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold mb-1 text-blue-600">Casos de uso:</div>
                  <ul className="space-y-1">
                    {size.useCases.map((useCase, useCaseIndex) => (
                      <li key={useCaseIndex} className="flex items-start text-sm">
                        <span className="mr-1 text-blue-500">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}