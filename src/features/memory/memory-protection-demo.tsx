import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldAlert, ShieldCheck } from "lucide-react"

export default function MemoryProtectionDemo() {
  const [memory, setMemory] = useState({
    regions: [
      { id: 0, name: "Código", start: 0x1000, end: 0x2000, permissions: ["read", "execute"], color: "bg-blue-100" },
      { id: 1, name: "Datos", start: 0x2000, end: 0x3000, permissions: ["read", "write"], color: "bg-green-100" },
      { id: 2, name: "Heap", start: 0x3000, end: 0x5000, permissions: ["read", "write"], color: "bg-yellow-100" },
      { id: 3, name: "Stack", start: 0x5000, end: 0x7000, permissions: ["read", "write"], color: "bg-red-100" }
    ],
    currentAccess: null as { regionId: number, address: number, operation: "read" | "write" | "execute" } | null
  })
  
  const [accessAttempts, setAccessAttempts] = useState<{
    regionId: number, 
    address: number, 
    operation: "read" | "write" | "execute", 
    allowed: boolean, 
    timestamp: number
  }[]>([])
  
  const [stats, setStats] = useState({
    totalAttempts: 0,
    allowed: 0,
    denied: 0,
    violations: 0
  })
  
  const [config, setConfig] = useState({
    enableProtection: true,
    enableNX: true,
    enableStackProtection: true
  })

  // Simulate memory access
  const attemptAccess = (address: number, operation: "read" | "write" | "execute") => {
    // Find which region the address belongs to
    const region = memory.regions.find(r => address >= r.start && address < r.end)
    
    if (!region) {
      // Invalid address
      setAccessAttempts(prev => [...prev, {
        regionId: -1,
        address,
        operation,
        allowed: false,
        timestamp: Date.now()
      }])
      
      setStats(prev => ({
        totalAttempts: prev.totalAttempts + 1,
        allowed: prev.allowed,
        denied: prev.denied + 1,
        violations: prev.violations + 1
      }))
      
      setMemory(prev => ({ ...prev, currentAccess: null }))
      return
    }
    
    // Check permissions
    let allowed = region.permissions.includes(operation)
    
    // Additional checks based on configuration
    if (config.enableNX && region.name === "Código" && operation === "write") {
      allowed = false
    }
    
    if (config.enableStackProtection && region.name === "Stack" && operation === "execute") {
      allowed = false
    }
    
    // Update access attempts
    setAccessAttempts(prev => [...prev, {
      regionId: region.id,
      address,
      operation,
      allowed,
      timestamp: Date.now()
    }])
    
    // Update stats
    setStats(prev => ({
      totalAttempts: prev.totalAttempts + 1,
      allowed: prev.allowed + (allowed ? 1 : 0),
      denied: prev.denied + (allowed ? 0 : 1),
      violations: prev.violations + (allowed ? 0 : 1)
    }))
    
    // Update current access
    setMemory(prev => ({ ...prev, currentAccess: { regionId: region.id, address, operation } }))
  }

  // Reset simulation
  const resetSimulation = () => {
    setAccessAttempts([])
    setStats({
      totalAttempts: 0,
      allowed: 0,
      denied: 0,
      violations: 0
    })
    setMemory(prev => ({ ...prev, currentAccess: null }))
  }

  // Calculate allowed rate
  const allowedRate = stats.totalAttempts > 0 
    ? ((stats.allowed / stats.totalAttempts) * 100).toFixed(1)
    : "0"

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Demo de Protección de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo los mecanismos de protección de memoria previenen accesos no autorizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableProtection">Protección de Memoria</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="enableProtection"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.enableProtection}
                    onChange={(e) => setConfig(prev => ({ ...prev, enableProtection: e.target.checked }))}
                  />
                  <label
                    htmlFor="enableProtection"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enableNX">Protección NX (No eXecute)</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="enableNX"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.enableNX}
                    onChange={(e) => setConfig(prev => ({ ...prev, enableNX: e.target.checked }))}
                  />
                  <label
                    htmlFor="enableNX"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enableStackProtection">Protección de Stack</Label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="enableStackProtection"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={config.enableStackProtection}
                    onChange={(e) => setConfig(prev => ({ ...prev, enableStackProtection: e.target.checked }))}
                  />
                  <label
                    htmlFor="enableStackProtection"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
            </div>

            <div>
              <Label>Dirección de Acceso</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <Button 
                  onClick={() => attemptAccess(0x1800, "execute")} 
                  variant="outline"
                >
                  Código
                </Button>
                <Button 
                  onClick={() => attemptAccess(0x2800, "read")} 
                  variant="outline"
                >
                  Datos
                </Button>
                <Button 
                  onClick={() => attemptAccess(0x4000, "write")} 
                  variant="outline"
                >
                  Heap
                </Button>
                <Button 
                  onClick={() => attemptAccess(0x6000, "write")} 
                  variant="outline"
                >
                  Stack
                </Button>
              </div>
            </div>

            <div>
              <Label>Operación</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button 
                  onClick={() => {
                    const lastAttempt = accessAttempts[accessAttempts.length - 1]
                    if (lastAttempt) {
                      attemptAccess(lastAttempt.address, "read")
                    }
                  }} 
                  variant="outline"
                >
                  Lectura
                </Button>
                <Button 
                  onClick={() => {
                    const lastAttempt = accessAttempts[accessAttempts.length - 1]
                    if (lastAttempt) {
                      attemptAccess(lastAttempt.address, "write")
                    }
                  }} 
                  variant="outline"
                >
                  Escritura
                </Button>
                <Button 
                  onClick={() => {
                    const lastAttempt = accessAttempts[accessAttempts.length - 1]
                    if (lastAttempt) {
                      attemptAccess(lastAttempt.address, "execute")
                    }
                  }} 
                  variant="outline"
                >
                  Ejecución
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetSimulation} 
                variant="outline" 
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualización de Memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="font-semibold mb-2">Layout de Memoria</div>
              <div className="space-y-1">
                {memory.regions.map(region => {
                  const isCurrentRegion = memory.currentAccess?.regionId === region.id
                  return (
                    <div 
                      key={region.id}
                      className={`
                        p-3 rounded flex justify-between items-center
                        ${region.color}
                        ${isCurrentRegion ? "ring-2 ring-blue-500" : ""}
                      `}
                    >
                      <div>
                        <div className="font-semibold">{region.name}</div>
                        <div className="text-xs text-gray-600">
                          0x{region.start.toString(16).toUpperCase()} - 0x{region.end.toString(16).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {region.permissions.includes("read") && (
                          <Badge variant="secondary" className="text-xs">R</Badge>
                        )}
                        {region.permissions.includes("write") && (
                          <Badge variant="secondary" className="text-xs">W</Badge>
                        )}
                        {region.permissions.includes("execute") && (
                          <Badge variant="secondary" className="text-xs">X</Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="text-xs text-gray-500">Intentos Totales</div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalAttempts}</div>
              </div>
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="text-xs text-gray-500">Permitidos</div>
                <div className="text-2xl font-bold text-green-600">{stats.allowed}</div>
              </div>
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="text-xs text-gray-500">Denegados</div>
                <div className="text-2xl font-bold text-red-600">{stats.denied}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Tasa de Aciertos</span>
                <span>{allowedRate}%</span>
              </div>
              <Progress 
                value={parseFloat(allowedRate)} 
                className="w-full" 
                color="green"
              />
            </div>

            <div>
              <div className="font-semibold mb-2">Acceso Actual</div>
              {memory.currentAccess ? (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-mono">
                        Dirección: 0x{memory.currentAccess.address.toString(16).toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Operación: {memory.currentAccess.operation}
                      </div>
                    </div>
                    <div>
                      {memory.regions[memory.currentAccess.regionId] && (
                        <Badge variant="outline">
                          {memory.regions[memory.currentAccess.regionId].name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                  No hay accesos recientes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Registro de Accesos</CardTitle>
        </CardHeader>
        <CardContent>
          {accessAttempts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {accessAttempts.slice(-8).map((attempt, index) => (
                <div 
                  key={index} 
                  className={`
                    p-3 rounded border flex flex-col
                    ${attempt.allowed 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-sm">
                      0x{attempt.address.toString(16).toUpperCase()}
                    </div>
                    <Badge 
                      variant={attempt.allowed ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {attempt.operation.charAt(0).toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-1">
                    {attempt.regionId >= 0 
                      ? memory.regions[attempt.regionId]?.name 
                      : "Inválida"}
                  </div>
                  
                  <div className="mt-2">
                    {attempt.allowed ? (
                      <div className="flex items-center text-xs text-green-600">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Permitido
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-red-600">
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        Denegado
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay intentos de acceso registrados todavía</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Mecanismos de Protección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2 text-blue-800">Protección de Memoria</div>
              <p className="text-sm text-gray-600 mb-4">
                Los sistemas operan dividen la memoria en regiones con diferentes 
                permisos (lectura, escritura, ejecución) para prevenir accesos no autorizados.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-sm">Prevención de ejecución de datos</span>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-sm">Protección contra escritura en código</span>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-sm">Separación de espacios de proceso</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-green-800">Protecciones Específicas</div>
              <p className="text-sm text-gray-600 mb-4">
                Protecciones adicionales para casos específicos como stack y heap.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-sm">Protección NX (DEP) - Evita ejecución en datos</span>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-sm">Protección de Stack - Evita ejecución en stack</span>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-sm">Stack Canaries - Detecta corrupción de stack</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Seguridad:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Marca las páginas que solo contienen datos como no ejecutables</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa stack canaries para detectar buffer overflows</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Implementa ASLR (Address Space Layout Randomization)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Valida índices de arrays y tamaños de buffers</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
