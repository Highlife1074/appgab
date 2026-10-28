import { Link } from 'react-router-dom'
import { MODULE_PASSES_REQUIRED } from '../../utils/constants'

export default function ModuleRow({ domainId, module, index }) {
  const { id, title, focus, validated, passes, attempts, bestScore, passedToday } = module

  return (
    <Link
      to={`/domaine/${domainId}/module/${id}`}
      className="flex gap-4 border border-neutral-800 p-4 hover:border-neutral-500 focus-visible:border-accent focus-visible:outline-none"
    >
      <span
        className={`grid size-8 shrink-0 place-items-center text-xs font-bold ${
          validated ? 'bg-success text-neutral-950' : 'border border-neutral-700 text-neutral-400'
        }`}
        aria-hidden="true"
      >
        {validated ? '✓' : index + 1}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-100">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{focus}</p>
        <p className="mt-2 text-xs text-neutral-400">
          {validated
            ? 'Validé'
            : `Réussites ${passes}/${MODULE_PASSES_REQUIRED}${passedToday ? ' (la suivante devra être obtenue un autre jour)' : ''}`}
          {attempts > 0 && ` · ${attempts} tentative${attempts > 1 ? 's' : ''} · meilleure note ${bestScore}/10`}
        </p>
      </div>
    </Link>
  )
}
