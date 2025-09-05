import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FalseSharingVisualizationProps {
  cores: {
    id: number
    variables: {
      id: number
      value: number
      shared: boolean
    }[]
  }[]
  sharedLine: {
    variableIds: number[]
    coreIds: number[]
  }
  invalidatedCores: number[]
}

export function FalseSharingVisualization({ 
  cores, 
  sharedLine,
  invalidatedCores
}: FalseSharingVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualización de False Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {cores.map(core => (
            <div 
              key={core.id}
              className={`
                border rounded-lg p-4 transition-all duration-200
                ${invalidatedCores.includes(core.id) 
                  ? "bg-red-50 border-red-200 ring-2 ring-red-500" 
                  : "bg-gray-50 border-gray-200"}
              `}
            >
              <div className="font-semibold mb-3">Core {core.id}</div>
              <div className="grid grid-cols-2 gap-2">
                {core.variables.map(variable => (
                  <div 
                    key={variable.id}
                    className={`
                      border rounded p-2 transition-all duration-200
                      ${sharedLine.variableIds.includes(variable.id) 
                        ? "bg-yellow-100 border-yellow-300" 
                        : "bg-white border-gray-200"}
                    `}
                  >
                    <div className="text-xs text-gray-500">Variable {variable.id}</div>
                    <div className="font-mono text-lg">{variable.value}</div>
                    {variable.shared && (
                      <div className="text-xs text-red-500 mt-1">Compartida</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="font-semibold text-yellow-800">Línea de Caché Compartida</div>
            <div className="text-sm text-yellow-700 mt-1">
              Las variables {sharedLine.variableIds.join(", ")} comparten la misma línea de caché.
              Cuando un core modifica una variable, se invalida la línea completa en los otros cores.
            </div>
          </div>
          
          {invalidatedCores.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-semibold text-red-800">Cores Invalidados</div>
              <div className="text-sm text-red-700 mt-1">
                Los cores {invalidatedCores.join(", ")} han invalidado sus copias de la línea de caché
                compartida y necesitan volver a cargarla desde memoria principal.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface CoherenceStateProps {
  states: {
    coreId: number
    cacheLines: {
      id: number
      state: "M" | "E" | "S" | "I"
      value: number
    }[]
  }[]
}

export function CoherenceState({ states }: CoherenceStateProps) {
  // State descriptions
  const stateDescriptions = {
    "M": "Modified - Modificada",
    "E": "Exclusive - Exclusiva",
    "S": "Shared - Compartida",
    "I": "Invalid - Inválida"
  }
  
  // State colors
  const stateColors = {
    "M": "bg-red-500",
    "E": "bg-yellow-500",
    "S": "bg-green-500",
    "I": "bg-gray-500"
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estados de Coherencia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {states.map(state => (
            <div key={state.coreId} className="border rounded p-3">
              <div className="font-semibold mb-2">Core {state.coreId}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {state.cacheLines.map(line => (
                  <div 
                    key={line.id}
                    className={`
                      border rounded p-2 text-center
                      ${stateColors[line.state as keyof typeof stateColors]}
                      text-white
                    `}
                  >
                    <div className="font-mono">L{line.id}</div>
                    <div className="text-xs">{stateDescriptions[line.state as keyof typeof stateDescriptions]}</div>
                    <div className="font-mono text-sm mt-1">{line.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Leyenda</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">M - Modified</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm">E - Exclusive</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">S - Shared</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
              <span className="text-sm">I - Invalid</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}