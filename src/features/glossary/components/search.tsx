import { SearchIcon } from "lucide-react"
import { useGlossary } from "./context"
import { Input } from "@/components/ui/input"

export default function GlossarySearch() {
  const { searchTerm, setSearchTerm } = useGlossary()

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar término..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}