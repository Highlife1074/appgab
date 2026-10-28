import Button from '../ui/Button'
import Loader from '../ui/Loader'
import ErrorBanner from '../ui/ErrorBanner'
import CourseBlock from './CourseBlock'
import ChallengeBlock from './ChallengeBlock'
import ResponseInput from './ResponseInput'
import EvaluationFeedback from './EvaluationFeedback'
import { SIMULATION_PHASE as P } from '../../utils/constants'

export default function TrainingSession({ session }) {
  const { phase, course, challenge, evaluation, outcome, error, isBusy, isExam } = session
  const hasChallenge = Boolean(challenge) && phase !== P.LOADING_CHALLENGE

  return (
    <div className="space-y-6">
      {phase === P.IDLE && !isExam && (
        <Button onClick={session.loadCourse} className="w-full sm:w-auto">
          Ouvrir le cours
        </Button>
      )}
      {phase === P.IDLE && isExam && (
        <Button onClick={session.loadChallenge} className="w-full sm:w-auto">
          Lancer l'examen (compte comme une tentative)
        </Button>
      )}

      {phase === P.LOADING_COURSE && (
        <Loader label="Préparation du cours (jusqu'à deux minutes la première fois)" />
      )}
      {course && <CourseBlock course={course} />}

      {(phase === P.COURSE || (phase === P.ERROR && course)) && (
        <Button onClick={session.loadChallenge} className="w-full sm:w-auto">
          J'ai compris, je passe à l'épreuve
        </Button>
      )}

      {phase === P.LOADING_CHALLENGE && <Loader label="Mise en situation" />}
      {hasChallenge && <ChallengeBlock challenge={challenge} isExam={isExam} />}

      {hasChallenge && (phase === P.CHALLENGE || phase === P.EVALUATING) && (
        <ResponseInput key={session.simulationId} onSubmit={session.submit} disabled={isBusy} />
      )}
      {phase === P.EVALUATING && <Loader label="L'Éminence évalue ta réponse" />}

      {phase === P.EVALUATED && (
        <>
          <EvaluationFeedback evaluation={evaluation} outcome={outcome} isExam={isExam} />
          {!isExam && (
            <Button variant="secondary" onClick={session.loadChallenge} className="w-full sm:w-auto">
              Nouvelle épreuve sur ce module
            </Button>
          )}
        </>
      )}

      <ErrorBanner message={error} />
      {phase === P.ERROR && !course && (
        <Button variant="secondary" onClick={session.reset}>
          Recommencer
        </Button>
      )}
    </div>
  )
}
