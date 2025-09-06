import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function InstallButton() {
  const [deferred, setDeferred] = useState<any>(null)
  const [supported, setSupported] = useState(false)
  useEffect(() => {
    const listener = (e: any) => { e.preventDefault(); setDeferred(e); setSupported(true) }
    window.addEventListener('beforeinstallprompt', listener)
    return () => window.removeEventListener('beforeinstallprompt', listener)
  }, [])
  if (!supported) return null
  return (
    <Button variant="ghost" size="sm" onClick={async () => { try { await deferred.prompt(); setDeferred(null) } catch {} }} aria-label="Instalar aplicación">
      Instalar
    </Button>
  )
}

