import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SecurityThreatProps {
  threat: "bufferOverflow" | "useAfterFree" | "doubleFree" | "nullPointer"
  name: string
  description: string
  consequence: string
  prevention: string
  example: string
}

export function SecurityThreat({ 
  threat,
  name,
  description,
  consequence,
  prevention,
  example
}: SecurityThreatProps) {
  // Threat icons and colors
  const threatInfo = {
    "bufferOverflow": {
      icon: "💥",
      color: "#ef4444"
    },
    "useAfterFree": {
      icon: "👻",
      color: "#8b5cf6"
    },
    "doubleFree": {
      icon: "🔁",
      color: "#f59e0b"
    },
    "nullPointer": {
      icon: "❌",
      color: "#6b7280"
    }
  }

  const currentThreat = threatInfo[threat]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentThreat.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentThreat.color }}
      >
        <span className="mr-2 text-xl">{currentThreat.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="p-2 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800 text-sm">Consecuencia:</div>
          <div className="text-sm text-red-700">{consequence}</div>
        </div>
        
        <div className="p-2 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800 text-sm">Prevención:</div>
          <div className="text-sm text-green-700">{prevention}</div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Ejemplo:</div>
          <div className="font-mono text-xs bg-gray-800 text-white p-2 rounded">
            {example}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MemorySecurityProps {
  threats: {
    threat: "bufferOverflow" | "useAfterFree" | "doubleFree" | "nullPointer"
    name: string
    description: string
    consequence: string
    prevention: string
    example: string
  }[]
}

export function MemorySecurity({ threats }: MemorySecurityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <span className="mr-2">🛡️</span>
          Seguridad de Memoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="font-semibold text-red-800">¿Por qué es importante la seguridad?</div>
          <div className="text-sm text-red-700 mt-1">
            Las vulnerabilidades de memoria son una de las causas más comunes 
            de fallos de seguridad en sistemas informáticos.
          </div>
        </div>
        
        <div className="space-y-3">
          {threats.map((threat, index) => (
            <SecurityThreat
              key={index}
              threat={threat.threat}
              name={threat.name}
              description={threat.description}
              consequence={threat.consequence}
              prevention={threat.prevention}
              example={threat.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface ProtectionMechanismProps {
  mechanism: "nx" | "aslr" | "stackCanary" | "dep"
  name: string
  description: string
  howItWorks: string
  effectiveness: number
  implementation: string
}

export function ProtectionMechanism({ 
  mechanism,
  name,
  description,
  howItWorks,
  effectiveness,
  implementation
}: ProtectionMechanismProps) {
  // Mechanism icons and colors
  const mechanismInfo = {
    "nx": {
      icon: "🛡️",
      color: "#3b82f6"
    },
    "aslr": {
      icon: "🔀",
      color: "#10b981"
    },
    "stackCanary": {
      icon: "🐦",
      color: "#8b5cf6"
    },
    "dep": {
      icon: "🛡️",
      color: "#f59e0b"
    }
  }

  const currentMechanism = mechanismInfo[mechanism]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentMechanism.color }}
        >
          <span className="mr-2 text-xl">{currentMechanism.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div>
            <div className="font-semibold mb-1">¿Cómo funciona?</div>
            <div className="text-gray-600 text-sm">
              {howItWorks}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Implementación:</div>
            <div className="text-sm bg-gray-50 p-2 rounded">
              {implementation}
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Efectividad:</div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 rounded-full" 
                style={{ 
                  width: `${effectiveness}%`,
                  backgroundColor: currentMechanism.color
                }}
              ></div>
            </div>
            <div className="text-right text-sm mt-1">{effectiveness}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MemoryProtectionProps {
  mechanisms: {
    mechanism: "nx" | "aslr" | "stackCanary" | "dep"
    name: string
    description: string
    howItWorks: string
    effectiveness: number
    implementation: string
  }[]
}

export function MemoryProtection({ mechanisms }: MemoryProtectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Protecciones de Memoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800">¿Cómo proteger la memoria?</div>
          <div className="text-sm text-green-700 mt-1">
            Las protecciones de memoria previenen ejecución de código malicioso 
            y acceso no autorizado a datos sensibles.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mechanisms.map((mechanism, index) => (
            <ProtectionMechanism
              key={index}
              mechanism={mechanism.mechanism}
              name={mechanism.name}
              description={mechanism.description}
              howItWorks={mechanism.howItWorks}
              effectiveness={mechanism.effectiveness}
              implementation={mechanism.implementation}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SideChannelProps {
  channel: "cache" | "timing" | "power" | "electromagnetic"
  name: string
  description: string
  attackMethod: string
  mitigation: string
  example: string
}

export function SideChannel({ 
  channel,
  name,
  description,
  attackMethod,
  mitigation,
  example
}: SideChannelProps) {
  // Channel icons and colors
  const channelInfo = {
    "cache": {
      icon: "キャッシング",
      color: "#3b82f6"
    },
    "timing": {
      icon: "⏱️",
      color: "#10b981"
    },
    "power": {
      icon: "🔋",
      color: "#f59e0b"
    },
    "electromagnetic": {
      icon: "📡",
      color: "#8b5cf6"
    }
  }

  const currentChannel = channelInfo[channel]

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        borderLeftColor: currentChannel.color, 
        borderLeftWidth: '4px' 
      }}
    >
      <div 
        className="font-semibold mb-2 flex items-center"
        style={{ color: currentChannel.color }}
      >
        <span className="mr-2 text-xl">{currentChannel.icon}</span>
        {name}
      </div>
      
      <div className="space-y-3">
        <div className="text-gray-600">
          {description}
        </div>
        
        <div className="p-2 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800 text-sm">Método de ataque:</div>
          <div className="text-sm text-blue-700">{attackMethod}</div>
        </div>
        
        <div className="p-2 bg-green-50 border border-green-200 rounded">
          <div className="font-semibold text-green-800 text-sm">Mitigación:</div>
          <div className="text-sm text-green-700">{mitigation}</div>
        </div>
        
        <div>
          <div className="font-semibold text-sm mb-1">Ejemplo:</div>
          <div className="font-mono text-xs bg-gray-800 text-white p-2 rounded">
            {example}
          </div>
        </div>
      </div>
    </div>
  )
}

interface SideChannelsProps {
  channels: {
    channel: "cache" | "timing" | "power" | "electromagnetic"
    name: string
    description: string
    attackMethod: string
    mitigation: string
    example: string
  }[]
}

export function SideChannels({ channels }: SideChannelsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <span className="mr-2">🔍</span>
          Ataques de Canal Lateral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="font-semibold text-purple-800">¿Qué son los canales laterales?</div>
          <div className="text-sm text-purple-700 mt-1">
            Los ataques de canal lateral explotan información indirecta como 
            tiempos de ejecución, consumo de energía o emanaciones electromagnéticas 
            para obtener datos sensibles.
          </div>
        </div>
        
        <div className="space-y-3">
          {channels.map((channel, index) => (
            <SideChannel
              key={index}
              channel={channel.channel}
              name={channel.name}
              description={channel.description}
              attackMethod={channel.attackMethod}
              mitigation={channel.mitigation}
              example={channel.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SpectreMeltdownProps {
  variant: "spectre" | "meltdown"
  name: string
  description: string
  impact: string
  mitigation: string
  example: string
}

export function SpectreMeltdown({ 
  variant,
  name,
  description,
  impact,
  mitigation,
  example
}: SpectreMeltdownProps) {
  // Variant icons and colors
  const variantInfo = {
    "spectre": {
      icon: "👻",
      color: "#8b5cf6"
    },
    "meltdown": {
      icon: "💣",
      color: "#ef4444"
    }
  }

  const currentVariant = variantInfo[variant]

  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center"
          style={{ color: currentVariant.color }}
        >
          <span className="mr-2 text-2xl">{currentVariant.icon}</span>
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-gray-600">
            {description}
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-semibold text-red-800 mb-1">Impacto:</div>
            <div className="text-sm text-red-700">{impact}</div>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-semibold text-green-800 mb-1">Mitigación:</div>
            <div className="text-sm text-green-700">{mitigation}</div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Ejemplo:</div>
            <div className="font-mono text-sm bg-gray-800 text-white p-2 rounded">
              {example}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SpectreMeltdownOverviewProps {
  variants: {
    variant: "spectre" | "meltdown"
    name: string
    description: string
    impact: string
    mitigation: string
    example: string
  }[]
}

export function SpectreMeltdownOverview({ variants }: SpectreMeltdownOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-orange-600">
          <span className="mr-2">⚠️</span>
          Spectre y Meltdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <div className="font-semibold text-orange-800">¿Qué son Spectre y Meltdown?</div>
          <div className="text-sm text-orange-700 mt-1">
            Spectre y Meltdown son vulnerabilidades de hardware que afectan 
            a la mayoría de procesadores modernos, permitiendo acceso no autorizado 
            a datos protegidos.
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variants.map((variant, index) => (
            <SpectreMeltdown
              key={index}
              variant={variant.variant}
              name={variant.name}
              description={variant.description}
              impact={variant.impact}
              mitigation={variant.mitigation}
              example={variant.example}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}