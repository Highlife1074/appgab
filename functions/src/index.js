import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError, onCall } from 'firebase-functions/https'
import { setGlobalOptions } from 'firebase-functions/options'
import { defineSecret } from 'firebase-functions/params'
import {
  MAX_AI_CALLS_PER_DAY,
  MAX_RESPONSE_LENGTH,
  MIN_RESPONSE_LENGTH,
  MODULE_PASSES_REQUIRED,
  createDomainProgress,
  dayKey,
  examStatus,
  getLevel,
  getModule,
  isValidDomain,
  normalizeDomainProgress,
  passThreshold,
  DOMAIN_IDS,
  MAX_LEVEL,
} from '../curriculum/index.js'
import { generateStructured } from './ai.js'
import { challengeSchema, courseSchema, evaluationSchema } from './schemas.js'
import {
  CHALLENGE_SYSTEM,
  COURSE_SYSTEM,
  EVALUATION_SYSTEM,
  challengePrompt,
  coursePrompt,
  evaluationPrompt,
} from './prompts.js'

initializeApp()
const db = getFirestore()

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY')

setGlobalOptions({ region: 'europe-west1', maxInstances: 10 })

const callable = (handler) =>
  onCall({ secrets: [ANTHROPIC_API_KEY], timeoutSeconds: 540, memory: '512MiB' }, (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Connexion requise.')
    return handler(request.data ?? {}, request.auth.uid)
  })

const userRef = (uid) => db.collection('users').doc(uid)

const readProgress = (snapshot, now) => {
  const raw = snapshot.exists ? snapshot.data().progress ?? {} : {}
  return Object.fromEntries(DOMAIN_IDS.map((id) => [id, normalizeDomainProgress(raw[id], now)]))
}

/**
 * Crée le profil si besoin et consomme un appel IA du quota journalier.
 * `check` valide les prérequis avant tout décompte : une demande refusée ne coûte rien.
 * Renvoie la progression du domaine demandé.
 */
async function consumeQuota(uid, domainId, check = () => {}) {
  const now = Date.now()
  return db.runTransaction(async (tx) => {
    const ref = userRef(uid)
    const snapshot = await tx.get(ref)
    const progress = readProgress(snapshot, now)
    check(progress[domainId])
    const today = dayKey(now)
    const usage = snapshot.exists ? snapshot.data().usage : null
    const count = usage?.day === today ? usage.count : 0
    if (count >= MAX_AI_CALLS_PER_DAY) {
      throw new HttpsError('resource-exhausted', `Limite de ${MAX_AI_CALLS_PER_DAY} exercices par jour atteinte. Reviens demain.`)
    }

    const update = { progress, usage: { day: today, count: count + 1 }, updatedAt: now }
    if (!snapshot.exists) {
      update.createdAt = now
    }
    tx.set(ref, update, { merge: true })
    return progress[domainId]
  })
}

function requireDomain(domain) {
  if (!isValidDomain(domain)) throw new HttpsError('invalid-argument', 'Domaine inconnu.')
}

function requireModule(domain, level, moduleId) {
  const module = getModule(domain, level, moduleId)
  if (!module) throw new HttpsError('invalid-argument', 'Module inconnu pour ce palier.')
  return module
}

// ─── Cours ────────────────────────────────────────────────────────────────────
// Un cours est généré une seule fois par module puis partagé : qualité constante, coût minimal.
export const getCourse = callable(async ({ domain, level, moduleId }, uid) => {
  requireDomain(domain)
  const snapshot = await userRef(uid).get()
  const currentLevel = readProgress(snapshot, Date.now())[domain].level
  const targetLevel = Number.isInteger(level) ? level : currentLevel
  if (targetLevel < 1 || targetLevel > currentLevel) {
    throw new HttpsError('permission-denied', 'Ce palier n’est pas encore débloqué.')
  }
  const module = requireModule(domain, targetLevel, moduleId)

  const cacheRef = db.collection('courses').doc(`${domain}_L${targetLevel}_${moduleId}`)
  const cached = await cacheRef.get()
  if (cached.exists) return { course: cached.data().course }

  await consumeQuota(uid, domain)
  const course = await generateStructured({
    apiKey: ANTHROPIC_API_KEY.value(),
    system: COURSE_SYSTEM,
    prompt: coursePrompt({ domainId: domain, levelData: getLevel(domain, targetLevel), module }),
    schema: courseSchema,
    effort: 'high',
    maxTokens: 32000,
  })
  await cacheRef.set({ domain, level: targetLevel, moduleId, course, createdAt: Date.now() })
  return { course }
})

