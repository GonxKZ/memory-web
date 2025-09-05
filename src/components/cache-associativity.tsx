import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CacheAssociativityProps {
  associativity: number
  lineSize: number
  setSize: number
  highlightedWay?: number | null
}

export function CacheAssociativity({ 
  associativity, 
  lineSize, 
  setSize,
  highlightedWay
}: CacheAssociativityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Caché {associativity}-way associative
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Tamaño de línea: {lineSize} bytes</span>
            <span>Tamaño del conjunto: {setSize} líneas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(associativity / 16) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: associativity }).map((_, index) => (
            <div 
              key={index}
              className={`
                border rounded-lg p-4 transition-all duration-200
                ${highlightedWay === index ? "ring-2 ring-blue-500 bg-blue-50" : "border-gray-200"}
              `}
            >
              <div className="font-semibold mb-2">Vía {index}</div>
              <div className="text-sm text-gray-500">Líneas: {setSize}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CacheHierarchyProps {
  levels: {
    level: string
    size: string
    latency: string
    associativity: number
  }[]
}

export function CacheHierarchy({ levels }: CacheHierarchyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jerarquía de Caché</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {levels.map((level, index) => (
            <div key={index} className="flex items-center">
              <div className="w-16 font-semibold">{level.level}</div>
              <div className="flex-1 ml-4">
                <div className="flex justify-between text-sm">
                  <span>{level.size}</span>
                  <span>{level.latency}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(index + 1) * 25}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-24 text-right text-sm text-gray-500">
                {level.associativity}-way
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}