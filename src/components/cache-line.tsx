import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/lib/memory-utils"

interface CacheLineProps {
  tag: number | null
  index: number
  valid: boolean
  dirty: boolean
  lastAccessed: number
  highlighted?: boolean
}

export function CacheLine({ 
  tag, 
  index, 
  valid, 
  dirty, 
  lastAccessed,
  highlighted = false
}: CacheLineProps) {
  return (
    <div 
      className={`border rounded-lg p-3 transition-all duration-200 ${
        highlighted 
          ? "ring-2 ring-blue-500 bg-blue-50" 
          : valid 
            ? "bg-green-50 border-green-200" 
            : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="font-mono text-sm">
          Línea {index}
        </div>
        <div className="flex gap-2">
          {valid && (
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
          )}
          {dirty && (
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          )}
        </div>
      </div>
      
      {valid && tag !== null ? (
        <div className="mt-2">
          <div className="text-xs text-gray-500">Tag</div>
          <div className="font-mono">{formatAddress(tag)}</div>
        </div>
      ) : (
        <div className="mt-2 text-gray-400 text-sm">
          Vacío
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Último acceso: {lastAccessed}
      </div>
    </div>
  )
}

interface CacheSetProps {
  lines: {
    tag: number | null
    valid: boolean
    dirty: boolean
    lastAccessed: number
  }[]
  index: number
  highlightedLine?: number | null
}

export function CacheSet({ lines, index, highlightedLine }: CacheSetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conjunto {index}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lines.map((line, lineIndex) => (
            <CacheLine
              key={lineIndex}
              tag={line.tag}
              index={lineIndex}
              valid={line.valid}
              dirty={line.dirty}
              lastAccessed={line.lastAccessed}
              highlighted={highlightedLine === lineIndex}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}