export type InterleavingType = 'bit' | 'word' | 'page' | 'bank'
export type AccessPattern = 'sequential' | 'random' | 'stride' | 'pointer-chasing'

export interface InterleavingConfig {
  interleavingType: InterleavingType
  modules: number
  blockSize: number // bytes
  accessPattern: AccessPattern
  stride: number
  memorySize: number // MB
}

export interface AccessRecord {
  address: number
  module: number
  hit: boolean
  latency: number
  bank?: number
}

export interface ModuleUsage { moduleId: number; accesses: number; utilization: number }

export interface Stats {
  bandwidthImprovement: number
  latencyReduction: number
  moduleBalance: number
  totalAccesses: number
}

export interface InterleavingState {
  accesses: AccessRecord[]
  moduleUsage: ModuleUsage[]
  stats: Stats
}

