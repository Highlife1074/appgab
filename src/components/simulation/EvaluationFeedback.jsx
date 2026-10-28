import { PASS_THRESHOLD } from '../../utils/constants'

function FeedbackList({ title, items, tone }) {
  if (!items.length) return null
  return (
    <div>
      <h3 className={`text-xs tracking-widest uppercase ${tone}`}>{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-neutral-300">
        {items.map((item) => (
          <li key={item} className="before:mr-2 before:text-neutral-600 before:content-['—']">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function EvaluationFeedback({ evaluation, outcome }) {
  const { score, passed, verdict, strengths, weaknesses } = evaluation

  return (
    <section className={`border p-4 ${passed ? 'border-success/50' : 'border-danger/50'}`} aria-live="polite">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs tracking-widest text-neutral-500 uppercase">Évaluation</p>
        <p className={`text-3xl font-bold tabular-nums ${passed ? 'text-success' : 'text-danger'}`}>
          {score}
          <span className="text-base text-neutral-500">/10</span>
        </p>
      </div>
      {verdict && <p className="mt-2 text-sm font-semibold text-neutral-100">{verdict}</p>}
      <div className="mt-4 space-y-4">
        <FeedbackList title="Ce qui fonctionne" items={strengths} tone="text-success" />
        <FeedbackList title="Ce qui te fera dévorer tout cru" items={weaknesses} tone="text-danger" />
      </div>
      <p className="mt-4 border-t border-neutral-800 pt-3 text-xs text-neutral-400">
        {outcome?.leveledUp
          ? `Palier validé. Niveau ${outcome.newLevel}/10.`
          : outcome?.stale
            ? 'Tentative non comptabilisée : ce palier a déjà évolué.'
            : `Échec. Seuil requis : ${PASS_THRESHOLD}/10. Tu restes au même niveau.`}
      </p>
    </section>
  )
}
