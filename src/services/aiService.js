import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'

// Les appels à Claude, la notation et la progression sont arbitrés côté serveur.
const call = (name) => {
  const fn = httpsCallable(functions, name, { timeout: 540_000 })
  return async (payload) => {
    try {
      const { data } = await fn(payload)
      return data
    } catch (error) {
      throw new Error(toMessage(error))
    }
  }
}

function toMessage(error) {
  // Les HttpsError du serveur portent déjà un message en français.
  if (error?.code && error.code !== 'functions/internal' && error.message) return error.message
  if (error?.code === 'functions/deadline-exceeded') return 'Le moteur a mis trop de temps à répondre. Réessaie.'
  return error?.message || 'Erreur inattendue. Réessaie.'
}

export const fetchCourse = call('getCourse')
export const startChallenge = call('startChallenge')
export const submitResponse = call('submitResponse')
