import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ControlFlowIntegrityProps {
  technique: "controlFlowGraph" | "shadowStack" | "codeSigning" | "randomization"
  name: string
  description: string
  protection: string
  implementation: string
  limitations: string[]
  technicalDetails: string
  examples: string[]
}

export function ControlFlowIntegrityTechnique({ 
  technique,
  name,
  description,
  protection,
  implementation,
  limitations,
  technicalDetails,
  examples
}: ControlFlowIntegrityProps) {
  // Technique icons and colors
  const techniqueInfo = {
    "controlFlowGraph": {
      icon: "📊",
      color: "#3b82f6"
    },
    "shadowStack": {
      icon: "👻",
      color: "#10b981"
    },
    "codeSigning": {
      icon: "✍️",
      color: "#8b5cf6"
    },
    "randomization": {
      icon: "🔀",
      color: "#f59e0b"
    }
  }

  const currentTechnique = techniqueInfo[technique]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTechnique.color }}
        >
          <span className="mr-2 text-2xl">{currentTechnique.icon}</span>
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
              <span className="mr-2 text-green-800">🛡️</span>
              Protección
            </div>
            <div className="text-green-700">
              {protection}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Implementación:</div>
            <div className="text-sm bg-gray-50 p-3 rounded text-gray-700">
              {implementation}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="font-semibold mb-2 text-red-800 flex items-center">
                <span className="mr-2">⚠️</span>
                Limitaciones
              </div>
              <ul className="space-y-2">
                {limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-600">•</span>
                    <span className="text-red-700">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ControlFlowIntegrityConceptsProps {
  techniques: {
    technique: "controlFlowGraph" | "shadowStack" | "codeSigning" | "randomization"
    name: string
    description: string
    protection: string
    implementation: string
    limitations: string[]
    technicalDetails: string
    examples: string[]
  }[]
}

export function ControlFlowIntegrityConcepts({ techniques }: ControlFlowIntegrityConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Integridad de Flujo de Control</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          La integridad de flujo de control protege que los programas se ejecuten en el orden 
          previsto, evitando que atacantes desvíen la ejecución a código malicioso. Es como 
          asegurar que un libro se lea en orden y no salte capítulos de forma sospechosa. 
          Esta técnica es fundamental para prevenir una clase de vulnerabilidades llamadas 
          ejecución de código dirigida (code injection) y programación orientada a retorno 
          (return-oriented programming).
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((technique, index) => (
          <ControlFlowIntegrityTechnique
            key={index}
            technique={technique.technique}
            name={technique.name}
            description={technique.description}
            protection={technique.protection}
            implementation={technique.implementation}
            limitations={technique.limitations}
            technicalDetails={technique.technicalDetails}
            examples={technique.examples}
          />
        ))}
      </div>
      
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🛣️</span>
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">¿Cómo se desvía el flujo de control?</h3>
              <p className="text-orange-700 mb-3">
                Los atacantes pueden desviar el flujo de control mediante:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">1.</span>
                  <div>
                    <span className="font-semibold">Desbordamiento de buffer:</span>
                    <span> Escribir más datos de los permitidos en una variable, sobrescribiendo direcciones de retorno o punteros de función</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">2.</span>
                  <div>
                    <span className="font-semibold">Corrupción de punteros:</span>
                    <span> Modificar punteros para que apunten a código malicioso en lugar de su destino legítimo</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">3.</span>
                  <div>
                    <span className="font-semibold">Ataques de tipo "return-oriented programming" (ROP):</span>
                    <span> Encadenar fragmentos de código legítimo (gadgets) para ejecutar operaciones maliciosas</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">4.</span>
                  <div>
                    <span className="font-semibold">Ataques de tipo "jump-oriented programming" (JOP):</span>
                    <span> Similar a ROP pero usando saltos indirectos en lugar de retornos</span>
                  </div>
                </li>
              </ul>
              <p className="text-orange-700 mt-3">
                Las técnicas de integridad de flujo de control detectan o previenen estos 
                intentos de desvío, manteniendo la ejecución del programa en su camino previsto. 
                Es como tener un guardia de seguridad en cada intersección de caminos del programa 
                que verifica que los vehículos sigan las rutas permitidas.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización del proceso de protección:</div>
                <div className="font-mono text-sm">
                  <div>// Flujo normal de control</div>
                  <div>main() → functionA() → functionB() → return to main()</div>
                  <div className="my-2 text-center text-red-500">// ↓ Ataque de desbordamiento de búfer ↓</div>
                  <div>// Flujo corrompido</div>
                  <div>main() → functionA() → [shellcode] → ¡ataque exitoso!</div>
                  <div className="my-2 text-center text-green-500">// ↑ Con CFI activo ↑</div>
                  <div>// El guardia detecta que [shellcode] no es una función válida</div>
                  <div>// y aborta la ejecución</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}