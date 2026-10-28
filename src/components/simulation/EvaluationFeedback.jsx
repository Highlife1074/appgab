function FeedbackList({ title, items, tone }) {
  if (!items.length) return null
  return (
    <div>
      <h3 className={`text-xs tracking-widest uppercase ${tone}`}>{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-neutral-300">
        {items.map((item, i) => (
          <li key={i} className="before:mr-2 before:text-neutral-600 before:content-['—']">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function outcomeMessage(outcome, evaluation, isExam) {
  if (outcome?.stale) return 'Tentative non comptabilisée : ce palier a déjà évolué.'
  if (isExam) {
    return outcome?.leveledUp
      ? `Examen réussi. Tu passes au palier ${outcome.newLevel}/10. Ne te repose pas dessus.`
      : `Examen échoué. Seuil requis : ${evaluation.threshold}/10. Nouvelle tentative possible dans 24 h.`
  }
  if (!evaluation.passed) return `Échec. Seuil requis : ${evaluation.threshold}/10. Retravaille le cours et recommence.`
  if (outcome?.alreadyPassedToday) {
    return "Réussi, mais tu as déjà validé ce module aujourd'hui. La seconde réussite doit être obtenue un autre jour."
  }
  if (outcome?.validated) return 'Module validé : deux réussites sur deux jours différents.'
  return `Réussite ${outcome?.passes}/${outcome?.required}. Reviens un autre jour pour confirmer l'acquis.`
}

export default function EvaluationFeedback({ evaluation, outcome, isExam }) {
  const { score, passed, verdict, criteria, strengths, weaknesses, modelAnswer, nextFocus } = evaluation

  return (
    <section className={`border p-4 ${passed ? 'border-success/50' : 'border-danger/50'}`} aria-live="polite">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs tracking-widest text-neutral-500 uppercase">Évaluation</p>
        <p className={`text-3xl font-bold tabular-nums ${passed ? 'text-success' : 'text-danger'}`}>
          {score}
          <span className="text-base text-neutral-500">/10</span>
        </p>
      </div>
      <p className="mt-2 text-sm font-semibold text-neutral-100">{verdict}</p>
      <p className="mt-2 text-xs text-neutral-400">{outcomeMessage(outcome, evaluation, isExam)}</p>

      <div className="mt-5 divide-y divide-neutral-800 border-y border-neutral-800">
        {criteria.map((criterion, i) => (
          <div key={i} className="py-3">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-semibold text-neutral-200">{criterion.name}</p>
              <p className="text-sm text-neutral-400 tabular-nums">{Math.round(criterion.score)}/10</p>
            </div>
            <p className="mt-1 text-sm text-neutral-400">{criterion.comment}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <FeedbackList title="Ce qui fonctionne" items={strengths} tone="text-success" />
        <FeedbackList title="Ce qui te fera dévorer tout cru" items={weaknesses} tone="text-danger" />
      </div>

      <div className="mt-5 border-l-2 border-accent pl-3">
        <h3 className="text-xs tracking-widest text-accent uppercase">La réponse d'un expert</h3>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-neutral-200">{modelAnswer}</p>
      </div>
      <p className="mt-4 text-sm text-neutral-300">
        <span className="font-semibold text-neutral-100">À travailler : </span>
        {nextFocus}
      </p>
    </section>
  )
}
