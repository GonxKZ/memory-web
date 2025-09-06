import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"

export default function PageTableExplorer() {
  const [config, setConfig] = useState({
    virtualAddress: 0x12345678,
    pageSize: 4096, // 4KB
    levels: 4,
    pageWalkSpeed: 500 // ms
  })
  
  const [pageTable, setPageTable] = useState<any[]>([])
  const [isWalking, setIsWalking] = useState(false)
  const [walkProgress, setWalkProgress] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [translationResult, setTranslationResult] = useState<{
    physicalAddress: number | null,
    pageFault: boolean,
    tlbHit: boolean
  }>({
    physicalAddress: null,
    pageFault: false,
    tlbHit: false
  })

  // Initialize page table structure
  const initializePageTable = () => {
    const newPageTable = []
    const indexBits = 9 // Assuming 9 bits per level for x86-64
    
    // Create page table structure
    for (let level = 0; level < config.levels; level++) {
      // For visualization, we'll create a simplified representation
      const entries = []
      const numEntries = level === config.levels - 1 ? 512 : 8 // Limit for visualization
      
      for (let i = 0; i < numEntries; i++) {
        entries.push({
          index: i,
          valid: Math.random() > 0.2, // 80% valid entries
          frame: Math.floor(Math.random() * 1000000),
          present: Math.random() > 0.1, // 90% present entries
          accessed: Math.random() > 0.3, // 70% accessed entries
          dirty: Math.random() > 0.5 // 50% dirty entries
        })
      }
      
      newPageTable.push({
        level,
        entries,
        indexBits
      })
    }
    
    setPageTable(newPageTable)
    return newPageTable
  }

  // Calculate page table indices from virtual address
  const getPageTableIndices = (address: number) => {
    const indices = []
    let addr = address
    const offsetBits = Math.log2(config.pageSize)
    
    for (let i = 0; i < config.levels; i++) {
      const index = (addr >> offsetBits) & ((1 << 9) - 1)
      indices.unshift(index)
      addr >>= 9
    }
    
    return {
      indices,
      offset: address & ((1 << offsetBits) - 1)
    }
  }

  // Simulate page walk
  const simulatePageWalk = async () => {
    setIsWalking(true)
    setWalkProgress(0)
    setCurrentLevel(0)
    setTranslationResult({
      physicalAddress: null,
      pageFault: false,
      tlbHit: false
    })
    
    const { indices, offset } = getPageTableIndices(config.virtualAddress)
    const table = pageTable.length > 0 ? pageTable : initializePageTable()
    
    // Check TLB first (simplified)
    if (Math.random() > 0.7) {
      // TLB hit
      setTranslationResult({
        physicalAddress: (Math.floor(Math.random() * 1000000) << 12) | offset,
        pageFault: false,
        tlbHit: true
      })
      setWalkProgress(100)
      setIsWalking(false)
      return
    }
    
    // Page walk
    let currentFrame = 0
    
    for (let level = 0; level < config.levels; level++) {
      setCurrentLevel(level)
      setWalkProgress(((level + 1) / config.levels) * 100)
      
      // Get index for this level
      const index = indices[level]
      
      // Check if entry exists and is valid
      if (level < table.length && index < table[level].entries.length) {
        const entry = table[level].entries[index]
        
        if (!entry.valid) {
          // Page fault
          setTranslationResult({
            physicalAddress: null,
            pageFault: true,
            tlbHit: false
          })
          setIsWalking(false)
          return
        }
        
        // Move to next level
        currentFrame = entry.frame
      } else {
        // Page fault - entry doesn't exist
        setTranslationResult({
          physicalAddress: null,
          pageFault: true,
          tlbHit: false
        })
        setIsWalking(false)
        return
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.pageWalkSpeed))
    }
    
    // Calculate final physical address
    const physicalAddress = (currentFrame << Math.log2(config.pageSize)) | offset
    
    setTranslationResult({
      physicalAddress,
      pageFault: false,
      tlbHit: false
    })
    
    setIsWalking(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsWalking(false)
    setWalkProgress(0)
    setCurrentLevel(0)
    setTranslationResult({
      physicalAddress: null,
      pageFault: false,
      tlbHit: false
    })
  }

  // Get page table indices for current address
  const { indices, offset } = getPageTableIndices(config.virtualAddress)

  const [guided, setGuided] = useState(false)

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Explorador de Tablas de Página</h1>
        <p className="text-gray-600 mt-2">
          Visualiza la estructura jerárquica de tablas de página y el proceso de traducción
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Mapa por niveles"
        metaphor="Un edificio con recepciones: cada planta te deriva a la siguiente correcta."
        idea="Cada nivel usa un índice de la VA; flags controlan presencia, escritura y usuario."
        bullets={["Present/Writable/User", "Accessed/Dirty", "Páginas grandes"]}
        board={{ title: "Bits", content: "P/W/U/A/D/PS..." }}
      />

      {guided && (
        <GuidedFlow
          title="Consultar entrada"
          steps={[
            { title: "Elegir VA", content: "Dividimos VA en índices + offset." },
            { title: "Nivel 1", content: "Buscamos la entrada; si no es válida, fault." },
            { title: "Niveles siguientes", content: "Repetimos hasta resolver marco o detectar ausencia." },
            { title: "Permisos", content: "Leemos flags para saber si la operación está permitida." },
          ]}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="virtualAddress">Dirección Virtual (hex)</Label>
              <Input
                id="virtualAddress"
                value={`0x${config.virtualAddress.toString(16).toUpperCase()}`}
                onChange={(e) => setConfig({
                  ...config,
                  virtualAddress: parseInt(e.target.value, 16) || 0
                })}
              />
            </div>

            <div>
              <Label htmlFor="pageSize">Tamaño de Página (bytes)</Label>
              <select
                id="pageSize"
                value={config.pageSize}
                onChange={(e) => setConfig({
                  ...config,
                  pageSize: Number(e.target.value)
                })}
                className="w-full p-2 border rounded"
              >
                <option value={4096}>4 KB</option>
                <option value={2097152}>2 MB (Huge Page)</option>
                <option value={1073741824}>1 GB (Huge Page)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="levels">Niveles de Tabla de Páginas</Label>
              <Input
                id="levels"
                type="number"
                value={config.levels}
                onChange={(e) => setConfig({
                  ...config,
                  levels: Number(e.target.value)
                })}
                min="2"
                max="5"
              />
            </div>

            <div>
              <Label htmlFor="pageWalkSpeed">Velocidad de Page Walk (ms)</Label>
              <Input
                id="pageWalkSpeed"
                type="range"
                min="100"
                max="2000"
                value={config.pageWalkSpeed}
                onChange={(e) => setConfig({
                  ...config,
                  pageWalkSpeed: Number(e.target.value)
                })}
              />
              <div className="text-center">{config.pageWalkSpeed} ms</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={simulatePageWalk}
                disabled={isWalking}
              >
                {isWalking ? "Caminando..." : "Iniciar Page Walk"}
              </Button>
              <Button 
                onClick={resetSimulation}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estructura de Tablas de Página</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="font-mono text-lg mb-4">
                Dirección virtual: 0x{config.virtualAddress.toString(16).toUpperCase()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {indices.map((index, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded ${
                      currentLevel === i && isWalking 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="text-xs text-gray-500">Nivel {i + 1}</div>
                    <div className="font-mono">0x{index.toString(16).toUpperCase()}</div>
                  </div>
                ))}
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Offset</div>
                  <div className="font-mono">0x{offset.toString(16).toUpperCase()}</div>
                </div>
              </div>

              {isWalking && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>{Math.round(walkProgress)}%</span>
                  </div>
                  <Progress value={walkProgress} className="w-full" />
                </div>
              )}

              <div className="space-y-4">
                {pageTable.map((table, levelIndex) => (
                  <Card key={levelIndex}>
                    <CardHeader>
                      <CardTitle className="text-sm">Nivel {levelIndex} Tabla de Página</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500 mb-2">
                        {table.entries.length} entradas (índices 0x0 - 0x{(table.entries.length - 1).toString(16).toUpperCase()})
                      </div>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                          {table.entries.slice(0, 32).map((entry: any, entryIndex: number) => (
                            <div
                              key={entryIndex}
                              className={`
                                p-1 text-center text-xs rounded
                                ${entryIndex === indices[levelIndex] && currentLevel === levelIndex && isWalking
                                  ? "ring-2 ring-blue-500 bg-blue-500 text-white"
                                  : entry.valid
                                    ? entry.present
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              `}
                              title={`
                                Índice: 0x${entry.index.toString(16).toUpperCase()}
                                Marco: 0x${entry.frame.toString(16).toUpperCase()}
                                Válido: ${entry.valid ? "Sí" : "No"}
                                Presente: ${entry.present ? "Sí" : "No"}
                                Accedido: ${entry.accessed ? "Sí" : "No"}
                                Sucio: ${entry.dirty ? "Sí" : "No"}
                              `}
                            >
                              0x{entry.index.toString(16).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {translationResult.physicalAddress !== null && (
              <div className="p-4 bg-green-50 rounded mb-4">
                <div className="font-semibold text-green-800 mb-2">Traducción Completada</div>
                <div className="font-mono">
                  Dirección física: 0x{translationResult.physicalAddress.toString(16).toUpperCase()}
                </div>
                {translationResult.tlbHit && (
                  <div className="text-sm text-green-700 mt-1">
                    ¡TLB HIT! Traducción encontrada en caché
                  </div>
                )}
              </div>
            )}

            {translationResult.pageFault && (
              <div className="p-4 bg-red-50 rounded mb-4">
                <div className="font-semibold text-red-800 mb-2">PAGE FAULT</div>
                <div className="text-sm text-red-700">
                  La página no está presente en memoria. Se necesita una interrupción de página.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Leyenda de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded text-center">
              <Badge className="bg-green-500 mb-2">VÁLIDO</Badge>
              <div className="font-semibold">Entrada Válida</div>
              <div className="text-sm text-gray-600 mt-1">
                La entrada es válida y puede usarse para traducción
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded text-center">
              <Badge className="bg-yellow-500 mb-2">NO PRESENTE</Badge>
              <div className="font-semibold">No Presente</div>
              <div className="text-sm text-gray-600 mt-1">
                La entrada es válida pero la página no está en memoria
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded text-center">
              <Badge className="bg-red-500 mb-2">INVÁLIDO</Badge>
              <div className="font-semibold">Entrada Inválida</div>
              <div className="text-sm text-gray-600 mt-1">
                La entrada no es válida para traducción
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded text-center">
              <Badge className="bg-blue-500 mb-2">ACTUAL</Badge>
              <div className="font-semibold">Nivel Actual</div>
              <div className="text-sm text-gray-600 mt-1">
                Nivel que se está procesando actualmente
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Tablas de Página</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Estructura Jerárquica</div>
              <p className="text-sm text-blue-700">
                Las tablas de página están organizadas en una estructura jerárquica 
                de múltiples niveles para mapear direcciones virtuales a físicas.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Entradas de Página</div>
              <p className="text-sm text-green-700">
                Cada entrada contiene información como el número de marco físico, 
                bits de validez, presencia, acceso y modificación.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Page Walk</div>
              <p className="text-sm text-purple-700">
                El proceso de recorrer las tablas de página para encontrar la 
                traducción de una dirección virtual a física.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Tamaños de Página:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span><strong>4 KB:</strong> Tamaño de página estándar, buena granularidad</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span><strong>2 MB (Huge Page):</strong> Reduce entradas TLB, mejora rendimiento para grandes datasets</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span><strong>1 GB (Huge Page):</strong> Mínimas entradas TLB, máximo rendimiento para datasets muy grandes</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
