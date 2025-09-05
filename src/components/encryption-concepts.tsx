import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EncryptionTechniqueProps {
  technique: "aes" | "rsa" | "ecc" | "chaCha20"
  name: string
  description: string
  securityLevel: "high" | "medium" | "low"
  performance: "fast" | "medium" | "slow"
  useCases: string[]
  technicalDetails: string
  examples: string[]
}

export function EncryptionTechnique({ 
  technique,
  name,
  description,
  securityLevel,
  performance,
  useCases,
  technicalDetails,
  examples
}: EncryptionTechniqueProps) {
  // Technique icons and colors
  const techInfo = {
    "aes": {
      icon: "🔒",
      color: "#3b82f6"
    },
    "rsa": {
      icon: "🔐",
      color: "#10b981"
    },
    "ecc": {
      icon: "🔑",
      color: "#8b5cf6"
    },
    "chaCha20": {
      icon: "🌀",
      color: "#f59e0b"
    }
  }

  const securityInfo = {
    "high": { label: "Alto", color: "#10b981" },
    "medium": { label: "Medio", color: "#f59e0b" },
    "low": { label: "Bajo", color: "#ef4444" }
  }

  const performanceInfo = {
    "fast": { label: "Rápido", color: "#10b981" },
    "medium": { label: "Medio", color: "#f59e0b" },
    "slow": { label: "Lento", color: "#ef4444" }
  }

  const currentTech = techInfo[technique]
  const currentSecurity = securityInfo[securityLevel]
  const currentPerformance = performanceInfo[performance]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTech.color }}
        >
          <span className="mr-2 text-2xl">{currentTech.icon}</span>
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
          
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: `${currentSecurity.color}20` }}
            >
              <div className="text-xs text-gray-500">Nivel de seguridad</div>
              <div 
                className="font-bold"
                style={{ color: currentSecurity.color }}
              >
                {currentSecurity.label}
              </div>
            </div>
            <div 
              className="p-3 rounded text-center"
              style={{ backgroundColor: `${currentPerformance.color}20` }}
            >
              <div className="text-xs text-gray-500">Rendimiento</div>
              <div 
                className="font-bold"
                style={{ color: currentPerformance.color }}
              >
                {currentPerformance.label}
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Casos de uso:</div>
            <ul className="space-y-2">
              {useCases.map((useCase, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span className="text-gray-700">{useCase}</span>
                </li>
              ))}
            </ul>
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

interface MemoryEncryptionConceptsProps {
  techniques: {
    technique: "aes" | "rsa" | "ecc" | "chaCha20"
    name: string
    description: string
    securityLevel: "high" | "medium" | "low"
    performance: "fast" | "medium" | "slow"
    useCases: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function MemoryEncryptionConcepts({ techniques }: MemoryEncryptionConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Encriptación de Memoria</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          La encriptación de memoria protege los datos almacenados en memoria mediante 
          algoritmos criptográficos. Es como guardar documentos importantes en una caja 
          fuerte: solo quienes tienen la combinación pueden acceder al contenido. Esta 
          protección es esencial para mantener la confidencialidad de datos sensibles 
          incluso cuando la memoria física puede ser accedida por atacantes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((technique, index) => (
          <EncryptionTechnique
            key={index}
            technique={technique.technique}
            name={technique.name}
            description={technique.description}
            securityLevel={technique.securityLevel}
            performance={technique.performance}
            useCases={technique.useCases}
            technicalDetails={technique.technicalDetails}
            examples={technique.examples}
          />
        ))}
      </div>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔐</span>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Tipos de encriptación</h3>
              <p className="text-purple-700 mb-3">
                Hay dos grandes categorías de algoritmos criptográficos:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">Criptografía simétrica:</span>
                    <span> Usa la misma clave para cifrar y descifrar (como AES). Es rápida pero requiere compartir la clave de forma segura.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Criptografía asimétrica:</span>
                    <span> Usa un par de claves: una pública para cifrar y una privada para descifrar (como RSA). Es más segura para compartir pero más lenta.</span>
                  </div>
                </li>
              </ul>
              <p className="text-purple-700 mt-3">
                En la práctica, se combinan ambos tipos: se usa criptografía asimétrica para 
                compartir una clave segura, y luego criptografía simétrica para la comunicación 
                eficiente.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Ejemplo de combinación híbrida:</div>
                <div className="font-mono text-sm">
                  <div>// 1. Alice genera clave simétrica aleatoria</div>
                  <div>// 2. Alice cifra mensaje con clave simétrica (AES)</div>
                  <div>// 3. Alice cifra clave simétrica con clave pública de Bob (RSA)</div>
                  <div>// 4. Alice envía ambos datos a Bob</div>
                  <div>// 5. Bob descifra clave simétrica con su clave privada</div>
                  <div>// 6. Bob descifra mensaje con clave simétrica</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}