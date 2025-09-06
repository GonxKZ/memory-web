import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DocModule = { default: React.ComponentType; meta?: { title: string; module?: string; slug?: string } }
const files = import.meta.glob('/src/content/**/*.mdx')

const index: Record<string, () => Promise<DocModule>> = {}
for (const [path, loader] of Object.entries(files)) {
  const slug = path.split('/').slice(-1)[0].replace(/\.mdx$/, '')
  index[slug] = loader as any
}

export default function DocRoute() {
  const nav = useNavigate()
  const loc = useLocation()
  const slug = decodeURIComponent(loc.pathname.replace(/.*\/docs\//, ''))
  const load = index[slug]

  // Lazy render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const Comp = (function useAsync() {
    const m = (window as any)[`__doc_${slug}`]
    if (m) return m as React.ComponentType
    throw index[slug]().then((mod) => { (window as any)[`__doc_${slug}`] = mod.default })
  })

  if (!load) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Contenido no encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <button className="underline" onClick={() => nav('/docs')}>Volver a contenido</button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="prose dark:prose-invert max-w-3xl mx-auto">
        {/* @ts-expect-error async MDX component */}
        <Comp />
      </div>
    </div>
  )
}

