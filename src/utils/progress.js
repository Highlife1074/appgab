import { DOMAIN_IDS, MAX_LEVEL } from './constants'

export const createInitialDomainProgress = () => ({
  level: 1,
  attempts: 0,
  bestScore: null,
  lastScore: null,
  lastAttemptAt: null,
})

export const createInitialProgress = () =>
  Object.fromEntries(DOMAIN_IDS.map((id) => [id, createInitialDomainProgress()]))

export const toPercent = (level) => Math.round((Math.min(level, MAX_LEVEL) / MAX_LEVEL) * 100)
