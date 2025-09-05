import { Card } from '@/components/ui/card'

const concepts = [
  {
    id: 'virtualization',
    name: 'Virtualización de Memoria',
    description: 'Cómo los programas ven la memoria',
    icon: '🌐'
  },
  {
    id: 'segmentation',
    name: 'Segmentación',
    description: 'Dividir la memoria en partes',
    icon: '📐'
  },
  {
    id: 'protection',
    name: 'Protección de Memoria',
    description: 'Mantener la memoria segura',
    icon: '🛡️'
  },
  {
    id: 'consistency',
    name: 'Consistencia de Memoria',
    description: 'Cómo se comparte la memoria',
    icon: '🔁'
  },
  {
    id: 'optimization',
    name: 'Optimización de Memoria',
    description: 'Hacer que la memoria sea más rápida',
    icon: '⚡'
  },
  {
    id: 'compression',
    name: 'Compresión de Memoria',
    description: 'Guardar más en el mismo espacio',
    icon: '🗜️'
  },
  {
    id: 'sidechannel',
    name: 'Ataques de Canal Lateral',
    description: 'Ataques indirectos a la memoria',
    icon: '🕵️'
  },
  {
    id: 'encryption',
    name: 'Encriptación de Memoria',
    description: 'Proteger datos con códigos',
    icon: '🔐'
  },
  {
    id: 'controlflow',
    name: 'Integridad de Flujo de Control',
    description: 'Proteger el orden de ejecución',
    icon: '🔄'
  },
  {
    id: 'mapping',
    name: 'Mapeo de Memoria',
    description: 'Conectar direcciones virtuales y físicas',
    icon: '🗺️'
  },
  {
    id: 'barriers',
    name: 'Barreras de Memoria',
    description: 'Controlar el orden de operaciones',
    icon: '🚧'
  },
  {
    id: 'numa',
    name: 'NUMA',
    description: 'Arquitectura de memoria no uniforme',
    icon: '🔢'
  },
  {
    id: 'bandwidth',
    name: 'Ancho de Banda de Memoria',
    description: 'Velocidad de transferencia de datos',
    icon: '📶'
  },
  {
    id: 'prefetching',
    name: 'Prefetching',
    description: 'Predecir y cargar datos',
    icon: '🔮'
  },
  {
    id: 'replacement',
    name: 'Políticas de Reemplazo de Caché',
    description: 'Decidir qué datos mantener',
    icon: 'キャッシング'
  },
  {
    id: 'attacks',
    name: 'Ataques de Canal Lateral',
    description: 'Ataques que usan información indirecta',
    icon: '🕵️'
  },
  {
    id: 'spectre',
    name: 'Spectre y Meltdown',
    description: 'Vulnerabilidades de procesadores',
    icon: '👻'
  },
  {
    id: 'rowhammer',
    name: 'Rowhammer',
    description: 'Ataque físico a la memoria',
    icon: '🔨'
  }
]

interface ConceptNavigationProps {
  activeConcept: string
  setActiveConcept: (concept: string) => void
}

export function ConceptNavigation({ activeConcept, setActiveConcept }: ConceptNavigationProps) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Conceptos de Memoria</h2>
      <p className="text-sm text-gray-600 mb-4">
        Selecciona un concepto para aprender más sobre él:
      </p>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {concepts.map((concept) => (
          <button
            key={concept.id}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              activeConcept === concept.id
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveConcept(concept.id)}
          >
            <div className="flex items-center">
              <span className="text-xl mr-3">{concept.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{concept.name}</div>
                <div className="text-xs text-gray-500">{concept.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}