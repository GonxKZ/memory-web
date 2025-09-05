import { z } from 'zod'

export const cacheConfigSchema = z.object({
  lineSize: z.number().min(1),
  sets: z.number().min(1),
  ways: z.number().min(1),
  policy: z.enum(['LRU', 'PLRU', 'RR'])
})

export const tlbConfigSchema = z.object({
  entries: z.number().min(1),
  associativity: z.number().min(1),
  pageSize: z.number().min(1)
})

export const dramConfigSchema = z.object({
  banks: z.number().min(1),
  rows: z.number().min(1),
  columns: z.number().min(1),
  policy: z.enum(['open-page', 'closed-page'])
})