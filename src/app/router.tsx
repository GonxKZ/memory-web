import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react'
import Layout from './layout'
const App = lazy(() => import('./App'))
const HomePage = lazy(() => import('./home/page'))
const GlossaryPage = lazy(() => import('./glossary/page'))
const LessonsPage = lazy(() => import('./lessons/page'))
const TemarioPage = lazy(() => import('./temario/page'))
const DocsPage = lazy(() => import('./docs/page'))
const DocRoute = lazy(() => import('./docs/route'))
const LessonRoute = lazy(() => import('./lesson/route'))

export default function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<div className='p-4'>Cargando...</div>}>
        <Routes>
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<App />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/temario" element={<TemarioPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/*" element={<DocRoute />} />
            <Route path="/lesson/*" element={<LessonRoute />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
