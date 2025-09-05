import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemoryBlockAllocatorProps {
  id: number
  size: number
  allocated: boolean
  buddyId?: number | null
  highlighted?: boolean
  onClick?: () => void
}

export function MemoryBlockAllocator({ 
  id, 
  size, 
  allocated, 
  buddyId,
  highlighted,
  onClick
}: MemoryBlockAllocatorProps) {
  return (
    <div
      className={`
        border rounded p-2 cursor-pointer transition-all duration-200
        ${highlighted ? "ring-2 ring-blue-500" : ""}
        ${allocated 
          ? "bg-red-100 border-red-300" 
          : buddyId !== null 
            ? "bg-yellow-100 border-yellow-300" 
            : "bg-green-100 border-green-300"}
      `}
      onClick={onClick}
    >
      <div className="font-mono text-sm">Bloque {id}</div>
      <div className="font-mono text-lg">{size}B</div>
      {allocated && (
        <div className="text-xs text-red-700 mt-1">Asignado</div>
      )}
      {buddyId !== null && buddyId !== undefined && !allocated && (
        <div className="text-xs text-yellow-700 mt-1">Buddy: {buddyId}</div>
      )}
    </div>
  )
}

interface BuddyAllocatorVisualizationProps {
  blocks: {
    id: number
    size: number
    allocated: boolean
    buddyId?: number | null
    address: number
  }[]
  highlightedBlock?: number | null
  onBlockClick?: (id: number) => void
}

export function BuddyAllocatorVisualization({ 
  blocks, 
  highlightedBlock,
  onBlockClick
}: BuddyAllocatorVisualizationProps) {
  // Sort blocks by address
  const sortedBlocks = [...blocks].sort((a, b) => a.address - b.address)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buddy Allocator</CardTitle>
      </CardHeader>
      <CardContent>
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
                      : block.buddyId !== null && block.buddyId !== undefined
                        ? "bg-yellow-500"
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
            <MemoryBlockAllocator
              key={block.id}
              id={block.id}
              size={block.size}
              allocated={block.allocated}
              buddyId={block.buddyId}
              highlighted={highlightedBlock === block.id}
              onClick={() => onBlockClick?.(block.id)}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Leyenda</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Libre</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm">Buddy</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Asignado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SlabAllocatorVisualizationProps {
  slabs: {
    id: number
    objectSize: number
    totalObjects: number
    allocatedObjects: number
    highlighted?: boolean
  }[]
  highlightedSlab?: number | null
  onSlabClick?: (id: number) => void
}

export function SlabAllocatorVisualization({ 
  slabs, 
  highlightedSlab,
  onSlabClick
}: SlabAllocatorVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Slab Allocator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {slabs.map(slab => (
            <div 
              key={slab.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${highlightedSlab === slab.id 
                  ? "ring-2 ring-blue-500 bg-blue-50" 
                  : "border-gray-200"}
              `}
              onClick={() => onSlabClick?.(slab.id)}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">Slab {slab.id}</div>
                <div className="text-sm text-gray-500">
                  {slab.objectSize} bytes por objeto
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Objetos: {slab.allocatedObjects}/{slab.totalObjects}</span>
                  <span>{Math.round((slab.allocatedObjects / slab.totalObjects) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(slab.allocatedObjects / slab.totalObjects) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-10 gap-1">
                {Array.from({ length: slab.totalObjects }).map((_, index) => (
                  <div
                    key={index}
                    className={`
                      h-4 rounded
                      ${index < slab.allocatedObjects 
                        ? "bg-blue-500" 
                        : "bg-gray-200"}
                    `}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}