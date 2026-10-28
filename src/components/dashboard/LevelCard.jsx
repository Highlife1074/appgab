import { Link } from 'react-router-dom'
import ProgressBar from '../ui/ProgressBar'
import { DOMAINS, MAX_LEVEL } from '../../utils/constants'

export default function LevelCard({ domainId, level, attempts, lastScore }) {
  const domain = DOMAINS[domainId]
  const mastered = level >= MAX_LEVEL

  return (
    <Link
      to={`/simulation/${domainId}`}
      className="block border border-neutral-800 p-5 hover:border-neutral-500 focus-visible:border-accent focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-neutral-500 uppercase">Domaine {domain.index}</p>
          <h2 className="mt-1 text-base font-semibold text-neutral-100">{domain.label}</h2>
        </div>
        <p className="shrink-0 text-2xl font-bold text-neutral-100 tabular-nums">
          {level}
          <span className="text-sm text-neutral-500">/{MAX_LEVEL}</span>
        </p>
      </div>
      <div className="mt-4">
        <ProgressBar level={level} />
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        {mastered
          ? 'Maîtrise totale.'
          : `${attempts} tentative${attempts > 1 ? 's' : ''}${lastScore != null ? ` · dernière note ${lastScore}/10` : ''}`}
      </p>
    </Link>
  )
}
