import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

export default function MemoryProtectionVisualization() {
  const [config, setConfig] = useState({
    protectionType: "nx" as "nx" | "aslr" | "stackCanary" | "smeP" | "cfi",
    memorySize: 1024, // KB
    blockSize: 64, // bytes
    protectionLevel: 3, // 1-5
    simulationSpeed: 200 // ms
  })
  
  const [protection, setProtection] = useState({
    memoryRegions: [] as {
      id: number,
      name: string,
      start: number,
      end: number,
      permissions: ("read" | "write" | "execute")[],
      protected: boolean,
      violations: number
    }[],
    accessAttempts: [] as {
      address: number,
      operation: "read" | "write" | "execute",
      allowed: boolean,
      violationType: string | null,
      timestamp: number
    }[],
    stats: {
      totalAttempts: 0,
      allowed: 0,
      denied: 0,
      violations: 0,
      protectionEffectiveness: 0
    }
  })
  
  const [history, setHistory] = useState<{
    time: number,
    allowed: number,
    denied: number,
    violations: number,
    effectiveness: number
  }[]>([])
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [guided, setGuided] = useState(false)

  // Initialize memory regions with different protection levels
  useState(() => {
    const regions: { id: number; name: string; start: number; end: number; permissions: ("read"|"write"|"execute")[]; protected: boolean; violations: number; }[] = [
      {
        id: 0,
        name: "Código",
        start: 0,
        end: 256 * 1024, // 256KB
        permissions: ["read", "execute"],
        protected: true,
        violations: 0
      },
      {
        id: 1,
        name: "Datos",
        start: 256 * 1024,
        end: 512 * 1024, // 256KB
        permissions: ["read", "write"],
        protected: true,
        violations: 0
      },
      {
        id: 2,
        name: "Heap",
        start: 512 * 1024,
        end: 768 * 1024, // 256KB
        permissions: ["read", "write"],
        protected: true,
        violations: 0
      },
      {
        id: 3,
        name: "Stack",
        start: 768 * 1024,
        end: 1024 * 1024, // 256KB
        permissions: ["read", "write"],
        protected: true,
        violations: 0
      }
    ]
    
    setProtection(prev => ({
      ...prev,
      memoryRegions: regions
    }))
  })

  // Simulate memory protection
  const simulateMemoryProtection = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset protection stats
    setProtection(prev => ({
      ...prev,
      accessAttempts: [],
      stats: {
        totalAttempts: 0,
        allowed: 0,
        denied: 0,
        violations: 0,
        protectionEffectiveness: 0
      }
    }))
    
    const newHistory = []
    let totalAttempts = 0
    let allowed = 0
    let denied = 0
    let violations = 0
    let protectionEffectiveness = 0
    
    // Simulate memory accesses
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate random memory access
      const address = Math.floor(Math.random() * config.memorySize * 1024)
      const operation = ["read", "write", "execute"][Math.floor(Math.random() * 3)] as "read" | "write" | "execute"
      
      // Check if access is allowed based on memory region permissions
      const region = protection.memoryRegions.find(r => address >= r.start && address < r.end)
      let allowedAccess = false
      let violationType = null
      
      if (region) {
        // Check permissions
        if (region.permissions.includes(operation)) {
          allowedAccess = true
        } else {
          // Permission violation
          allowedAccess = false
          violationType = `${operation} not allowed in ${region.name}`
          violations++
        }
        
        // Apply protection mechanisms
        if (config.protectionType === "nx" && operation === "execute" && !region.permissions.includes("execute")) {
          // NX bit protection
          allowedAccess = false
          violationType = "NX bit violation"
        } else if (config.protectionType === "aslr" && Math.random() > 0.95) {
          // ASLR - randomize addresses (simulated)
          allowedAccess = false
          violationType = "ASLR randomized address"
        } else if (config.protectionType === "stackCanary" && region.name === "Stack" && operation === "write" && Math.random() > 0.9) {
          // Stack canary protection
          allowedAccess = false
          violationType = "Stack canary violation"
        } else if (config.protectionType === "smeP" && operation === "execute" && region && region.permissions.includes("execute")) {
          // SMEP protection
          allowedAccess = false
          violationType = "SMEP violation"
        } else if (config.protectionType === "cfi" && Math.random() > 0.98) {
          // Control Flow Integrity
          allowedAccess = false
          violationType = "CFI violation"
        }
      } else {
        // Invalid address
        allowedAccess = false
        violationType = "Invalid address"
        violations++
      }
      
      // Update counters
      totalAttempts++
      if (allowedAccess) {
        allowed++
      } else {
        denied++
      }
      
      // Calculate effectiveness
      protectionEffectiveness = totalAttempts > 0 ? (denied / totalAttempts) * 100 : 0
      
      // Update protection state
      setProtection(prev => {
        // Update region violations if needed
        const updatedRegions = prev.memoryRegions.map(region => {
          if (region && address >= region.start && address < region.end && !allowedAccess) {
            return {
              ...region,
              violations: region.violations + 1
            }
          }
          return region
        })
        
        // Add access attempt
        const newAccessAttempt = {
          address,
          operation,
          allowed: allowedAccess,
          violationType,
          timestamp: Date.now()
        }
        
        return {
          ...prev,
          memoryRegions: updatedRegions,
          accessAttempts: [...prev.accessAttempts.slice(-49), newAccessAttempt],
          stats: {
            totalAttempts,
            allowed,
            denied,
            violations,
            protectionEffectiveness: parseFloat(protectionEffectiveness.toFixed(2))
          }
        }
      })
      
      // Add to history every 10 iterations
      if (i % 10 === 0) {
        newHistory.push({
          time: i,
          allowed,
          denied,
          violations,
          effectiveness: parseFloat(protectionEffectiveness.toFixed(2))
        })
        setHistory(newHistory)
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    setProtection({
      memoryRegions: protection.memoryRegions.map(region => ({
        ...region,
        violations: 0
      })),
      accessAttempts: [],
      stats: {
        totalAttempts: 0,
        allowed: 0,
        denied: 0,
        violations: 0,
        protectionEffectiveness: 0
      }
    })
  }

  // Protection type information
  const protectionInfo = {
    "nx": {
      name: "NX Bit",
      description: "Bit No-eXecute que previene ejecución en regiones de datos",
      color: "#3b82f6",
      icon: "🛡️"
    },
    "aslr": {
      name: "ASLR",
      description: "Randomización del layout del espacio de direcciones",
      color: "#10b981",
      icon: "🔀"
    },
    "stackCanary": {
      name: "Stack Canary",
      description: "Valores especiales para detectar corrupción del stack",
      color: "#8b5cf6",
      icon: "🐦"
    },
    "smeP": {
      name: "SMEP",
      description: "Prevención de ejecución en modo supervisor",
      color: "#f59e0b",
      icon: "🔒"
    },
    "cfi": {
      name: "CFI",
      description: "Integridad del flujo de control",
      color: "#ef4444",
      icon: "🔗"
    }
  }

  const currentProtection = protectionInfo[config.protectionType]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Protección de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo los mecanismos de protección previenen accesos no autorizados a memoria
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Candados de memoria"
        metaphor="R (leer), W (escribir) y X (ejecutar) son tres llaves. Si no tienes la correcta, no pasas."
        idea="El bit NX impide ejecutar datos; ASLR cambia posiciones para dificultar ataques de adivinación."
        bullets={["Permisos RWX", "Bit NX", "ASLR"]}
        board={{ title: "Chequear acceso", content: "Permitir si operación ∈ permisos(region) y política lo autoriza" }}
      />

      {guided && (
        <GuidedFlow
          title="¿Permitido o denegado?"
          steps={[
            { title: "Identificar región", content: "Ubicamos la dirección en Code/Datos/Heap/Stack." },
            { title: "Comprobar permiso", content: "¿La operación (R/W/X) está permitida?" },
            { title: "Política extra", content: "NX, ASLR o CFI pueden bloquear aunque haya permiso básico." },
            { title: "Resultado", content: "Registramos intento y efecto (violación, permitido)." },
          ]}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="protectionType">Tipo de Protección</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(protectionInfo).map(([key, protection]) => (
                  <Button
                    key={key}
                    variant={config.protectionType === key ? "default" : "outline"}
                    onClick={() => setConfig({...config, protectionType: key as any})}
                    className="flex items-center justify-center"
                  >
                    <span className="mr-1 text-lg">{protection.icon}</span>
                    <span className="text-xs">{protection.name.split(" ")[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (KB)</Label>
              <Input
                id="memorySize"
                type="number"
                value={config.memorySize}
                onChange={(e) => setConfig({...config, memorySize: Number(e.target.value)})}
                min="256"
                step="256"
              />
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="16"
                step="16"
              />
            </div>

            <div>
              <Label htmlFor="protectionLevel">Nivel de Protección</Label>
              <Input
                id="protectionLevel"
                type="range"
                min="1"
                max="5"
                value={config.protectionLevel}
                onChange={(e) => setConfig({...config, protectionLevel: Number(e.target.value)})}
              />
              <div className="text-center">{config.protectionLevel}</div>
            </div>

            <div>
              <Label htmlFor="simulationSpeed">Velocidad de Simulación (ms)</Label>
              <Input
                id="simulationSpeed"
                type="range"
                min="50"
                max="1000"
                value={config.simulationSpeed}
                onChange={(e) => setConfig({...config, simulationSpeed: Number(e.target.value)})}
              />
              <div className="text-center">{config.simulationSpeed} ms</div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateMemoryProtection} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Simulando..." : "Iniciar Simulación"}
              </Button>
              <Button 
                onClick={resetSimulation} 
                variant="outline"
              >
                Reset
              </Button>
            </div>

            {isRunning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle 
              className="flex items-center"
              style={{ color: currentProtection.color }}
            >
              <span className="mr-2 text-2xl">{currentProtection.icon}</span>
              {currentProtection.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{currentProtection.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentProtection.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Permitidos</div>
                  <div className="text-2xl font-bold text-green-600">
                    {protection.stats.allowed}
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Denegados</div>
                  <div className="text-2xl font-bold text-red-600">
                    {protection.stats.denied}
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Violaciones</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {protection.stats.violations}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Efectividad</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {protection.stats.protectionEffectiveness}%
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Regiones de Memoria</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {protection.memoryRegions.map(region => (
                    <Card key={region.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">{region.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Dirección Inicio</div>
                              <div className="font-mono text-sm">
                                0x{region.start.toString(16).toUpperCase()}
                              </div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Dirección Fin</div>
                              <div className="font-mono text-sm">
                                0x{region.end.toString(16).toUpperCase()}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Permisos</div>
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
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Violaciones</span>
                              <span>{region.violations}</span>
                            </div>
                            <Progress 
                              value={region.violations > 0 ? Math.min(region.violations * 10, 100) : 0} 
                              className="w-full" 
                              color="red"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Accesos Recientes</div>
                <div className="flex flex-wrap gap-1">
                  {protection.accessAttempts.slice(-20).map((attempt, index) => (
                    <div
                      key={index}
                      className={`
                        w-10 h-10 rounded flex items-center justify-center text-xs font-mono
                        ${attempt.allowed 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"}
                      `}
                      title={
                        `Dirección: 0x${attempt.address.toString(16).toUpperCase()}
` +
                        `Operación: ${attempt.operation}
` +
                        `${attempt.allowed ? "Permitido" : "Denegado"}
` +
                        `${attempt.violationType ? `Violación: ${attempt.violationType}` : ""}`
                      }
                    >
                      {attempt.operation === "read" && "R"}
                      {attempt.operation === "write" && "W"}
                      {attempt.operation === "execute" && "X"}
                      {!attempt.allowed && "!"}
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
          <CardTitle>Historial de Protección</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={history}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: "Tiempo", position: "insideBottom", offset: -5 }} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: "Efectividad (%)", angle: 90, position: "insideRight" }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="allowed" 
                    stroke="#10b981" 
                    activeDot={{ r: 8 }} 
                    name="Permitidos"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="denied" 
                    stroke="#ef4444" 
                    name="Denegados"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="violations" 
                    stroke="#8b5cf6" 
                    name="Violaciones"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="effectiveness" 
                    stroke="#3b82f6" 
                    name="Efectividad"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay datos de simulación todavía. Ejecute una simulación para ver el historial.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Técnicas de Protección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(protectionInfo).map(([key, protection]) => (
              <Card 
                key={key}
                className={config.protectionType === key ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader>
                  <CardTitle 
                    className="flex items-center text-sm"
                    style={{ color: protection.color }}
                  >
                    <span className="mr-2 text-xl">{protection.icon}</span>
                    {protection.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      {protection.description}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Ventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "nx" && "Prevención de ejecución de datos"}
                            {key === "aslr" && "Dificulta exploits"}
                            {key === "stackCanary" && "Detección de buffer overflows"}
                            {key === "smeP" && "Prevención de ejecución en modo supervisor"}
                            {key === "cfi" && "Integridad del flujo de control"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-green-500">✓</span>
                          <span>
                            {key === "nx" && "Bajo overhead"}
                            {key === "aslr" && "Protección automática"}
                            {key === "stackCanary" && "Simple de implementar"}
                            {key === "smeP" && "Protección de kernel"}
                            {key === "cfi" && "Prevención de ROP/JOP"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-xs mb-1">Desventajas:</div>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "nx" && "No protege contra todos los exploits"}
                            {key === "aslr" && "Puede romper aplicaciones mal escritas"}
                            {key === "stackCanary" && "Solo protege stack"}
                            {key === "smeP" && "Requiere soporte específico de CPU"}
                            {key === "cfi" && "Complejidad de implementación"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-1 text-red-500">✗</span>
                          <span>
                            {key === "nx" && "Puede requerir JIT tricks"}
                            {key === "aslr" && "Posible fallo aleatorio"}
                            {key === "stackCanary" && "Overhead en cada función"}
                            {key === "smeP" && "Puede romper drivers mal escritos"}
                            {key === "cfi" && "Impacto en rendimiento"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos de Seguridad:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Habilita NX bit en sistemas modernos para prevenir ejecución de datos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa ASLR para dificultar exploits basados en direcciones conocidas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Implementa stack canaries para detectar buffer overflows</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Habilita SMEP para proteger el kernel de código de usuario</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Usa CFI para prevenir manipulación del flujo de control</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
