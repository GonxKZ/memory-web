import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CpuIcon, 
  DatabaseIcon, 
  LayersIcon, 
  LockIcon, 
  ZapIcon,
  BookOpenIcon,
  SearchIcon
} from "lucide-react"

export default function Home() {
  const modules = [
    {
      title: "Módulo 1: Cachés",
      description: "Aprende sobre jerarquía de cachés, políticas de reemplazo y localidad.",
      icon: <CpuIcon className="h-8 w-8" />,
      href: "/cache/set-visualizer",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Módulo 2: TLB y Memoria Virtual",
      description: "Entiende la traducción de direcciones, paginación y TLB.",
      icon: <LayersIcon className="h-8 w-8" />,
      href: "/tlb/tlb-walk",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Módulo 3: DRAM",
      description: "Descubre cómo funciona la memoria principal.",
      icon: <DatabaseIcon className="h-8 w-8" />,
      href: "/dram/bank-matrix",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Módulo 4: Coherencia y Consistencia",
      description: "Aprende sobre coherencia de caché y modelos de consistencia.",
      icon: <ZapIcon className="h-8 w-8" />,
      href: "/coherence/mesi-simulator",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Módulo 5: Asignadores de Memoria",
      description: "Explora cómo se gestiona la memoria dinámica.",
      icon: <LockIcon className="h-8 w-8" />,
      href: "/allocators/buddy-allocator",
      color: "bg-red-100 text-red-600"
    }
  ]

  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Memoria <span className="text-blue-600">Low-Level</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Una web didáctica e interactiva sobre cómo funciona la memoria a bajo nivel.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/cache/set-visualizer">
              Comenzar a aprender
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/glossary">
              Explorar glosario
            </Link>
          </Button>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Módulos de Aprendizaje</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora los diferentes aspectos de la memoria a través de visualizaciones 
            interactivas y laboratorios prácticos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card 
              key={index} 
              className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${module.color}`}>
                  {module.icon}
                </div>
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{module.description}</p>
                <Button asChild className="w-full">
                  <Link to={module.href}>
                    Explorar módulo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Por qué aprender con nosotros?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una experiencia educativa única con visualizaciones interactivas 
            y explicaciones claras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Contenido Didáctico</h3>
            <p className="text-gray-600">
              Explicaciones claras y concisas con ejemplos prácticos para facilitar el aprendizaje.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ZapIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visualizaciones Interactivas</h3>
            <p className="text-gray-600">
              Experimenta conceptos complejos a través de simulaciones y visualizaciones 3D.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Glosario Integrado</h3>
            <p className="text-gray-600">
              Accede a definiciones técnicas fácilmente desde cualquier parte de la plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Sumérgete en el fascinante mundo de la memoria a bajo nivel y mejora tus 
          habilidades en programación de sistemas.
        </p>
        <Button size="lg" asChild>
          <Link to="/cache/set-visualizer">
            Comenzar ahora
          </Link>
        </Button>
      </section>
    </div>
  )
}