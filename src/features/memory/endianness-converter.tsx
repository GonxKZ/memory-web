import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon, CheckIcon } from "lucide-react"

export default function EndiannessConverter() {
  const [input, setInput] = useState<string>("12345678")
  const [format, setFormat] = useState<"hex" | "dec" | "bin">("hex")
  const [endianness, setEndianness] = useState<"big" | "little">("big")
  const [converted, setConverted] = useState<string>("")
  const [byteArray, setByteArray] = useState<number[]>([])
  const [copied, setCopied] = useState(false)

  // Convert input based on format and endianness
  useEffect(() => {
    let value: number
    
    try {
      if (format === "hex") {
        // Remove 0x prefix if present
        const cleanInput = input.replace(/^0x/i, "")
        value = parseInt(cleanInput, 16)
      } else if (format === "dec") {
        value = parseInt(input, 10)
      } else {
        // Binary
        value = parseInt(input, 2)
      }
      
      if (isNaN(value)) {
        setConverted("Entrada inválida")
        setByteArray([])
        return
      }
      
      // Convert to byte array (4 bytes for this example)
      const bytes = [
        (value >> 24) & 0xFF,
        (value >> 16) & 0xFF,
        (value >> 8) & 0xFF,
        value & 0xFF
      ]
      
      setByteArray(bytes)
      
      // Apply endianness conversion
      let convertedBytes = [...bytes]
      if (endianness === "little") {
        convertedBytes = convertedBytes.reverse()
      }
      
      // Convert back to number
      const convertedValue = (convertedBytes[0] << 24) | 
                            (convertedBytes[1] << 16) | 
                            (convertedBytes[2] << 8) | 
                            convertedBytes[3]
      
      // Format output based on selected format
      if (format === "hex") {
        setConverted("0x" + convertedValue.toString(16).toUpperCase().padStart(8, '0'))
      } else if (format === "dec") {
        setConverted(convertedValue.toString())
      } else {
        setConverted(convertedValue.toString(2).padStart(32, '0'))
      }
    } catch {
      setConverted("Error en conversión")
      setByteArray([])
    }
  }, [input, format, endianness])

  // Copy result to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(converted)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Swap endianness
  const swapEndianness = () => {
    setEndianness(prev => prev === "big" ? "little" : "big")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Convertidor de Endianness</h1>
        <p className="text-gray-600 mt-2">
          Visualiza cómo se representan los datos en diferentes formatos de endianness
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Entrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="input">Valor</Label>
              <Input
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ingrese valor"
              />
            </div>

            <div>
              <Label>Formato de Entrada</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={format === "hex" ? "default" : "outline"}
                  onClick={() => setFormat("hex")}
                >
                  Hexadecimal
                </Button>
                <Button
                  variant={format === "dec" ? "default" : "outline"}
                  onClick={() => setFormat("dec")}
                >
                  Decimal
                </Button>
                <Button
                  variant={format === "bin" ? "default" : "outline"}
                  onClick={() => setFormat("bin")}
                >
                  Binario
                </Button>
              </div>
            </div>

            <div>
              <Label>Endianness Original</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={endianness === "big" ? "default" : "outline"}
                  onClick={() => setEndianness("big")}
                >
                  Big Endian
                </Button>
                <Button
                  variant={endianness === "little" ? "default" : "outline"}
                  onClick={() => setEndianness("little")}
                >
                  Little Endian
                </Button>
              </div>
            </div>

            <Button 
              onClick={swapEndianness} 
              className="w-full"
              variant="outline"
            >
              Intercambiar Endianness
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-2xl">
                  {converted}
                </div>
                <Button 
                  onClick={copyToClipboard} 
                  variant="outline" 
                  size="icon"
                >
                  {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-2">Representación en Bytes</div>
                  <div className="flex gap-2">
                    {byteArray.map((byte, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-gray-50 rounded text-center flex-1"
                      >
                        <div className="text-xs text-gray-500">Byte {index}</div>
                        <div className="font-mono font-semibold">0x{byte.toString(16).toUpperCase().padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500 mt-1">{byte}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-2">Representación en Memoria</div>
                  <div className="p-4 bg-gray-800 text-green-400 rounded font-mono text-sm">
                    <div className="mb-2 text-gray-400">// Big Endian</div>
                    <div className="mb-4">
                      {byteArray.map((byte, index) => (
                        <span key={index} className="mr-1">
                          {byte.toString(16).toUpperCase().padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mb-2 text-gray-400">// Little Endian</div>
                    <div>
                      {[...byteArray].reverse().map((byte, index) => (
                        <span key={index} className="mr-1">
                          {byte.toString(16).toUpperCase().padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Visualización de Endianness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-4 text-center">Big Endian</div>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Memory addresses */}
                  <div className="flex mb-2">
                    {[0, 1, 2, 3].map((addr) => (
                      <div key={addr} className="w-16 text-center text-xs text-gray-500">
                        Dirección {addr}
                      </div>
                    ))}
                  </div>
                  
                  {/* Memory bytes */}
                  <div className="flex">
                    {byteArray.map((byte, index) => (
                      <div 
                        key={index} 
                        className="w-16 h-16 bg-white border-2 border-blue-500 flex items-center justify-center font-mono font-bold"
                      >
                        {byte.toString(16).toUpperCase().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                  
                  {/* Most significant byte indicator */}
                  <div className="absolute -bottom-8 left-0 w-16 text-center text-xs text-blue-600 font-semibold">
                    MSB
                  </div>
                  <div className="absolute -bottom-8 right-0 w-16 text-center text-xs text-blue-600 font-semibold">
                    LSB
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-blue-700">
                <p className="mb-2">
                  En Big Endian, el byte más significativo (MSB) se almacena en la dirección más baja.
                </p>
                <p>
                  Este formato es usado por protocolos de red como TCP/IP y algunas arquitecturas.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-4 text-center">Little Endian</div>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Memory addresses */}
                  <div className="flex mb-2">
                    {[0, 1, 2, 3].map((addr) => (
                      <div key={addr} className="w-16 text-center text-xs text-gray-500">
                        Dirección {addr}
                      </div>
                    ))}
                  </div>
                  
                  {/* Memory bytes (reversed for little endian) */}
                  <div className="flex">
                    {[...byteArray].reverse().map((byte, index) => (
                      <div 
                        key={index} 
                        className="w-16 h-16 bg-white border-2 border-green-500 flex items-center justify-center font-mono font-bold"
                      >
                        {byte.toString(16).toUpperCase().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                  
                  {/* Least significant byte indicator */}
                  <div className="absolute -bottom-8 left-0 w-16 text-center text-xs text-green-600 font-semibold">
                    LSB
                  </div>
                  <div className="absolute -bottom-8 right-0 w-16 text-center text-xs text-green-600 font-semibold">
                    MSB
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-green-700">
                <p className="mb-2">
                  En Little Endian, el byte menos significativo (LSB) se almacena en la dirección más baja.
                </p>
                <p>
                  Este formato es usado por procesadores x86/x64 y la mayoría de arquitecturas modernas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Importancia de Endianness:</div>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Interoperabilidad entre sistemas con diferentes endianness</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Correcta interpretación de datos en archivos binarios y redes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Depuración de problemas de portabilidad en aplicaciones multiplataforma</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
