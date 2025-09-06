import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ExplainPanel from "@/components/learn/ExplainPanel"
import GuidedFlow from "@/components/learn/GuidedFlow"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export default function MemoryOptimizationPatterns() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [optimizationResults, setOptimizationResults] = useState<{
    pattern: string,
    before: {time: number, memory: number, cacheMisses: number},
    after: {time: number, memory: number, cacheMisses: number},
    improvement: number
  }[]>([])
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [guided, setGuided] = useState(false)

  // Optimization patterns data
  const patterns = [
    {
      id: "pool",
      name: "Object Pool",
      description: "Reutiliza objetos en lugar de crear/eliminar continuamente",
      problem: "Creación y destrucción frecuente de objetos",
      solution: "Mantener un pool de objetos pre-creados",
      before: {time: 100, memory: 1000, cacheMisses: 50},
      after: {time: 30, memory: 800, cacheMisses: 20},
      codeExample: `
// Sin pool
for (int i = 0; i < 1000; i++) {
  GameObject* obj = new GameObject();
  // ... uso del objeto ...
  delete obj;
}

// Con pool
ObjectPool<GameObject> pool(100);
for (int i = 0; i < 1000; i++) {
  GameObject* obj = pool.acquire();
  // ... uso del objeto ...
  pool.release(obj);
}
      `,
      benefits: [
        "Reducción de tiempo de alojamiento",
        "Menos presión en el recolector de basura",
        "Mejor localidad de caché"
      ],
      drawbacks: [
        "Complejidad adicional",
        "Posible desperdicio de memoria"
      ]
    },
    {
      id: "flyweight",
      name: "Flyweight",
      description: "Comparte objetos inmutables para ahorrar memoria",
      problem: "Muchos objetos con datos compartidos",
      solution: "Separar estado intrínseco y extrínseco",
      before: {time: 80, memory: 2000, cacheMisses: 40},
      after: {time: 70, memory: 500, cacheMisses: 35},
      codeExample: `
// Sin flyweight
class Tree {
  private TreeType type;
  private int x, y;
  // ... otros datos ...
}

// Con flyweight
class Tree {
  private TreeType type; // Referencia compartida
  private int x, y;
}

class TreeType {
  private String name;
  private Color color;
  private Texture texture;
  // Datos compartidos
}
      `,
      benefits: [
        "Reducción drástica de uso de memoria",
        "Mejor localidad de datos compartidos"
      ],
      drawbacks: [
        "Complejidad en gestión de estado",
        "Posible sobrecarga en acceso a datos extrínsecos"
      ]
    },
    {
      id: "arena",
      name: "Arena Allocator",
      description: "Asigna bloques grandes y libera todo a la vez",
      problem: "Muchas pequeñas asignaciones/deasignaciones",
      solution: "Asignar en bloques grandes y liberar en masa",
      before: {time: 120, memory: 1500, cacheMisses: 60},
      after: {time: 40, memory: 1200, cacheMisses: 25},
      codeExample: `
// Sin arena
for (int i = 0; i < 1000; i++) {
  char* str = malloc(strlen(data[i]) + 1);
  strcpy(str, data[i]);
  process_string(str);
  free(str);
}

// Con arena
Arena arena(1024 * 1024); // 1MB
for (int i = 0; i < 1000; i++) {
  char* str = arena.allocate(strlen(data[i]) + 1);
  strcpy(str, data[i]);
  process_string(str);
  // No necesita free individual
}
arena.reset(); // Libera todo a la vez
      `,
      benefits: [
        "Eliminación de overhead de deallocation",
        "Mejor localidad de datos asignados juntos",
        "Prevención de fragmentación"
      ],
      drawbacks: [
        "No adecuado para objetos con vidas diferentes",
        "Posible desperdicio en el último bloque"
      ]
    },
    {
      id: "soa",
      name: "Structure of Arrays",
      description: "Organiza datos para mejorar localidad",
      problem: "Acceso ineficiente a datos parciales",
      solution: "Separar campos en arrays independientes",
      before: {time: 90, memory: 1000, cacheMisses: 70},
      after: {time: 45, memory: 1000, cacheMisses: 20},
      codeExample: `
// Array of Structures (AOS)
struct Particle {
  float x, y, z;
  float vx, vy, vz;
};

Particle particles[N];

// Acceso ineficiente
for (int i = 0; i < N; i++) {
  particles[i].x += particles[i].vx;
}

// Structure of Arrays (SOA)
struct Particles {
  float x[N], y[N], z[N];
  float vx[N], vy[N], vz[N];
};

Particles particles;

// Acceso eficiente
for (int i = 0; i < N; i++) {
  particles.x[i] += particles.vx[i];
}
      `,
      benefits: [
        "Mejor localidad para acceso parcial",
        "Mayor eficiencia en operaciones vectoriales",
        "Menos fallos de caché"
      ],
      drawbacks: [
        "Menos intuitivo para acceso completo",
        "Complejidad en gestión de datos"
      ]
    }
  ]

  // Analyze optimization patterns
  const analyzePatterns = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setOptimizationResults([])
    
    // Simulate analysis process
    for (let i = 0; i < patterns.length; i++) {
      // Update progress
      setAnalysisProgress(((i + 1) / patterns.length) * 100)
      
      // Calculate improvement
      const pattern = patterns[i]
      const timeImprovement = ((pattern.before.time - pattern.after.time) / pattern.before.time) * 100
      const memoryImprovement = ((pattern.before.memory - pattern.after.memory) / pattern.before.memory) * 100
      const cacheImprovement = ((pattern.before.cacheMisses - pattern.after.cacheMisses) / pattern.before.cacheMisses) * 100
      const overallImprovement = (timeImprovement + memoryImprovement + cacheImprovement) / 3
      
      // Add to results
      setOptimizationResults(prev => [...prev, {
        pattern: pattern.id,
        before: pattern.before,
        after: pattern.after,
        improvement: parseFloat(overallImprovement.toFixed(1))
      }])
      
      // Add delay to visualize
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    setIsAnalyzing(false)
  }

  // Reset analysis
  const resetAnalysis = () => {
    setIsAnalyzing(false)
    setAnalysisProgress(0)
    setOptimizationResults([])
    setSelectedPattern(null)
  }

  // Get pattern by ID
  const getPatternById = (id: string) => {
    return patterns.find(p => p.id === id) || patterns[0]
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Patrones de Optimización de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Explora técnicas para optimizar el uso de memoria y mejorar el rendimiento
        </p>
        <div className="mt-3">
          <Button variant={guided ? "default" : "outline"} onClick={() => setGuided(v => !v)}>
            {guided ? "Ocultar modo guía" : "Modo guía (paso a paso)"}
          </Button>
        </div>
      </div>

      <ExplainPanel
        title="Mover datos, no punteros"
        metaphor="Como guardar juntos los cubiertos que usas en la misma comida."
        idea="Localidad (AoS vs SoA) y tiling cambian drásticamente la eficiencia de caché."
        bullets={["AoS vs SoA", "Tiling", "Prefetch consciente"]}
        board={{ title: "Efecto", content: "Mejor localidad ⇒ menos fallos ⇒ tiempo total menor" }}
      />

      {guided && (
        <GuidedFlow
          title="Del patrón al rendimiento"
          steps={[
            { title: "Patrón actual", content: "Observa accesos y saltos." },
            { title: "Reorganizar", content: "Prueba SoA o tiling según acceso." },
            { title: "Medir", content: "Hit‑rate y tiempo total." },
            { title: "Iterar", content: "Combina con prefetch para estabilizar ganancias." },
          ]}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patrones de Optimización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {patterns.map(pattern => (
              <Card 
                key={pattern.id}
                className={`
                  cursor-pointer transition-all duration-200
                  ${selectedPattern === pattern.id 
                    ? "ring-2 ring-blue-500 bg-blue-50" 
                    : "hover:shadow-md"}
                `}
                onClick={() => setSelectedPattern(pattern.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="mr-2 text-xl">
                      {pattern.id === "pool" && "🏊"}
                      {pattern.id === "flyweight" && "🪶"}
                      {pattern.id === "arena" && "🏟️"}
                      {pattern.id === "soa" && "🗄️"}
                    </span>
                    {pattern.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-3">
                    {pattern.description}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {pattern.problem}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex gap-2">
              <Button 
                onClick={analyzePatterns} 
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? "Analizando..." : "Analizar Patrones"}
              </Button>
              <Button 
                onClick={resetAnalysis} 
                variant="outline"
              >
                Reset
              </Button>
            </div>
            
            {isAnalyzing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso</span>
                  <span>{analysisProgress.toFixed(0)}%</span>
                </div>
                <Progress value={analysisProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedPattern 
                ? getPatternById(selectedPattern).name 
                : "Detalles del Patrón"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPattern ? (
              <div className="space-y-6">
                <div>
                  <div className="font-semibold mb-2">Descripción</div>
                  <div className="text-gray-600">
                    {getPatternById(selectedPattern).description}
                  </div>
                </div>
                
                <div>
                  <div className="font-semibold mb-2">Problema</div>
                  <div className="text-gray-600">
                    {getPatternById(selectedPattern).problem}
                  </div>
                </div>
                
                <div>
                  <div className="font-semibold mb-2">Solución</div>
                  <div className="text-gray-600">
                    {getPatternById(selectedPattern).solution}
                  </div>
                </div>
                
                <div>
                  <div className="font-semibold mb-2">Ejemplo de Código</div>
                  <div className="font-mono text-sm bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
                    <pre>{getPatternById(selectedPattern).codeExample.trim()}</pre>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold mb-2 text-green-600">Beneficios</div>
                    <ul className="space-y-1">
                      {getPatternById(selectedPattern).benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-semibold mb-2 text-red-600">Desventajas</div>
                    <ul className="space-y-1">
                      {getPatternById(selectedPattern).drawbacks.map((drawback, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-red-500">✗</span>
                          <span className="text-sm">{drawback}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Seleccione un patrón de optimización para ver los detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resultados de Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          {optimizationResults.length > 0 ? (
            <div className="space-y-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={optimizationResults.map(result => {
                      const pattern = getPatternById(result.pattern)
                      return {
                        name: pattern.name,
                        "Mejora (%)": result.improvement,
                        "Antes": pattern.before.time,
                        "Después": pattern.after.time
                      }
                    })}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Mejora (%)" fill="#10b981" name="Mejora (%)" />
                    <Bar dataKey="Antes" fill="#ef4444" name="Tiempo Antes (ms)" />
                    <Bar dataKey="Después" fill="#3b82f6" name="Tiempo Después (ms)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {optimizationResults.map(result => {
                  const pattern = getPatternById(result.pattern)
                  return (
                    <Card key={result.pattern}>
                      <CardHeader>
                        <CardTitle className="text-sm">{pattern.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Mejora</div>
                            <div className="text-2xl font-bold text-green-600">
                              {result.improvement}%
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Antes</div>
                              <div className="font-mono text-sm">{pattern.before.time} ms</div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Después</div>
                              <div className="font-mono text-sm">{pattern.after.time} ms</div>
                            </div>
                          </div>
                          
                          <div className="p-2 bg-green-50 rounded text-center">
                            <div className="text-xs text-gray-500">Fallos de Caché</div>
                            <div className="font-mono text-sm">
                              {pattern.before.cacheMisses} → {pattern.after.cacheMisses}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay resultados de análisis todavía. Ejecute el análisis para ver los resultados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Guía de Selección de Patrones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Cuándo usar Object Pool?</div>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Cuando se crean/eliminan muchos objetos del mismo tipo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>Para objetos con costo alto de construcción</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>En aplicaciones en tiempo real o juegos</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">¿Cuándo usar Flyweight?</div>
              <ul className="space-y-1 text-sm text-green-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Cuando hay muchos objetos con datos compartidos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>Para objetos inmutables o principalmente inmutables</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>En aplicaciones con muchos objetos similares</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">¿Cuándo usar Arena Allocator?</div>
              <ul className="space-y-1 text-sm text-purple-700">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>Cuando se hacen muchas pequeñas asignaciones relacionadas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>Para objetos con vidas temporales similares</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-500">•</span>
                  <span>En compiladores o procesadores de texto</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded">
              <div className="font-semibold text-yellow-800 mb-2">¿Cuándo usar Structure of Arrays?</div>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">•</span>
                  <span>Cuando se accede a campos específicos de muchos objetos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">•</span>
                  <span>Para cálculos numéricos intensivos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-500">•</span>
                  <span>En aplicaciones SIMD o vectorizadas</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Consejos Generales:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Profilea tu aplicación antes de aplicar optimizaciones</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Considera el trade-off entre complejidad y beneficio</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Mide el impacto de las optimizaciones con benchmarks</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Documenta las decisiones de optimización para mantenimiento futuro</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
