// Utility functions for memory address formatting and calculations
export function formatAddress(address: number, bits: number = 32): string {
  // Format as hexadecimal with leading zeros
  const hex = address.toString(16).toUpperCase().padStart(bits / 4, '0')
  
  // Add 0x prefix
  return `0x${hex}`
}

export function formatBinary(value: number, bits: number = 8): string {
  // Format as binary with leading zeros
  const binary = value.toString(2).padStart(bits, '0')
  
  // Add spaces every 4 bits for readability
  return binary.match(/.{1,4}/g)?.join(' ') || binary
}

export function extractBits(value: number, start: number, end: number): number {
  // Extract bits from start to end (inclusive)
  const mask = (1 << (end - start + 1)) - 1
  return (value >> start) & mask
}

export function calculateCacheIndex(address: number, lineSize: number, setCount: number): number {
  // Calculate cache index from address
  const lineBits = Math.log2(lineSize)
  const indexBits = Math.log2(setCount)
  return (address >> lineBits) & ((1 << indexBits) - 1)
}

export function calculateCacheTag(address: number, lineSize: number, setCount: number): number {
  // Calculate cache tag from address
  const lineBits = Math.log2(lineSize)
  const indexBits = Math.log2(setCount)
  return address >> (lineBits + indexBits)
}