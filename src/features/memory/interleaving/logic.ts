import type { InterleavingConfig, InterleavingState, ModuleUsage } from './types'

export function initModuleUsage(modules: number): ModuleUsage[] {
  return Array.from({ length: modules }, (_, i) => ({ moduleId: i, accesses: 0, utilization: 0 }))
}

export function computeModule(config: InterleavingConfig, blockNumber: number): number {
  switch (config.interleavingType) {
    case 'bit': return blockNumber % config.modules
    case 'word': return Math.floor(blockNumber / 4) % config.modules
    case 'page': return Math.floor(blockNumber / 64) % config.modules
    case 'bank': return Math.floor(blockNumber / 16) % config.modules
  }
}

export function nextAddress(config: InterleavingConfig, i: number): number {
  if (config.accessPattern === 'sequential') return i * config.blockSize
  if (config.accessPattern === 'random') return Math.floor(Math.random() * config.memorySize * 1024 * 1024)
  if (config.accessPattern === 'stride') return i * config.stride * config.blockSize
  // pointer-chasing aproximado
  return (i * 17 + 31) % (config.memorySize * 1024 * 1024)
}

export function simulateStep(state: InterleavingState, config: InterleavingConfig, i: number): InterleavingState {
  const address = nextAddress(config, i)
  const blockNumber = Math.floor(address / config.blockSize)
  const module = computeModule(config, blockNumber)
  const inCache = state.accesses.some(a => Math.floor(a.address / config.blockSize) === blockNumber && a.module === module)
  const hit = inCache
  const latency = hit ? 5 : 100 // ns

  const moduleUsage = state.moduleUsage.map(m => ({ ...m }))
  moduleUsage[module].accesses += 1
  for (const m of moduleUsage) m.utilization = (m.accesses / (i + 1)) * 100

  const accesses = [...state.accesses.slice(-49), { address, module, hit, latency }]

  const totalAccesses = i + 1
  const avgBandwidth = (config.blockSize / (latency / 1e9)) // bytes/s instantáneo
  const bandwidthImprovement = parseFloat((avgBandwidth / 1024 / 1024).toFixed(2))
  const latencyReduction = parseFloat((latency).toFixed(2))
  const avgUtil = moduleUsage.reduce((s, m) => s + m.utilization, 0) / moduleUsage.length
  const variance = moduleUsage.reduce((s, m) => s + Math.pow(m.utilization - avgUtil, 2), 0) / moduleUsage.length
  const moduleBalance = parseFloat((100 - Math.sqrt(variance)).toFixed(2))

  return {
    accesses,
    moduleUsage,
    stats: {
      bandwidthImprovement,
      latencyReduction,
      moduleBalance,
      totalAccesses,
    },
  }
}

