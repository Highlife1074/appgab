import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useSimulation } from '../hooks/useSimulation'
import { useProgress } from '../hooks/useProgress'
import ChatInterface from '../components/simulation/ChatInterface'
import ProgressBar from '../components/ui/ProgressBar'
import Loader from '../components/ui/Loader'
import { DOMAINS, isValidDomain, MAX_LEVEL } from '../utils/constants'

export default function SimulationPage() {
  const { domainId } = useParams()
  if (!isValidDomain(domainId)) return <Navigate to="/" replace />
  return <Simulation domainId={domainId} />
}

function Simulation({ domainId }) {
  const { isLoading } = useProgress()
  const simulation = useSimulation(domainId)
  const { domain: activeDomain, reset } = simulation

  // Une simulation d'un autre domaine ne doit pas fuiter dans cette vue.
  useEffect(() => {
    if (activeDomain && activeDomain !== domainId) reset()
  }, [activeDomain, domainId, reset])

  if (isLoading) return <Loader label="Chargement" />

  return (
    <div>
      <Link to="/" className="text-xs tracking-widest text-neutral-500 uppercase hover:text-neutral-200">
        ← Tableau de bord
      </Link>
      <header className="mt-4 mb-6">
        <h1 className="text-lg font-semibold text-neutral-100">{DOMAINS[domainId].label}</h1>
        <p className="mt-1 text-sm text-neutral-500 tabular-nums">
          Palier {simulation.level ?? simulation.currentLevel}/{MAX_LEVEL}
        </p>
        <div className="mt-3">
          <ProgressBar level={simulation.currentLevel} />
        </div>
      </header>
      <ChatInterface simulation={simulation} />
    </div>
  )
}
