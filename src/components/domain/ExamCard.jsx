import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/format'

function lockMessage(exam) {
  switch (exam.reason) {
    case 'modules':
      return `Valide encore ${exam.remainingModules} module${exam.remainingModules > 1 ? 's' : ''} pour débloquer l'examen.`
    case 'time':
      return `Temps minimal de maturation sur ce palier : examen disponible le ${formatDate(exam.unlockAt)}.`
    case 'cooldown':
      return `Dernière tentative trop récente : prochain essai possible le ${formatDate(exam.unlockAt)}.`
    default:
      return ''
  }
}

export default function ExamCard({ domainId, exam, threshold, level }) {
  if (exam.reason === 'mastered') {
    return (
      <div className="border border-accent/50 bg-accent/5 p-4 text-sm text-neutral-200">
        Palier 10 atteint : maîtrise d'expert international. Les modules restent ouverts pour t'entretenir.
      </div>
    )
  }

  const content = (
    <>
      <p className="text-xs tracking-widest text-danger uppercase">Examen de passage</p>
      <p className="mt-1 text-sm font-semibold text-neutral-100">Accès au palier {level + 1}</p>
      <p className="mt-2 text-xs leading-relaxed text-neutral-400">
        Une situation qui mobilise tous les modules du palier. Seuil : {threshold}/10. Lancer l'examen compte comme une
        tentative ; en cas d'échec, nouvel essai après 24 h.
      </p>
      <p className={`mt-3 text-xs font-semibold ${exam.unlocked ? 'text-success' : 'text-neutral-500'}`}>
        {exam.unlocked ? 'Disponible' : lockMessage(exam)}
      </p>
      {exam.attempts > 0 && (
        <p className="mt-1 text-xs text-neutral-500">
          {exam.attempts} tentative{exam.attempts > 1 ? 's' : ''}
          {exam.lastScore != null && ` · dernière note ${exam.lastScore}/10`}
        </p>
      )}
    </>
  )

  return exam.unlocked ? (
    <Link
      to={`/domaine/${domainId}/examen`}
      className="block border border-danger/60 p-4 hover:border-danger focus-visible:outline-none"
    >
      {content}
    </Link>
  ) : (
    <div className="border border-neutral-800 p-4 opacity-80">{content}</div>
  )
}
