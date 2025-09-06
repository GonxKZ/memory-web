import { useCallback, useEffect, useRef, useState } from 'react'

export type SimulationControls<TState> = {
  state: TState
  progress: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: (next?: TState) => void
}

type Options<TState> = {
  initial: TState
  totalSteps: number
  stepMs?: number
  step: (state: TState, i: number) => TState
  onUpdate?: (state: TState, i: number) => void
}

export function useSimulation<TState>(opts: Options<TState>): SimulationControls<TState> {
  const { initial, totalSteps, stepMs = 16, step, onUpdate } = opts
  const [state, setState] = useState<TState>(initial)
  const [progress, setProgress] = useState(0)
  const [isRunning, setRunning] = useState(false)
  const iRef = useRef(0)
  const timer = useRef<number | null>(null)

  const tick = useCallback(() => {
    if (iRef.current >= totalSteps) {
      setRunning(false)
      if (timer.current) clearTimeout(timer.current)
      timer.current = null
      return
    }
    setState(prev => {
      const next = step(prev, iRef.current)
      onUpdate?.(next, iRef.current)
      return next
    })
    iRef.current += 1
    setProgress(Math.min(100, ((iRef.current) / totalSteps) * 100))
    timer.current = window.setTimeout(tick, stepMs)
  }, [totalSteps, stepMs, step, onUpdate])

  const start = useCallback(() => {
    if (isRunning) return
    setRunning(true)
    timer.current = window.setTimeout(tick, stepMs)
  }, [isRunning, stepMs, tick])

  const pause = useCallback(() => {
    setRunning(false)
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
  }, [])

  const reset = useCallback((next?: TState) => {
    pause()
    iRef.current = 0
    setProgress(0)
    setState(next ?? initial)
  }, [pause, initial])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return { state, progress, isRunning, start, pause, reset }
}
