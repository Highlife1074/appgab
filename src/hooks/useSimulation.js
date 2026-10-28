import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useProgress } from './useProgress'
import { evaluateResponse, generateChallenge, generateCourse, llmProviderName } from '../services/llm/llmService'
import { attachChallenge, attachEvaluation, createSimulation } from '../services/simulationService'
import { recordAttempt } from '../services/progressService'
import { MIN_RESPONSE_LENGTH, SIMULATION_PHASE } from '../utils/constants'

export function useSimulation(domain) {
  const user = useAppStore((state) => state.user)
  const simulation = useAppStore((state) => state.simulation)
  const patchSimulation = useAppStore((state) => state.patchSimulation)
  const resetSimulation = useAppStore((state) => state.resetSimulation)
  const { getDomain } = useProgress()
  const { level } = getDomain(domain)

  const fail = useCallback(
    (error) => patchSimulation({ phase: SIMULATION_PHASE.ERROR, error: error.message }),
    [patchSimulation],
  )

  const startCourse = useCallback(async () => {
    resetSimulation()
    patchSimulation({ phase: SIMULATION_PHASE.LOADING_COURSE, domain, level })
    try {
      const course = await generateCourse({ domain, level })
      const simulationId = await createSimulation(user.uid, { domain, level, course, provider: llmProviderName })
      patchSimulation({ phase: SIMULATION_PHASE.COURSE, course, simulationId })
    } catch (error) {
      fail(error)
    }
  }, [domain, level, user, patchSimulation, resetSimulation, fail])

  const startChallenge = useCallback(async () => {
    patchSimulation({ phase: SIMULATION_PHASE.LOADING_CHALLENGE })
    try {
      const challenge = await generateChallenge({ domain, level, course: simulation.course })
      await attachChallenge(simulation.simulationId, challenge)
      patchSimulation({ phase: SIMULATION_PHASE.CHALLENGE, challenge })
    } catch (error) {
      fail(error)
    }
  }, [domain, level, simulation.course, simulation.simulationId, patchSimulation, fail])

  const submitResponse = useCallback(
    async (responseText) => {
      const text = responseText.trim()
      if (text.length < MIN_RESPONSE_LENGTH) {
        patchSimulation({ error: `Réponse trop courte (${MIN_RESPONSE_LENGTH} caractères minimum).` })
        return
      }

      patchSimulation({ phase: SIMULATION_PHASE.EVALUATING, error: null })
      try {
        const evaluation = await evaluateResponse({
          domain,
          level: simulation.level,
          challenge: simulation.challenge,
          response: text,
        })
        await attachEvaluation(simulation.simulationId, { responseText: text, evaluation })
        const outcome = await recordAttempt(user.uid, {
          domain,
          level: simulation.level,
          score: evaluation.score,
        })
        patchSimulation({ phase: SIMULATION_PHASE.EVALUATED, evaluation, outcome })
      } catch (error) {
        fail(error)
      }
    },
    [domain, simulation.level, simulation.challenge, simulation.simulationId, user, patchSimulation, fail],
  )

  return {
    ...simulation,
    currentLevel: level,
    isBusy: [
      SIMULATION_PHASE.LOADING_COURSE,
      SIMULATION_PHASE.LOADING_CHALLENGE,
      SIMULATION_PHASE.EVALUATING,
    ].includes(simulation.phase),
    startCourse,
    startChallenge,
    submitResponse,
    reset: resetSimulation,
  }
}
