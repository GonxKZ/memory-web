import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SpectreMeltdownProps {
  variant: "spectre" | "meltdown"
  name: string
  description: string
  explanation: string
  protection: string
  mitigation: string[]
  technicalDetails: string
  realWorldImpact: string[]
}

export function SpectreMeltdownConcept({ 
  variant,
  name,
  description,
  explanation,
  protection,
  mitigation,
  technicalDetails,
  realWorldImpact
}: SpectreMeltdownProps) {
  // Variant information
  const variantInfo = {
    "spectre": {
      icon: "👻",
      color: "#8b5cf6"
    },
    "meltdown": {
      icon: "💣",
      color: "#ef4444"
    }
  }

  const currentVariant = variantInfo[variant]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentVariant.color }}
        >
          <span className="mr-2 text-3xl">{currentVariant.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="font-semibold mb-1">¿Qué es?</div>
            <div className="text-gray-700">
              {description}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">Detalles Técnicos</div>
            <div className="text-blue-700 text-sm">
              {technicalDetails}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Explicación</div>
            <div className="text-gray-700">
              {explanation}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="font-semibold text-green-800 mb-2 flex items-center">
              <span className="mr-2">🛡️</span>
              Protección
            </div>
            <div className="text-green-700">
              {protection}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Mitigaciones</div>
            <ul className="space-y-2">
              {mitigation.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Impacto en el mundo real:</div>
            <ul className="space-y-2">
              {realWorldImpact.map((impact, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-gray-500">•</span>
                  <span className="text-gray-700">{impact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SpectreMeltdownConceptsProps {
  variants: {
    variant: "spectre" | "meltdown"
    name: string
    description: string
    explanation: string
    protection: string
    mitigation: string[]
    technicalDetails: string
    realWorldImpact: string[]
  }[]
}

export function SpectreMeltdownConcepts({ variants }: SpectreMeltdownConceptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Spectre y Meltdown</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Spectre y Meltdown son vulnerabilidades de seguridad que afectan a procesadores 
          modernos, permitiendo que programas maliciosos accedan a datos protegidos en la 
          memoria. Son como fallas en el diseño de una casa que permiten a los intrusos 
          acceder a habitaciones normalmente seguras. Estas vulnerabilidades son 
          particularmente peligrosas porque explotan características fundamentales del 
          funcionamiento de los procesadores modernos.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((variant, index) => (
          <SpectreMeltdownConcept
            key={index}
            variant={variant.variant}
            name={variant.name}
            description={variant.description}
            explanation={variant.explanation}
            protection={variant.protection}
            mitigation={variant.mitigation}
            technicalDetails={variant.technicalDetails}
            realWorldImpact={variant.realWorldImpact}
          />
        ))}
      </div>
      
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🧱</span>
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">¿Por qué son importantes?</h3>
              <p className="text-orange-700 mb-3">
                Estas vulnerabilidades son significativas porque:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Afectan hardware fundamental:</span>
                    <span> No son bugs de software, sino problemas en el diseño de los procesadores</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Son difíciles de corregir:</span>
                    <span> Requieren actualizaciones de hardware, microcódigo y software</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Tienen impacto amplio:</span>
                    <span> Afectan la mayoría de computadoras modernas (Intel, AMD, ARM)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Revelan arquitectura:</span>
                    <span> Exponen problemas fundamentales en cómo funcionan las computadoras modernas</span>
                  </div>
                </li>
              </ul>
              <p className="text-orange-700 mt-3">
                La importancia de estas vulnerabilidades llevó a una revisión completa de 
                cómo se diseñan y protegen los sistemas informáticos, influyendo en 
                generaciones futuras de procesadores. Revelaron la necesidad de considerar 
                la seguridad en el diseño de hardware desde las etapas iniciales.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización de los ataques:</div>
                <div className="font-mono text-sm">
                  <div>// Spectre: Engañar al predictor de ramas</div>
                  <div>if (indice &lt; array1_size) &#123;</div>
                  <div className="ml-4">// Predictor entrenado para seguir este camino</div>
                  <div className="ml-4">temp &amp;= array2[array1[indice] * 256];</div>
                  <div>&#125;</div>
                  <div className="my-2 text-center text-red-500">// ↓ Ejecución especulativa ↓</div>
                  <div>// Aunque indice &gt;= array1_size, se ejecuta especulativamente</div>
                  <div>// array1[indice] accede datos secretos</div>
                  <div>// array2[array1[indice] * 256] carga datos en caché</div>
                  <div>// Canal lateral: medir tiempos de acceso a array2 para deducir array1[indice]</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}