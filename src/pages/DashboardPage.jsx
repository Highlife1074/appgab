import { useProgress } from '../hooks/useProgress'
import LevelCard from '../components/dashboard/LevelCard'
import Loader from '../components/ui/Loader'
import ErrorBanner from '../components/ui/ErrorBanner'
import { DOMAIN_IDS } from '../utils/constants'

export default function DashboardPage() {
  const { domains, isLoading, error } = useProgress()

  return (
    <div>
      <h1 className="text-xs tracking-widest text-neutral-500 uppercase">Tableau de bord</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Choisis ton terrain. Le palier 10 est celui d'un expert international : compte des mois, pas des jours.
      </p>

      <ErrorBanner message={error} />
      {isLoading ? (
        <Loader label="Chargement de la progression" />
      ) : (
        <div className="mt-6 grid gap-3">
          {DOMAIN_IDS.map((id) => (
            <LevelCard key={id} domain={domains[id]} />
          ))}
        </div>
      )}
    </div>
  )
}
