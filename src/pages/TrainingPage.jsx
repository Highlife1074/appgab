import { Link, Navigate, useParams } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useSimulation } from '../hooks/useSimulation'
import TrainingSession from '../components/simulation/TrainingSession'
import Loader from '../components/ui/Loader'
import { DOMAINS, isValidDomain, passThreshold } from '../utils/constants'

export default function TrainingPage({ exam = false }) {
  const { domainId, moduleId } = useParams()
  const { isLoading, getDomain } = useProgress()

  if (!isValidDomain(domainId)) return <Navigate to="/" replace />
  if (isLoading) return <Loader label="Chargement" />

  const domain = getDomain(domainId)
  const module = exam ? null : domain.modules.find((m) => m.id === moduleId)
  if (!exam && !module) return <Navigate to={`/domaine/${domainId}`} replace />

  return <Training domain={domain} module={module} />
}

function Training({ domain, module }) {
  const session = useSimulation(domain.id, module?.id ?? null)
  const examLocked = !module && !domain.exam.unlocked && session.phase === 'idle'

  return (
    <div>
      <Link
        to={`/domaine/${domain.id}`}
        className="text-xs tracking-widest text-neutral-500 uppercase hover:text-neutral-200"
      >
        ← {DOMAINS[domain.id].short} · palier {domain.level}
      </Link>
      <header className="mt-4 mb-6">
        <h1 className="text-lg font-semibold text-neutral-100">{module ? module.title : `Examen du palier ${domain.level}`}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {module ? module.focus : domain.levelData.title} · seuil {passThreshold(domain.level)}/10
        </p>
      </header>
      {examLocked ? (
        <p className="text-sm text-neutral-400">L'examen de ce palier n'est pas encore disponible.</p>
      ) : (
        <TrainingSession session={session} />
      )}
    </div>
  )
}
