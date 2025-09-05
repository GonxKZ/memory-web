import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConsistencyModelsVisualization() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Modelos de Consistencia</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo diferentes modelos de consistencia afectan el orden de las operaciones de memoria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>¿Qué es la Consistencia de Memoria?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                La consistencia de memoria define las reglas que gobiernan el orden en que las operaciones 
                de memoria (lecturas y escrituras) se vuelven visibles para diferentes procesadores.
              </p>
              
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-800 mb-2">Concepto Clave:</div>
                <p className="text-blue-700">
                  Un modelo de consistencia más fuerte garantiza más orden y previsibilidad, pero puede 
                  limitar el rendimiento. Un modelo más débil permite más paralelismo pero requiere 
                  más cuidado en la programación.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="font-semibold">Consistencia Fuerte</div>
                  <div className="text-sm text-gray-600">Más predecible</div>
                </div>
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="font-semibold">Consistencia Débil</div>
                  <div className="text-sm text-gray-600">Más rendimiento</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Modelos Comunes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">•</span>
                <span>
                  <strong>Secuencial:</strong> Todas las operaciones parecen ocurrir en un orden global
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>
                  <strong>Causal:</strong> Solo se garantiza el orden de operaciones causalmente relacionadas
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-purple-500">•</span>
                <span>
                  <strong>PRAM:</strong> Las operaciones de cada procesador se ven en orden de programa
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">•</span>
                <span>
                  <strong>Total Store Ordering (TSO):</strong> Modelo usado en arquitecturas x86
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Comparativa de Modelos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Consistencia Secuencial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    El modelo más fuerte, todas las operaciones parecen ocurrir en un orden global.
                  </div>
                  
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Más fácil de razonar</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Resultados predecibles</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-red-50 rounded">
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Limita optimizaciones</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Puede afectar rendimiento</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Total Store Ordering (TSO)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Modelo usado en arquitecturas x86, permite reordenamiento de lecturas con escrituras.
                  </div>
                  
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Buena relación rendimiento/consistencia</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Adecuado para muchas aplicaciones</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-red-50 rounded">
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Complejidad en programación concurrente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Puede causar errores sutiles</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Consistencia Relajada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Permite más reordenamiento para mejorar el rendimiento.
                  </div>
                  
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-semibold text-xs mb-1">Ventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Máximo rendimiento potencial</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-green-500">✓</span>
                        <span>Mayor paralelismo</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-red-50 rounded">
                    <div className="font-semibold text-xs mb-1">Desventajas:</div>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Difícil de programar correctamente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-1 text-red-500">✗</span>
                        <span>Errores difíciles de depurar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
