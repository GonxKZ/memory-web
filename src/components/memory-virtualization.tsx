import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/lib/memory-utils"

interface AddressTranslationProps {
  virtualAddress: number
  physicalAddress: number
  pageTableEntries: {
    level: number
    index: number
    frameNumber: number
    valid: boolean
  }[]
}

export function AddressTranslation({ 
  virtualAddress,
  physicalAddress,
  pageTableEntries
}: AddressTranslationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🗺️</span>
          Traducción de Direcciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Cómo funciona la traducción?</div>
          <div className="text-sm text-blue-700 mt-1">
            La unidad de gestión de memoria (MMU) traduce direcciones virtuales 
            a direcciones físicas usando tablas de páginas.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Dirección Virtual</div>
            <div className="font-mono text-lg">{formatAddress(virtualAddress)}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-xs text-gray-500">Dirección Física</div>
            <div className="font-mono text-lg">{formatAddress(physicalAddress)}</div>
          </div>
        </div>
        
        <div>
          <div className="font-semibold mb-2">Camino de traducción:</div>
          <div className="space-y-2">
            {pageTableEntries.map((entry, index) => (
              <div 
                key={index}
                className={`
                  p-3 rounded border flex justify-between items-center
                  ${entry.valid 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"}
                `}
              >
                <div>
                  <div className="font-semibold">Nivel {entry.level} - Índice {entry.index}</div>
                  {entry.valid && (
                    <div className="text-sm text-gray-600">
                      Marco: {formatAddress(entry.frameNumber)}
                    </div>
                  )}
                </div>
                <div>
                  {entry.valid ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Válido
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      Inválido
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PageTableEntryProps {
  index: number
  valid: boolean
  frameNumber: number | null
  dirty: boolean
  accessed: boolean
  protection: ("read" | "write" | "execute")[]
}

export function PageTableEntry({ 
  index,
  valid,
  frameNumber,
  dirty,
  accessed,
  protection
}: PageTableEntryProps) {
  return (
    <div className={`
      p-3 rounded border
      ${valid ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
    `}>
      <div className="flex justify-between items-center">
        <div className="font-mono">PTE {index}</div>
        <div className="flex gap-1">
          {valid && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {dirty && (
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          )}
          {accessed && (
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
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
      
      <div className="flex gap-1 mt-2">
        {protection.includes("read") && (
          <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">R</span>
        )}
        {protection.includes("write") && (
          <span className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">W</span>
        )}
        {protection.includes("execute") && (
          <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">X</span>
        )}
      </div>
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
    protection: ("read" | "write" | "execute")[]
  }[]
}

export function PageTable({ level, entries }: PageTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla de Páginas Nivel {level}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {entries.map((entry, index) => (
            <PageTableEntry
              key={index}
              index={entry.index}
              valid={entry.valid}
              frameNumber={entry.frameNumber}
              dirty={entry.dirty}
              accessed={entry.accessed}
              protection={entry.protection}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface TLBEntryProps {
  virtualPage: number
  physicalFrame: number
  valid: boolean
  dirty: boolean
  accessed: boolean
  protection: ("read" | "write" | "execute")[]
}

export function TLBEntry({ 
  virtualPage,
  physicalFrame,
  valid,
  dirty,
  accessed,
  protection
}: TLBEntryProps) {
  return (
    <div className={`
      p-3 rounded border
      ${valid ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
    `}>
      <div className="flex justify-between items-center">
        <div className="font-mono">
          VPN {formatAddress(virtualPage, 20)}
        </div>
        <div className="flex gap-1">
          {valid && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {dirty && (
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          )}
          {accessed && (
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          )}
        </div>
      </div>
      
      {valid ? (
        <div className="mt-2">
          <div className="text-xs text-gray-500">Marco físico</div>
          <div className="font-mono">{formatAddress(physicalFrame, 20)}</div>
        </div>
      ) : (
        <div className="mt-2 text-gray-400 text-sm">
          Vacío
        </div>
      )}
      
      <div className="flex gap-1 mt-2">
        {protection.includes("read") && (
          <span className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">R</span>
        )}
        {protection.includes("write") && (
          <span className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">W</span>
        )}
        {protection.includes("execute") && (
          <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">X</span>
        )}
      </div>
    </div>
  )
}

interface TLBVisualizationProps {
  entries: {
    virtualPage: number
    physicalFrame: number
    valid: boolean
    dirty: boolean
    accessed: boolean
    protection: ("read" | "write" | "execute")[]
  }[]
}

export function TLBVisualization({ entries }: TLBVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">キャッシング</span>
          TLB (Translation Lookaside Buffer)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué es el TLB?</div>
          <div className="text-sm text-purple-700 mt-1">
            El TLB es una caché especializada que almacena las traducciones 
            más recientes de direcciones virtuales a físicas.
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {entries.map((entry, index) => (
            <TLBEntry
              key={index}
              virtualPage={entry.virtualPage}
              physicalFrame={entry.physicalFrame}
              valid={entry.valid}
              dirty={entry.dirty}
              accessed={entry.accessed}
              protection={entry.protection}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Estadísticas del TLB:</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-green-50 rounded text-center">
              <div className="text-xs text-gray-500">Aciertos</div>
              <div className="font-semibold text-green-600">
                {entries.filter(e => e.valid).length}
              </div>
            </div>
            <div className="p-2 bg-red-50 rounded text-center">
              <div className="text-xs text-gray-500">Fallos</div>
              <div className="font-semibold text-red-600">
                {entries.filter(e => !e.valid).length}
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded text-center">
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-semibold text-blue-600">
                {entries.length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface VirtualizationTechniqueProps {
  technique: "shadow" | "ept" | "nested"
  name: string
  description: string
  advantage: string
  disadvantage: string
  example: string
}

export function VirtualizationTechnique({ 
  technique,
  name,
  description,
  advantage,
  disadvantage,
  example
}: VirtualizationTechniqueProps) {
  // Technique icons and colors
  const techniqueInfo = {
    "shadow": {
      icon: "👻",
      color: "#3b82f6"
    },
    "ept": {
      icon: "🔌",
      color: "#10b981"
    },
    "nested": {
      icon: "🔁",
      color: "#8b5cf6"
    }
  }

  const currentTechnique = techniqueInfo[technique]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentTechnique.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentTechnique.color }}
      >
        <span className="mr-2 text-xl">{currentTechnique.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="p-2 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800 text-sm">Ventaja:</div>
          <div className="text-sm text-green-700">{advantage}</div>
        </div>
        
        <div className="p-2 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800 text-sm">Desventaja:</div>
          <div className="text-sm text-red-700">{disadvantage}</div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Ejemplo:</div>
          <div className="font-mono text-xs bg-gray-800 text-white p-2 rounded">
            {example}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MemoryVirtualizationProps {
  techniques: {
    technique: "shadow" | "ept" | "nested"
    name: string
    description: string
    advantage: string
    disadvantage: string
    example: string
  }[]
}

export function MemoryVirtualization({ techniques }: MemoryVirtualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtualización de Memoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es la virtualización de memoria?</div>
          <div className="text-sm text-blue-700 mt-1">
            La virtualización de memoria permite que múltiples sistemas operativos 
            compartan la misma memoria física mientras mantienen la ilusión de 
            tener memoria privada.
          </div>
        </div>
        
        <div className="space-y-3">
          {techniques.map((technique, index) => (
            <VirtualizationTechnique
              key={index}
              technique={technique.technique}
              name={technique.name}
              description={technique.description}
              advantage={technique.advantage}
              disadvantage={technique.disadvantage}
              example={technique.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}