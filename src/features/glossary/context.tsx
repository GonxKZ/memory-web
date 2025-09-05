"use client"

import { createContext, useContext, useState } from "react"
import type { GlossaryTerm } from "./types"
import { glossaryTerms } from "./types"

type GlossaryContextType = {
  terms: GlossaryTerm[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  filteredTerms: GlossaryTerm[]
}

const GlossaryContext = createContext<GlossaryContextType | undefined>(undefined)

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredTerms = glossaryTerms.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <GlossaryContext.Provider value={{
      terms: glossaryTerms,
      searchTerm,
      setSearchTerm,
      filteredTerms
    }}>
      {children}
    </GlossaryContext.Provider>
  )
}

export function useGlossary() {
  const context = useContext(GlossaryContext)
  if (context === undefined) {
    throw new Error("useGlossary must be used within a GlossaryProvider")
  }
  return context
}
