import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="text-4xl font-bold text-neutral-100">404</p>
        <p className="mt-2 text-sm text-neutral-500">Ce terrain n'existe pas.</p>
        <Link to="/" className="mt-6 inline-block text-xs tracking-widest text-accent uppercase">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
}
