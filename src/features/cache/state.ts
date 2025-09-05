import type { CacheConfig } from "@/types/content"

export type CacheLine = {
  tag: number | null
  valid: boolean
  dirty: boolean
  lastAccessed: number
}

export type CacheSet = CacheLine[]

export type CacheState = {
  sets: CacheSet[]
  config: CacheConfig
  accessCount: number
}

// Initialize cache state
export function initializeCache(config: CacheConfig): CacheState {
  const sets: CacheSet[] = []
  
  for (let i = 0; i < config.sets; i++) {
    const lines: CacheLine[] = []
    for (let j = 0; j < config.ways; j++) {
      lines.push({
        tag: null,
        valid: false,
        dirty: false,
        lastAccessed: 0
      })
    }
    sets.push(lines)
  }
  
  return {
    sets,
    config,
    accessCount: 0
  }
}

// Access cache with an address
export function accessCache(state: CacheState, address: number): { hit: boolean; newState: CacheState } {
  const { config } = state
  const setIndex = getCacheSet(address, config)
  const tag = getCacheTag(address, config)
  
  const set = state.sets[setIndex]
  let hit = false
  let lineToReplace = -1
  
  // Check for hit
  for (let i = 0; i < set.length; i++) {
    if (set[i].valid && set[i].tag === tag) {
      hit = true
      lineToReplace = i
      break
    }
  }
  
  // If miss, find line to replace
  if (!hit) {
    // First check for invalid lines
    for (let i = 0; i < set.length; i++) {
      if (!set[i].valid) {
        lineToReplace = i
        break
      }
    }
    
    // If no invalid lines, use LRU policy
    if (lineToReplace === -1) {
      let minAccess = set[0].lastAccessed
      lineToReplace = 0
      for (let i = 1; i < set.length; i++) {
        if (set[i].lastAccessed < minAccess) {
          minAccess = set[i].lastAccessed
          lineToReplace = i
        }
      }
    }
  }
  
  // Create new state
  const newSets = [...state.sets]
  const newSet = [...set]
  
  newSet[lineToReplace] = {
    tag: hit ? tag : tag,
    valid: true,
    dirty: false, // Simplified for this example
    lastAccessed: state.accessCount + 1
  }
  
  newSets[setIndex] = newSet
  
  return {
    hit,
    newState: {
      ...state,
      sets: newSets,
      accessCount: state.accessCount + 1
    }
  }
}

// Helper functions (simplified versions)
function getCacheSet(address: number, config: CacheConfig): number {
  const indexBits = Math.log2(config.sets)
  const offsetBits = Math.log2(config.lineSize)
  return (address >> offsetBits) & ((1 << indexBits) - 1)
}

function getCacheTag(address: number, config: CacheConfig): number {
  const indexBits = Math.log2(config.sets)
  const offsetBits = Math.log2(config.lineSize)
  return address >> (indexBits + offsetBits)
}