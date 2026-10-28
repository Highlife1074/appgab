import Button from '../ui/Button'
import Loader from '../ui/Loader'
import ErrorBanner from '../ui/ErrorBanner'
import CourseBlock from './CourseBlock'
import ChallengeBlock from './ChallengeBlock'
import ResponseInput from './ResponseInput'
import EvaluationFeedback from './EvaluationFeedback'
import { SIMULATION_PHASE as P } from '../../utils/constants'

export default function ChatInterface({ simulation }) {
  const { phase, course, challenge, evaluation, outcome, error, isBusy } = simulation

  return (
    <div className="space-y-6">
      {phase === P.IDLE && (
        <Button onClick={simulation.startCourse} className="w-full sm:w-auto">
          Recevoir la masterclass
        </Button>
      )}

      {phase === P.LOADING_COURSE && <Loader label="Préparation du cours" />}
      {course && <CourseBlock course={course} />}

      {phase === P.COURSE && (
        <Button onClick={simulation.startChallenge} className="w-full sm:w-auto">
          Affronter l'épreuve
        </Button>
      )}

      {phase === P.LOADING_CHALLENGE && <Loader label="Mise en situation" />}
      {challenge && <ChallengeBlock challenge={challenge} />}

      {(phase === P.CHALLENGE || phase === P.EVALUATING) && (
        <ResponseInput onSubmit={simulation.submitResponse} disabled={isBusy} />
      )}
      {phase === P.EVALUATING && <Loader label="L'Éminence évalue ta réponse" />}

      {phase === P.EVALUATED && (
        <>
          <EvaluationFeedback evaluation={evaluation} outcome={outcome} />
          <Button variant="secondary" onClick={simulation.startCourse} className="w-full sm:w-auto">
            Nouvelle épreuve
          </Button>
        </>
      )}

      <ErrorBanner message={error} />
      {phase === P.ERROR && (
        <Button variant="secondary" onClick={simulation.reset}>
          Recommencer
        </Button>
      )}
    </div>
  )
}
