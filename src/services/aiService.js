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

const NETWORK_MESSAGE = 'Serveur injoignable. Vérifie ta connexion, puis réessaie dans un instant.'

function toMessage(error) {
  if (error?.code === 'functions/deadline-exceeded') return 'Le moteur a mis trop de temps à répondre. Réessaie.'
  // Sans réponse du serveur (réseau, serveur absent), le SDK renvoie « internal » sans détail.
  if (error?.code === 'functions/internal' && (!error.message || error.message === 'internal')) return NETWORK_MESSAGE
  // Les HttpsError du serveur portent déjà un message en français.
  return error?.message || 'Erreur inattendue. Réessaie.'
}

export const fetchCourse = call('getCourse')
export const startChallenge = call('startChallenge')
export const submitResponse = call('submitResponse')
