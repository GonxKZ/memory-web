import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Memoria de Bajo Nivel
              </h1>
              <p className="text-gray-600 text-sm">
                Visualización Interactiva
              </p>
            </div>
            <nav aria-label="Navegación principal" className="hidden md:flex gap-3">
              <a className="text-sm text-gray-700 hover:text-gray-900" href="/lessons">Lecciones</a>
              <a className="text-sm text-gray-700 hover:text-gray-900" href="/glossary">Glosario</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-1 container mx-auto px-4 py-6" id="main-content">
        <div className="flex-1" role="main">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido a la Visualización de Memoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Aplicación de Visualización de Conceptos de Memoria</h2>
                <p className="text-gray-600 mb-6">
                  Esta aplicación proporciona visualizaciones interactivas de conceptos avanzados de memoria,
                  incluyendo virtualización, segmentación, mapeo, protección, y más.
                </p>
                
                <div className="flex justify-center gap-4 mb-6">
                  <Button onClick={() => setCount(count + 1)}>
                    Contador: {count}
                  </Button>
                  <Button variant="outline" onClick={() => setCount(0)}>
                    Reset
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-semibold text-blue-600">Conceptos Fundamentales</div>
                      <p className="text-sm text-gray-600 mt-2">
                        Aprende sobre virtualización, segmentación y mapeo de memoria
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-semibold text-green-600">Técnicas Avanzadas</div>
                      <p className="text-sm text-gray-600 mt-2">
                        Explora optimización, compresión y prefetching de memoria
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-semibold text-purple-600">Seguridad</div>
                      <p className="text-sm text-gray-600 mt-2">
                        Entiende ataques de canal lateral y protección de memoria
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-gray-600 mb-2 md:mb-0">
              © {new Date().getFullYear()} Visualización de Conceptos de Memoria de Bajo Nivel
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                Acerca de
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                Contacto
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                Privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
