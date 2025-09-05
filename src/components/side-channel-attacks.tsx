import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SideChannelAttackProps {
  attack: "cache" | "timing" | "power" | "electromagnetic"
  name: string
  description: string
  difficulty: "Baja" | "Media" | "Alta"
  mitigation: string
  example: string
  technicalDetails: string
  realWorldExamples: string[]
  onClick?: () => void
}

export function SideChannelAttack({ 
  attack,
  name,
  description,
  difficulty,
  mitigation,
  example,
  technicalDetails,
  realWorldExamples,
  onClick
}: SideChannelAttackProps) {
  // Attack information
  const attackInfo = {
    "cache": {
      icon: "キャッシング",
      color: "#3b82f6"
    },
    "timing": {
      icon: "⏱️",
      color: "#10b981"
    },
    "power": {
      icon: "🔋",
      color: "#f59e0b"
    },
    "electromagnetic": {
      icon: "📡",
      color: "#8b5cf6"
    }
  }

  const difficultyInfo = {
    "Baja": { label: "Baja", color: "#10b981" },
    "Media": { label: "Media", color: "#f59e0b" },
    "Alta": { label: "Alta", color: "#ef4444" }
  }

  const currentAttack = attackInfo[attack]
  const currentDifficulty = difficultyInfo[difficulty]

  return (
    <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg" onClick={onClick}>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentAttack.color }}
        >
          <span className="mr-2 text-2xl">{currentAttack.icon}</span>
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
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Dificultad:</span>
              <span 
                className="ml-2 font-bold"
                style={{ color: currentDifficulty.color }}
              >
                {currentDifficulty.label}
              </span>
            </div>
            <div className="text-sm bg-gray-100 px-2 py-1 rounded">
              Mitigación: {mitigation}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Ejemplo:</div>
            <div className="font-mono text-sm bg-gray-800 text-white p-3 rounded">
              {example}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Ejemplos del mundo real:</div>
            <ul className="space-y-2">
              {realWorldExamples.map((example, index) => (
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

interface SideChannelAttacksProps {
  attacks: {
    attack: "cache" | "timing" | "power" | "electromagnetic"
    name: string
    description: string
    difficulty: "Baja" | "Media" | "Alta"
    mitigation: string
    example: string
    technicalDetails: string
    realWorldExamples: string[]
  }[]
  onAttackClick?: (name: string) => void
}

export function SideChannelAttacks({ attacks, onAttackClick }: SideChannelAttacksProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ataques de Canal Lateral</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Los ataques de canal lateral no atacan directamente el sistema, sino que obtienen 
          información observando características indirectas como tiempos, consumo de energía 
          o emisiones electromagnéticas. Es como deducir la combinación de una caja fuerte 
          escuchando el sonido de los mecanismos internos, en lugar de intentar romperla.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attacks.map((attack, index) => (
          <SideChannelAttack
            key={index}
            attack={attack.attack}
            name={attack.name}
            description={attack.description}
            difficulty={attack.difficulty}
            mitigation={attack.mitigation}
            example={attack.example}
            technicalDetails={attack.technicalDetails}
            realWorldExamples={attack.realWorldExamples}
            onClick={() => onAttackClick?.(attack.name)}
          />
        ))}
      </div>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🕵️</span>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">¿Por qué son peligrosos?</h3>
              <p className="text-red-700 mb-3">
                Los ataques de canal lateral son particularmente peligrosos porque:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Son difíciles de detectar:</span>
                    <span> No dejan rastros obvios de intrusión</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Pueden realizarse a distancia:</span>
                    <span> Algunos pueden ejecutarse desde otro programa</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Son difíciles de prevenir:</span>
                    <span> Requieren cambios en hardware y software</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <div>
                    <span className="font-semibold">Pueden revelar información crítica:</span>
                    <span> Como claves criptográficas o datos sensibles</span>
                  </div>
                </li>
              </ul>
              <p className="text-red-700 mt-3">
                Por estas razones, la mitigación requiere un enfoque en múltiples capas que 
                aborde diferentes tipos de canales laterales.
              </p>
              
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="font-semibold text-gray-800 mb-2">Visualización de ataque de canal lateral:</div>
                <div className="font-mono text-sm">
                  <div>// Programa vulnerable</div>
                  <div>if (password[i] == input[i]) &#123;</div>
                  <div className="ml-4">// Acceso lento a array secreto</div>
                  <div className="ml-4">secret_array[password[i] * 256] += 1;</div>
                  <div>&#125;</div>
                  <div className="my-2 text-center text-red-500">// ↓ Atacante mide tiempos de acceso ↓</div>
                  <div>// Tiempo alto = carácter correcto</div>
                  <div>// Tiempo bajo = carácter incorrecto</div>
                  <div>// Deduce password carácter por carácter</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}