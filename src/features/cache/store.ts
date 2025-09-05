import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CacheState } from './state'
import { initializeCache } from './state'
import type { CacheConfig } from '@/types/content'

interface CacheLabState {
  cacheState: CacheState
  config: CacheConfig
  initialize: (config: CacheConfig) => void
  accessCache: (address: number) => void
}

export const useCacheLabStore = create<CacheLabState>()(
  devtools(
    (set) => ({
      cacheState: initializeCache({
        lineSize: 64,
        sets: 4,
        ways: 2,
        policy: 'LRU'
      }),
      config: {
        lineSize: 64,
        sets: 4,
        ways: 2,
        policy: 'LRU'
      },
      initialize: (config) => {
        set({
          cacheState: initializeCache(config),
          config
        })
      },
      accessCache: (address) => {
        // In a real implementation, we would update the cache state here
        // For now, we'll just log the access
        console.log(`Accessing cache with address: ${address}`)
      }
    })
  )
)