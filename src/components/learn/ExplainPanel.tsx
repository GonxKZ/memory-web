import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

type ExplainPanelProps = {
  title: string
  metaphor: string
  idea: string
  bullets?: string[]
  board?: { title: string; content: string }
  metrics?: { label: string; value: string | number; color?: string }[]
}

export default function ExplainPanel({ title, metaphor, idea, bullets = [], board, metrics = [] }: ExplainPanelProps) {
  const [showBoard, setShowBoard] = useState(false)
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {board && (
            <Button size="sm" variant={showBoard ? "default" : "outline"} onClick={() => setShowBoard(v => !v)}>
              {showBoard ? "Ocultar pizarra" : "Modo pizarra"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase text-gray-500">Metáfora</div>
              <div className="text-sm text-gray-800">{metaphor}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Idea técnica</div>
              <div className="text-sm text-gray-800">{idea}</div>
            </div>
            {bullets.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-3">
            {metrics.length > 0 && (
              <div>
                <div className="text-xs uppercase text-gray-500 mb-2">Métricas clave</div>
                <div className="flex flex-wrap gap-2">
                  {metrics.map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <span className="mr-1 text-gray-500">{m.label}:</span>
                      <span className={m.color ? m.color : "text-gray-800"}>{m.value}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {board && showBoard && (
              <div className="p-3 rounded bg-gray-50 border">
                <div className="font-semibold text-sm mb-1">{board.title}</div>
                <div className="text-xs text-gray-700 whitespace-pre-wrap">{board.content}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

