import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { 
  HomeIcon, 
  SearchIcon, 
  SettingsIcon, 
  UserIcon,
  BookOpenIcon
} from "lucide-react"
import ThemeToggle from "@/components/theme/ThemeToggle"
import SearchModal from "@/components/search/SearchModal"
import InstallButton from "@/components/pwa/InstallButton"
import { useEffect, useMemo, useState } from "react"
import { getLastVisited } from "@/lib/progress"
import { listLessons } from "@/lessons/registry"
import { getVisited } from "@/lib/progress"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const loc = useLocation()
  const is = (p: string) => (loc.pathname === p || (p.endsWith('/*') && loc.pathname.startsWith(p.replace('/*','/'))))
  const [last, setLast] = useState<string | null>(null)
  const lessons = useMemo(() => listLessons(), [])
  const [visitedCount, setVisitedCount] = useState<number>(0)
  useEffect(() => {
    setLast(getLastVisited())
    setVisitedCount(getVisited().length)
  }, [loc.pathname])
  return (
    <div className="flex flex-col min-h-screen">
      <SearchModal />
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60">
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
                aria-current={is('/') ? 'page' : undefined}
                className={`flex items-center gap-2 text-sm font-medium hover:text-blue-600 ${is('/') ? 'text-blue-600' : ''}`}
              >
                <HomeIcon className="h-4 w-4" />
                Inicio
              </Link>
              <Link 
                to="/lessons" 
                aria-current={is('/lessons') ? 'page' : undefined}
                className={`flex items-center gap-2 text-sm font-medium hover:text-blue-600 ${is('/lessons') ? 'text-blue-600' : ''}`}
              >
                <SearchIcon className="h-4 w-4" />
                Lecciones
              </Link>
              <Link 
                to="/temario" 
                aria-current={is('/temario') ? 'page' : undefined}
                className={`flex items-center gap-2 text-sm font-medium hover:text-blue-600 ${is('/temario') ? 'text-blue-600' : ''}`}
              >
                <BookOpenIcon className="h-4 w-4" />
                Temario
              </Link>
              <Link 
                to="/docs" 
                aria-current={is('/docs') ? 'page' : undefined}
                className={`flex items-center gap-2 text-sm font-medium hover:text-blue-600 ${is('/docs') ? 'text-blue-600' : ''}`}
              >
                <BookOpenIcon className="h-4 w-4" />
                Contenido
              </Link>
              <Link 
                to="/glossary" 
                aria-current={is('/glossary') ? 'page' : undefined}
                className={`flex items-center gap-2 text-sm font-medium hover:text-blue-600 ${is('/glossary') ? 'text-blue-600' : ''}`}
              >
                <SearchIcon className="h-4 w-4" />
                Glosario
              </Link>
            </nav>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600" aria-label="Progreso global">
                <span>{visitedCount}/{lessons.length} lecciones</span>
              </div>
              {last && (
                <Button variant="outline" onClick={() => location.assign(`/lesson/${last}`)} aria-label="Continuar última lección">
                  Continuar
                </Button>
              )}
              <ThemeToggle />
              <InstallButton />
              <Button variant="ghost" size="icon" aria-label="Ajustes">
                <SettingsIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Perfil">
                <UserIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-0 bg-white dark:bg-zinc-900">
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
