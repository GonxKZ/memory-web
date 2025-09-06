import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

type DocModule = { default: React.ComponentType; meta?: { title: string; module?: string; slug?: string; description?: string } }
const files = import.meta.glob('/src/content/**/*.mdx', { eager: true }) as Record<string, DocModule>

const entries = Object.entries(files).map(([path, mod]) => ({
  path,
  Comp: mod.default,
  title: mod.meta?.title ?? path.split('/').slice(-1)[0].replace(/\.mdx$/, ''),
  module: mod.meta?.module ?? 'General',
  slug: mod.meta?.slug ?? path.split('/').slice(-1)[0].replace(/\.mdx$/, ''),
  description: mod.meta?.description ?? '',
}))

export default function DocsPage() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    if (!q) return entries
    const s = q.toLowerCase()
    return entries.filter(e => e.title.toLowerCase().includes(s) || e.module.toLowerCase().includes(s) || e.description.toLowerCase().includes(s))
  }, [q])

  const groups = useMemo(() => filtered.reduce((acc: Record<string, typeof entries>, e) => {
    acc[e.module] ||= [] as any
    acc[e.module].push(e)
    return acc
  }, {}), [filtered])

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Contenido</h1>
        <p className="text-gray-600 mt-2">Material de apoyo y teoría complementaria.</p>
        <div className="mt-4 max-w-md mx-auto">
          <Input placeholder="Buscar contenido…" value={q} onChange={e => setQ(e.target.value)} aria-label="Buscar contenido" />
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groups).map(([mod, items]) => (
          <Card key={mod}>
            <CardHeader>
              <CardTitle>{mod}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {items.map((e) => (
                  <Card key={e.slug} className="cursor-pointer hover:shadow-sm">
                    <CardContent className="p-4 space-y-2">
                      <div className="text-sm font-semibold">{e.title}</div>
                      {e.description && <div className="text-xs text-gray-500 line-clamp-3">{e.description}</div>}
                      <Button size="sm" variant="outline" onClick={() => navigate(`/docs/${e.slug}`)} aria-label={`Abrir ${e.title}`}>
                        Abrir
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

