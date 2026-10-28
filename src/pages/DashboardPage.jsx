import { useProgress } from '../hooks/useProgress'
import LevelCard from '../components/dashboard/LevelCard'
import Loader from '../components/ui/Loader'
import ErrorBanner from '../components/ui/ErrorBanner'
import { PASS_THRESHOLD } from '../utils/constants'

export default function DashboardPage() {
  const { domains, isLoading, error } = useProgress()

  return (
    <div>
      <h1 className="text-xs tracking-widest text-neutral-500 uppercase">Tableau de bord</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Choisis ton terrain. Seuil de validation : {PASS_THRESHOLD}/10 — sans exception.
      </p>

      <ErrorBanner message={error} />
      {isLoading ? (
        <Loader label="Chargement de la progression" />
      ) : (
        <div className="mt-6 grid gap-3">
          {domains.map((domain) => (
            <LevelCard key={domain.id} domainId={domain.id} {...domain} />
          ))}
        </div>
      )}
    </div>
  )
}
