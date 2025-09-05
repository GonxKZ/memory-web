import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Visualización de Conceptos de Memoria de Bajo Nivel</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explora los conceptos fundamentales de la memoria en sistemas informáticos con explicaciones 
          detalladas, ejemplos prácticos y visualizaciones interactivas.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <span className="mr-2 text-2xl">🧠</span>
              Aprende
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Conceptos complejos explicados en términos simples con analogías cotidianas 
              para facilitar la comprensión de temas avanzados de memoria.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <span className="mr-2 text-2xl">👁️</span>
              Visualiza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Diagramas y explicaciones visuales que muestran cómo funcionan los conceptos 
              en la práctica, con ejemplos de código y casos de uso reales.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <span className="mr-2 text-2xl">🔍</span>
              Explora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700">
              Navega por diferentes temas usando el menú lateral y profundiza en áreas 
              que te interesen especialmente, con contenido actualizado regularmente.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <span className="mr-2 text-2xl">📚</span>
            Temas Cubiertos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Fundamentos</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Virtualización de Memoria</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Segmentación</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Mapeo de Memoria</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Protección de Memoria</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Técnicas Avanzadas</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Optimización de Memoria</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Compresión de Memoria</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Barreras de Memoria</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Consistencia de Memoria</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Seguridad</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className="mr-2 text-orange-500">•</span>
                  <span>Ataques de Canal Lateral</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-500">•</span>
                  <span>Encriptación de Memoria</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-500">•</span>
                  <span>Integridad de Flujo de Control</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-500">•</span>
                  <span>Spectre y Meltdown</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Rendimiento</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>NUMA</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>Ancho de Banda de Memoria</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>Prefetching</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>Políticas de Reemplazo de Caché</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            <span className="mr-2 text-2xl">💡</span>
            Cómo usar esta guía
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="font-semibold text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">1.</span>
                <span>Navega</span>
              </div>
              <p className="text-yellow-700">
                Usa el menú lateral para seleccionar el tema que quieres explorar.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <div className="font-semibold text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">2.</span>
                <span>Lee</span>
              </div>
              <p className="text-yellow-700">
                Cada sección explica conceptos con ejemplos y analogías fáciles de entender.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <div className="font-semibold text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">3.</span>
                <span>Aprende</span>
              </div>
              <p className="text-yellow-700">
                Profundiza en los temas que más te interesen y descubre cómo aplicar 
                estos conceptos en la práctica.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center text-indigo-800">
            <span className="mr-2 text-2xl">🎯</span>
            ¿Para quién es esta guía?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-indigo-800 mb-2">Estudiantes</h3>
              <p className="text-indigo-700">
                Ideal para estudiantes de informática que quieren entender conceptos 
                de sistemas y arquitectura de computadoras.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-indigo-800 mb-2">Desarrolladores</h3>
              <p className="text-indigo-700">
                Útil para programadores que quieren escribir código más eficiente 
                y seguro a nivel de sistema.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-indigo-800 mb-2">Profesionales de Seguridad</h3>
              <p className="text-indigo-700">
                Recurso valioso para entender vulnerabilidades de memoria y cómo 
                proteger sistemas contra ellas.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-indigo-800 mb-2">Cualquier persona curiosa</h3>
              <p className="text-indigo-700">
                Explicaciones claras para cualquier persona interesada en cómo 
                funcionan los ordenadores a bajo nivel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}