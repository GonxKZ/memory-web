import type { CacheConfig } from "@/types/content"

// Function to calculate cache set from address
export function getCacheSet(address: number, config: CacheConfig): number {
  // Calculate index bits
  const indexBits = Math.log2(config.sets)
  // Calculate offset bits
  const offsetBits = Math.log2(config.lineSize)
  // Extract index bits from address
  const index = (address >> offsetBits) & ((1 << indexBits) - 1)
  return index
}

// Function to calculate cache tag from address
export function getCacheTag(address: number, config: CacheConfig): number {
  // Calculate index bits
  const indexBits = Math.log2(config.sets)
  // Calculate offset bits
  const offsetBits = Math.log2(config.lineSize)
  // Extract tag bits from address
  const tag = address >> (indexBits + offsetBits)
  return tag
}

// Function to calculate cache offset from address
export function getCacheOffset(address: number, config: CacheConfig): number {
  // Calculate offset bits
  const offsetBits = Math.log2(config.lineSize)
  // Extract offset bits from address
  const offset = address & ((1 << offsetBits) - 1)
  return offset
}