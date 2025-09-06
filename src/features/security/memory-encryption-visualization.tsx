import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function MemoryEncryptionVisualization() {
  const [config, setConfig] = useState({
    encryptionType: "aes" as "aes" | "chacha20" | "speck" | "simon",
    keySize: 256, // bits
    blockSize: 128, // bits
    memorySize: 1024, // MB
    encryptionMode: "xts" as "xts" | "ctr" | "cbc" | "gcm",
    performanceImpact: 0.1, // 10% overhead
    simulationSpeed: 300 // ms
  })
  
  const [encryption, setEncryption] = useState({
    memory: {
      plainText: [] as number[],
      cipherText: [] as number[],
      encryptedBlocks: [] as {
        id: number,
        plainText: number[],
        cipherText: number[],
        iv: number[],
        key: number[],
        nonce: number[],
        authenticated: boolean,
        integrityVerified: boolean
      }[],
      key: [] as number[],
      iv: [] as number[],
      nonce: [] as number[]
    },
    performance: {
      encryptionSpeed: 0, // MB/s
      decryptionSpeed: 0, // MB/s
      cpuOverhead: 0, // %
      memoryOverhead: 0, // KB
      latency: 0, // ns
      throughput: 0 // operations/sec
    },
    security: {
      confidentiality: 0, // %
      integrity: 0, // %
      authenticity: 0, // %
      resistance: {
        aes: 0,
        chacha20: 0,
        speck: 0,
        simon: 0
      }
    },
    modes: {
      xts: {
        name: "XTS",
        description: "XEX-based Tweaked-codebook mode with ciphertext Stealing",
        security: 0,
        performance: 0,
        useCase: "Storage encryption"
      },
      ctr: {
        name: "CTR",
        description: "Counter mode",
        security: 0,
        performance: 0,
        useCase: "High-speed encryption"
      },
      cbc: {
        name: "CBC",
        description: "Cipher Block Chaining",
        security: 0,
        performance: 0,
        useCase: "General-purpose encryption"
      },
      gcm: {
        name: "GCM",
        description: "Galois/Counter Mode",
        security: 0,
        performance: 0,
        useCase: "Authenticated encryption"
      }
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [_history, setHistory] = useState<any[]>([])

  // Initialize memory encryption
  useState(() => {
    // Generate plaintext memory
    const plainText = []
    for (let i = 0; i < config.memorySize * 1024; i++) {
      plainText.push(Math.floor(Math.random() * 256))
    }
    
    // Generate encryption key
    const key = []
    for (let i = 0; i < config.keySize / 8; i++) {
      key.push(Math.floor(Math.random() * 256))
    }
    
    // Generate IV/nonce
    const iv = []
    const nonce = []
    for (let i = 0; i < config.blockSize / 8; i++) {
      iv.push(Math.floor(Math.random() * 256))
      nonce.push(Math.floor(Math.random() * 256))
    }
    
    // Initialize encrypted blocks
    const encryptedBlocks = []
      const blockSz = config.blockSize / 8
      const numBlocks = Math.ceil(plainText.length / blockSz)
    
    for (let i = 0; i < numBlocks; i++) {
      const blockStart = i * blockSz
      const blockEnd = Math.min(blockStart + blockSz, plainText.length)
      const plainBlock = plainText.slice(blockStart, blockEnd)
      
      // Pad block if necessary
      while (plainBlock.length < blockSz) {
        plainBlock.push(0)
      }
      
      encryptedBlocks.push({
        id: i,
        plainText: plainBlock,
        cipherText: Array(blockSz).fill(0),
        iv: [...iv],
        key: [...key],
        nonce: [...nonce],
        authenticated: config.encryptionMode === "gcm",
        integrityVerified: config.encryptionMode === "gcm"
      })
    }
    
    // Initialize performance metrics
    const baseEncryptionSpeed = 1000 // MB/s
    const baseDecryptionSpeed = 1000 // MB/s
    const performanceOverhead = config.performanceImpact
    const encryptionSpeed = baseEncryptionSpeed * (1 - performanceOverhead)
    const decryptionSpeed = baseDecryptionSpeed * (1 - performanceOverhead)
    const cpuOverhead = performanceOverhead * 100
    const memoryOverhead = config.keySize / 8 + config.blockSize / 8 // Key + IV/Nonce
    
    // Initialize security metrics
    const confidentiality = 100 // Assuming perfect encryption
    const integrity = config.encryptionMode === "gcm" ? 100 : 0 // Only GCM provides integrity
    const authenticity = config.encryptionMode === "gcm" ? 100 : 0 // Only GCM provides authenticity
    
    // Initialize resistance scores
    const resistance = {
      aes: config.encryptionType === "aes" ? 100 : 80,
      chacha20: config.encryptionType === "chacha20" ? 100 : 70,
      speck: config.encryptionType === "speck" ? 100 : 60,
      simon: config.encryptionType === "simon" ? 100 : 60
    }
    
    // Initialize mode properties
    const modes = {
      xts: {
        name: "XTS",
        description: "XEX-based Tweaked-codebook mode with ciphertext Stealing",
        security: 90,
        performance: 85,
        useCase: "Storage encryption"
      },
      ctr: {
        name: "CTR",
        description: "Counter mode",
        security: 85,
        performance: 95,
        useCase: "High-speed encryption"
      },
      cbc: {
        name: "CBC",
        description: "Cipher Block Chaining",
        security: 80,
        performance: 75,
        useCase: "General-purpose encryption"
      },
      gcm: {
        name: "GCM",
        description: "Galois/Counter Mode",
        security: 95,
        performance: 90,
        useCase: "Authenticated encryption"
      }
    }
    
    setEncryption({
      memory: {
        plainText,
        cipherText: Array(plainText.length).fill(0),
        encryptedBlocks,
        key,
        iv,
        nonce
      },
      performance: {
        encryptionSpeed: parseFloat(encryptionSpeed.toFixed(0)),
        decryptionSpeed: parseFloat(decryptionSpeed.toFixed(0)),
        cpuOverhead: parseFloat(cpuOverhead.toFixed(1)),
        memoryOverhead: memoryOverhead,
        latency: 10, // ns
        throughput: parseFloat((encryptionSpeed * 1024 * 1024 / blockSz).toFixed(0))
      },
      security: {
        confidentiality,
        integrity,
        authenticity,
        resistance
      },
      modes
    })
  })

  // Simulate memory encryption
  const simulateMemoryEncryption = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset performance counters
    setEncryption(prev => ({
      ...prev,
      performance: {
        encryptionSpeed: 0,
        decryptionSpeed: 0,
        cpuOverhead: 0,
        memoryOverhead: 0,
        latency: 0,
        throughput: 0
      },
      security: {
        ...prev.security,
        confidentiality: 0,
        integrity: 0,
        authenticity: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current encryption state (keep typing)
      const currentEncryption = JSON.parse(JSON.stringify(encryption)) as typeof encryption
      const currentPerformance = { ...encryption.performance }
      const currentSecurity = { ...encryption.security }
      
      // Simulate encryption process
      const blockSize = config.blockSize / 8
      const numBlocks = Math.ceil(currentEncryption.memory.plainText.length / blockSize)
      
      // Encrypt blocks
      for (let i = 0; i < Math.min(numBlocks, 10); i++) { // Process 10 blocks per step
        const blockIndex = (step * 10 + i) % numBlocks
        const block = currentEncryption.memory.encryptedBlocks[blockIndex]
        
        if (block) {
          // Simulate encryption based on algorithm
          const cipherBlock = []
          const key = block.key
          const iv = block.iv
          const nonce = block.nonce
          
          switch (config.encryptionType) {
            case "aes":
              // AES encryption simulation
              for (let j = 0; j < blockSize; j++) {
                const plainByte = block.plainText[j] || 0
                const keyByte = key[j % key.length] || 0
                const ivByte = iv[j % iv.length] || 0
                cipherBlock.push((plainByte ^ keyByte ^ ivByte) & 0xFF)
              }
              break
              
            case "chacha20":
              // ChaCha20 encryption simulation
              for (let j = 0; j < blockSize; j++) {
                const plainByte = block.plainText[j] || 0
                const keyByte = key[j % key.length] || 0
                const nonceByte = nonce[j % nonce.length] || 0
                cipherBlock.push((plainByte + keyByte + nonceByte) & 0xFF)
              }
              break
              
            case "speck":
              // SPECK encryption simulation
              for (let j = 0; j < blockSize; j++) {
                const plainByte = block.plainText[j] || 0
                const keyByte = key[j % key.length] || 0
                cipherBlock.push(((plainByte << 2) ^ keyByte) & 0xFF)
              }
              break
              
            case "simon":
              // SIMON encryption simulation
              for (let j = 0; j < blockSize; j++) {
                const plainByte = block.plainText[j] || 0
                const keyByte = key[j % key.length] || 0
                cipherBlock.push(((plainByte >> 1) ^ keyByte) & 0xFF)
              }
              break
          }
          
          // Update block with cipher text
          block.cipherText = cipherBlock
          
          // Apply encryption mode
          switch (config.encryptionMode) {
            case "xts":
              // XTS mode - tweak each block
              block.iv = block.iv.map((byte, idx) => (byte ^ idx) & 0xFF)
              break
              
            case "ctr":
              // CTR mode - increment nonce
              block.nonce = block.nonce.map((byte, idx) => (byte + 1) & 0xFF)
              break
              
            case "cbc":
              // CBC mode - chain blocks
              if (blockIndex > 0) {
                const prevBlock = currentEncryption.memory.encryptedBlocks[blockIndex - 1]
                if (prevBlock) {
                  block.iv = prevBlock.cipherText.map((byte, idx) => (byte ^ idx) & 0xFF)
                }
              }
              break
              
            case "gcm": {
              // GCM mode - authenticate and encrypt
              block.authenticated = true
              block.integrityVerified = true
              // Simulate authentication tag
              const authTag = []
              for (let j = 0; j < 16; j++) { // 128-bit authentication tag
                authTag.push((cipherBlock[j] ^ key[j % key.length]) & 0xFF)
              }
              block.cipherText = [...cipherBlock, ...authTag]
              break
            }
          }
        }
      }
      
      // Update performance metrics
      const baseEncryptionSpeed = 1000 // MB/s
      const baseDecryptionSpeed = 1000 // MB/s
      const performanceOverhead = config.performanceImpact
      const encryptionSpeed = baseEncryptionSpeed * (1 - performanceOverhead)
      const decryptionSpeed = baseDecryptionSpeed * (1 - performanceOverhead)
      const cpuOverhead = performanceOverhead * 100
      const memoryOverhead = config.keySize / 8 + config.blockSize / 8 // Key + IV/Nonce
      
      currentPerformance.encryptionSpeed = parseFloat(encryptionSpeed.toFixed(0))
      currentPerformance.decryptionSpeed = parseFloat(decryptionSpeed.toFixed(0))
      currentPerformance.cpuOverhead = parseFloat(cpuOverhead.toFixed(1))
      currentPerformance.memoryOverhead = memoryOverhead
      currentPerformance.latency = 10 + Math.floor(performanceOverhead * 50) // ns
      currentPerformance.throughput = parseFloat((encryptionSpeed * 1024 * 1024 / blockSize).toFixed(0))
      
      // Update security metrics
      currentSecurity.confidentiality = 100 // Assuming perfect encryption
      currentSecurity.integrity = config.encryptionMode === "gcm" ? 100 : 0 // Only GCM provides integrity
      currentSecurity.authenticity = config.encryptionMode === "gcm" ? 100 : 0 // Only GCM provides authenticity
      
      // Update resistance scores based on algorithm
      currentSecurity.resistance = {
        aes: config.encryptionType === "aes" ? 100 : 80,
        chacha20: config.encryptionType === "chacha20" ? 100 : 70,
        speck: config.encryptionType === "speck" ? 100 : 60,
        simon: config.encryptionType === "simon" ? 100 : 60
      }
      
      // Update mode properties based on current configuration
      currentEncryption.modes = {
        xts: {
          ...currentEncryption.modes.xts,
          security: config.encryptionMode === "xts" ? 95 : 90,
          performance: config.encryptionMode === "xts" ? 90 : 85
        },
        ctr: {
          ...currentEncryption.modes.ctr,
          security: config.encryptionMode === "ctr" ? 90 : 85,
          performance: config.encryptionMode === "ctr" ? 98 : 95
        },
        cbc: {
          ...currentEncryption.modes.cbc,
          security: config.encryptionMode === "cbc" ? 85 : 80,
          performance: config.encryptionMode === "cbc" ? 80 : 75
        },
        gcm: {
          ...currentEncryption.modes.gcm,
          security: config.encryptionMode === "gcm" ? 98 : 95,
          performance: config.encryptionMode === "gcm" ? 92 : 90
        }
      }
      
      // Update encryption state
      currentEncryption.performance = currentPerformance
      currentEncryption.security = currentSecurity
      setEncryption(currentEncryption)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          performance: {...currentPerformance},
          security: {...currentSecurity},
          modes: {...currentEncryption.modes},
          encryptedBlocks: currentEncryption.memory.encryptedBlocks.length,
          plainTextSize: currentEncryption.memory.plainText.length,
          cipherTextSize: currentEncryption.memory.cipherText.length
        }])
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 100))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    
    // Reset encryption state
    const plainText = []
    for (let i = 0; i < config.memorySize * 1024; i++) {
      plainText.push(Math.floor(Math.random() * 256))
    }
    
    const key = []
    for (let i = 0; i < config.keySize / 8; i++) {
      key.push(Math.floor(Math.random() * 256))
    }
    
    const iv = []
    const nonce = []
    for (let i = 0; i < config.blockSize / 8; i++) {
      iv.push(Math.floor(Math.random() * 256))
      nonce.push(Math.floor(Math.random() * 256))
    }
    
    const encryptedBlocks = []
    const blockSize = config.blockSize / 8
    const numBlocks = Math.ceil(plainText.length / blockSize)
    
    for (let i = 0; i < numBlocks; i++) {
      const blockStart = i * blockSize
      const blockEnd = Math.min(blockStart + blockSize, plainText.length)
      const plainBlock = plainText.slice(blockStart, blockEnd)
      
      // Pad block if necessary
      while (plainBlock.length < blockSize) {
        plainBlock.push(0)
      }
      
      encryptedBlocks.push({
        id: i,
        plainText: plainBlock,
        cipherText: Array(blockSize).fill(0),
        iv: [...iv],
        key: [...key],
        nonce: [...nonce],
        authenticated: config.encryptionMode === "gcm",
        integrityVerified: config.encryptionMode === "gcm"
      })
    }
    
    const baseEncryptionSpeed = 1000 // MB/s
    const baseDecryptionSpeed = 1000 // MB/s
    const performanceOverhead = config.performanceImpact
    const encryptionSpeed = baseEncryptionSpeed * (1 - performanceOverhead)
    const decryptionSpeed = baseDecryptionSpeed * (1 - performanceOverhead)
    const cpuOverhead = performanceOverhead * 100
    const memoryOverhead = config.keySize / 8 + config.blockSize / 8 // Key + IV/Nonce
    
    const confidentiality = 100 // Assuming perfect encryption
    const integrity = config.encryptionMode === "gcm" ? 100 : 0 // Only GCM provides integrity
    const authenticity = config.encryptionMode === "gcm" ? 100 : 0 // Only GCM provides authenticity
    
    const resistance = {
      aes: config.encryptionType === "aes" ? 100 : 80,
      chacha20: config.encryptionType === "chacha20" ? 100 : 70,
      speck: config.encryptionType === "speck" ? 100 : 60,
      simon: config.encryptionType === "simon" ? 100 : 60
    }
    
    const modes = {
      xts: {
        name: "XTS",
        description: "XEX-based Tweaked-codebook mode with ciphertext Stealing",
        security: 90,
        performance: 85,
        useCase: "Storage encryption"
      },
      ctr: {
        name: "CTR",
        description: "Counter mode",
        security: 85,
        performance: 95,
        useCase: "High-speed encryption"
      },
      cbc: {
        name: "CBC",
        description: "Cipher Block Chaining",
        security: 80,
        performance: 75,
        useCase: "General-purpose encryption"
      },
      gcm: {
        name: "GCM",
        description: "Galois/Counter Mode",
        security: 95,
        performance: 90,
        useCase: "Authenticated encryption"
      }
    }
    
    setEncryption({
      memory: {
        plainText,
        cipherText: Array(plainText.length).fill(0),
        encryptedBlocks,
        key,
        iv,
        nonce
      },
      performance: {
        encryptionSpeed: parseFloat(encryptionSpeed.toFixed(0)),
        decryptionSpeed: parseFloat(decryptionSpeed.toFixed(0)),
        cpuOverhead: parseFloat(cpuOverhead.toFixed(1)),
        memoryOverhead: memoryOverhead,
        latency: 10 + Math.floor(performanceOverhead * 50), // ns
        throughput: parseFloat((encryptionSpeed * 1024 * 1024 / blockSize).toFixed(0))
      },
      security: {
        confidentiality,
        integrity,
        authenticity,
        resistance
      },
      modes
    })
  }

  // Get encryption info
  const getEncryptionInfo = () => {
    switch (config.encryptionType) {
      case "aes":
        return {
          name: "AES",
          fullName: "Advanced Encryption Standard",
          description: "Estándar de cifrado simétrico adoptado por el gobierno de EE.UU.",
          color: "#3b82f6",
          icon: "🔐"
        }
      case "chacha20":
        return {
          name: "ChaCha20",
          fullName: "ChaCha20 Stream Cipher",
          description: "Cifrado de flujo rápido y seguro desarrollado por Daniel J. Bernstein",
          color: "#10b981",
          icon: "🌀"
        }
      case "speck":
        return {
          name: "SPECK",
          fullName: "Simon and Speck Block Ciphers",
          description: "Familia de cifrados livianos diseñados por la NSA para dispositivos con recursos limitados",
          color: "#8b5cf6",
          icon: "⚔️"
        }
      case "simon":
        return {
          name: "SIMON",
          fullName: "Simon and Speck Block Ciphers",
          description: "Familia de cifrados livianos diseñados por la NSA para dispositivos con recursos limitados",
          color: "#f59e0b",
          icon: "🛡️"
        }
      default:
        return {
          name: "AES",
          fullName: "Advanced Encryption Standard",
          description: "Estándar de cifrado simétrico adoptado por el gobierno de EE.UU.",
          color: "#3b82f6",
          icon: "🔐"
        }
    }
  }

  const encryptionInfo = getEncryptionInfo()

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Encriptación de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo se protege la memoria mediante técnicas de encriptación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="encryptionType">Tipo de Encriptación</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.encryptionType === "aes" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionType: "aes"})}
                >
                  AES
                </Button>
                <Button
                  variant={config.encryptionType === "chacha20" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionType: "chacha20"})}
                >
                  ChaCha20
                </Button>
                <Button
                  variant={config.encryptionType === "speck" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionType: "speck"})}
                >
                  SPECK
                </Button>
                <Button
                  variant={config.encryptionType === "simon" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionType: "simon"})}
                >
                  SIMON
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="keySize">Tamaño de Clave (bits)</Label>
              <select
                id="keySize"
                value={config.keySize}
                onChange={(e) => setConfig({...config, keySize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={128}>128 bits</option>
                <option value={192}>192 bits</option>
                <option value={256}>256 bits</option>
              </select>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bits)</Label>
              <select
                id="blockSize"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                <option value={64}>64 bits</option>
                <option value={128}>128 bits</option>
                <option value={256}>256 bits</option>
              </select>
            </div>

            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (MB)</Label>
              <Input
                id="memorySize"
                type="number"
                value={config.memorySize}
                onChange={(e) => setConfig({...config, memorySize: Number(e.target.value)})}
                min="256"
                step="256"
              />
            </div>

            <div>
              <Label htmlFor="encryptionMode">Modo de Encriptación</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.encryptionMode === "xts" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionMode: "xts"})}
                >
                  XTS
                </Button>
                <Button
                  variant={config.encryptionMode === "ctr" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionMode: "ctr"})}
                >
                  CTR
                </Button>
                <Button
                  variant={config.encryptionMode === "cbc" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionMode: "cbc"})}
                >
                  CBC
                </Button>
                <Button
                  variant={config.encryptionMode === "gcm" ? "default" : "outline"}
                  onClick={() => setConfig({...config, encryptionMode: "gcm"})}
                >
                  GCM
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="performanceImpact">Impacto en Rendimiento (%)</Label>
              <Input
                id="performanceImpact"
                type="range"
                min="0"
                max="50"
                value={config.performanceImpact * 100}
                onChange={(e) => setConfig({...config, performanceImpact: Number(e.target.value) / 100})}
              />
              <div className="text-center">{(config.performanceImpact * 100).toFixed(0)}%</div>
            </div>

            <div>
              <Label htmlFor="simulationSpeed">Velocidad de Simulación (ms)</Label>
              <Input
                id="simulationSpeed"
                type="range"
                min="50"
                max="1000"
                value={config.simulationSpeed}
                onChange={(e) => setConfig({...config, simulationSpeed: Number(e.target.value)})}
              />
              <div className="text-center">{config.simulationSpeed} ms</div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateMemoryEncryption} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Simulando..." : "Iniciar Simulación"}
              </Button>
              <Button 
                onClick={resetSimulation} 
                variant="outline"
              >
                Reset
              </Button>
            </div>

            {isRunning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle 
              className="flex items-center"
              style={{ color: encryptionInfo.color }}
            >
              <span className="mr-2 text-2xl">{encryptionInfo.icon}</span>
              {encryptionInfo.name} - {encryptionInfo.fullName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {encryptionInfo.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Velocidad de Encriptación</div>
                  <div className="text-2xl font-bold text-green-600">
                    {encryption.performance.encryptionSpeed} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Velocidad de Desencriptación</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {encryption.performance.decryptionSpeed} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Overhead de CPU</div>
                  <div className="text-2xl font-bold text-red-600">
                    {encryption.performance.cpuOverhead}%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Overhead de Memoria</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {encryption.performance.memoryOverhead} KB
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Bloques Encriptados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Total</span>
                          <span>{encryption.memory.encryptedBlocks.length}</span>
                        </div>
                        <Progress 
                          value={100} 
                          className="w-full" 
                          color="green"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Autenticados</span>
                          <span>
                            {encryption.memory.encryptedBlocks.filter(block => block.authenticated).length}
                          </span>
                        </div>
                        <Progress 
                          value={
                            encryption.memory.encryptedBlocks.length > 0 
                              ? (encryption.memory.encryptedBlocks.filter(block => block.authenticated).length / 
                                 encryption.memory.encryptedBlocks.length) * 100
                              : 0
                          } 
                          className="w-full" 
                          color="blue"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Integridad Verificada</span>
                          <span>
                            {encryption.memory.encryptedBlocks.filter(block => block.integrityVerified).length}
                          </span>
                        </div>
                        <Progress 
                          value={
                            encryption.memory.encryptedBlocks.length > 0 
                              ? (encryption.memory.encryptedBlocks.filter(block => block.integrityVerified).length / 
                                 encryption.memory.encryptedBlocks.length) * 100
                              : 0
                          } 
                          className="w-full" 
                          color="purple"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Claves y Vectores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Clave</div>
                          <div className="font-mono text-sm">
                            {encryption.memory.key.slice(0, 8).map(byte => byte.toString(16).padStart(2, '0')).join(' ')}
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">IV/Nonce</div>
                          <div className="font-mono text-sm">
                            {encryption.memory.iv.slice(0, 8).map(byte => byte.toString(16).padStart(2, '0')).join(' ')}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tamaño de Clave</div>
                        <div className="font-semibold">{config.keySize} bits</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Tamaño de Bloque</div>
                        <div className="font-semibold">{config.blockSize} bits</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Modo de Encriptación</div>
                        <div className="font-semibold">
                          {config.encryptionMode === "xts" && "XTS"}
                          {config.encryptionMode === "ctr" && "CTR"}
                          {config.encryptionMode === "cbc" && "CBC"}
                          {config.encryptionMode === "gcm" && "GCM"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Texto Plano</div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                  {encryption.memory.plainText.slice(0, 100).map((byte, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded flex items-center justify-center text-xs font-mono bg-green-500 text-white"
                      title={`Byte ${index}: 0x${byte.toString(16).toUpperCase()}`}
                    >
                      {byte % 16}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Texto Cifrado</div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                  {encryption.memory.cipherText.slice(0, 100).map((byte, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded flex items-center justify-center text-xs font-mono bg-red-500 text-white"
                      title={`Byte ${index}: 0x${byte.toString(16).toUpperCase()}`}
                    >
                      {byte % 16}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Seguridad</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Confidencialidad</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {encryption.security.confidentiality}%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Integridad</div>
                    <div className="text-2xl font-bold text-green-600">
                      {encryption.security.integrity}%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Autenticidad</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {encryption.security.authenticity}%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Resistencia Criptográfica</div>
                    <div className="text-2xl font-bold text-red-600">
                      {Math.max(...Object.values(encryption.security.resistance))}%
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Modos de Encriptación</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card 
                    className={
                      config.encryptionMode === "xts" 
                        ? "ring-2 ring-blue-500" 
                        : "opacity-75"
                    }
                  >
                    <CardHeader>
                      <CardTitle className="text-xs">XTS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          {encryption.modes.xts.description}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Seguridad</div>
                            <Progress 
                              value={encryption.modes.xts.security} 
                              className="w-full" 
                              color={encryption.modes.xts.security > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.xts.security}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Rendimiento</div>
                            <Progress 
                              value={encryption.modes.xts.performance} 
                              className="w-full" 
                              color={encryption.modes.xts.performance > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.xts.performance}%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-center text-gray-500">
                          Caso de uso: {encryption.modes.xts.useCase}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={
                      config.encryptionMode === "ctr" 
                        ? "ring-2 ring-green-500" 
                        : "opacity-75"
                    }
                  >
                    <CardHeader>
                      <CardTitle className="text-xs">CTR</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          {encryption.modes.ctr.description}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Seguridad</div>
                            <Progress 
                              value={encryption.modes.ctr.security} 
                              className="w-full" 
                              color={encryption.modes.ctr.security > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.ctr.security}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Rendimiento</div>
                            <Progress 
                              value={encryption.modes.ctr.performance} 
                              className="w-full" 
                              color={encryption.modes.ctr.performance > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.ctr.performance}%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-center text-gray-500">
                          Caso de uso: {encryption.modes.ctr.useCase}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={
                      config.encryptionMode === "cbc" 
                        ? "ring-2 ring-purple-500" 
                        : "opacity-75"
                    }
                  >
                    <CardHeader>
                      <CardTitle className="text-xs">CBC</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          {encryption.modes.cbc.description}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Seguridad</div>
                            <Progress 
                              value={encryption.modes.cbc.security} 
                              className="w-full" 
                              color={encryption.modes.cbc.security > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.cbc.security}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Rendimiento</div>
                            <Progress 
                              value={encryption.modes.cbc.performance} 
                              className="w-full" 
                              color={encryption.modes.cbc.performance > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.cbc.performance}%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-center text-gray-500">
                          Caso de uso: {encryption.modes.cbc.useCase}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={
                      config.encryptionMode === "gcm" 
                        ? "ring-2 ring-red-500" 
                        : "opacity-75"
                    }
                  >
                    <CardHeader>
                      <CardTitle className="text-xs">GCM</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          {encryption.modes.gcm.description}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Seguridad</div>
                            <Progress 
                              value={encryption.modes.gcm.security} 
                              className="w-full" 
                              color={encryption.modes.gcm.security > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.gcm.security}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Rendimiento</div>
                            <Progress 
                              value={encryption.modes.gcm.performance} 
                              className="w-full" 
                              color={encryption.modes.gcm.performance > 80 ? "green" : "yellow"}
                            />
                            <div className="text-xs text-center mt-1">
                              {encryption.modes.gcm.performance}%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-center text-gray-500">
                          Caso de uso: {encryption.modes.gcm.useCase}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Encriptación de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es la Encriptación de Memoria?</div>
              <p className="text-sm text-blue-700 mb-3">
                La encriptación de memoria protege los datos almacenados en RAM de 
                accesos no autorizados, incluso cuando el sistema está apagado o 
                comprometido físicamente.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Protección:</strong> Datos cifrados en reposo</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Transparencia:</strong> Sin cambios en aplicaciones</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Overhead:</strong> Impacto en rendimiento</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Tipos de Encriptación</div>
              <p className="text-sm text-green-700 mb-3">
                Diferentes algoritmos y modos de encriptación ofrecen distintas 
                combinaciones de seguridad, rendimiento y características.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>AES:</strong> Estándar probado y confiable</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>ChaCha20:</strong> Rápido y seguro en software</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>SPECK/SIMON:</strong> Cifrados livianos</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Modos de Operación</div>
              <p className="text-sm text-purple-700 mb-3">
                Los modos de operación determinan cómo se aplican los algoritmos 
                de encriptación a los datos, afectando seguridad y rendimiento.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>XTS:</strong> Para almacenamiento cifrado</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>CTR:</strong> Encriptación paralelizable</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">•</span>
                  <span><strong>GCM:</strong> Encriptación autenticada</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded">
              <div className="font-semibold text-red-800 mb-2">Impacto en Rendimiento</div>
              <p className="text-sm text-red-700 mb-3">
                La encriptación de memoria introduce overhead que puede afectar 
                el rendimiento del sistema dependiendo de la implementación.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>CPU:</strong> Sobrecarga de procesamiento</span>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Memoria:</strong> Requerimientos adicionales</span>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Ancho de banda:</strong> Potencial reducción</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Implementaciones Modernas:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Hardware</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Intel MKTME:</strong> Encriptación transparente de memoria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>AMD SME:</strong> Encriptación de estado de memoria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>ARM Confidential Compute:</strong> Extensiones de seguridad</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Software</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>dm-crypt/LUKS:</strong> Encriptación de volumen completo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>fscrypt:</strong> Encriptación de archivos en Linux</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>BitLocker:</strong> Encriptación de volumen en Windows</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Virtualización</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>vSphere VM Encryption:</strong> Encriptación de VM</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Hyper-V Shielded VMs:</strong> VMs protegidas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>KVM Memory Encryption:</strong> Encriptación en KVM</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
