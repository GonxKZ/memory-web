import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { 
  HomeIcon, 
  SearchIcon, 
  SettingsIcon, 
  UserIcon
} from "lucide-react"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <HomeIcon className="h-6 w-6" />
              Memoria Low-Level
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
              >
                <HomeIcon className="h-4 w-4" />
                Inicio
              </Link>
              <Link 
                to="/glossary" 
                className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
              >
                <SearchIcon className="h-4 w-4" />
                Glosario
              </Link>
            </nav>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Memoria Low-Level. Todos los derechos reservados.
          </p>
          <nav className="flex gap-4">
            <a href="#" className="text-sm hover:underline underline-offset-4">
              Términos
            </a>
            <a href="#" className="text-sm hover:underline underline-offset-4">
              Privacidad
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}