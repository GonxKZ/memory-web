import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"

export default function TLBWalk() {
  const [virtualAddress, setVirtualAddress] = useState<number>(0x12345678)
  const [pageSize, setPageSize] = useState<number>(4096) // 4KB
  const [levels, setLevels] = useState<number>(4)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [steps, setSteps] = useState<string[]>([])

  // Calculate page table indices
  const getPageTableIndices = (address: number, levels: number, pageSize: number) => {
    const indices = []
    let addr = address
    const offsetBits = Math.log2(pageSize)
    
    for (let i = 0; i < levels; i++) {
      // Assuming 9 bits for each level (4KB pages, 48-bit addressing)
      const index = addr & ((1 << 9) - 1)
      indices.unshift(index)
      addr >>= 9
    }
    
    return {
      indices,
      offset: address & ((1 << offsetBits) - 1)
    }
  }

  const startTLBWalk = () => {
    const { indices, offset } = getPageTableIndices(virtualAddress, levels, pageSize)
    const newSteps = [
      `Dirección virtual: 0x${virtualAddress.toString(16).toUpperCase()}`,
      `Offset: 0x${offset.toString(16).toUpperCase()}`
    ]
    
    indices.forEach((index, i) => {
      newSteps.push(`Nivel ${i + 1} índice: 0x${index.toString(16).toUpperCase()}`)
    })
    
    newSteps.push("Búsqueda en TLB...")
    newSteps.push("¡TLB HIT! Traducción completada.")
    
    setSteps(newSteps)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetWalk = () => {
    setSteps([])
    setCurrentStep(0)
  }

  const { indices, offset } = getPageTableIndices(virtualAddress, levels, pageSize)
  const [guided, setGuided] = useState(false)

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">TLB Walk</h1>
        <p className="text-gray-600 mt-2">
          Visualiza el proceso de traducción de direcciones virtuales a físicas
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Atajo del TLB"
        metaphor="Si el número está en favoritos, llamas directo; si no, buscas en el directorio por niveles."
        idea="Un hit en TLB evita el page walk. Páginas grandes reducen fallos del TLB."
        bullets={["VA = índices + offset", "Hit/miss del TLB", "Páginas grandes"]}
        board={{ title: "Efectivo", content: "Tiempo ≈ Hit + Miss × (Niveles × latencia)" }}
      />

      {guided && (
        <GuidedFlow
          title="De VA a PA"
          steps={[
            { title: "Dividir VA", content: "Extraemos offset e índices de cada nivel." },
            { title: "Consultar TLB", content: "Si acierta, ya tenemos PPN." },
            { title: "Page walk", content: "En miss, recorremos niveles para resolver PPN." },
            { title: "Insertar en TLB", content: "Guardamos la traducción para futuros accesos." },
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
                value={virtualAddress.toString(16)}
                onChange={(e) => setVirtualAddress(parseInt(e.target.value, 16) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="pageSize">Tamaño de Página (bytes)</Label>
              <Input
                id="pageSize"
                type="number"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                min="4096"
              />
            </div>

            <div>
              <Label htmlFor="levels">Niveles de Tabla de Páginas</Label>
              <Input
                id="levels"
                type="number"
                value={levels}
                onChange={(e) => setLevels(Number(e.target.value))}
                min="2"
                max="5"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={startTLBWalk}>Iniciar TLB Walk</Button>
              <Button onClick={resetWalk} variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Desglose de Dirección</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="font-mono text-lg mb-2">
                Dirección virtual: 0x{virtualAddress.toString(16).toUpperCase()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {indices.map((index, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500">Nivel {i + 1}</div>
                    <div className="font-mono">0x{index.toString(16).toUpperCase()}</div>
                  </div>
                ))}
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Offset</div>
                  <div className="font-mono">0x{offset.toString(16).toUpperCase()}</div>
                </div>
              </div>
            </div>

            {steps.length > 0 && (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Paso {currentStep + 1} de {steps.length}</span>
                    <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded mb-4">
                  <div className="font-mono">{steps[currentStep]}</div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    onClick={prevStep} 
                    disabled={currentStep === 0}
                  >
                    Anterior
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    disabled={currentStep === steps.length - 1}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Estados de TLB</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded text-center">
              <Badge className="bg-green-500 mb-2">HIT</Badge>
              <div className="font-semibold">TLB Hit</div>
              <div className="text-sm text-gray-600 mt-1">
                Traducción encontrada en TLB
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded text-center">
              <Badge className="bg-yellow-500 mb-2">MISS</Badge>
              <div className="font-semibold">TLB Miss</div>
              <div className="text-sm text-gray-600 mt-1">
                Traducción no encontrada, walk requerido
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded text-center">
              <Badge className="bg-blue-500 mb-2">WALK</Badge>
              <div className="font-semibold">Page Walk</div>
              <div className="text-sm text-gray-600 mt-1">
                Recorrido por tablas de páginas
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded text-center">
              <Badge className="bg-red-500 mb-2">FAULT</Badge>
              <div className="font-semibold">Page Fault</div>
              <div className="text-sm text-gray-600 mt-1">
                Página no presente en memoria
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
