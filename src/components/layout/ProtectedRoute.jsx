import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../ui/Loader'

export default function ProtectedRoute() {
  const { authStatus } = useAuth()
  const location = useLocation()

  if (authStatus === 'loading') return <FullScreenLoader />
  if (authStatus === 'anonymous') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

export function PublicOnlyRoute() {
  const { authStatus } = useAuth()
  const location = useLocation()

  if (authStatus === 'loading') return <FullScreenLoader />
  if (authStatus === 'authenticated') return <Navigate to={location.state?.from?.pathname ?? '/'} replace />
  return <Outlet />
}

export function FullScreenLoader() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <Loader label="Vérification" />
    </div>
  )
}
