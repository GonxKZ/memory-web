// Types for glossary terms
export type GlossaryTerm = {
  id: string
  term: string
  definition: string
  moduleId?: string
  lessonId?: string
}

// Example glossary data
export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "cache",
    term: "Caché",
    definition: "Memoria rápida y pequeña que almacena copias de datos frecuentemente accedidos desde la memoria principal."
  },
  {
    id: "tlb",
    term: "TLB",
    definition: "Translation Lookaside Buffer - Caché especializado que almacena las traducciones más recientes de direcciones virtuales a físicas."
  },
  {
    id: "dram",
    term: "DRAM",
    definition: "Dynamic Random Access Memory - Tipo de memoria principal utilizada en la mayoría de sistemas modernos."
  }
]