// ─── Épreuve ──────────────────────────────────────────────────────────────────
export const startChallenge = callable(async ({ domain, moduleId, exam }, uid) => {
  requireDomain(domain)
  const isExam = exam === true
  const domainProgress = await consumeQuota(uid, domain, (current) => {
    if (isExam) {
      const moduleIds = getLevel(domain, current.level).modules.map((m) => m.id)
      if (!examStatus(current, moduleIds).unlocked) {
        throw new HttpsError('failed-precondition', 'L’examen de ce palier est verrouillé.')
      }
    } else {
      requireModule(domain, current.level, moduleId)
    }
  })
  const { level } = domainProgress
  const levelData = getLevel(domain, level)
  const module = isExam ? null : getModule(domain, level, moduleId)

  const recentTitles = (isExam ? domainProgress.exam.recentTitles : domainProgress.modules[moduleId]?.recentTitles) ?? []
  const challenge = await generateStructured({
    apiKey: ANTHROPIC_API_KEY.value(),
    system: CHALLENGE_SYSTEM,
    prompt: challengePrompt({ domainId: domain, levelData, module, isExam, recentTitles }),
    schema: challengeSchema,
    effort: 'medium',
  })

  const now = Date.now()
  const simulation = await db.collection('simulations').add({
    userId: uid,
    domain,
    level,
    kind: isExam ? 'exam' : 'module',
    moduleId: isExam ? null : moduleId,
    challenge,
    status: 'challenge',
    response: null,
    evaluation: null,
    createdAt: now,
  })

  // Lancer un examen compte comme une tentative : on ne peut pas relancer jusqu'à tomber sur un cas facile.
  if (isExam) {
    await userRef(uid).update({
      [`progress.${domain}.exam.attempts`]: (domainProgress.exam.attempts ?? 0) + 1,
      [`progress.${domain}.exam.lastAttemptAt`]: now,
      [`progress.${domain}.exam.recentTitles`]: [challenge.title, ...recentTitles].slice(0, 5),
    })
  }

  return { simulationId: simulation.id, challenge }
})

// ─── Évaluation ───────────────────────────────────────────────────────────────
export const submitResponse = callable(async ({ simulationId, response }, uid) => {
  const text = typeof response === 'string' ? response.trim() : ''
  if (text.length < MIN_RESPONSE_LENGTH) {
    throw new HttpsError('invalid-argument', `Réponse trop courte (${MIN_RESPONSE_LENGTH} caractères minimum).`)
  }
  if (text.length > MAX_RESPONSE_LENGTH) {
    throw new HttpsError('invalid-argument', `Réponse trop longue (${MAX_RESPONSE_LENGTH} caractères maximum).`)
  }
  if (typeof simulationId !== 'string' || !simulationId) {
    throw new HttpsError('invalid-argument', 'Épreuve inconnue.')
  }

  const simulationRef = db.collection('simulations').doc(simulationId)
  const simulationSnap = await simulationRef.get()
  const simulation = simulationSnap.data()
  if (!simulationSnap.exists || simulation.userId !== uid) throw new HttpsError('not-found', 'Épreuve introuvable.')
  if (simulation.status !== 'challenge') throw new HttpsError('failed-precondition', 'Cette épreuve a déjà été évaluée.')

  const { domain, level, moduleId } = simulation
  const isExam = simulation.kind === 'exam'
  const levelData = getLevel(domain, level)
  try {
    await consumeQuota(uid, domain, (current) => {
      if (current.level !== level) {
        throw new HttpsError('failed-precondition', 'Ce palier a évolué depuis le début de l’épreuve.')
      }
    })
  } catch (error) {
    if (error.code === 'failed-precondition') await simulationRef.update({ status: 'expired' })
    throw error
  }

  const raw = await generateStructured({
    apiKey: ANTHROPIC_API_KEY.value(),
    system: EVALUATION_SYSTEM,
    prompt: evaluationPrompt({
      domainId: domain,
      levelData,
      module: isExam ? null : getModule(domain, level, moduleId),
      isExam,
      challenge: simulation.challenge,
      response: text,
    }),
    schema: evaluationSchema,
    effort: 'high',
  })

  const threshold = passThreshold(level)
  const score = Math.min(10, Math.max(0, Math.round(raw.score)))
  const evaluation = { ...raw, score, threshold, passed: score >= threshold }
  const now = Date.now()
  const today = dayKey(now)

  const outcome = await db.runTransaction(async (tx) => {
    const ref = userRef(uid)
    const progress = readProgress(await tx.get(ref), now)
    const current = progress[domain]
    if (current.level !== level) return { stale: true }

    if (isExam) {
      if (!evaluation.passed) {
        tx.update(ref, { [`progress.${domain}.exam.lastScore`]: score })
        return { leveledUp: false }
      }
      const newLevel = Math.min(level + 1, MAX_LEVEL)
      tx.update(ref, { [`progress.${domain}`]: createDomainProgress(newLevel, now) })
      return { leveledUp: true, newLevel }
    }

    const previous = current.modules[moduleId] ?? {}
    const passDays = previous.passDays ?? []
    const countsToday = evaluation.passed && !passDays.includes(today)
    const nextPassDays = countsToday ? [...passDays, today] : passDays
    tx.update(ref, {
      [`progress.${domain}.modules.${moduleId}`]: {
        attempts: (previous.attempts ?? 0) + 1,
        bestScore: Math.max(previous.bestScore ?? 0, score),
        lastScore: score,
        lastAttemptAt: now,
        passDays: nextPassDays,
        recentTitles: [simulation.challenge.title, ...(previous.recentTitles ?? [])].slice(0, 5),
      },
    })
    return {
      passes: nextPassDays.length,
      required: MODULE_PASSES_REQUIRED,
      validated: nextPassDays.length >= MODULE_PASSES_REQUIRED,
      alreadyPassedToday: evaluation.passed && !countsToday,
    }
  })

  await simulationRef.update({
    status: 'evaluated',
    response: { text, submittedAt: now },
    evaluation,
  })

  return { evaluation, outcome }
})
