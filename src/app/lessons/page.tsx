import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { listLessons, groupByModule } from "@/lessons/registry"
import { useNavigate } from "react-router-dom"
import { getVisited } from "@/lib/progress"

export default function LessonsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const lessons = useMemo(() => listLessons(), [])
  const visited = useMemo(() => new Set(getVisited()), [])
  const filtered = useMemo(() => {
    if (!query) return lessons
    const q = query.toLowerCase()
    return lessons.filter((l) => l.title.toLowerCase().includes(q) || l.module.toLowerCase().includes(q))
  }, [lessons, query])
  const grouped = groupByModule(filtered)

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Lecciones</h1>
        <p className="text-gray-600 mt-2">Elige un módulo y una lección</p>
        <div className="mt-4 max-w-md mx-auto">
          <Input placeholder="Buscar por nombre o módulo" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([moduleName, items]) => {
          const done = items.filter(l => visited.has(l.slug)).length
          const total = items.length
          const pct = total > 0 ? Math.round((done / total) * 100) : 0
          return (
            <Card key={moduleName}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{moduleName}</span>
                  <span className="text-xs text-gray-600">{done}/{total}</span>
                </CardTitle>
                <div className="px-6 pb-2">
                  <Progress value={pct} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {items.map((l) => {
                    const seen = visited.has(l.slug)
                    return (
                      <Card key={l.slug} className={`cursor-pointer hover:shadow-sm ${seen ? 'ring-1 ring-green-300' : ''}`} onClick={() => navigate(`/lesson/${l.slug}`)}>
                        <CardContent className="p-3">
                          <div className="text-sm font-semibold flex items-center gap-2">
                            {l.title}
                            {seen && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-300">Visto</span>}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{l.slug}</div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
