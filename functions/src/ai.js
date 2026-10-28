import Anthropic from '@anthropic-ai/sdk'
import { HttpsError } from 'firebase-functions/https'
import { logger } from 'firebase-functions'
import { toOutputSchema } from './schemas.js'

const MODEL = 'claude-opus-5-5'

const clients = new Map()
const getClient = (apiKey) => {
  if (!clients.has(apiKey)) clients.set(apiKey, new Anthropic({ apiKey }))
  return clients.get(apiKey)
}

/**
 * Appelle Claude avec une sortie JSON contrainte par `schema` (zod) et renvoie l'objet validé.
 * `fallbacks: "default"` relance automatiquement la requête sur un autre modèle en cas de refus.
 */
export async function generateStructured({ apiKey, system, prompt, schema, effort, maxTokens = 16000 }) {
  let response
  try {
    // Streaming obligatoire pour les sorties longues (cours) : évite les délais HTTP dépassés.
    response = await getClient(apiKey).beta.messages.stream({
      model: MODEL,
      max_tokens: maxTokens,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort, format: { type: 'json_schema', schema: toOutputSchema(schema) } },
      system,
      messages: [{ role: 'user', content: prompt }],
    }).finalMessage()
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      throw new HttpsError('resource-exhausted', 'Le moteur est saturé. Réessaie dans une minute.')
    }
    if (error instanceof Anthropic.AuthenticationError) {
      logger.error('Clé API Anthropic invalide ou absente.')
      throw new HttpsError('failed-precondition', 'Le moteur IA n’est pas configuré.')
    }
    if (error instanceof Anthropic.APIError) {
      logger.error('Erreur API Anthropic', { status: error.status, message: error.message })
      throw new HttpsError('unavailable', 'Le moteur IA est indisponible. Réessaie plus tard.')
    }
    throw error
  }

  logger.info('Appel Claude', { model: response.model, stop: response.stop_reason, usage: response.usage })

  if (response.stop_reason === 'refusal') {
    throw new HttpsError('failed-precondition', 'Le moteur a refusé de traiter cette demande.')
  }
  if (response.stop_reason === 'max_tokens') {
    throw new HttpsError('internal', 'Réponse du moteur tronquée. Réessaie.')
  }

  const text = response.content.find((block) => block.type === 'text')?.text
  let parsed
  try {
    parsed = JSON.parse(text ?? '')
  } catch {
    throw new HttpsError('internal', 'Réponse illisible du moteur. Réessaie.')
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    logger.error('Sortie hors schéma', { issues: result.error.issues })
    throw new HttpsError('internal', 'Réponse incomplète du moteur. Réessaie.')
  }
  return result.data
}
