import { Suspense, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getExplainAndGuided, listLessons, loadLessonComponent } from "@/lessons/registry"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"
import { useState } from "react"

export default function LessonRoute() {
  const nav = useNavigate()
  const loc = useLocation()
  // Path after /lesson/
  const rel = decodeURIComponent(loc.pathname.replace(/.*\/lesson\//, ""))
  const lessons = useMemo(() => listLessons(), [])
  const match = lessons.find((l) => l.slug === rel)
  const [guided, setGuided] = useState(false)
  const [Comp, setComp] = useState<null | React.ComponentType<any>>(null)

  useMemo(() => {
    if (match) {
      loadLessonComponent(match.path).then((C) => setComp(() => C))
    } else {
      setComp(() => null)
    }
  }, [match])

  if (!match) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No se encontró la lección</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => nav("/lessons")}>Volver a lecciones</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { explain, guided: guidedData } = getExplainAndGuided(match.slug)

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-6">
        <div className="text-xs text-gray-500">Módulo {match.module}</div>
        <h1 className="text-3xl font-bold">{match.title}</h1>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided((v) => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title={explain.title}
        metaphor={explain.metaphor}
        idea={explain.idea}
        bullets={explain.bullets}
        board={explain.board}
      />

      {guided && <GuidedFlow title={guidedData.title} steps={guidedData.steps} />}

      <Card>
        <CardHeader>
          <CardTitle>Visualización</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="p-4">Cargando visualización...</div>}>
            {Comp ? <Comp /> : <div className="p-4">Cargando...</div>}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

