import { useState, useEffect } from 'react'
import './App.css'
import { MemoryConcept } from './components/memory-concept'

function App() {
  const [activeConcept, setActiveConcept] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Cerrar menú al cambiar de concepto en móviles
  useEffect(() => {
    setIsMenuOpen(false)
  }, [activeConcept])

  // Conceptos organizados por categorías
  const conceptCategories = [
    {
      category: "Fundamentos",
      concepts: [
        { id: 'home', name: 'Inicio' },
        { id: 'virtualization', name: 'Virtualización de Memoria' },
        { id: 'segmentation', name: 'Segmentación de Memoria' },
        { id: 'mapping', name: 'Mapeo de Memoria' },
        { id: 'protection', name: 'Protección de Memoria' }
      ]
    },
    {
      category: "Técnicas Avanzadas",
      concepts: [
        { id: 'consistency', name: 'Consistencia de Memoria' },
        { id: 'optimization', name: 'Optimización de Memoria' },
        { id: 'compression', name: 'Compresión de Memoria' },
        { id: 'barriers', name: 'Barreras de Memoria' },
        { id: 'prefetching', name: 'Prefetching' },
        { id: 'replacement', name: 'Políticas de Reemplazo de Caché' },
        { id: 'bandwidth', name: 'Ancho de Banda de Memoria' },
        { id: 'numa', name: 'Arquitectura NUMA' }
      ]
    },
    {
      category: "Seguridad",
      concepts: [
        { id: 'sidechannel', name: 'Ataques de Canal Lateral' },
        { id: 'attacks', name: 'Ataques de Canal Lateral' },
        { id: 'spectre', name: 'Spectre y Meltdown' },
        { id: 'rowhammer', name: 'Rowhammer' },
        { id: 'encryption', name: 'Encriptación de Memoria' },
        { id: 'controlflow', name: 'Integridad de Flujo de Control' }
      ]
    }
  ]

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
            <button 
              className="md:hidden bg-gray-200 p-2 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 container mx-auto px-4 py-6">
        {/* Menú lateral - visible en escritorio, toggle en móviles */}
        <div 
          className={`bg-white rounded-lg shadow p-4 md:block md:w-1/4 mr-6 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'block absolute inset-0 z-20 h-fit mt-20 mx-4' : 'hidden'
          }`}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Conceptos</h2>
          
          {/* Barra de búsqueda */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar conceptos..."
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          
          {/* Navegación por categorías */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pb-4">
            {conceptCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                  {category.category}
                </h3>
                <ul className="space-y-1">
                  {category.concepts.map((concept, conceptIndex) => (
                    <li key={conceptIndex}>
                      <button 
                        className={`w-full text-left p-2 rounded text-sm transition-colors duration-200 ${
                          activeConcept === concept.id 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setActiveConcept(concept.id)}
                      >
                        {concept.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Botón para cerrar menú en móviles */}
          <button 
            className="md:hidden w-full mt-4 p-2 bg-gray-200 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Cerrar menú
          </button>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1">
          <MemoryConcept concept={activeConcept} />
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