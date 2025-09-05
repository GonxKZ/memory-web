import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProtectionMechanismProps {
  mechanism: "nx" | "aslr" | "stackCanary" | "dep"
  name: string
  description: string
  howItWorks: string
  effectiveness: number
  implementation: string
  technicalDetails: string
  examples: string[]
}

export function ProtectionMechanism({ 
  mechanism,
  name,
  description,
  howItWorks,
  effectiveness,
  implementation,
  technicalDetails,
  examples
}: ProtectionMechanismProps) {
  // Mechanism icons and colors
  const mechanismInfo = {
    "nx": {
      icon: "🛡️",
      color: "#3b82f6"
    },
    "aslr": {
      icon: "🔀",
      color: "#10b981"
    },
    "stackCanary": {
      icon: "🐦",
      color: "#8b5cf6"
    },
    "dep": {
      icon: "🛡️",
      color: "#f59e0b"
    }
  }

  const currentMechanism = mechanismInfo[mechanism]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentMechanism.color }}
        >
          <span className="mr-2 text-2xl">{currentMechanism.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-700">
            {description}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="font-semibold text-blue-800 mb-2">🔬 Detalles Técnicos</div>
            <div className="text-blue-700 text-sm">
              {technicalDetails}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="font-semibold mb-2 flex items-center">
              <span className="mr-2 text-green-800">⚙️</span>
              <span className="text-green-800">Cómo funciona</span>
            </div>
            <div className="text-green-700">
              {howItWorks}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Implementación:</div>
            <div className="text-sm bg-gray-50 p-3 rounded text-gray-700">
              {implementation}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Efectividad:</div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div 
                className="h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ 
                  width: `${effectiveness}%`,
                  backgroundColor: currentMechanism.color
                }}
              >
                {effectiveness}%
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-semibold mb-2">💡 Ejemplos:</div>
            <ul className="space-y-2">
              {examples.map((example, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span className="text-gray-700">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryProtectionConceptsProps {
  mechanisms: {
    mechanism: "nx" | "aslr" | "stackCanary" | "dep"
    name: string
    description: string
    howItWorks: string
    effectiveness: number
    implementation: string
    technicalDetails: string
    examples: string[]
  }[]
}

export function MemoryProtectionConcepts({ mechanisms }: MemoryProtectionConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Protección de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          La protección de memoria es fundamental para mantener la seguridad y estabilidad de los 
          sistemas informáticos modernos. Es como tener diferentes cerraduras y sistemas de seguridad 
          en una casa para proteger diferentes habitaciones. Estas técnicas evitan que programas 
          maliciosos o defectuosos accedan a áreas de memoria que no les pertenecen, protegiendo 
          tanto los datos sensibles como la integridad del sistema operativo.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mechanisms.map((mechanism, index) => (
          <ProtectionMechanism
            key={index}
            mechanism={mechanism.mechanism}
            name={mechanism.name}
            description={mechanism.description}
            howItWorks={mechanism.howItWorks}
            effectiveness={mechanism.effectiveness}
            implementation={mechanism.implementation}
            technicalDetails={mechanism.technicalDetails}
            examples={mechanism.examples}
          />
        ))}
      </div>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧱</span>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Capas de protección</h3>
              <p className="text-red-700 mb-3">
                La protección de memoria moderna utiliza múltiples capas de protección que se complementan entre sí:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">DEP/NX:</span>
                    <span> Como una cerradura en puertas que evita que se entre a ciertas habitaciones</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">ASLR:</span>
                    <span> Como mover muebles a posiciones aleatorias cada vez que llegas a casa</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">Stack Canaries:</span>
                    <span> Como alarmas que detectan si alguien intenta abrir una ventana</span>
                  </div>
                </li>
              </ul>
              <p className="text-red-700 mt-3">
                Cada capa proporciona una defensa diferente, y los atacantes deben superar todas 
                para comprometer el sistema. Esta estrategia de defensa en profundidad es esencial 
                para mantener sistemas seguros en el entorno de amenazas moderno.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de protección:</div>
                <div className="font-mono text-sm">
                  <div>// Sin protección:</div>
                  <div>buffer_overflow() → shellcode_execution() → system_compromise()</div>
                  <div className="my-2 text-center text-red-500">// ↓ Con múltiples capas de protección ↓</div>
                  <div>// Capa 1 (NX/DEP):</div>
                  <div>buffer_overflow() → shellcode_execution() → EXCEPTION (no ejecutable)</div>
                  <div className="my-1">// Capa 2 (ASLR):</div>
                  <div>attack_attempt() → unknown_addresses() → failure_to_find_targets()</div>
                  <div className="my-1">// Capa 3 (Stack Canaries):</div>
                  <div>buffer_overflow() → canary_corruption() → PROGRAM_ABORT</div>
                  <div className="my-2 text-center text-green-500">// ↑ Sistema protegido ↑</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}