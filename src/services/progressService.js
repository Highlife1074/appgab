import { doc, getDoc, onSnapshot, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { MAX_LEVEL, PASS_THRESHOLD } from '../utils/constants'
import { createInitialProgress } from '../utils/progress'

const userRef = (uid) => doc(db, 'users', uid)

export async function ensureUserDocument(user) {
  const ref = userRef(user.uid)
  const snapshot = await getDoc(ref)
  if (snapshot.exists()) return

  await setDoc(ref, {
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    progress: createInitialProgress(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const subscribeToProgress = (uid, onData, onError) =>
  onSnapshot(
    userRef(uid),
    (snapshot) => onData(snapshot.exists() ? snapshot.data().progress : null),
    onError,
  )

/**
 * Enregistre une tentative et fait monter de palier si la note atteint le seuil.
 * Transaction : la tentative n'est comptée que si elle porte sur le palier courant
 * (empêche un double passage via deux onglets ouverts).
 */
export async function recordAttempt(uid, { domain, level, score }) {
  return runTransaction(db, async (transaction) => {
    const ref = userRef(uid)
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists()) throw new Error('Profil utilisateur introuvable.')

    const current = snapshot.data().progress[domain]
    if (current.level !== level) {
      return { leveledUp: false, newLevel: current.level, stale: true }
    }

    const passed = score >= PASS_THRESHOLD
    const newLevel = passed ? Math.min(current.level + 1, MAX_LEVEL) : current.level

    transaction.update(ref, {
      [`progress.${domain}`]: {
        level: newLevel,
        attempts: current.attempts + 1,
        bestScore: Math.max(current.bestScore ?? 0, score),
        lastScore: score,
        lastAttemptAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    })

    return { leveledUp: newLevel > current.level, newLevel, stale: false }
  })
}
