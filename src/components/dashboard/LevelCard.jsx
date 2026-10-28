import { Link } from 'react-router-dom'
import ProgressBar from '../ui/ProgressBar'
import { DOMAINS, MAX_LEVEL, MODULES_PER_LEVEL } from '../../utils/constants'

export default function LevelCard({ domain }) {
  const { id, level, levelData, validatedCount } = domain
  const meta = DOMAINS[id]

  return (
    <Link
      to={`/domaine/${id}`}
      className="block border border-neutral-800 p-5 hover:border-neutral-500 focus-visible:border-accent focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-neutral-500 uppercase">Domaine {meta.index}</p>
          <h2 className="mt-1 text-base font-semibold text-neutral-100">{meta.label}</h2>
        </div>
        <p className="shrink-0 text-2xl font-bold text-neutral-100 tabular-nums">
          {level}
          <span className="text-sm text-neutral-500">/{MAX_LEVEL}</span>
        </p>
      </div>
      <div className="mt-4">
        <ProgressBar level={level} />
      </div>
      <p className="mt-3 text-xs text-neutral-400">
        {levelData.name} · {levelData.title}
      </p>
      <p className="mt-1 text-xs text-neutral-500">
        {validatedCount}/{MODULES_PER_LEVEL} modules validés
      </p>
    </Link>
  )
}
