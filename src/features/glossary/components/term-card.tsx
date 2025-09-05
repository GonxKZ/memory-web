import type { GlossaryTerm } from "./types"

export default function GlossaryTermCard({ term }: { term: GlossaryTerm }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{term.term}</h3>
      <p className="text-muted-foreground">{term.definition}</p>
    </div>
  )
}
