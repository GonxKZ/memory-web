import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

export default function MemoryVirtualizationDemo() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Demostración de Virtualización de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo funciona la virtualización de memoria en sistemas virtualizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Proceso de Virtualización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-800 mb-2">1. Direcciones Virtuales del Invitado</div>
                <p className="text-blue-700">
                  Las aplicaciones en la VM usan direcciones virtuales (GVA - Guest Virtual Address) 
                  como si tuvieran memoria física completa.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded">
                <div className="font-semibold text-green-800 mb-2">2. Traducción por Tablas de Páginas</div>
                <p className="text-green-700">
                  El MMU traduce las GVA a direcciones virtuales del host (GPA - Guest Physical Address) 
                  usando las tablas de páginas del sistema invitado.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded">
                <div className="font-semibold text-purple-800 mb-2">3. Traducción EPT/NPT</div>
                <p className="text-purple-700">
                  El hipervisor usa EPT (Extended Page Tables) o NPT (Nested Page Tables) para traducir 
                  las GPA a direcciones físicas reales del host (HPA - Host Physical Address).
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded">
                <div className="font-semibold text-orange-800 mb-2">4. Acceso a Memoria Física</div>
                <p className="text-orange-700">
                  Finalmente, la CPU accede a la memoria física real usando las direcciones HPA.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Beneficios de la Virtualización</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Aislamiento:</strong> Cada VM tiene su propio espacio de direcciones protegido
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Consolidación:</strong> Múltiples cargas de trabajo en un solo servidor físico
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Migración en Vivo:</strong> VMs pueden moverse entre hosts sin interrupciones
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Snapshotting:</strong> Estados completos de VMs pueden guardarse y restaurarse
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Técnicas Avanzadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-2 text-blue-600">Optimizaciones de Hardware</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>EPT/NPT:</strong> Traducción acelerada por hardware de direcciones anidadas
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>VPID:</strong> Identificadores de procesador virtual para invalidación de TLB
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    <strong>Unrestricted Guest:</strong> Modo que elimina restricciones en VMs de 64-bit
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-green-600">Gestión de Memoria</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>
                    <strong>Ballooning:</strong> Técnica para reclamar memoria de VMs sin usar
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>
                    <strong>Memory Overcommit:</strong> Asignar más memoria de la disponible físicamente
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>
                    <strong>Swap/Caching:</strong> Uso de almacenamiento secundario para memoria virtual
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
