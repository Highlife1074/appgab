import { mockProvider } from './mockProvider'
import { proxyProvider } from './proxyProvider'
import { parseChallenge, parseCourse, parseEvaluation } from './schema'

const PROVIDERS = { mock: mockProvider, proxy: proxyProvider }

const provider = PROVIDERS[import.meta.env.VITE_LLM_PROVIDER] ?? mockProvider

export const llmProviderName = provider.name

export const generateCourse = async ({ domain, level }) =>
  parseCourse(await provider.generateCourse({ domain, level }))

export const generateChallenge = async ({ domain, level, course }) =>
  parseChallenge(await provider.generateChallenge({ domain, level, course }))

export const evaluateResponse = async ({ domain, level, challenge, response }) =>
  parseEvaluation(await provider.evaluate({ domain, level, challenge, response }))
