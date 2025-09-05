import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MemoryVirtualizationConcepts() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Conceptos de Virtualización de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo los sistemas virtualizan la memoria para ejecutar múltiples sistemas operativos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>¿Qué es la Virtualización de Memoria?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                La virtualización de memoria es una técnica que permite que múltiples sistemas operativos 
                compartan los mismos recursos de memoria física, creando la ilusión de que cada uno tiene 
                su propia memoria dedicada.
              </p>
              
              <div className="p-4 bg-blue-50 rounded">
                <div className="font-semibold text-blue-800 mb-2">Concepto Clave:</div>
                <p className="text-blue-700">
                  Cada sistema operativo virtualizado (invitado) piensa que tiene su propio espacio de 
                  direcciones lineal completo, mientras que el hipervisor mapea estas direcciones virtuales 
                  a direcciones físicas reales en la memoria del sistema host.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-100 rounded text-center">
                  <div className="font-semibold">Dirección Virtual</div>
                  <div className="text-sm text-gray-600">(Usada por el SO invitado)</div>
                </div>
                <div className="p-3 bg-gray-100 rounded text-center">
                  <div className="font-semibold">Dirección Física</div>
                  <div className="text-sm text-gray-600">(Dirección real en RAM)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ventajas de la Virtualización de Memoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Aislamiento:</strong> Cada máquina virtual tiene su propio espacio de memoria protegido
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Consolidación:</strong> Permite ejecutar múltiples cargas de trabajo en un solo servidor físico
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Gestión Eficiente:</strong> El hipervisor puede optimizar la asignación de memoria entre VMs
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  <strong>Migración en Vivo:</strong> Facilita la migración de VMs entre hosts sin interrupciones
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Componentes Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">MMU (Unidad de Gestión de Memoria)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Traduce direcciones virtuales en direcciones físicas utilizando tablas de páginas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">EPT (Tablas de Páginas Extendidas)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Estructura de datos que mapea direcciones de máquina virtual (GVA) a direcciones físicas del host (HPA).
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Hipervisor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Software que gestiona la virtualización y coordina el acceso a los recursos de memoria entre VMs.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
