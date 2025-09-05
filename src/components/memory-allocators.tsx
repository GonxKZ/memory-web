import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BuddyAllocatorProps {
  name: string
  description: string
  blockSize: number
  freeBlocks: number
  allocatedBlocks: number
  fragmentation: number
  coalescing: boolean
}

export function BuddyAllocator({ 
  name,
  description,
  blockSize,
  freeBlocks,
  allocatedBlocks,
  fragmentation,
  coalescing
}: BuddyAllocatorProps) {
  // Calculate total blocks
  const totalBlocks = freeBlocks + allocatedBlocks
  const utilization = totalBlocks > 0 ? (allocatedBlocks / totalBlocks) * 100 : 0
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">👥</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Tamaño de bloque</div>
            <div className="font-semibold">{blockSize} bytes</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Fragmentación</div>
            <div className="font-semibold">{fragmentation}%</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Utilización</span>
            <span>{utilization.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-blue-600" 
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-xs text-gray-500">Bloques libres</div>
            <div className="font-semibold text-green-600">{freeBlocks}</div>
          </div>
          <div className="p-3 bg-red-50 rounded text-center">
            <div className="text-xs text-gray-500">Bloques asignados</div>
            <div className="font-semibold text-red-600">{allocatedBlocks}</div>
          </div>
        </div>
        
        {coalescing && (
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-center">
            <div className="text-sm font-semibold text-blue-800">Coalescing habilitado</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SlabAllocatorProps {
  name: string
  description: string
  objectSize: number
  objectsPerSlab: number
  totalSlabs: number
  activeSlabs: number
  freeObjects: number
  allocatedObjects: number
}

export function SlabAllocator({ 
  name,
  description,
  objectSize,
  objectsPerSlab,
  totalSlabs,
  activeSlabs,
  freeObjects,
  allocatedObjects
}: SlabAllocatorProps) {
  // Calculate utilization
  const totalObjects = freeObjects + allocatedObjects
  const utilization = totalObjects > 0 ? (allocatedObjects / totalObjects) * 100 : 0
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">🧱</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Tamaño de objeto</div>
            <div className="font-semibold">{objectSize} bytes</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Objetos por slab</div>
            <div className="font-semibold">{objectsPerSlab}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Utilización de objetos</span>
            <span>{utilization.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-green-600" 
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded text-center">
            <div className="text-xs text-gray-500">Slabs totales</div>
            <div className="font-semibold text-blue-600">{totalSlabs}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded text-center">
            <div className="text-xs text-gray-500">Slabs activos</div>
            <div className="font-semibold text-purple-600">{activeSlabs}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-xs text-gray-500">Objetos libres</div>
            <div className="font-semibold text-green-600">{freeObjects}</div>
          </div>
          <div className="p-3 bg-red-50 rounded text-center">
            <div className="text-xs text-gray-500">Objetos asignados</div>
            <div className="font-semibold text-red-600">{allocatedObjects}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AllocatorComparisonProps {
  allocators: {
    type: "buddy" | "slab"
    name: string
    description: string
    blockSize?: number
    freeBlocks?: number
    allocatedBlocks?: number
    fragmentation?: number
    coalescing?: boolean
    objectSize?: number
    objectsPerSlab?: number
    totalSlabs?: number
    activeSlabs?: number
    freeObjects?: number
    allocatedObjects?: number
  }[]
}

export function AllocatorComparison({ allocators }: AllocatorComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Allocators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es un allocator?</div>
          <div className="text-sm text-blue-700 mt-1">
            Los allocators gestionan la asignación y liberación de memoria dinámica, 
            optimizando para diferentes patrones de uso.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allocators.map((allocator, index) => (
            <div key={index}>
              {allocator.type === "buddy" && (
                <BuddyAllocator
                  name={allocator.name}
                  description={allocator.description}
                  blockSize={allocator.blockSize || 0}
                  freeBlocks={allocator.freeBlocks || 0}
                  allocatedBlocks={allocator.allocatedBlocks || 0}
                  fragmentation={allocator.fragmentation || 0}
                  coalescing={allocator.coalescing || false}
                />
              )}
              {allocator.type === "slab" && (
                <SlabAllocator
                  name={allocator.name}
                  description={allocator.description}
                  objectSize={allocator.objectSize || 0}
                  objectsPerSlab={allocator.objectsPerSlab || 0}
                  totalSlabs={allocator.totalSlabs || 0}
                  activeSlabs={allocator.activeSlabs || 0}
                  freeObjects={allocator.freeObjects || 0}
                  allocatedObjects={allocator.allocatedObjects || 0}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface AllocationRequestProps {
  size: number
  alignment: number
  allocator: "buddy" | "slab"
  result: "success" | "failure"
  allocatedSize?: number
  allocatedAddress?: number
}

export function AllocationRequest({ 
  size,
  alignment,
  allocator,
  result,
  allocatedSize,
  allocatedAddress
}: AllocationRequestProps) {
  return (
    <div 
      className={`
        p-3 rounded border
        ${result === "success" 
          ? "bg-green-50 border-green-200" 
          : "bg-red-50 border-red-200"}
      `}
    >
      <div className="flex justify-between items-center">
        <div className="font-semibold">
          Solicitud de {size} bytes
        </div>
        <div className="text-sm">
          {allocator === "buddy" ? "Buddy" : "Slab"}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="text-xs text-gray-500">Alineación</div>
        <div className="text-xs text-gray-500">Resultado</div>
        <div className="font-mono">{alignment} bytes</div>
        <div className={result === "success" ? "text-green-600" : "text-red-600"}>
          {result === "success" ? "Éxito" : "Fallo"}
        </div>
      </div>
      
      {result === "success" && allocatedSize && allocatedAddress && (
        <div className="mt-2 pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs text-gray-500">Tamaño asignado</div>
            <div className="text-xs text-gray-500">Dirección</div>
            <div className="font-mono">{allocatedSize} bytes</div>
            <div className="font-mono">0x{allocatedAddress.toString(16).toUpperCase()}</div>
          </div>
        </div>
      )}
    </div>
  )
}

interface AllocatorVisualizationProps {
  requests: {
    size: number
    alignment: number
    allocator: "buddy" | "slab"
    result: "success" | "failure"
    allocatedSize?: number
    allocatedAddress?: number
  }[]
}

export function AllocatorVisualization({ requests }: AllocatorVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualización de Solicitudes de Memoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="font-semibold mb-2">Solicitudes de asignación:</div>
          <div className="space-y-2">
            {requests.map((request, index) => (
              <AllocationRequest
                key={index}
                size={request.size}
                alignment={request.alignment}
                allocator={request.allocator}
                result={request.result}
                allocatedSize={request.allocatedSize}
                allocatedAddress={request.allocatedAddress}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-xs text-gray-500">Asignaciones exitosas</div>
            <div className="font-semibold text-green-600">
              {requests.filter(r => r.result === "success").length}
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded text-center">
            <div className="text-xs text-gray-500">Asignaciones fallidas</div>
            <div className="font-semibold text-red-600">
              {requests.filter(r => r.result === "failure").length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}