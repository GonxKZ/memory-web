import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { listLessons, groupByModule } from "@/lessons/registry"
import { useNavigate } from "react-router-dom"

export default function LessonsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const lessons = useMemo(() => listLessons(), [])
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
        {Object.entries(grouped).map(([moduleName, items]) => (
          <Card key={moduleName}>
            <CardHeader>
              <CardTitle>{moduleName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((l) => (
                  <Card key={l.slug} className="cursor-pointer hover:shadow-sm" onClick={() => navigate(`/lesson/${l.slug}`)}>
                    <CardContent className="p-3">
                      <div className="text-sm font-semibold">{l.title}</div>
                      <div className="text-xs text-gray-500">{l.slug}</div>
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
