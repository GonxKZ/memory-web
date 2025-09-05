// @ts-nocheck
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function MemoryEncryptionVisualization() {
  const [config, setConfig] = useState({
    encryptionType: "aes" as "aes" | "chacha20" | "speck" | "simon",
    keySize: 256, // bits
    blockSize: 128, // bits
    memorySize: 1024, // MB
    encryptionMode: "xts" as "xts" | "ctr" | "cbc" | "gcm",
    performanceImpact: 0.1, // 10% overhead
    simulationSpeed: 200, // ms
    // Fields used by compression logic below
    dataPattern: "mixed" as "text" | "binary" | "json" | "image" | "mixed",
    compressionAlgorithm: "zstd" as "lz4" | "zstd" | "gzip" | "snappy" | "brotli",
    compressionLevel: 6 // 1-9
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
  const [history, setHistory] = useState<any[]>([])

  // Initialize memory encryption
  useState(() => {
    // Create memory allocations with different data patterns
    const allocated = []
    const numAllocations = Math.floor(config.memorySize / (config.blockSize / 1024))
    
    for (let i = 0; i < Math.min(numAllocations, 1024); i++) {
      // Determine data pattern based on configuration
      let pattern: string
      if (config.dataPattern === "text") {
        pattern = "text"
      } else if (config.dataPattern === "binary") {
        pattern = "binary"
      } else if (config.dataPattern === "json") {
        pattern = "json"
      } else if (config.dataPattern === "image") {
        pattern = "image"
      } else {
        // Mixed pattern - randomly select
        const patterns = ["text", "binary", "json", "image"]
        pattern = patterns[Math.floor(Math.random() * patterns.length)]
      }
      
      // Determine compression characteristics based on pattern
      let baseCompressionRatio = 1.0
      let compressionSpeed = 1000 // MB/s base speed
      let cpuOverhead = 10 // % base overhead
      
      switch (pattern) {
        case "text":
          baseCompressionRatio = 0.4 // 60% compression
          compressionSpeed = 800 // MB/s
          cpuOverhead = 15 // %
          break
        case "binary":
          baseCompressionRatio = 0.8 // 20% compression
          compressionSpeed = 1200 // MB/s
          cpuOverhead = 8 // %
          break
        case "json":
          baseCompressionRatio = 0.3 // 70% compression
          compressionSpeed = 600 // MB/s
          cpuOverhead = 20 // %
          break
        case "image":
          baseCompressionRatio = 0.9 // 10% compression
          compressionSpeed = 1500 // MB/s
          cpuOverhead = 5 // %
          break
        default:
          baseCompressionRatio = 0.6 // 40% compression
          compressionSpeed = 1000 // MB/s
          cpuOverhead = 12 // %
      }
      
      // Apply compression algorithm adjustments
      let algorithmMultiplier = 1.0
      switch (config.compressionAlgorithm) {
        case "lz4":
          algorithmMultiplier = 0.9 // Faster, less compression
          break
        case "zstd":
          algorithmMultiplier = 1.1 // Good balance
          break
        case "gzip":
          algorithmMultiplier = 1.2 // Better compression, slower
          break
        case "snappy":
          algorithmMultiplier = 0.8 // Very fast, less compression
          break
        case "brotli":
          algorithmMultiplier = 1.3 // Best compression, slowest
          break
      }
      
      // Calculate final compression ratio with level adjustment
      const levelAdjustment = 1.0 - (config.compressionLevel - 1) * 0.1 // Higher level = better compression
      const finalCompressionRatio = Math.max(0.1, baseCompressionRatio * algorithmMultiplier * levelAdjustment)
      
      allocated.push({
        id: i,
        size: config.blockSize,
        compressedSize: Math.floor(config.blockSize * finalCompressionRatio),
        compressionRatio: parseFloat(finalCompressionRatio.toFixed(2)),
        algorithm: config.compressionAlgorithm,
        pattern,
        accessFrequency: Math.floor(Math.random() * 100), // 0-100 access frequency
        lastAccess: 0,
        compressed: true
      })
    }
    
    // Calculate algorithm suitability based on data pattern
    const algorithms = {
      lz4: {
        name: "LZ4",
        ratio: 0.7, // Moderate compression
        speed: 4000, // Very fast (MB/s)
        cpuOverhead: 5, // Low overhead (%)
        memoryOverhead: 10, // Low memory overhead (MB)
        suitability: 
          config.dataPattern === "binary" || config.dataPattern === "image" ? 0.9 :
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.7 : 0.8
      },
      zstd: {
        name: "Zstandard",
        ratio: 0.6, // Good compression
        speed: 1500, // Fast (MB/s)
        cpuOverhead: 12, // Moderate overhead (%)
        memoryOverhead: 20, // Moderate memory overhead (MB)
        suitability: 
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.9 :
          config.dataPattern === "binary" || config.dataPattern === "image" ? 0.8 : 0.85
      },
      gzip: {
        name: "GZIP",
        ratio: 0.5, // High compression
        speed: 800, // Moderate speed (MB/s)
        cpuOverhead: 20, // High overhead (%)
        memoryOverhead: 15, // Low memory overhead (MB)
        suitability: 
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.95 :
          config.dataPattern === "binary" ? 0.7 : 0.8
      },
      snappy: {
        name: "Snappy",
        ratio: 0.8, // Low compression
        speed: 5000, // Very fast (MB/s)
        cpuOverhead: 3, // Very low overhead (%)
        memoryOverhead: 5, // Very low memory overhead (MB)
        suitability: 
          config.dataPattern === "binary" || config.dataPattern === "image" ? 0.9 :
          config.dataPattern === "text" ? 0.6 : 0.75
      },
      brotli: {
        name: "Brotli",
        ratio: 0.4, // Very high compression
        speed: 400, // Slow (MB/s)
        cpuOverhead: 25, // High overhead (%)
        memoryOverhead: 30, // High memory overhead (MB)
        suitability: 
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.98 :
          config.dataPattern === "binary" ? 0.6 : 0.75
      }
    }
    
    // Calculate performance metrics
    const totalUncompressed = allocated.reduce((sum, alloc) => sum + alloc.size, 0)
    const totalCompressed = allocated.reduce((sum, alloc) => sum + alloc.compressedSize, 0)
    const compressionRatio = totalUncompressed > 0 ? totalCompressed / totalUncompressed : 1
    
    const currentAlgorithm = algorithms[config.compressionAlgorithm]
    const compressionSpeed = currentAlgorithm.speed * (1 - compressionRatio * 0.3) // Speed decreases with compression ratio
    const decompressionSpeed = currentAlgorithm.speed * 1.2 // Decompression is usually faster
    const memorySaved = totalUncompressed - totalCompressed
    const cpuOverhead = currentAlgorithm.cpuOverhead * compressionRatio
    const bandwidthSaved = memorySaved / (1024 * 1024) // MB saved
    
    setCompression({
      memory: {
        total: config.memorySize,
        used: totalCompressed / 1024, // KB to MB
        available: config.memorySize - (totalCompressed / 1024),
        compressed: totalCompressed,
        uncompressed: totalUncompressed,
        allocated
      },
      algorithms,
      performance: {
        compressionRatio: parseFloat(compressionRatio.toFixed(3)),
        compressionSpeed: parseFloat(compressionSpeed.toFixed(0)),
        decompressionSpeed: parseFloat(decompressionSpeed.toFixed(0)),
        memorySaved: parseFloat((memorySaved / 1024 / 1024).toFixed(2)), // MB saved
        cpuOverhead: parseFloat(cpuOverhead.toFixed(1)),
        bandwidthSaved: parseFloat(bandwidthSaved.toFixed(2))
      }
    })
  })

  // Simulate memory compression
  const simulateMemoryCompression = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset performance counters
    setCompression(prev => ({
      ...prev,
      performance: {
        compressionRatio: 0,
        compressionSpeed: 0,
        decompressionSpeed: 0,
        memorySaved: 0,
        cpuOverhead: 0,
        bandwidthSaved: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current compression state
      const currentCompression = JSON.parse(JSON.stringify(compression))
      const currentPerformance = { ...compression.performance }
      
      // Simulate memory accesses based on pattern
      const accesses = []
      const batchSize = 10
      
      for (let i = 0; i < batchSize; i++) {
        let address: number
        if (config.accessPattern === "sequential") {
          address = (step * batchSize + i) * config.blockSize
        } else if (config.accessPattern === "random") {
          address = Math.floor(Math.random() * config.memorySize * 1024 * 1024)
        } else {
          // Stride pattern
          address = (step * batchSize + i) * config.blockSize * 2
        }
        
        accesses.push({
          address,
          timestamp: step * batchSize + i,
          type: config.accessPattern
        })
      }
      
      // Process accesses
      let totalLatency = 0
      let cacheHits = 0
      let totalAccesses = 0
      
      for (const access of accesses) {
        totalAccesses++
        
        // Find allocation that contains this address
        const allocation = currentCompression.memory.allocated.find(alloc => 
          access.address >= alloc.id * config.blockSize && 
          access.address < (alloc.id + 1) * config.blockSize
        )
        
        if (allocation) {
          // Update access frequency
          allocation.accessFrequency = Math.min(100, allocation.accessFrequency + 1)
          allocation.lastAccess = access.timestamp
          
          // Check if data is compressed
          if (allocation.compressed) {
            // Compressed data access - may require decompression
            const decompressionNeeded = Math.random() > 0.7 // 30% chance of needing decompression
            if (decompressionNeeded) {
              // Add decompression latency
              totalLatency += 100 // ns for decompression
            } else {
              // Cache hit - data already decompressed
              cacheHits++
              totalLatency += 10 // ns for cache hit
            }
          } else {
            // Uncompressed data access
            totalLatency += 50 // ns for memory access
          }
        } else {
          // Unallocated memory access
          totalLatency += 200 // ns for page fault
        }
      }
      
      // Calculate performance metrics
      const averageLatency = totalAccesses > 0 ? totalLatency / totalAccesses : 0
      const cacheHitRate = totalAccesses > 0 ? (cacheHits / totalAccesses) * 100 : 0
      
      // Update compression stats
      currentPerformance.compressionRatio = 
        currentCompression.memory.compressed / currentCompression.memory.uncompressed
      
      currentPerformance.compressionSpeed = 
        (currentCompression.memory.uncompressed / 1024 / 1024) / (averageLatency / 1000000000) // MB/s
      
      currentPerformance.decompressionSpeed = 
        (currentCompression.memory.compressed / 1024 / 1024) / (averageLatency / 1000000000) // MB/s
      
      currentPerformance.memorySaved = 
        (currentCompression.memory.uncompressed - currentCompression.memory.compressed) / 1024 / 1024 // MB
      
      currentPerformance.cpuOverhead = 
        (averageLatency / 50) * 100 // Normalize against baseline 50ns access
      
      currentPerformance.bandwidthSaved = 
        currentPerformance.memorySaved // Same as memory saved
      
      // Update compression state
      setCompression(currentCompression)
      setPerformance(currentPerformance)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          performance: {...currentPerformance},
          memory: {
            used: currentCompression.memory.used,
            available: currentCompression.memory.available,
            compressed: currentCompression.memory.compressed,
            uncompressed: currentCompression.memory.uncompressed
          },
          cacheHitRate
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
    
    // Reset compression state
    const allocated = []
    const numAllocations = Math.floor(config.memorySize / (config.blockSize / 1024))
    
    for (let i = 0; i < Math.min(numAllocations, 1024); i++) {
      // Determine data pattern based on configuration
      let pattern: string
      if (config.dataPattern === "text") {
        pattern = "text"
      } else if (config.dataPattern === "binary") {
        pattern = "binary"
      } else if (config.dataPattern === "json") {
        pattern = "json"
      } else if (config.dataPattern === "image") {
        pattern = "image"
      } else {
        // Mixed pattern - randomly select
        const patterns = ["text", "binary", "json", "image"]
        pattern = patterns[Math.floor(Math.random() * patterns.length)]
      }
      
      // Determine compression characteristics based on pattern
      let baseCompressionRatio = 1.0
      let compressionSpeed = 1000 // MB/s base speed
      let cpuOverhead = 10 // % base overhead
      
      switch (pattern) {
        case "text":
          baseCompressionRatio = 0.4 // 60% compression
          compressionSpeed = 800 // MB/s
          cpuOverhead = 15 // %
          break
        case "binary":
          baseCompressionRatio = 0.8 // 20% compression
          compressionSpeed = 1200 // MB/s
          cpuOverhead = 8 // %
          break
        case "json":
          baseCompressionRatio = 0.3 // 70% compression
          compressionSpeed = 600 // MB/s
          cpuOverhead = 20 // %
          break
        case "image":
          baseCompressionRatio = 0.9 // 10% compression
          compressionSpeed = 1500 // MB/s
          cpuOverhead = 5 // %
          break
        default:
          baseCompressionRatio = 0.6 // 40% compression
          compressionSpeed = 1000 // MB/s
          cpuOverhead = 12 // %
      }
      
      // Apply compression algorithm adjustments
      let algorithmMultiplier = 1.0
      switch (config.compressionAlgorithm) {
        case "lz4":
          algorithmMultiplier = 0.9 // Faster, less compression
          break
        case "zstd":
          algorithmMultiplier = 1.1 // Good balance
          break
        case "gzip":
          algorithmMultiplier = 1.2 // Better compression, slower
          break
        case "snappy":
          algorithmMultiplier = 0.8 // Very fast, less compression
          break
        case "brotli":
          algorithmMultiplier = 1.3 // Best compression, slowest
          break
      }
      
      // Calculate final compression ratio with level adjustment
      const levelAdjustment = 1.0 - (config.compressionLevel - 1) * 0.1 // Higher level = better compression
      const finalCompressionRatio = Math.max(0.1, baseCompressionRatio * algorithmMultiplier * levelAdjustment)
      
      allocated.push({
        id: i,
        size: config.blockSize,
        compressedSize: Math.floor(config.blockSize * finalCompressionRatio),
        compressionRatio: parseFloat(finalCompressionRatio.toFixed(2)),
        algorithm: config.compressionAlgorithm,
        pattern,
        accessFrequency: Math.floor(Math.random() * 100), // 0-100 access frequency
        lastAccess: 0,
        compressed: true
      })
    }
    
    // Calculate algorithm suitability based on data pattern
    const algorithms = {
      lz4: {
        name: "LZ4",
        ratio: 0.7, // Moderate compression
        speed: 4000, // Very fast (MB/s)
        cpuOverhead: 5, // Low overhead (%)
        memoryOverhead: 10, // Low memory overhead (MB)
        suitability: 
          config.dataPattern === "binary" || config.dataPattern === "image" ? 0.9 :
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.7 : 0.8
      },
      zstd: {
        name: "Zstandard",
        ratio: 0.6, // Good compression
        speed: 1500, // Fast (MB/s)
        cpuOverhead: 12, // Moderate overhead (%)
        memoryOverhead: 20, // Moderate memory overhead (MB)
        suitability: 
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.9 :
          config.dataPattern === "binary" || config.dataPattern === "image" ? 0.8 : 0.85
      },
      gzip: {
        name: "GZIP",
        ratio: 0.5, // High compression
        speed: 800, // Moderate speed (MB/s)
        cpuOverhead: 20, // High overhead (%)
        memoryOverhead: 15, // Low memory overhead (MB)
        suitability: 
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.95 :
          config.dataPattern === "binary" ? 0.7 : 0.8
      },
      snappy: {
        name: "Snappy",
        ratio: 0.8, // Low compression
        speed: 5000, // Very fast (MB/s)
        cpuOverhead: 3, // Very low overhead (%)
        memoryOverhead: 5, // Very low memory overhead (MB)
        suitability: 
          config.dataPattern === "binary" || config.dataPattern === "image" ? 0.9 :
          config.dataPattern === "text" ? 0.6 : 0.75
      },
      brotli: {
        name: "Brotli",
        ratio: 0.4, // Very high compression
        speed: 400, // Slow (MB/s)
        cpuOverhead: 25, // High overhead (%)
        memoryOverhead: 30, // High memory overhead (MB)
        suitability: 
          config.dataPattern === "text" || config.dataPattern === "json" ? 0.98 :
          config.dataPattern === "binary" ? 0.6 : 0.75
      }
    }
    
    // Calculate performance metrics
    const totalUncompressed = allocated.reduce((sum, alloc) => sum + alloc.size, 0)
    const totalCompressed = allocated.reduce((sum, alloc) => sum + alloc.compressedSize, 0)
    const compressionRatio = totalUncompressed > 0 ? totalCompressed / totalUncompressed : 1
    
    const currentAlgorithm = algorithms[config.compressionAlgorithm]
    const compressionSpeed = currentAlgorithm.speed * (1 - compressionRatio * 0.3) // Speed decreases with compression ratio
    const decompressionSpeed = currentAlgorithm.speed * 1.2 // Decompression is usually faster
    const memorySaved = totalUncompressed - totalCompressed
    const cpuOverhead = currentAlgorithm.cpuOverhead * compressionRatio
    const bandwidthSaved = memorySaved / (1024 * 1024) // MB saved
    
    setCompression({
      memory: {
        total: config.memorySize,
        used: totalCompressed / 1024, // KB to MB
        available: config.memorySize - (totalCompressed / 1024),
        compressed: totalCompressed,
        uncompressed: totalUncompressed,
        allocated
      },
      algorithms,
      performance: {
        compressionRatio: parseFloat(compressionRatio.toFixed(3)),
        compressionSpeed: parseFloat(compressionSpeed.toFixed(0)),
        decompressionSpeed: parseFloat(decompressionSpeed.toFixed(0)),
        memorySaved: parseFloat((memorySaved / 1024 / 1024).toFixed(2)), // MB saved
        cpuOverhead: parseFloat(cpuOverhead.toFixed(1)),
        bandwidthSaved: parseFloat(bandwidthSaved.toFixed(2))
      }
    })
  }

  // Get compression info
  const getCompressionInfo = () => {
    switch (config.compressionAlgorithm) {
      case "lz4":
        return {
          name: "LZ4",
          fullName: "LZ4 Compression Algorithm",
          description: "Algoritmo de compresión extremadamente rápido con compresión moderada",
          color: "#3b82f6",
          icon: "⚡"
        }
      case "zstd":
        return {
          name: "Zstandard",
          fullName: "Zstandard Compression Algorithm",
          description: "Compresión moderna con excelente balance entre velocidad y ratio",
          color: "#10b981",
          icon: "🚀"
        }
      case "gzip":
        return {
          name: "GZIP",
          fullName: "GNU Zip Compression",
          description: "Compresión clásica con buen ratio pero velocidad moderada",
          color: "#8b5cf6",
          icon: "🗜️"
        }
      case "snappy":
        return {
          name: "Snappy",
          fullName: "Google Snappy Compression",
          description: "Compresión orientada a velocidad con bajo overhead",
          color: "#f59e0b",
          icon: "💨"
        }
      case "brotli":
        return {
          name: "Brotli",
          fullName: "Google Brotli Compression",
          description: "Compresión con excelente ratio para contenido web y texto",
          color: "#ef4444",
          icon: "🔒"
        }
      default:
        return {
          name: "LZ4",
          fullName: "LZ4 Compression Algorithm",
          description: "Algoritmo de compresión extremadamente rápido con compresión moderada",
          color: "#3b82f6",
          icon: "⚡"
        }
    }
  }

  const compressionInfo = getCompressionInfo()

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Visualización de Compresión de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo la compresión de memoria reduce el uso de espacio y mejora el rendimiento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="compressionAlgorithm">Algoritmo de Compresión</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.compressionAlgorithm === "lz4" ? "default" : "outline"}
                  onClick={() => setConfig({...config, compressionAlgorithm: "lz4"})}
                >
                  LZ4
                </Button>
                <Button
                  variant={config.compressionAlgorithm === "zstd" ? "default" : "outline"}
                  onClick={() => setConfig({...config, compressionAlgorithm: "zstd"})}
                >
                  Zstd
                </Button>
                <Button
                  variant={config.compressionAlgorithm === "gzip" ? "default" : "outline"}
                  onClick={() => setConfig({...config, compressionAlgorithm: "gzip"})}
                >
                  GZIP
                </Button>
                <Button
                  variant={config.compressionAlgorithm === "snappy" ? "default" : "outline"}
                  onClick={() => setConfig({...config, compressionAlgorithm: "snappy"})}
                >
                  Snappy
                </Button>
                <Button
                  variant={config.compressionAlgorithm === "brotli" ? "default" : "outline"}
                  onClick={() => setConfig({...config, compressionAlgorithm: "brotli"})}
                >
                  Brotli
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="dataPattern">Patrón de Datos</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.dataPattern === "text" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataPattern: "text"})}
                >
                  Texto
                </Button>
                <Button
                  variant={config.dataPattern === "binary" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataPattern: "binary"})}
                >
                  Binario
                </Button>
                <Button
                  variant={config.dataPattern === "json" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataPattern: "json"})}
                >
                  JSON
                </Button>
                <Button
                  variant={config.dataPattern === "image" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataPattern: "image"})}
                >
                  Imagen
                </Button>
                <Button
                  variant={config.dataPattern === "mixed" ? "default" : "outline"}
                  onClick={() => setConfig({...config, dataPattern: "mixed"})}
                  className="col-span-2"
                >
                  Mixto
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="compressionLevel">Nivel de Compresión</Label>
              <Input
                id="compressionLevel"
                type="range"
                min="1"
                max="9"
                value={config.compressionLevel}
                onChange={(e) => setConfig({...config, compressionLevel: Number(e.target.value)})}
              />
              <div className="text-center">{config.compressionLevel}</div>
            </div>

            <div>
              <Label htmlFor="blockSize">Tamaño de Bloque (bytes)</Label>
              <Input
                id="blockSize"
                type="number"
                value={config.blockSize}
                onChange={(e) => setConfig({...config, blockSize: Number(e.target.value)})}
                min="256"
                step="256"
              />
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
              <Label htmlFor="accessPattern">Patrón de Acceso</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.accessPattern === "sequential" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "sequential"})}
                >
                  Secuencial
                </Button>
                <Button
                  variant={config.accessPattern === "random" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "random"})}
                >
                  Aleatorio
                </Button>
                <Button
                  variant={config.accessPattern === "stride" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessPattern: "stride"})}
                >
                  Stride
                </Button>
              </div>
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
                onClick={simulateMemoryCompression} 
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
              style={{ color: compressionInfo.color }}
            >
              <span className="mr-2 text-2xl">{compressionInfo.icon}</span>
              {compressionInfo.name} - {compressionInfo.fullName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  {compressionInfo.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Ratio de Compresión</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(compression.performance.compressionRatio * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Velocidad de Compresión</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {compression.performance.compressionSpeed.toLocaleString()} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Velocidad de Descompresión</div>
                  <div className="text-2xl font-bold text-red-600">
                    {compression.performance.decompressionSpeed.toLocaleString()} MB/s
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Memoria Ahorrada</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {compression.performance.memorySaved.toFixed(2)} MB
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-blue-600">
                      <span className="mr-2">💾</span>
                      Memoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilización</span>
                          <span>{((compression.memory.used / compression.memory.total) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(compression.memory.used / compression.memory.total) * 100} 
                          className="w-full" 
                          color={(compression.memory.used / compression.memory.total) > 0.8 ? "red" : "blue"}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Total</div>
                          <div className="font-semibold">{compression.memory.total.toLocaleString()} MB</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Usada</div>
                          <div className="font-semibold">{compression.memory.used.toFixed(2)} MB</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Comprimida</div>
                          <div className="font-semibold text-green-600">
                            {compression.memory.compressed.toLocaleString()} bytes
                          </div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Sin Comprimir</div>
                          <div className="font-semibold text-red-600">
                            {compression.memory.uncompressed.toLocaleString()} bytes
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Asignaciones</div>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                          {compression.memory.allocated.slice(-50).map(alloc => (
                            <div
                              key={alloc.id}
                              className={`
                                w-6 h-6 rounded flex items-center justify-center text-xs font-mono
                                ${alloc.compressed 
                                  ? alloc.compressionRatio < 0.5 
                                    ? "bg-green-500 text-white" 
                                    : alloc.compressionRatio < 0.7 
                                      ? "bg-yellow-500 text-white" 
                                      : "bg-red-500 text-white"
                                  : "bg-gray-300"}
                              `}
                              title={`
                                ID: ${alloc.id}
                                Tamaño: ${alloc.size} bytes
                                Comprimido: ${alloc.compressedSize} bytes
                                Ratio: ${(alloc.compressionRatio * 100).toFixed(1)}%
                                Algoritmo: ${alloc.algorithm}
                                Patrón: ${alloc.pattern}
                                Frecuencia de acceso: ${alloc.accessFrequency}%
                                Último acceso: ${alloc.lastAccess}
                              `}
                            >
                              {alloc.compressed ? Math.floor(alloc.compressionRatio * 10) : "N"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center text-green-600">
                      <span className="mr-2">📈</span>
                      Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overhead de CPU</span>
                          <span>{compression.performance.cpuOverhead.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={compression.performance.cpuOverhead} 
                          className="w-full" 
                          color={compression.performance.cpuOverhead > 20 ? "red" : compression.performance.cpuOverhead > 10 ? "yellow" : "green"}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Ancho de Banda Ahorrado</span>
                          <span>{compression.performance.bandwidthSaved.toFixed(2)} MB</span>
                        </div>
                        <Progress 
                          value={(compression.performance.bandwidthSaved / compression.memory.total) * 100} 
                          className="w-full" 
                          color="green"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Tasa de Compresión</div>
                          <div className="font-semibold">
                            {((compression.memory.uncompressed - compression.memory.compressed) / compression.memory.uncompressed * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Tasa de Descompresión</div>
                          <div className="font-semibold">
                            {((compression.memory.compressed / compression.memory.uncompressed) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Historial de Acceso</div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded">
                          {history.slice(-30).map(record => (
                            <div
                              key={record.step}
                              className={`
                                w-4 h-4 rounded text-xs flex items-center justify-center
                                ${record.cacheHitRate > 80 
                                  ? "bg-green-500 text-white" 
                                  : record.cacheHitRate > 60 
                                    ? "bg-yellow-500 text-white" 
                                    : "bg-red-500 text-white"}
                              `}
                              title={`
                                Paso: ${record.step}
                                Tasa de hit: ${record.cacheHitRate.toFixed(1)}%
                                Memoria usada: ${record.memory.used.toFixed(2)} MB
                                Memoria disponible: ${record.memory.available.toFixed(2)} MB
                              `}
                            >
                              {Math.floor(record.cacheHitRate / 10)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Algoritmos de Compresión</div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {Object.entries(compression.algorithms).map(([key, algo]) => (
                    <Card 
                      key={key} 
                      className={config.compressionAlgorithm === key ? "ring-2 ring-blue-500" : ""}
                    >
                      <CardHeader>
                        <CardTitle className="text-xs">{algo.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">Adecuación</div>
                            <div className="font-semibold">
                              {(algo.suitability * 100).toFixed(0)}%
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Ratio</span>
                              <span>{(algo.ratio * 100).toFixed(0)}%</span>
                            </div>
                            <Progress 
                              value={algo.ratio * 100} 
                              className="w-full" 
                              color={algo.ratio > 0.7 ? "green" : algo.ratio > 0.5 ? "yellow" : "red"}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Velocidad</span>
                              <span>{algo.speed.toLocaleString()} MB/s</span>
                            </div>
                            <Progress 
                              value={algo.speed / 5000 * 100} 
                              className="w-full" 
                              color={algo.speed > 3000 ? "green" : algo.speed > 1500 ? "yellow" : "red"}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Overhead</span>
                              <span>{algo.cpuOverhead}%</span>
                            </div>
                            <Progress 
                              value={algo.cpuOverhead} 
                              className="w-full" 
                              color={algo.cpuOverhead > 15 ? "red" : algo.cpuOverhead > 10 ? "yellow" : "green"}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conceptos de Compresión de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">¿Qué es la Compresión de Memoria?</div>
              <p className="text-sm text-blue-700 mb-3">
                La compresión de memoria reduce el tamaño de los datos almacenados en RAM 
                para aumentar la capacidad efectiva y mejorar el rendimiento.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Aumenta capacidad efectiva</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mejora rendimiento de caché</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Reduce tráfico de memoria</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Beneficios</div>
              <p className="text-sm text-green-700 mb-3">
                La compresión de memoria ofrece múltiples ventajas en sistemas modernos 
                con grandes requerimientos de memoria.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Ahorro de costos en hardware</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Mejor utilización de recursos</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Reducción de latencia de memoria</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Desafíos</div>
              <p className="text-sm text-purple-700 mb-3">
                Aunque la compresión ofrece beneficios, también presenta desafíos 
                en términos de rendimiento y complejidad.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Overhead de CPU en compresión</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Latencia adicional en acceso</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>Complejidad en gestión de memoria</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Implementaciones Modernas:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-1">Sistemas Operativos</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Windows:</strong> Memory Compression (LZX)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Linux:</strong> zswap, zram (LZ4, LZO)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>macOS:</strong> Memory Compression (LZVN)</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Hardware</div>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>Intel:</strong> Memory Compression Technology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>AMD:</strong> Transparent Data Encryption</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span>
                    <span><strong>ARM:</strong> AMU (Activity Monitor Unit)</span>
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
// @ts-nocheck
