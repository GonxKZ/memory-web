import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VirtualizationConceptProps {
  concept: "mmu" | "ept" | "shadow" | "iommu"
  title: string
  description: string
  howItWorks: string
  benefits: string[]
}

export function VirtualizationConcept({ 
  concept,
  title,
  description,
  howItWorks,
  benefits
}: VirtualizationConceptProps) {
  // Concept icons and colors
  const conceptInfo = {
    "mmu": {
      icon: "🔧",
      color: "#3b82f6"
    },
    "ept": {
      icon: "🔌",
      color: "#10b981"
    },
    "shadow": {
      icon: "👻",
      color: "#8b5cf6"
    },
    "iommu": {
      icon: "使用網路",
      color: "#f59e0b"
    }
  }

  const currentConcept = conceptInfo[concept]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentConcept.color }}
        >
          <span className="mr-2 text-2xl">{currentConcept.icon}</span>
          {title}
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
          
          <div>
            <div className="font-semibold mb-2">Beneficios:</div>
            <ul className="space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AddressTranslationVisualizationProps {
  levels: {
    name: string
    virtualAddress: string
    physicalAddress: string
    translation: string
  }[]
  currentPage: number
  onPageChange: (page: number) => void
}

export function AddressTranslationVisualization({ 
  levels,
  currentPage,
  onPageChange
}: AddressTranslationVisualizationProps) {
  const currentPageData = levels[currentPage]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traducción de Direcciones en Virtualización</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">Traducción de direcciones</div>
          <div className="text-sm text-blue-700 mt-1">
            En sistemas virtualizados, las direcciones pasan por múltiples niveles de traducción
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-center space-x-2 mb-4">
            {levels.map((_, index) => (
              <button
                key={index}
                className={`
                  px-3 py-1 rounded-full text-sm
                  ${currentPage === index 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700"}
                `}
                onClick={() => onPageChange(index)}
              >
                Nivel {index + 1}
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center mb-3 font-semibold">
              {currentPageData.name}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-3">
                <div className="text-xs text-gray-500 mb-1">Dirección Virtual</div>
                <div className="font-mono text-lg">{currentPageData.virtualAddress}</div>
              </div>
              
              <div className="border rounded p-3">
                <div className="text-xs text-gray-500 mb-1">Dirección Física</div>
                <div className="font-mono text-lg">{currentPageData.physicalAddress}</div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-white border rounded">
              <div className="text-xs text-gray-500 mb-1">Traducción</div>
              <div className="text-sm">{currentPageData.translation}</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            {levels.map((level, index) => (
              <div key={index} className="flex items-center">
                <div className="px-3 py-1 bg-gray-200 rounded">
                  {level.name}
                </div>
                {index < levels.length - 1 && (
                  <div className="mx-2 text-gray-400">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface NestedVirtualizationProps {
  explanation: string
  benefits: string[]
  challenges: string[]
}

export function NestedVirtualization({ 
  explanation,
  benefits,
  challenges
}: NestedVirtualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2 text-2xl">🔁</span>
          Virtualización Anidada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="font-semibold mb-1">¿Qué es?</div>
            <div className="text-gray-600">
              {explanation}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-2 text-green-600">Beneficios</div>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-red-600">Desafíos</div>
              <ul className="space-y-2">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-500">⚠️</span>
                    <span className="text-sm">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <div className="font-semibold text-purple-800">Ejemplo práctico</div>
            <div className="text-sm text-purple-700 mt-1">
              Ejecutar una VM dentro de otra VM, útil para pruebas, desarrollo y aislamiento de entornos
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}