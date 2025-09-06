import { describe, it, expect } from 'vitest'
import { computeModule, initModuleUsage, simulateStep } from './logic'
import type { InterleavingConfig, InterleavingState } from './types'

const baseCfg: InterleavingConfig = {
  interleavingType: 'bit',
  modules: 4,
  blockSize: 64,
  accessPattern: 'sequential',
  stride: 1,
  memorySize: 1,
}

function emptyState(mods = 4): InterleavingState {
  return { accesses: [], moduleUsage: initModuleUsage(mods), stats: { bandwidthImprovement: 0, latencyReduction: 0, moduleBalance: 0, totalAccesses: 0 } }
}

describe('interleaving/logic', () => {
  it('computeModule maps blocks to modules (bit)', () => {
    expect(computeModule(baseCfg, 0)).toBe(0)
    expect(computeModule(baseCfg, 1)).toBe(1)
    expect(computeModule(baseCfg, 4)).toBe(0)
  })

  it('simulateStep appends access and updates usage', () => {
    const s1 = simulateStep(emptyState(), baseCfg, 0)
    expect(s1.accesses.length).toBe(1)
    const totalUtil = s1.moduleUsage.reduce((a, b) => a + b.utilization, 0)
    expect(totalUtil).toBeGreaterThan(0)
  })
})

