import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnimatedHomePage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Memoria de Bajo Nivel
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explora conceptos avanzados de gestión de memoria en sistemas modernos
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <span className="mr-2 text-2xl">📚</span>
              Fundamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Comprende los conceptos básicos de la memoria virtual, segmentación y protección.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <span className="mr-2 text-2xl">⚙️</span>
              Técnicas Avanzadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Profundiza en optimización, compresión y arquitecturas NUMA.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <span className="mr-2 text-2xl">🛡️</span>
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700">
              Aprende sobre ataques de canal lateral y técnicas de protección.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Visualización Interactiva</h2>
          <p className="mb-6">
            Esta guía interactiva te ayudará a entender los conceptos complejos de memoria de bajo nivel 
            a través de explicaciones detalladas, ejemplos prácticos y visualizaciones.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl font-bold">15+</div>
              <div>Conceptos</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl font-bold">50+</div>
              <div>Ejemplos</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl font-bold">100%</div>
              <div>En Español</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <span className="mr-2">🔍</span>
              ¿Cómo navegar?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Usa el menú lateral para explorar diferentes conceptos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Cada sección contiene explicaciones detalladas y ejemplos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>Las visualizaciones ayudan a comprender mejor los conceptos complejos</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <span className="mr-2">💡</span>
              Consejos de aprendizaje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Comienza con los fundamentos antes de avanzar a temas complejos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Experimenta con los ejemplos para reforzar tu comprensión</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Toma notas de los conceptos que te resulten más difíciles</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}