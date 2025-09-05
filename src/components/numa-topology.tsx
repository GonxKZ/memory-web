import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NUMANodeProps {
  id: number
  cores: number[]
  memory: number
  connectedTo: number[]
  highlighted?: boolean
  latencyTo: { [nodeId: number]: number }
  onNodeClick?: (id: number) => void
}

export function NUMANode({ 
  id, 
  cores, 
  memory, 
  connectedTo,
  highlighted,
  latencyTo,
  onNodeClick
}: NUMANodeProps) {
  return (
    <div
      className={`
        border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
        ${highlighted ? "ring-4 ring-blue-500" : "border-gray-200"}
      `}
      onClick={() => onNodeClick?.(id)}
    >
      <div className="font-semibold text-center mb-2">Nodo {id}</div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-500">Cores</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {cores.map(core => (
            <div key={core} className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              {core}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-500">Memoria</div>
        <div className="font-mono">{memory} GB</div>
      </div>
      
      <div>
        <div className="text-sm text-gray-500">Conexiones</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {connectedTo.map(node => (
            <div 
              key={node} 
              className="px-2 py-1 bg-gray-100 text-xs rounded flex items-center"
            >
              Nodo {node}
              <span className="ml-1 text-gray-500">
                ({latencyTo[node]}ns)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface NUMATopologyProps {
  nodes: {
    id: number
    cores: number[]
    memory: number
    connectedTo: number[]
    latencyTo: { [nodeId: number]: number }
  }[]
  highlightedNode?: number | null
  onNodeClick?: (id: number) => void
}

export function NUMATopology({ 
  nodes, 
  highlightedNode,
  onNodeClick
}: NUMATopologyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topología NUMA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es NUMA?</div>
          <div className="text-sm text-blue-700 mt-1">
            NUMA (Non-Uniform Memory Access) es una arquitectura donde cada procesador tiene 
            acceso a su propia memoria local, pero puede acceder a la memoria de otros nodos 
            con mayor latencia.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map(node => (
            <NUMANode
              key={node.id}
              id={node.id}
              cores={node.cores}
              memory={node.memory}
              connectedTo={node.connectedTo}
              latencyTo={node.latencyTo}
              highlighted={highlightedNode === node.id}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="font-semibold mb-2">Leyenda</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm">Cores</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
              <span className="text-sm">Conexiones entre nodos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface NUMALatencyHeatmapProps {
  nodes: number[]
  latencyMatrix: number[][]
  highlightedCell?: { row: number; col: number } | null
  onCellClick?: (row: number, col: number) => void
}

export function NUMALatencyHeatmap({ 
  nodes, 
  latencyMatrix,
  highlightedCell,
  onCellClick
}: NUMALatencyHeatmapProps) {
  // Find min and max latencies for color scaling
  let minLatency = Infinity
  let maxLatency = -Infinity
  
  for (let i = 0; i < latencyMatrix.length; i++) {
    for (let j = 0; j < latencyMatrix[i].length; j++) {
      if (latencyMatrix[i][j] < minLatency) minLatency = latencyMatrix[i][j]
      if (latencyMatrix[i][j] > maxLatency) maxLatency = latencyMatrix[i][j]
    }
  }
  
  // Function to get color based on latency
  const getLatencyColor = (latency: number) => {
    const ratio = (latency - minLatency) / (maxLatency - minLatency)
    const red = Math.floor(255 * ratio)
    const green = Math.floor(255 * (1 - ratio))
    return `rgb(${red}, ${green}, 100)`
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Calor de Latencias NUMA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2"></th>
                {nodes.map(node => (
                  <th key={node} className="p-2 text-center">Nodo {node}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {latencyMatrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="p-2 font-semibold text-center">Nodo {nodes[rowIndex]}</td>
                  {row.map((latency, colIndex) => {
                    const isHighlighted = highlightedCell?.row === rowIndex && highlightedCell?.col === colIndex
                    const isDiagonal = rowIndex === colIndex
                    
                    return (
                      <td 
                        key={colIndex}
                        className={`
                          p-2 text-center cursor-pointer transition-all duration-200
                          ${isHighlighted ? "ring-2 ring-blue-500" : ""}
                          ${isDiagonal ? "bg-gray-100" : ""}
                        `}
                        style={{ 
                          backgroundColor: isDiagonal ? undefined : getLatencyColor(latency),
                          color: isDiagonal ? "inherit" : "white",
                          fontWeight: isDiagonal ? "normal" : "bold"
                        }}
                        onClick={() => onCellClick?.(rowIndex, colIndex)}
                      >
                        {isDiagonal ? "-" : latency}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center">
            <span className="text-sm mr-2">Menor latencia</span>
            <div className="w-32 h-4 bg-gradient-to-r from-green-500 to-red-500 rounded"></div>
            <span className="text-sm ml-2">Mayor latencia</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}