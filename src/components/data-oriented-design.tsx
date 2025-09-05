import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DataLayoutProps {
  layout: "aos" | "soa"
  name: string
  description: string
  memoryLayout: string
  performance: {
    cacheEfficiency: number
    prefetching: number
    parallelism: number
  }
  useCases: string[]
}

export function DataLayout({ 
  layout,
  name,
  description,
  memoryLayout,
  performance,
  useCases
}: DataLayoutProps) {
  // Layout icons and colors
  const layoutInfo = {
    "aos": {
      icon: "📦",
      color: "#3b82f6"
    },
    "soa": {
      icon: "🗄️",
      color: "#10b981"
    }
  }

  const currentLayout = layoutInfo[layout]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentLayout.color }}
        >
          <span className="mr-2 text-xl">{currentLayout.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div>
            <div className="font-semibold mb-1">Layout en memoria:</div>
            <div className="font-mono text-sm bg-gray-50 p-2 rounded">
              {memoryLayout}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Rendimiento:</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Eficiencia de caché</span>
                  <span>{performance.cacheEfficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${performance.cacheEfficiency}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Prefetching</span>
                  <span>{performance.prefetching}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${performance.prefetching}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Paralelismo</span>
                  <span>{performance.parallelism}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${performance.parallelism}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Casos de uso:</div>
            <ul className="space-y-1">
              {useCases.map((useCase, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="mr-1">•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DataLayoutComparisonProps {
  layouts: {
    layout: "aos" | "soa"
    name: string
    description: string
    memoryLayout: string
    performance: {
      cacheEfficiency: number
      prefetching: number
      parallelism: number
    }
    useCases: string[]
  }[]
}

export function DataLayoutComparison({ layouts }: DataLayoutComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Layouts de Datos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">Diseño Orientado a Datos</div>
          <div className="text-sm text-blue-700 mt-1">
            El diseño orientado a datos se centra en organizar los datos en memoria para maximizar 
            la eficiencia de la caché y el rendimiento del procesador.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layouts.map((layout, index) => (
            <DataLayout
              key={index}
              layout={layout.layout}
              name={layout.name}
              description={layout.description}
              memoryLayout={layout.memoryLayout}
              performance={layout.performance}
              useCases={layout.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryAccessPatternProps {
  pattern: "sequential" | "strided" | "random"
  addresses: number[]
  accessOrder: number[]
  cacheHits: boolean[]
}

export function MemoryAccessPattern({ 
  pattern,
  addresses,
  accessOrder,
  cacheHits
}: MemoryAccessPatternProps) {
  // Pattern information
  const patternInfo = {
    "sequential": {
      title: "Acceso Secuencial",
      description: "Acceso a elementos en orden consecutivo",
      color: "#3b82f6"
    },
    "strided": {
      title: "Acceso con Stride",
      description: "Acceso a elementos con un intervalo fijo",
      color: "#10b981"
    },
    "random": {
      title: "Acceso Aleatorio",
      description: "Acceso a elementos en orden aleatorio",
      color: "#ef4444"
    }
  }

  const currentPattern = patternInfo[pattern]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentPattern.color }}
        >
          <span className="mr-2">
            {pattern === "sequential" && "➡️"}
            {pattern === "strided" && "🔢"}
            {pattern === "random" && "🔀"}
          </span>
          {currentPattern.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {currentPattern.description}
          </div>
          
          <div>
            <div className="font-semibold mb-2">Direcciones en memoria:</div>
            <div className="flex flex-wrap gap-2">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-sm font-mono"
                >
                  {address}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Orden de acceso:</div>
            <div className="flex flex-wrap gap-2">
              {accessOrder.map((order, index) => {
                const isCacheHit = cacheHits[index]
                
                return (
                  <div
                    key={index}
                    className={`
                      w-10 h-10 rounded flex items-center justify-center text-sm font-mono
                      ${isCacheHit 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"}
                    `}
                  >
                    {order}
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded">
              <div className="font-semibold text-green-800">Aciertos de Caché</div>
              <div className="text-2xl font-bold text-green-600">
                {cacheHits.filter(hit => hit).length}
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded">
              <div className="font-semibold text-red-800">Fallos de Caché</div>
              <div className="text-2xl font-bold text-red-600">
                {cacheHits.filter(hit => !hit).length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}