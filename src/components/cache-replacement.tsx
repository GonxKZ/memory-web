import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReplacementPolicyProps {
  policy: "lru" | "plru" | "rr" | "lfu"
  name: string
  description: string
  howItWorks: string
  advantages: string[]
  disadvantages: string[]
}

export function ReplacementPolicy({ 
  policy,
  name,
  description,
  howItWorks,
  advantages,
  disadvantages
}: ReplacementPolicyProps) {
  // Policy icons and colors
  const policyInfo = {
    "lru": {
      icon: "⏱️",
      color: "#3b82f6"
    },
    "plru": {
      icon: "🔄",
      color: "#10b981"
    },
    "rr": {
      icon: "🔁",
      color: "#8b5cf6"
    },
    "lfu": {
      icon: "📈",
      color: "#f59e0b"
    }
  }

  const currentPolicy = policyInfo[policy]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentPolicy.color }}
        >
          <span className="mr-2 text-xl">{currentPolicy.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div>
            <div className="font-semibold mb-1">¿Cómo funciona?</div>
            <div className="text-gray-600 text-sm">
              {howItWorks}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-2 text-green-600">Ventajas</div>
              <ul className="space-y-1">
                {advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-red-600">Desventajas</div>
              <ul className="space-y-1">
                {disadvantages.map((disadvantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-500">✗</span>
                    <span className="text-sm">{disadvantage}</span>
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

interface ReplacementPoliciesComparisonProps {
  policies: {
    policy: "lru" | "plru" | "rr" | "lfu"
    name: string
    description: string
    howItWorks: string
    advantages: string[]
    disadvantages: string[]
  }[]
}

export function ReplacementPoliciesComparison({ policies }: ReplacementPoliciesComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Políticas de Reemplazo de Caché</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué son las políticas de reemplazo?</div>
          <div className="text-sm text-blue-700 mt-1">
            Las políticas de reemplazo determinan qué bloque de caché se debe eliminar 
            cuando se necesita espacio para un nuevo bloque.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((policy, index) => (
            <ReplacementPolicy
              key={index}
              policy={policy.policy}
              name={policy.name}
              description={policy.description}
              howItWorks={policy.howItWorks}
              advantages={policy.advantages}
              disadvantages={policy.disadvantages}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface LRUVisualizationProps {
  cacheLines: {
    id: number
    tag: number | null
    valid: boolean
    lastAccessed: number
  }[]
  accessSequence: number[]
  currentAccess: number
}

export function LRUVisualization({ 
  cacheLines, 
  accessSequence,
  currentAccess
}: LRUVisualizationProps) {
  // Sort cache lines by last accessed time (LRU order)
  const sortedLines = [...cacheLines].sort((a, b) => a.lastAccessed - b.lastAccessed)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">⏱️</span>
          LRU (Least Recently Used)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Cómo funciona LRU?</div>
          <div className="text-sm text-blue-700 mt-1">
            LRU reemplaza el bloque que ha estado sin usarse por más tiempo.
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-semibold mb-2">Secuencia de acceso:</div>
          <div className="flex flex-wrap gap-2">
            {accessSequence.map((access, index) => (
              <div
                key={index}
                className={`
                  w-8 h-8 rounded flex items-center justify-center text-sm font-mono
                  ${index === currentAccess 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700"}
                `}
              >
                {access}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="font-semibold mb-2">Estado de la caché (orden LRU):</div>
          <div className="space-y-2">
            {sortedLines.map((line, index) => (
              <div 
                key={line.id}
                className={`
                  p-3 rounded flex justify-between items-center
                  ${line.valid 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-gray-50 border border-gray-200"}
                `}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs mr-2">
                    {index}
                  </div>
                  <div>
                    <div className="font-mono">
                      {line.valid ? `Tag: ${line.tag}` : "Vacío"}
                    </div>
                    {line.valid && (
                      <div className="text-xs text-gray-500">
                        Último acceso: t={line.lastAccessed}
                      </div>
                    )}
                  </div>
                </div>
                {line.valid && index === 0 && (
                  <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Próximo a reemplazar
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}