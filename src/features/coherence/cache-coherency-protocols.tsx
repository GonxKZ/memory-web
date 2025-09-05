import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CacheCoherencyProtocols() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Protocolos de Coherencia de Caché</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo se mantiene la coherencia entre múltiples cachés en sistemas multiprocesador
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>¿Qué es la Coherencia de Caché?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                La coherencia de caché es un mecanismo que garantiza que múltiples copias de los mismos 
                datos en diferentes cachés permanezcan consistentes entre sí.
              </p>
              
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-800 mb-2">Problema que Resuelve:</div>
                <p className="text-blue-700">
                  Cuando múltiples procesadores tienen copias de los mismos datos en sus cachés, 
                  necesitamos asegurar que los cambios hechos por un procesador sean visibles para 
                  los demás procesadores.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-100 rounded text-center">
                  <div className="font-semibold">Sin Coherencia</div>
                  <div className="text-sm text-gray-600">Datos inconsistentes</div>
                </div>
                <div className="p-3 bg-gray-100 rounded text-center">
                  <div className="font-semibold">Con Coherencia</div>
                  <div className="text-sm text-gray-600">Datos consistentes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Protocolos Comunes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>
                  <strong>MSI:</strong> Modified, Shared, Invalid - Protocolo básico de tres estados
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>
                  <strong>MESI:</strong> Modified, Exclusive, Shared, Invalid - Extensión del MSI
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-purple-500">•</span>
                <span>
                  <strong>MOESI:</strong> Modified, Owner, Exclusive, Shared, Invalid - Más estados
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">•</span>
                <span>
                  <strong>Dragon:</strong> Protocolo basado en actualizaciones en lugar de invaliaciones
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Estados del Protocolo MESI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Modified (M)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  La caché tiene la única copia válida del dato, que ha sido modificada.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Exclusive (E)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  La caché tiene la única copia del dato, pero no ha sido modificada.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-yellow-600">Shared (S)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  El dato está presente en varias cachés y no ha sido modificado.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Invalid (I)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  El bloque no contiene datos válidos o está obsoleto.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}