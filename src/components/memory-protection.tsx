import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemoryProtectionMechanismProps {
  mechanism: "nx" | "aslr" | "stackCanary" | "dep"
  name: string
  description: string
  howItWorks: string
  effectiveness: number
  implementation: string
  technicalDetails: string
  examples: string[]
}

export function MemoryProtectionMechanism({ 
  mechanism,
  name,
  description,
  howItWorks,
  effectiveness,
  implementation,
  technicalDetails,
  examples
}: MemoryProtectionMechanismProps) {
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
    <Card className="h-full">
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
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">Detalles Técnicos</div>
            <div className="text-blue-700 text-sm">
              {technicalDetails}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="font-semibold mb-2 flex items-center">
              <span className="mr-2">⚙️</span>
              Cómo funciona
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
          
          <div>
            <div className="font-semibold mb-2">Ejemplos:</div>
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
          <MemoryProtectionMechanism
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
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧠</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona la protección de memoria?</h3>
              <p className="text-blue-700 mb-3">
                La protección de memoria involucra varios componentes trabajando juntos:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">MMU (Unidad de Gestión de Memoria):</span>
                    <span> Hardware que traduce direcciones virtuales a físicas y verifica permisos</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Tablas de Páginas:</span>
                    <span> Estructuras de datos que definen permisos para cada página de memoria</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">Sistema Operativo:</span>
                    <span> Administra las tablas de páginas y asigna memoria a procesos</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">4.</span>
                  <div>
                    <span className="font-semibold">Compilador:</span>
                    <span> Inserta protecciones como stack canaries durante la compilación</span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-700 mt-3">
                Estos componentes trabajan en conjunto para crear múltiples capas de protección, haciendo 
                mucho más difícil para los atacantes comprometer el sistema. La efectividad de la 
                protección depende de la combinación correcta de estas técnicas.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de protección:</div>
                <div className="font-mono text-sm">
                  <div>1. Proceso intenta acceder a dirección 0x12345678</div>
                  <div className="my-1 text-center">↓</div>
                  <div>2. MMU traduce a dirección física y verifica permisos</div>
                  <div className="my-1 text-center">↓</div>
                  <div>3. ¿Tiene permiso de lectura/escritura/ejecución?</div>
                  <div className="my-1 text-center">↓</div>
                  <div>4. Si no: Se genera una excepción de protección (SIGSEGV)</div>
                  <div className="my-1 text-center">↓</div>
                  <div>5. Sistema operativo maneja la excepción</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}