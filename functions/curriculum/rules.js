// Règles de progression partagées par le client (affichage) et les Cloud Functions (arbitrage).
// Ce fichier ne doit importer aucune dépendance : il est embarqué tel quel dans le bundle Vite.

export const MAX_LEVEL = 10
export const MODULES_PER_LEVEL = 6

// Un module est validé après ce nombre de réussites, obtenues sur des jours différents :
// une seule bonne réponse peut être un coup de chance, deux à distance prouvent l'acquis.
export const MODULE_PASSES_REQUIRED = 2

export const EXAM_COOLDOWN_HOURS = 24
export const MAX_AI_CALLS_PER_DAY = 40
export const MAX_RESPONSE_LENGTH = 5000
export const MIN_RESPONSE_LENGTH = 120

// Durée minimale passée sur un palier avant de pouvoir tenter l'examen (index 0 = palier 1).
// Le palier 10 est le sommet : il n'a pas d'examen.
const MIN_DAYS_BEFORE_EXAM = [7, 10, 14, 21, 30, 30, 45, 60, 90]

export const minDaysBeforeExam = (level) => MIN_DAYS_BEFORE_EXAM[level - 1] ?? null

// Seuil de réussite sur 10, valable pour les modules et l'examen du palier.
export const passThreshold = (level) => (level <= 5 ? 8 : 9)

const DAY_MS = 24 * 60 * 60 * 1000

export const toMillis = (value) => {
  if (value == null) return null
  if (typeof value === 'number') return value
  if (typeof value.toMillis === 'function') return value.toMillis()
  if (value instanceof Date) return value.getTime()
  return null
}

export const dayKey = (millis) => new Date(millis).toISOString().slice(0, 10)

export const createDomainProgress = (level = 1, now = Date.now()) => ({
  level,
  levelStartedAt: now,
  modules: {},
  exam: { attempts: 0, lastScore: null, lastAttemptAt: null },
})

// Accepte aussi l'ancien format ({ level, attempts, bestScore... }) et le complète.
export function normalizeDomainProgress(raw, now = Date.now()) {
  if (!raw) return createDomainProgress(1, now)
  return {
    level: raw.level ?? 1,
    levelStartedAt: toMillis(raw.levelStartedAt) ?? now,
    modules: raw.modules ?? {},
    exam: { attempts: 0, lastScore: null, lastAttemptAt: null, ...raw.exam },
  }
}

export const moduleState = (moduleProgress) => {
  const passDays = moduleProgress?.passDays ?? []
  return {
    passes: passDays.length,
    validated: passDays.length >= MODULE_PASSES_REQUIRED,
    attempts: moduleProgress?.attempts ?? 0,
    bestScore: moduleProgress?.bestScore ?? null,
    lastScore: moduleProgress?.lastScore ?? null,
    passedToday: passDays.includes(dayKey(Date.now())),
  }
}

/**
 * Explique pourquoi l'examen est verrouillé, ou renvoie { unlocked: true }.
 * `moduleIds` : identifiants des modules du palier courant.
 */
export function examStatus(domainProgress, moduleIds, now = Date.now()) {
  const { level, levelStartedAt, modules, exam } = domainProgress
  if (level >= MAX_LEVEL) return { unlocked: false, reason: 'mastered' }

  const remainingModules = moduleIds.filter((id) => !moduleState(modules[id]).validated).length
  const minDays = minDaysBeforeExam(level)
  const unlockAt = levelStartedAt + minDays * DAY_MS
  const lastAttempt = toMillis(exam.lastAttemptAt)
  const cooldownUntil = lastAttempt ? lastAttempt + EXAM_COOLDOWN_HOURS * 60 * 60 * 1000 : 0

  if (remainingModules > 0) return { unlocked: false, reason: 'modules', remainingModules }
  if (now < unlockAt) return { unlocked: false, reason: 'time', unlockAt }
  if (now < cooldownUntil) return { unlocked: false, reason: 'cooldown', unlockAt: cooldownUntil }
  return { unlocked: true }
}
