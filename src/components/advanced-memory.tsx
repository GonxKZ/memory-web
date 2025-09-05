import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MemoryTechnologyProps {
  technology: "dram" | "sram" | "flash" | "hbm" | "gddr"
  name: string
  description: string
  speed: string
  capacity: string
  power: string
  useCases: string[]
}

export function MemoryTechnology({ 
  technology,
  name,
  description,
  speed,
  capacity,
  power,
  useCases
}: MemoryTechnologyProps) {
  // Technology icons and colors
  const techInfo = {
    "dram": {
      icon: "🧠",
      color: "#3b82f6"
    },
    "sram": {
      icon: "⚡",
      color: "#10b981"
    },
    "flash": {
      icon: "💾",
      color: "#8b5cf6"
    },
    "hbm": {
      icon: "スタッガ",
      color: "#f59e0b"
    },
    "gddr": {
      icon: "🎮",
      color: "#ef4444"
    }
  }

  const currentTech = techInfo[technology]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentTech.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentTech.color }}
      >
        <span className="mr-2 text-xl">{currentTech.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Velocidad</div>
            <div className="font-semibold">{speed}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Capacidad</div>
            <div className="font-semibold">{capacity}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-500">Consumo</div>
            <div className="font-semibold">{power}</div>
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Casos de uso:</div>
          <ul className="space-y-1">
            {useCases.map((useCase, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="mr-1">•</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

interface MemoryTechnologiesProps {
  technologies: {
    technology: "dram" | "sram" | "flash" | "hbm" | "gddr"
    name: string
    description: string
    speed: string
    capacity: string
    power: string
    useCases: string[]
  }[]
}

export function MemoryTechnologies({ technologies }: MemoryTechnologiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-600">
          <span className="mr-2">🔬</span>
          Tecnologías de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué tecnologías existen?</div>
          <div className="text-sm text-blue-700 mt-1">
            Diferentes tecnologías de memoria ofrecen distintas ventajas en 
            velocidad, capacidad, consumo y costo para diversas aplicaciones.
          </div>
        </div>
        
        <div className="space-y-3">
          {technologies.map((technology, index) => (
            <MemoryTechnology
              key={index}
              technology={technology.technology}
              name={technology.name}
              description={technology.description}
              speed={technology.speed}
              capacity={technology.capacity}
              power={technology.power}
              useCases={technology.useCases}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface EmergingTechnologyProps {
  technology: "pcm" | "mram" | "rram" | "spintronics"
  name: string
  description: string
  advantages: string[]
  challenges: string[]
  timeline: string
}

export function EmergingTechnology({ 
  technology,
  name,
  description,
  advantages,
  challenges,
  timeline
}: EmergingTechnologyProps) {
  // Technology icons and colors
  const techInfo = {
    "pcm": {
      icon: "💾",
      color: "#3b82f6"
    },
    "mram": {
      icon: "🧲",
      color: "#10b981"
    },
    "rram": {
      icon: "💡",
      color: "#8b5cf6"
    },
    "spintronics": {
      icon: "🔄",
      color: "#f59e0b"
    }
  }

  const currentTech = techInfo[technology]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTech.color }}
        >
          <span className="mr-2 text-xl">{currentTech.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-2 text-green-600">Ventajas:</div>
              <ul className="space-y-1">
                {advantages.map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span className="text-sm">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-semibold mb-2 text-red-600">Desafíos:</div>
              <ul className="space-y-1">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-500">✗</span>
                    <span className="text-sm">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-semibold mb-1">Línea de tiempo:</div>
            <div className="text-sm">{timeline}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface EmergingTechnologiesProps {
  technologies: {
    technology: "pcm" | "mram" | "rram" | "spintronics"
    name: string
    description: string
    advantages: string[]
    challenges: string[]
    timeline: string
  }[]
}

export function EmergingTechnologies({ technologies }: EmergingTechnologiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">🚀</span>
          Tecnologías Emergentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué hay en el futuro?</div>
          <div className="text-sm text-purple-700 mt-1">
            Nuevas tecnologías de memoria prometen superar las limitaciones 
            de las tecnologías actuales en velocidad, durabilidad y no volatilidad.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technologies.map((technology, index) => (
            <EmergingTechnology
              key={index}
              technology={technology.technology}
              name={technology.name}
              description={technology.description}
              advantages={technology.advantages}
              challenges={technology.challenges}
              timeline={technology.timeline}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryBenchmarkProps {
  test: "latency" | "bandwidth" | "random" | "sequential"
  name: string
  description: string
  result: number
  unit: string
  comparison: {
    dram: number
    sram: number
    flash: number
  }
}

export function MemoryBenchmark({ 
  test,
  name,
  description,
  result,
  unit,
  comparison
}: MemoryBenchmarkProps) {
  // Test icons and colors
  const testInfo = {
    "latency": {
      icon: "⏱️",
      color: "#3b82f6"
    },
    "bandwidth": {
      icon: "📶",
      color: "#10b981"
    },
    "random": {
      icon: "🔀",
      color: "#8b5cf6"
    },
    "sequential": {
      icon: "➡️",
      color: "#f59e0b"
    }
  }

  const currentTest = testInfo[test]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentTest.color }}
        >
          <span className="mr-2 text-xl">{currentTest.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="p-3 bg-gray-800 text-white rounded text-center">
            <div className="text-2xl font-bold">{result} {unit}</div>
          </div>
          
          <div>
            <div className="font-semibold mb-2">Comparación:</div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-24 text-sm">DRAM</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-blue-600" 
                      style={{ width: `${(comparison.dram / Math.max(comparison.dram, comparison.sram, comparison.flash)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-mono">{comparison.dram}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-sm">SRAM</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-green-600" 
                      style={{ width: `${(comparison.sram / Math.max(comparison.dram, comparison.sram, comparison.flash)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-mono">{comparison.sram}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-sm">Flash</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-purple-600" 
                      style={{ width: `${(comparison.flash / Math.max(comparison.dram, comparison.sram, comparison.flash)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-mono">{comparison.flash}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryBenchmarksProps {
  benchmarks: {
    test: "latency" | "bandwidth" | "random" | "sequential"
    name: string
    description: string
    result: number
    unit: string
    comparison: {
      dram: number
      sram: number
      flash: number
    }
  }[]
}

export function MemoryBenchmarks({ benchmarks }: MemoryBenchmarksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-600">
          <span className="mr-2">📊</span>
          Benchmarks de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Cómo se mide el rendimiento?</div>
          <div className="text-sm text-green-700 mt-1">
            Los benchmarks evalúan diferentes aspectos del rendimiento de memoria 
            para comparar tecnologías y configuraciones.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmarks.map((benchmark, index) => (
            <MemoryBenchmark
              key={index}
              test={benchmark.test}
              name={benchmark.name}
              description={benchmark.description}
              result={benchmark.result}
              unit={benchmark.unit}
              comparison={benchmark.comparison}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}