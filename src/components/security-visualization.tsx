import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SecurityConceptProps {
  title: string
  description: string
  icon: string
  color: string
  examples: string[]
}

export function SecurityConcept({ 
  title, 
  description, 
  icon,
  color,
  examples
}: SecurityConceptProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color }}
        >
          <span className="mr-2">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-600 mb-4">
          {description}
        </div>
        <div>
          <div className="font-semibold mb-2">Ejemplos:</div>
          <ul className="space-y-1">
            {examples.map((example, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span className="text-sm">{example}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

interface SideChannelVisualizationProps {
  concept: "cache" | "timing" | "power" | "electromagnetic"
  attacks: {
    name: string
    description: string
    difficulty: "Baja" | "Media" | "Alta"
    mitigation: string
  }[]
  onAttackClick?: (name: string) => void
}

export function SideChannelVisualization({ 
  concept,
  attacks,
  onAttackClick
}: SideChannelVisualizationProps) {
  // Concept information
  const conceptInfo = {
    "cache": {
      title: "Ataques de Canal Lateral por Caché",
      description: "Explotan la variación en el tiempo de acceso a la caché para obtener información",
      icon: "キャッシング",
      color: "#3b82f6"
    },
    "timing": {
      title: "Ataques de Canal Lateral por Tiempo",
      description: "Analizan las variaciones en el tiempo de ejecución para extraer información",
      icon: "⏱️",
      color: "#10b981"
    },
    "power": {
      title: "Ataques de Canal Lateral por Consumo",
      description: "Miden el consumo de energía para inferir operaciones internas",
      icon: "🔋",
      color: "#f59e0b"
    },
    "electromagnetic": {
      title: "Ataques de Canal Lateral Electromagnéticos",
      description: "Capturan emisiones electromagnéticas para obtener información",
      icon: "📡",
      color: "#8b5cf6"
    }
  }

  const currentConcept = conceptInfo[concept]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center"
            style={{ color: currentConcept.color }}
          >
            <span className="mr-2 text-2xl">{currentConcept.icon}</span>
            {currentConcept.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            {currentConcept.description}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attacks.map((attack, index) => (
          <Card 
            key={index} 
            className="cursor-pointer transition-all duration-200 hover:shadow-md"
            onClick={() => onAttackClick?.(attack.name)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{attack.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-3">
                {attack.description}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-semibold">Dificultad:</span> {attack.difficulty}
                </div>
                <div className="px-2 py-1 bg-gray-100 text-xs rounded">
                  Mitigación: {attack.mitigation}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface SpectreMeltdownVisualizationProps {
  variant: "spectre" | "meltdown"
  explanation: string
  protection: string
  mitigation: string[]
}

export function SpectreMeltdownVisualization({ 
  variant,
  explanation,
  protection,
  mitigation
}: SpectreMeltdownVisualizationProps) {
  // Variant information
  const variantInfo = {
    "spectre": {
      title: "Spectre",
      description: "Permite que un programa acceda a datos arbitrarios en la memoria de otro programa",
      icon: "👻",
      color: "#8b5cf6"
    },
    "meltdown": {
      title: "Meltdown",
      description: "Permite que un programa acceda a datos protegidos del kernel en la memoria",
      icon: "💣",
      color: "#ef4444"
    }
  }

  const currentVariant = variantInfo[variant]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentVariant.color }}
        >
          <span className="mr-2 text-2xl">{currentVariant.icon}</span>
          {currentVariant.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="font-semibold mb-1">¿Qué es?</div>
            <div className="text-gray-600">
              {currentVariant.description}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Explicación</div>
            <div className="text-gray-600">
              {explanation}
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="font-semibold text-blue-800 mb-1">Protección</div>
            <div className="text-blue-700 text-sm">
              {protection}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Mitigaciones</div>
            <ul className="space-y-2">
              {mitigation.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface RowhammerVisualizationProps {
  explanation: string
  protection: string
  mitigation: string[]
}

export function RowhammerVisualization({ 
  explanation,
  protection,
  mitigation
}: RowhammerVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <span className="mr-2 text-2xl">🔨</span>
          Rowhammer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="font-semibold mb-1">¿Qué es?</div>
            <div className="text-gray-600">
              Una vulnerabilidad que permite a un atacante voltear bits en la memoria DRAM mediante 
              accesos repetidos a filas de memoria adyacentes.
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Explicación</div>
            <div className="text-gray-600">
              {explanation}
            </div>
          </div>
          
          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
            <div className="font-semibold text-orange-800 mb-1">Protección</div>
            <div className="text-orange-700 text-sm">
              {protection}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Mitigaciones</div>
            <ul className="space-y-2">
              {mitigation.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}