export default async function reportWebVitals() {
  try {
    const { onCLS, onFID, onLCP, onINP, onTTFB } = await import('web-vitals')
    const log = (name: string, value: number) => {
      // simple console logging; can be swapped for analytics endpoint
      // values are in milliseconds except CLS (unitless)
      console.log(`[Vitals] ${name}:`, Math.round(name === 'CLS' ? value * 1000 : value))
    }
    onCLS((m: any) => log('CLS', m.value))
    onFID((m: any) => log('FID', m.value))
    onLCP((m: any) => log('LCP', m.value))
    onINP((m: any) => log('INP', m.value))
    onTTFB((m: any) => log('TTFB', m.value))
  } catch {
    // ignore
  }
}
