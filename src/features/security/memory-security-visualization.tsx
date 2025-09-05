import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"

export default function MemorySecurityVisualization() {
  const [config, setConfig] = useState({
    protectionType: "nx" as "nx" | "aslr" | "stackCanary" | "smeP" | "controlFlow",
    memorySize: 1024, // 1KB for visualization
    vulnerabilityType: "bufferOverflow" as "bufferOverflow" | "useAfterFree" | "doubleFree" | "nullPointer",
    attackVector: "stack" as "stack" | "heap" | "code" | "data"
  })
  
  const [security, setSecurity] = useState({
    protections: {
      nx: true,
      aslr: true,
      stackCanary: true,
      smeP: false,
      controlFlow: false
    },
    vulnerabilities: {
      bufferOverflow: 0,
      useAfterFree: 0,
      doubleFree: 0,
      nullPointer: 0
    },
    attacksBlocked: 0,
    attacksSuccessful: 0,
    securityScore: 0
  })
  
  const [simulation, setSimulation] = useState({
    memoryLayout: [] as {address: number, type: string, protected: boolean, vulnerable: boolean}[],
    stack: [] as {address: number, value: number, canary: boolean, protected: boolean}[],
    heap: [] as {address: number, allocated: boolean, freed: boolean, vulnerable: boolean}[],
    codeSegment: [] as {address: number, instruction: string, protected: boolean, executable: boolean}[],
    attackHistory: [] as {type: string, success: boolean, timestamp: number}[]
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize memory layout
  useEffect(() => {
    // Create memory layout
    const memoryLayout = []
    const stack = []
    const heap = []
    const codeSegment = []
    
    // Stack (lower addresses)
    for (let i = 0; i < 256; i++) {
      const address = i
      memoryLayout.push({
        address,
        type: "stack",
        protected: security.protections.stackCanary,
        vulnerable: config.vulnerabilityType === "bufferOverflow"
      })
      
      stack.push({
        address,
        value: Math.floor(Math.random() * 256),
        canary: security.protections.stackCanary && i % 32 === 31, // Place canaries every 32 bytes
        protected: security.protections.stackCanary
      })
    }
    
    // Code segment (middle addresses)
    for (let i = 256; i < 512; i++) {
      const address = i
      memoryLayout.push({
        address,
        type: "code",
        protected: security.protections.nx,
        vulnerable: config.attackVector === "code"
      })
      
      codeSegment.push({
        address,
        instruction: `mov eax, ${Math.floor(Math.random() * 256)}`,
        protected: security.protections.nx,
        executable: !security.protections.nx || config.attackVector === "code"
      })
    }
    
    // Heap (higher addresses)
    for (let i = 512; i < 1024; i++) {
      const address = i
      memoryLayout.push({
        address,
        type: "heap",
        protected: false, // Heap protections are more complex
        vulnerable: config.vulnerabilityType === "useAfterFree" || config.vulnerabilityType === "doubleFree"
      })
      
      heap.push({
        address,
        allocated: Math.random() > 0.5,
        freed: false,
        vulnerable: config.vulnerabilityType === "useAfterFree" || config.vulnerabilityType === "doubleFree"
      })
    }
    
    setSimulation({
      memoryLayout,
      stack,
      heap,
      codeSegment,
      attackHistory: []
    })
  }, [config, security])

  // Simulate security attack
  const simulateAttack = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Reset attack history
    setSimulation(prev => ({
      ...prev,
      attackHistory: []
    }))
    
    // Simulate attack attempts
    for (let i = 0; i < 100; i++) {
      setProgress((i / 100) * 100)
      
      // Generate random attack
      const attackTypes = ["bufferOverflow", "useAfterFree", "doubleFree", "nullPointer"]
      const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)] as 
        "bufferOverflow" | "useAfterFree" | "doubleFree" | "nullPointer"
      
      const attackVectors = ["stack", "heap", "code", "data"]
      const attackVector = attackVectors[Math.floor(Math.random() * attackVectors.length)] as 
        "stack" | "heap" | "code" | "data"
      
      // Determine if attack is successful based on protections
      let success = false
      
      switch (attackType) {
        case "bufferOverflow":
          if (attackVector === "stack") {
            success = !security.protections.stackCanary || Math.random() > 0.9
          } else if (attackVector === "heap") {
            success = true // Heap overflows are harder to protect
          }
          break
          
        case "useAfterFree":
          if (attackVector === "heap") {
            success = true // UAF is difficult to prevent completely
          }
          break
          
        case "doubleFree":
          if (attackVector === "heap") {
            success = !security.protections.controlFlow || Math.random() > 0.8
          }
          break
          
        case "nullPointer":
          success = true // Hard to prevent without performance impact
          break
      }
      
      // Update security stats
      setSecurity(prev => ({
        ...prev,
        vulnerabilities: {
          ...prev.vulnerabilities,
          [attackType]: prev.vulnerabilities[attackType] + 1
        },
        attacksBlocked: success ? prev.attacksBlocked : prev.attacksBlocked + 1,
        attacksSuccessful: success ? prev.attacksSuccessful + 1 : prev.attacksSuccessful,
        securityScore: Math.max(0, prev.securityScore + (success ? -1 : 1))
      }))
      
      // Add to attack history
      setSimulation(prev => ({
        ...prev,
        attackHistory: [
          ...prev.attackHistory.slice(-19),
          {
            type: attackType,
            success,
            timestamp: Date.now()
          }
        ]
      }))
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Toggle protection
  const toggleProtection = (protection: keyof typeof security.protections) => {
    setSecurity(prev => ({
      ...prev,
      protections: {
        ...prev.protections,
        [protection]: !prev.protections[protection]
      }
    }))
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    
    setSecurity({
      protections: {
        nx: true,
        aslr: true,
        stackCanary: true,
        smeP: false,
        controlFlow: false
      },
      vulnerabilities: {
        bufferOverflow: 0,
        useAfterFree: 0,
        doubleFree: 0,
        nullPointer: 0
      },
      attacksBlocked: 0,
      attacksSuccessful: 0,
      securityScore: 100
    })
    
    setSimulation({
      memoryLayout: [],
      stack: [],
      heap: [],
      codeSegment: [],
      attackHistory: []
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Seguridad de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo las técnicas de seguridad protegen la memoria contra ataques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración de Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="protectionType">Tipo de Protección</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.protectionType === "nx" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "nx"})}
                >
                  NX Bit
                </Button>
                <Button
                  variant={config.protectionType === "aslr" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "aslr"})}
                >
                  ASLR
                </Button>
                <Button
                  variant={config.protectionType === "stackCanary" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "stackCanary"})}
                >
                  Stack Canary
                </Button>
                <Button
                  variant={config.protectionType === "smeP" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "smeP"})}
                >
                  SMEP
                </Button>
                <Button
                  variant={config.protectionType === "controlFlow" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "controlFlow"})}
                >
                  Control Flow
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (bytes)</Label>
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
              <Label htmlFor="vulnerabilityType">Tipo de Vulnerabilidad</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.vulnerabilityType === "bufferOverflow" ? "default" : "outline"}
                  onClick={() => setConfig({...config, vulnerabilityType: "bufferOverflow"})}
                >
                  Buffer Overflow
                </Button>
                <Button
                  variant={config.vulnerabilityType === "useAfterFree" ? "default" : "outline"}
                  onClick={() => setConfig({...config, vulnerabilityType: "useAfterFree"})}
                >
                  Use After Free
                </Button>
                <Button
                  variant={config.vulnerabilityType === "doubleFree" ? "default" : "outline"}
                  onClick={() => setConfig({...config, vulnerabilityType: "doubleFree"})}
                >
                  Double Free
                </Button>
                <Button
                  variant={config.vulnerabilityType === "nullPointer" ? "default" : "outline"}
                  onClick={() => setConfig({...config, vulnerabilityType: "nullPointer"})}
                >
                  Null Pointer
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="attackVector">Vector de Ataque</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.attackVector === "stack" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackVector: "stack"})}
                >
                  Stack
                </Button>
                <Button
                  variant={config.attackVector === "heap" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackVector: "heap"})}
                >
                  Heap
                </Button>
                <Button
                  variant={config.attackVector === "code" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackVector: "code"})}
                >
                  Código
                </Button>
                <Button
                  variant={config.attackVector === "data" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackVector: "data"})}
                >
                  Datos
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateAttack} 
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
            <CardTitle>Estado de Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ataques Bloqueados</div>
                  <div className="text-2xl font-bold text-green-600">{security.attacksBlocked}</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ataques Exitosos</div>
                  <div className="text-2xl font-bold text-red-600">{security.attacksSuccessful}</div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Puntuación de Seguridad</div>
                  <div className="text-2xl font-bold text-blue-600">{security.securityScore}</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Vulnerabilidades</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.values(security.vulnerabilities).reduce((sum, count) => sum + count, 0)}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Protecciones Activas</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    variant={security.protections.nx ? "default" : "outline"}
                    onClick={() => toggleProtection("nx")}
                    className={`
                      ${security.protections.nx 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-gray-200 hover:bg-gray-300"}
                    `}
                  >
                    NX Bit {security.protections.nx ? "✓" : "✗"}
                  </Button>
                  
                  <Button
                    variant={security.protections.aslr ? "default" : "outline"}
                    onClick={() => toggleProtection("aslr")}
                    className={`
                      ${security.protections.aslr 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-gray-200 hover:bg-gray-300"}
                    `}
                  >
                    ASLR {security.protections.aslr ? "✓" : "✗"}
                  </Button>
                  
                  <Button
                    variant={security.protections.stackCanary ? "default" : "outline"}
                    onClick={() => toggleProtection("stackCanary")}
                    className={`
                      ${security.protections.stackCanary 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-gray-200 hover:bg-gray-300"}
                    `}
                  >
                    Stack Canary {security.protections.stackCanary ? "✓" : "✗"}
                  </Button>
                  
                  <Button
                    variant={security.protections.smeP ? "default" : "outline"}
                    onClick={() => toggleProtection("smeP")}
                    className={`
                      ${security.protections.smeP 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-gray-200 hover:bg-gray-300"}
                    `}
                  >
                    SMEP {security.protections.smeP ? "✓" : "✗"}
                  </Button>
                  
                  <Button
                    variant={security.protections.controlFlow ? "default" : "outline"}
                    onClick={() => toggleProtection("controlFlow")}
                    className={`
                      ${security.protections.controlFlow 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-gray-200 hover:bg-gray-300"}
                    `}
                  >
                    Control Flow {security.protections.controlFlow ? "✓" : "✗"}
                  </Button>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Layout de Memoria</div>
                <div className="h-32 relative bg-gray-50 rounded overflow-hidden">
                  {/* Stack (lower addresses) */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1/4 bg-red-100 border-r border-red-300"
                    style={{ width: "25%" }}
                  >
                    <div className="absolute top-2 left-2 text-xs text-red-800 font-semibold">
                      Stack
                    </div>
                    {simulation.stack.slice(0, 10).map((entry, index) => (
                      <div
                        key={entry.address}
                        className={`
                          absolute w-4 h-4 rounded
                          ${entry.canary 
                            ? "bg-yellow-500" 
                            : entry.protected 
                              ? "bg-green-500" 
                              : "bg-red-500"}
                        `}
                        style={{
                          left: `${(index / 10) * 20 + 5}%`,
                          top: `${20 + (index % 5) * 15}%`
                        }}
                        title={
                          entry.canary 
                            ? `Canario en dirección 0x${entry.address.toString(16)}` 
                            : `Valor en dirección 0x${entry.address.toString(16)}`
                        }
                      ></div>
                    ))}
                  </div>
                  
                  {/* Code segment (middle addresses) */}
                  <div 
                    className="absolute left-1/4 top-0 bottom-0 w-1/4 bg-blue-100 border-r border-blue-300"
                    style={{ left: "25%", width: "25%" }}
                  >
                    <div className="absolute top-2 left-2 text-xs text-blue-800 font-semibold">
                      Código
                    </div>
                    {simulation.codeSegment.slice(0, 10).map((entry, index) => (
                      <div
                        key={entry.address}
                        className={`
                          absolute w-4 h-4 rounded
                          ${entry.protected 
                            ? entry.executable 
                              ? "bg-red-500" 
                              : "bg-green-500"
                            : "bg-blue-500"}
                        `}
                        style={{
                          left: `${(index / 10) * 20 + 5}%`,
                          top: `${20 + (index % 5) * 15}%`
                        }}
                        title={
                          entry.protected 
                            ? entry.executable 
                              ? `Código ejecutable protegido (dirección 0x${entry.address.toString(16)})` 
                              : `Código no ejecutable (dirección 0x${entry.address.toString(16)})`
                            : `Código sin protección (dirección 0x${entry.address.toString(16)})`
                        }
                      ></div>
                    ))}
                  </div>
                  
                  {/* Heap (higher addresses) */}
                  <div 
                    className="absolute left-1/2 top-0 bottom-0 w-1/2 bg-green-100"
                    style={{ left: "50%", width: "50%" }}
                  >
                    <div className="absolute top-2 left-2 text-xs text-green-800 font-semibold">
                      Heap
                    </div>
                    {simulation.heap.slice(0, 20).map((entry, index) => (
                      <div
                        key={entry.address}
                        className={`
                          absolute w-4 h-4 rounded
                          ${entry.allocated 
                            ? entry.freed 
                              ? "bg-gray-500" 
                              : "bg-green-500"
                            : "bg-gray-200"}
                        `}
                        style={{
                          left: `${(index / 20) * 40 + 5}%`,
                          top: `${20 + (index % 5) * 15}%`
                        }}
                        title={
                          entry.allocated 
                            ? entry.freed 
                              ? `Bloque libre en dirección 0x${entry.address.toString(16)}` 
                              : `Bloque asignado en dirección 0x${entry.address.toString(16)}`
                            : `Bloque no asignado en dirección 0x${entry.address.toString(16)}`
                        }
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Historial de Ataques</div>
                <div className="flex flex-wrap gap-1">
                  {simulation.attackHistory.map((attack, index) => (
                    <div
                      key={index}
                      className={`
                        w-8 h-8 rounded flex items-center justify-center text-xs font-mono
                        ${attack.success 
                          ? "bg-red-500 text-white" 
                          : "bg-green-500 text-white"}
                      `}
                      title={
                        `${attack.type} ${attack.success ? "exitoso" : "bloqueado"} en ${attack.timestamp}`
                      }
                    >
                      {attack.success ? "✗" : "✓"}
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
          <CardTitle>Detalles de Protección</CardTitle>
        </CardHeader>
        <CardContent>
          {config.protectionType === "nx" && (
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">NX Bit (No-eXecute)</div>
              <p className="text-sm text-blue-700 mb-3">
                El bit NX marca páginas de memoria como no ejecutables, previniendo 
                la ejecución de código malicioso en áreas de datos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-sm mb-1">Ventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Prevención de ejecución de datos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Bajo overhead</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Implementación simple en hardware</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold text-sm mb-1">Desventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>No previene todos los tipos de exploit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Puede requerir JIT compilation tricks</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {config.protectionType === "aslr" && (
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">ASLR (Address Space Layout Randomization)</div>
              <p className="text-sm text-green-700 mb-3">
                ASLR aleatoriza la ubicación de áreas de memoria como stack, heap y bibliotecas, 
                dificultando a los atacantes predecir direcciones.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-sm mb-1">Ventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Dificulta exploits basados en direcciones conocidas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Funciona sin modificar el código</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Compatible con la mayoría de aplicaciones</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold text-sm mb-1">Desventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Puede causar fallos aleatorios en aplicaciones mal escritas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>No protege contra todos los tipos de ataque</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {config.protectionType === "stackCanary" && (
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">Stack Canaries</div>
              <p className="text-sm text-yellow-700 mb-3">
                Los Stack Canaries colocan valores especiales entre variables locales 
                y la dirección de retorno, detectando desbordamientos de buffer.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-sm mb-1">Ventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Detección temprana de buffer overflows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Implementación relativamente simple</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Efectivo contra ataques de stack smashing</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold text-sm mb-1">Desventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>No protege contra heap overflows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Puede ser evitado con técnicas avanzadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Pequeño overhead en cada función</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {config.protectionType === "smeP" && (
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">SMEP (Supervisor Mode Execution Prevention)</div>
              <p className="text-sm text-purple-700 mb-3">
                SMEP previene que el kernel ejecute código del espacio de usuario, 
                protegiendo contra privilege escalation exploits.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-sm mb-1">Ventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Protección efectiva contra kernel exploits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Funciona a nivel de hardware</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Bajo impacto en rendimiento</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold text-sm mb-1">Desventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Requiere soporte específico de CPU</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Puede romper drivers legítimos mal escritos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {config.protectionType === "controlFlow" && (
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">Control Flow Integrity (CFI)</div>
              <p className="text-sm text-red-700 mb-3">
                CFI asegura que el flujo de control del programa siga caminos válidos, 
                previniendo ejecución de código malicioso.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-sm mb-1">Ventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Protección fuerte contra ROP/JOP exploits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Funciona a nivel de compilación/ejecución</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>Detecta desviaciones en tiempo real</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold text-sm mb-1">Desventajas:</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Complejidad significativa de implementación</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Puede tener impacto en rendimiento</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-500">✗</span>
                      <span>Requiere herramientas de compilación especializadas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
