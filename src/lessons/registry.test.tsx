import { describe, it, expect } from 'vitest'
import { getExplainAndGuided, groupByModule, listLessons } from './registry'

describe('lessons registry', () => {
  it('lists lessons and groups by module', () => {
    const lessons = listLessons()
    expect(Array.isArray(lessons)).toBe(true)
    expect(lessons.length).toBeGreaterThan(0)
    const grouped = groupByModule(lessons)
    const modules = Object.keys(grouped)
    expect(modules.length).toBeGreaterThan(0)
    for (const m of modules) {
      expect(Array.isArray(grouped[m])).toBe(true)
      expect(grouped[m].length).toBeGreaterThan(0)
    }
  })

  it('returns tailored explain/guided for TLB, NUMA, prefetch', () => {
    const tlb = getExplainAndGuided('tlb/page-table-explorer')
    expect(tlb.explain.title.toLowerCase()).toContain('tlb')
    const numa = getExplainAndGuided('numa/numa-topology-explorer')
    expect(numa.explain.metaphor.toLowerCase()).toContain('cerca')
    const pre = getExplainAndGuided('prefetching/prefetching-visualization')
    expect(pre.guided.title.toLowerCase()).toContain('cómo')
  })
})

