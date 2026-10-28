import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useAuthBootstrap } from './hooks/useAuth'
import AppShell from './components/layout/AppShell'
import ProtectedRoute, { FullScreenLoader, PublicOnlyRoute } from './components/layout/ProtectedRoute'

// Découpage par route : la page de connexion ne charge pas le moteur de simulation.
const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SimulationPage = lazy(() => import('./pages/SimulationPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// HashRouter : GitHub Pages ne sait pas réécrire les URL vers index.html,
// un BrowserRouter renverrait une 404 au rafraîchissement de /simulation/...
export default function App() {
  useAuthBootstrap()

  return (
    <HashRouter>
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="simulation/:domainId" element={<SimulationPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
