import { useCallback, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { fetchCourse, startChallenge, submitResponse } from '../services/aiService'
import { MAX_RESPONSE_LENGTH, MIN_RESPONSE_LENGTH, SIMULATION_PHASE as P } from '../utils/constants'

const BUSY = [P.LOADING_COURSE, P.LOADING_CHALLENGE, P.EVALUATING]
const EMPTY = { phase: P.IDLE, course: null, simulationId: null, challenge: null, evaluation: null, outcome: null, error: null }

/** Séance d'entraînement : `moduleId` pour un module, `null` pour l'examen du palier. */
export function useSimulation(domain, moduleId) {
  const isExam = moduleId == null
  const key = `${domain}:${isExam ? 'exam' : moduleId}`
  const simulation = useAppStore((state) => state.simulation)
  const patchSimulation = useAppStore((state) => state.patchSimulation)
  const resetSimulation = useAppStore((state) => state.resetSimulation)

  // Une séance d'un autre module ne doit pas fuiter dans cette vue.
  useEffect(() => {
    if (useAppStore.getState().simulation.key !== key) resetSimulation(key)
  }, [key, resetSimulation])

  const run = useCallback(
    async (pendingPhase, action, nextPhase) => {
      const previousPhase = useAppStore.getState().simulation.phase
      patchSimulation({ phase: pendingPhase, error: null })
      try {
        const patch = await action()
        patchSimulation({ ...patch, phase: nextPhase })
      } catch (error) {
        // On revient à l'étape précédente : l'apprenant peut réessayer sans tout perdre.
        patchSimulation({ phase: previousPhase === P.IDLE ? P.ERROR : previousPhase, error: error.message })
      }
    },
    [patchSimulation],
  )

  const loadCourse = useCallback(
    () => run(P.LOADING_COURSE, async () => fetchCourse({ domain, moduleId }), P.COURSE),
    [run, domain, moduleId],
  )

  const loadChallenge = useCallback(
    () =>
      run(
        P.LOADING_CHALLENGE,
        async () => {
          const data = await startChallenge(isExam ? { domain, exam: true } : { domain, moduleId })
          return { ...data, evaluation: null, outcome: null }
        },
        P.CHALLENGE,
      ),
    [run, domain, moduleId, isExam],
  )

  const submit = useCallback(
    (responseText) => {
      const text = responseText.trim()
      if (text.length < MIN_RESPONSE_LENGTH || text.length > MAX_RESPONSE_LENGTH) {
        patchSimulation({ error: `Ta réponse doit faire entre ${MIN_RESPONSE_LENGTH} et ${MAX_RESPONSE_LENGTH} caractères.` })
        return
      }
      const { simulationId } = useAppStore.getState().simulation
      return run(P.EVALUATING, () => submitResponse({ simulationId, response: text }), P.EVALUATED)
    },
    [run, patchSimulation],
  )

  const current = simulation.key === key ? simulation : { ...EMPTY, key }

  return {
    ...current,
    isExam,
    isBusy: BUSY.includes(current.phase),
    loadCourse,
    loadChallenge,
    submit,
    reset: () => resetSimulation(key),
  }
}
