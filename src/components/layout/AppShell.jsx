import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

export default function AppShell() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link to="/" className="text-sm font-bold tracking-[0.3em] text-neutral-100 uppercase">
            L'Éminence
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-neutral-500 sm:inline">{user?.email}</span>
            <Button variant="ghost" onClick={signOut} className="px-2">
              Quitter
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
