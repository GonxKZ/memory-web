import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function BuddyAllocatorViz() {
  const [memorySize, setMemorySize] = useState<number>(1024) // 1KB
  const [blocks, setBlocks] = useState<{id: number, size: number, allocated: boolean, buddyId: number | null}[]>([
    { id: 0, size: 1024, allocated: false, buddyId: null }
  ])
  
  const [nextBlockId, setNextBlockId] = useState<number>(1)
  const [allocationRequests, setAllocationRequests] = useState<{size: number, result: "success" | "failure"}[]>([])

  // Find a free block of at least the requested size
  const findFreeBlock = (size: number) => {
    return blocks.find(block => !block.allocated && block.size >= size)
  }

  // Split a block into two buddies
  const splitBlock = (blockId: number) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === blockId)
      if (!block || block.allocated) return prev
      
      const newSize = block.size / 2
      const newBlocks = prev.filter(b => b.id !== blockId)
      
      const buddy1 = {
        id: nextBlockId,
        size: newSize,
        allocated: false,
        buddyId: nextBlockId + 1
      }
      
      const buddy2 = {
        id: nextBlockId + 1,
        size: newSize,
        allocated: false,
        buddyId: nextBlockId
      }
      
      setNextBlockId(prevId => prevId + 2)
      
      return [...newBlocks, buddy1, buddy2]
    })
  }

  // Allocate memory
  const allocate = (size: number) => {
    // Round up to nearest power of 2
    const roundedSize = Math.pow(2, Math.ceil(Math.log2(size)))
    
    let block = findFreeBlock(roundedSize)
    
    // If no block found, try to split larger blocks
    if (!block) {
      // Find the smallest block that can be split to accommodate the request
      const splittableBlocks = blocks
        .filter(b => !b.allocated && b.size > roundedSize)
        .sort((a, b) => a.size - b.size)
      
      if (splittableBlocks.length > 0) {
        const blockToSplit = splittableBlocks[0]
        splitBlock(blockToSplit.id)
        block = findFreeBlock(roundedSize)
      }
    }
    
    if (block) {
      // Mark block as allocated
      setBlocks(prev => 
        prev.map(b => 
          b.id === block!.id ? { ...b, allocated: true, buddyId: null } : b
        )
      )
      
      setAllocationRequests(prev => [...prev, { size, result: "success" }])
    } else {
      setAllocationRequests(prev => [...prev, { size, result: "failure" }])
    }
  }

  // Free allocated block
  const free = (blockId: number) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === blockId)
      if (!block || !block.allocated) return prev
      
      // Mark block as free
      const updatedBlocks = prev.map(b => 
        b.id === blockId ? { ...b, allocated: false } : b
      )
      
      // Try to coalesce with buddy
      if (block.buddyId !== null) {
        const buddy = updatedBlocks.find(b => b.id === block.buddyId)
        if (buddy && !buddy.allocated && buddy.size === block.size) {
          // Coalesce blocks
          const coalescedBlock = {
            id: Math.min(block.id, buddy.id),
            size: block.size * 2,
            allocated: false,
            buddyId: null
          }
          
          return updatedBlocks
            .filter(b => b.id !== block.id && b.id !== buddy.id)
            .concat(coalescedBlock)
        }
      }
      
      return updatedBlocks
    })
  }

  // Reset allocator
  const resetAllocator = () => {
    setBlocks([
      { id: 0, size: memorySize, allocated: false, buddyId: null }
    ])
    setNextBlockId(1)
    setAllocationRequests([])
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualizador de Buddy Allocator</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo funciona el algoritmo de asignación de memoria Buddy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (bytes)</Label>
              <Input
                id="memorySize"
                type="number"
                value={memorySize}
                onChange={(e) => setMemorySize(Number(e.target.value))}
                min="64"
                step="64"
              />
            </div>

            <div>
              <Label htmlFor="allocSize">Tamaño a Asignar (bytes)</Label>
              <Input
                id="allocSize"
                type="number"
                min="1"
                defaultValue="32"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  const size = parseInt(
                    (document.getElementById("allocSize") as HTMLInputElement).value
                  ) || 32
                  allocate(size)
                }}
                className="flex-1"
              >
                Asignar Memoria
              </Button>
              <Button onClick={resetAllocator} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estado del Heap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="text-center text-sm text-gray-500 mb-2">
                Direcciones: 0 - {memorySize - 1} bytes
              </div>
              
              <div className="flex items-end h-32 gap-0.5 border rounded p-2">
                {blocks
                  .sort((a, b) => a.size - b.size)
                  .map(block => (
                    <div
                      key={block.id}
                      className={`
                        flex-1 flex flex-col items-center justify-end border-r last:border-r-0
                        ${block.allocated 
                          ? "bg-red-500 text-white" 
                          : "bg-green-500 text-white"}
                      `}
                      style={{ 
                        height: `${Math.log2(block.size / 16) * 20 + 20}px`,
                        minWidth: "20px"
                      }}
                      title={`Bloque ${block.id}: ${block.size} bytes (${block.allocated ? 'Asignado' : 'Libre'})`}
                    >
                      <div className="text-xs p-1">{block.size}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold mb-2">Bloques Libres</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {blocks
                    .filter(block => !block.allocated)
                    .sort((a, b) => b.size - a.size)
                    .map(block => (
                      <div key={block.id} className="border rounded p-2 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <span>
                            Bloque {block.id}: {block.size} bytes
                          </span>
                          {block.buddyId !== null && (
                            <Badge variant="outline">
                              Buddy: {block.buddyId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2">Bloques Asignados</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {blocks
                    .filter(block => block.allocated)
                    .map(block => (
                      <div 
                        key={block.id} 
                        className="border rounded p-2 bg-red-50 flex justify-between items-center"
                      >
                        <span>
                          {block.size} bytes (Bloque {block.id})
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => free(block.id)}
                        >
                          Liberar
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Historial de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 overflow-y-auto">
            {allocationRequests.length > 0 ? (
              <ul className="space-y-2">
                {allocationRequests.map((request, index) => (
                  <li 
                    key={index} 
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span>
                      Solicitado {request.size} bytes
                    </span>
                    <Badge 
                      variant={request.result === "success" ? "default" : "destructive"}
                    >
                      {request.result === "success" ? "Éxito" : "Fallo"}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay solicitudes de asignación todavía
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Información sobre Buddy Allocator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-sm">
            <p>
              El Buddy Allocator es un algoritmo de gestión de memoria que:
            </p>
            <ul className="mt-2 list-disc pl-5">
              <li>Divide la memoria en bloques de tamaño potencia de 2</li>
              <li>Asigna el bloque más pequeño que puede satisfacer la solicitud</li>
              <li>Divide bloques grandes cuando no hay bloques pequeños disponibles</li>
              <li>Une (coalesces) bloques libres adyacentes cuando se liberan</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="font-semibold text-blue-800">Ventajas:</div>
              <ul className="mt-1 list-disc pl-5 text-blue-700">
                <li>Evita la fragmentación externa</li>
                <li>Algoritmo relativamente simple</li>
                <li>Eficiente en tiempo de asignación y liberación</li>
              </ul>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="font-semibold text-yellow-800">Desventajas:</div>
              <ul className="mt-1 list-disc pl-5 text-yellow-700">
                <li>Puede causar fragmentación interna</li>
                <li>Requiere que el tamaño de memoria sea potencia de 2</li>
                <li>Puede desperdiciar memoria si las solicitudes no son potencias de 2</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}