import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

export type GuidedStep = {
  title: string
  content: string
  hint?: string
}

type GuidedFlowProps = {
  title: string
  steps: GuidedStep[]
  onReset?: () => void
}

export default function GuidedFlow({ title, steps, onReset }: GuidedFlowProps) {
  const [index, setIndex] = useState(0)
  const pct = steps.length > 1 ? ((index + 1) / steps.length) * 100 : 100

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            {onReset && (
              <Button size="sm" variant="outline" onClick={() => { setIndex(0); onReset() }}>Reiniciar</Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-xs text-gray-500">Paso {index + 1} de {steps.length}</div>
          <Progress value={pct} className="w-full" />
          <div className="p-3 rounded bg-gray-50 border">
            <div className="font-semibold mb-1">{steps[index]?.title}</div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{steps[index]?.content}</div>
            {steps[index]?.hint && (
              <div className="mt-2 text-xs text-gray-600">Sugerencia: {steps[index]?.hint}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}>Anterior</Button>
            <Button size="sm" onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))} disabled={index === steps.length - 1}>Siguiente</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )}

