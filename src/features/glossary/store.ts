import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface GlossaryState {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredTerms: string[]
  setFilteredTerms: (terms: string[]) => void
}

export const useGlossaryStore = create<GlossaryState>()(
  devtools(
    (set) => ({
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
      filteredTerms: [],
      setFilteredTerms: (terms) => set({ filteredTerms: terms }),
    })
  )
)