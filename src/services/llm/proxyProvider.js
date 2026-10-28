import { getIdToken } from '../authService'

// Le proxy (Cloud Function / Worker) détient la clé Claude ou OpenAI et construit les prompts.
// Le client n'envoie que des données métier : jamais de prompt système, jamais de clé.
const PROXY_URL = import.meta.env.VITE_LLM_PROXY_URL

async function call(task, payload) {
  if (!PROXY_URL) throw new Error('VITE_LLM_PROXY_URL non configurée.')

  const token = await getIdToken()
  const res = await fetch(`${PROXY_URL.replace(/\/$/, '')}/${task}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`Moteur indisponible (${res.status}).`)
  return res.json()
}

export const proxyProvider = {
  name: 'proxy',
  generateCourse: (payload) => call('course', payload),
  generateChallenge: (payload) => call('challenge', payload),
  evaluate: (payload) => call('evaluate', payload),
}
