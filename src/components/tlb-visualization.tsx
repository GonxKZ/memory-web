import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/lib/memory-utils"

interface TLBEntryProps {
  virtualPage: number | null
  physicalFrame: number | null
  valid: boolean
  dirty: boolean
  accessed: boolean
  highlighted?: boolean
}

export function TLBEntry({ 
  virtualPage, 
  physicalFrame, 
  valid, 
  dirty, 
  accessed,
  highlighted = false
}: TLBEntryProps) {
  return (
    <div 
      className={`
        border rounded p-3 transition-all duration-200
        ${highlighted ? "ring-2 ring-blue-500 bg-blue-50" : ""}
        ${valid ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
      `}
    >
      <div className="flex justify-between items-center">
        <div className="font-mono text-sm">
          {valid && virtualPage !== null ? `VPN ${virtualPage}` : "Vacío"}
        </div>
        <div className="flex gap-1">
          {valid && (
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Válido"></span>
          )}
          {dirty && (
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" title="Sucio"></span>
          )}
          {accessed && (
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" title="Accedido"></span>
          )}
        </div>
      </div>
      
      {valid && physicalFrame !== null && (
        <div className="mt-2">
          <div className="text-xs text-gray-500">Marco físico</div>
          <div className="font-mono">{formatAddress(physicalFrame)}</div>
        </div>
      )}
    </div>
  )
}

interface TLBVisualizationProps {
  entries: {
    virtualPage: number | null
    physicalFrame: number | null
    valid: boolean
    dirty: boolean
    accessed: boolean
  }[]
  highlightedEntry?: number | null
}

export function TLBVisualization({ entries, highlightedEntry }: TLBVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TLB (Translation Lookaside Buffer)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {entries.map((entry, index) => (
            <TLBEntry
              key={index}
              virtualPage={entry.virtualPage}
              physicalFrame={entry.physicalFrame}
              valid={entry.valid}
              dirty={entry.dirty}
              accessed={entry.accessed}
              highlighted={highlightedEntry === index}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}