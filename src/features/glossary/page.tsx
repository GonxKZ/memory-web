import { GlossaryProvider } from "./context"
import GlossarySearch from "./components/search"
import GlossaryTermCard from "./components/term-card"
import { useGlossary } from "./context"

function GlossaryContent() {
  const { filteredTerms } = useGlossary()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Glosario</h1>
      
      <div className="mb-8">
        <GlossarySearch />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map(term => (
          <GlossaryTermCard key={term.id} term={term} />
        ))}
      </div>
    </div>
  )
}

export default function GlossaryPage() {
  return (
    <GlossaryProvider>
      <GlossaryContent />
    </GlossaryProvider>
  )
}