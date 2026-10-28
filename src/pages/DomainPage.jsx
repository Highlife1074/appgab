import { Link, Navigate, useParams } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import ProgressBar from '../components/ui/ProgressBar'
import Loader from '../components/ui/Loader'
import ModuleRow from '../components/domain/ModuleRow'
import ExamCard from '../components/domain/ExamCard'
import { DOMAINS, MAX_LEVEL, MODULE_PASSES_REQUIRED, isValidDomain, minDaysBeforeExam, passThreshold } from '../utils/constants'

export default function DomainPage() {
  const { domainId } = useParams()
  const { isLoading, getDomain } = useProgress()

  if (!isValidDomain(domainId)) return <Navigate to="/" replace />
  if (isLoading) return <Loader label="Chargement" />

  const domain = getDomain(domainId)
  const { level, levelData, modules, exam } = domain
  const minDays = minDaysBeforeExam(level)

  return (
    <div>
      <Link to="/" className="text-xs tracking-widest text-neutral-500 uppercase hover:text-neutral-200">
        ← Tableau de bord
      </Link>

      <header className="mt-4">
        <p className="text-xs tracking-widest text-neutral-500 uppercase">{DOMAINS[domainId].label}</p>
        <h1 className="mt-1 text-lg font-semibold text-neutral-100">
          Palier {level}/{MAX_LEVEL} · {levelData.name}
        </h1>
        <p className="mt-1 text-sm text-neutral-300">{levelData.title}</p>
        <div className="mt-3">
          <ProgressBar level={level} />
        </div>
      </header>

      <section className="mt-6 border-l-2 border-neutral-700 pl-4 text-xs leading-relaxed text-neutral-400">
        <p className="font-semibold text-neutral-200">Règles du palier</p>
        <p className="mt-1">
          Chaque module se valide par {MODULE_PASSES_REQUIRED} épreuves réussies ({passThreshold(level)}/10 minimum), obtenues sur
          des jours différents.
          {minDays != null &&
            ` L'examen s'ouvre quand les 6 modules sont validés et au plus tôt ${minDays} jours après ton arrivée sur ce palier.`}
        </p>
      </section>

      <h2 className="mt-8 text-xs tracking-widest text-neutral-500 uppercase">Modules</h2>
      <div className="mt-3 grid gap-2">
        {modules.map((module, index) => (
          <ModuleRow key={module.id} domainId={domainId} module={module} index={index} />
        ))}
      </div>

      <div className="mt-6">
        <ExamCard domainId={domainId} exam={exam} threshold={passThreshold(level)} level={level} />
      </div>
    </div>
  )
}
