import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react'
const App = lazy(() => import('./App'))
const HomePage = lazy(() => import('./home/page'))
const GlossaryPage = lazy(() => import('./glossary/page'))
const LessonsPage = lazy(() => import('./lessons/page'))
const LessonRoute = lazy(() => import('./lesson/route'))

export default function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<div className='p-4'>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/*" element={<LessonRoute />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
