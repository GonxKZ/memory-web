/* eslint-disable no-useless-escape */
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedDiv } from '@/components/animated-div'
import { MathRenderer } from '@/components/math-renderer'
import { CodeBlock } from '@/components/code-block'

export default function LessonTemplate() {
  const [activeTab, setActiveTab] = useState('theory')
  
  return (
    <div className="container mx-auto py-8">
      <AnimatedDiv>
        <h1 className="text-3xl font-bold mb-4">Título de la Lección</h1>
        <p className="mb-8 text-lg">Resumen de la lección</p>
      </AnimatedDiv>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="theory">Teoría</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
          <TabsTrigger value="lab">Laboratorio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theory">
          <AnimatedDiv delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Conceptos Fundamentales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>
                    Contenido teórico de la lección. Puede incluir explicaciones, 
                    fórmulas matemáticas y ejemplos de código.
                  </p>
                  
                  <MathRenderer 
                    expression={"\	ext{Tiempo de acceso} = \	ext{Hit Rate} \	imes \	ext{Tiempo Hit} + \	ext{Miss Rate} \	imes \	ext{Tiempo Miss}"} 
                    displayMode 
                  />
                  
                  <CodeBlock 
                    code={`// Ejemplo de código
function calculateLatency(hitRate, hitTime, missTime) {
  return hitRate * hitTime + (1 - hitRate) * missTime;
}`} 
                    language="javascript" 
                  />
                </div>
              </CardContent>
            </Card>
          </AnimatedDiv>
        </TabsContent>
        
        <TabsContent value="demo">
          <AnimatedDiv delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Demostración Interactiva</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Contenido de la demostración interactiva</p>
                <Button className="mt-4">Interactuar con la demo</Button>
              </CardContent>
            </Card>
          </AnimatedDiv>
        </TabsContent>
        
        <TabsContent value="lab">
          <AnimatedDiv delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Laboratorio Práctico</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Contenido del laboratorio práctico</p>
                <Button className="mt-4">Iniciar laboratorio</Button>
              </CardContent>
            </Card>
          </AnimatedDiv>
        </TabsContent>
      </Tabs>
    </div>
  )
}
