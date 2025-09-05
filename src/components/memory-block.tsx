import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/lib/memory-utils"

interface MemoryBlockProps {
  address: number
  value: number
  size: number
  allocated: boolean
  owner?: number | null
  highlighted?: boolean
}

export function MemoryBlock({ 
  address, 
  value, 
  size, 
  allocated, 
  owner,
  highlighted = false
}: MemoryBlockProps) {
  return (
    <div 
      className={`
        border rounded p-2 transition-all duration-200
        ${highlighted ? "ring-2 ring-blue-500 bg-blue-50" : ""}
        ${allocated ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
      `}
    >
      <div className="font-mono text-xs text-gray-500">
        {formatAddress(address)}
      </div>
      <div className="font-mono text-lg font-semibold">
        {value}
      </div>
      <div className="text-xs mt-1">
        {size} bytes
      </div>
      {owner !== undefined && owner !== null && (
        <div className="text-xs text-gray-500">
          Core {owner}
        </div>
      )}
    </div>
  )
}

interface MemoryRowProps {
  blocks: {
    address: number
    value: number
    size: number
    allocated: boolean
    owner?: number | null
  }[]
  highlightedBlock?: number | null
}

export function MemoryRow({ blocks, highlightedBlock }: MemoryRowProps) {
  return (
    <div className="flex gap-1">
      {blocks.map((block, index) => (
        <MemoryBlock
          key={index}
          address={block.address}
          value={block.value}
          size={block.size}
          allocated={block.allocated}
          owner={block.owner}
          highlighted={highlightedBlock === index}
        />
      ))}
    </div>
  )
}

interface MemoryGridProps {
  rows: {
    blocks: {
      address: number
      value: number
      size: number
      allocated: boolean
      owner?: number | null
    }[]
    highlightedBlock?: number | null
  }[]
}

export function MemoryGrid({ rows }: MemoryGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Memoria Principal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {rows.map((row, rowIndex) => (
            <MemoryRow
              key={rowIndex}
              blocks={row.blocks}
              highlightedBlock={row.highlightedBlock}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}