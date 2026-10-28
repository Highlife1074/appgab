import { PASS_THRESHOLD } from '../../utils/constants'

const asText = (value, fallback = '') => (typeof value === 'string' ? value.trim() : fallback)
const asList = (value) => (Array.isArray(value) ? value.map((item) => asText(item)).filter(Boolean) : [])

export function parseCourse(raw) {
  const course = { title: asText(raw?.title), content: asText(raw?.content) }
  if (!course.title || !course.content) throw new Error('Cours invalide renvoyé par le moteur.')
  return course
}

export function parseChallenge(raw) {
  const challenge = {
    title: asText(raw?.title),
    context: asText(raw?.context),
    stakes: asText(raw?.stakes),
    prompt: asText(raw?.prompt),
  }
  if (!challenge.title || !challenge.context || !challenge.prompt) {
    throw new Error('Épreuve invalide renvoyée par le moteur.')
  }
  return challenge
}

// La note est recalculée côté client : on ne fait jamais confiance au champ `passed` du modèle.
export function parseEvaluation(raw) {
  const score = Math.round(Number(raw?.score))
  if (!Number.isFinite(score)) throw new Error('Évaluation invalide renvoyée par le moteur.')
  const clamped = Math.min(10, Math.max(0, score))

  return {
    score: clamped,
    passed: clamped >= PASS_THRESHOLD,
    verdict: asText(raw?.verdict),
    strengths: asList(raw?.strengths),
    weaknesses: asList(raw?.weaknesses),
  }
}
