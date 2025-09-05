import React, { createContext, useContext, useState } from "react"

type GlossaryContextType = {
  searchTerm: string
  setSearchTerm: (v: string) => void
}

const GlossaryContext = createContext<GlossaryContextType | undefined>(undefined)

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("")
  return (
    <GlossaryContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </GlossaryContext.Provider>
  )
}

export function useGlossary() {
  const ctx = useContext(GlossaryContext)
  if (!ctx) throw new Error("useGlossary must be used within GlossaryProvider")
  return ctx
}

