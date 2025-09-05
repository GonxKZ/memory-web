// Types for content structure
export type Lesson = {
  id: string
  moduleId: string
  title: string
  summary: string
  terms: string[]
  durationMin: number
  level: 'intro' | 'medio' | 'avanzado'
  labIds: string[]
}

export type Module = {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

// Types for cache configuration
export type CacheConfig = {
  lineSize: number // bytes
  sets: number
  ways: number
  policy: 'LRU' | 'PLRU' | 'RR'
}

// Types for TLB configuration
export type TLBConfig = {
  entries: number
  associativity: number
  pageSize: number // bytes
}

// Types for DRAM configuration
export type DRAMConfig = {
  banks: number
  rows: number
  columns: number
  policy: 'open-page' | 'closed-page'
}