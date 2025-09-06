import { useEffect, useMemo, useRef, useState } from 'react'
import MiniSearch from 'minisearch'
import { listLessons } from '@/lessons/registry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type DocModule = { default: React.ComponentType; meta?: { title?: string; module?: string; slug?: string; description?: string } }
const docsModules = import.meta.glob('/src/content/**/*.mdx', { eager: true }) as Record<string, DocModule>

type Item = { id: string; title: string; module: string; slug: string; kind: 'lesson' | 'doc'; description?: string }

function buildIndex(): { search: MiniSearch<Item>; all: Item[] } {
  const lessons = listLessons().map<Item>(l => ({ id: `lesson:${l.slug}`, title: l.title, module: l.module, slug: l.slug, kind: 'lesson' }))
  const docs = Object.entries(docsModules).map<Item>(([path, mod]) => ({
    id: `doc:${path}`,
    title: mod.meta?.title ?? path.split('/').pop()!.replace(/\.mdx$/, ''),
    module: mod.meta?.module ?? 'Docs',
    slug: mod.meta?.slug ?? path.split('/').pop()!.replace(/\.mdx$/, ''),
    description: mod.meta?.description,
    kind: 'doc',
  }))
  const all = [...lessons, ...docs]
  const search = new MiniSearch<Item>({ fields: ['title', 'module', 'slug', 'description'], storeFields: ['title', 'module', 'slug', 'kind', 'description'], searchOptions: { prefix: true, fuzzy: 0.2 } })
  search.addAll(all)
  return { search, all }
}

export default function SearchModal() {
  const [{ search, all }] = useState(() => buildIndex())
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(true) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0) }, [open])

  const results = useMemo<Item[]>(() => {
    if (!q.trim()) return all.slice(0, 8)
    return (search.search(q).slice(0, 20) as unknown as Item[])
  }, [q, search, all])

  if (!open) return null
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Buscar (Ctrl/⌘+K)</CardTitle>
        </CardHeader>
        <CardContent>
          <Input ref={inputRef} placeholder="Lecciones o contenidos…" value={q} onChange={e => setQ(e.target.value)} aria-label="Buscar" />
          <div className="mt-4 max-h-80 overflow-auto divide-y">
            {results.map((r) => (
              <a key={r.id} className="block p-3 hover:bg-accent rounded" href={r.kind === 'lesson' ? `/lesson/${r.slug}` : `/docs/${r.slug}`} onClick={() => setOpen(false)}>
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-xs text-gray-500">{r.module} · {r.kind === 'lesson' ? r.slug : 'contenido'}</div>
                {r.description && <div className="text-xs text-gray-600 line-clamp-2 mt-1">{r.description}</div>}
              </a>
            ))}
            {results.length === 0 && <div className="text-sm text-gray-500 p-3">Sin resultados.</div>}
          </div>
          <div className="mt-3 flex justify-end">
            <button className="text-xs text-gray-500 underline" onClick={() => setOpen(false)}>Cerrar</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
