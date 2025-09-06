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
  storageKey?: string
}

export default function GuidedFlow({ title, steps, onReset, storageKey }: GuidedFlowProps) {
  const [index, setIndex] = useState(() => {
    if (!storageKey) return 0
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
    const n = raw ? parseInt(raw, 10) : 0
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), Math.max(steps.length - 1, 0)) : 0
  })
  const pct = steps.length > 1 ? ((index + 1) / steps.length) * 100 : 100
  const save = (i: number) => {
    setIndex(i)
    if (storageKey && typeof window !== 'undefined') window.localStorage.setItem(storageKey, String(i))
    // Sincroniza con URL (?step=x)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('step', String(i+1))
      window.history.replaceState({}, '', url.toString())
    } catch {}
  }

  // Inicializa desde ?step= de la URL
  useState(() => {
    try {
      const url = new URL(window.location.href)
      const s = parseInt(url.searchParams.get('step') || '0', 10)
      if (s && Number.isFinite(s)) save(Math.min(Math.max(s-1, 0), Math.max(steps.length - 1, 0)))
    } catch {}
  })

  // Atajos de teclado
  useState(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') save(Math.max(0, index - 1))
      if (e.key === 'ArrowRight') save(Math.min(steps.length - 1, index + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            {onReset && (
              <Button size="sm" variant="outline" onClick={() => { save(0); onReset() }}>Reiniciar</Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-xs text-gray-500">Paso {index + 1} de {steps.length}</div>
          <Progress value={pct} className="w-full" />
          {steps.length > 1 && (
            <div className="flex flex-wrap gap-1" aria-label="Paso">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => save(i)}
                  className={`h-2 w-6 rounded ${i === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                  aria-current={i === index}
                  aria-label={`Ir al paso ${i + 1}`}
                />
              ))}
            </div>
          )}
          <div className="p-3 rounded bg-gray-50 border">
            <div className="font-semibold mb-1">{steps[index]?.title}</div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{steps[index]?.content}</div>
            {steps[index]?.hint && (
              <div className="mt-2 text-xs text-gray-600">Sugerencia: {steps[index]?.hint}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => save(Math.max(0, index - 1))} disabled={index === 0}>Anterior</Button>
            <Button size="sm" onClick={() => save(Math.min(steps.length - 1, index + 1))} disabled={index === steps.length - 1}>Siguiente</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )}
