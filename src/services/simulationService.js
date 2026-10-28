import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

const simulations = collection(db, 'simulations')

export async function createSimulation(uid, { domain, level, course, provider }) {
  const ref = await addDoc(simulations, {
    userId: uid,
    domain,
    level,
    status: 'course',
    course,
    challenge: null,
    response: null,
    evaluation: null,
    provider,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export const attachChallenge = (simulationId, challenge) =>
  updateDoc(doc(db, 'simulations', simulationId), {
    status: 'challenge',
    challenge,
    updatedAt: serverTimestamp(),
  })

export const attachEvaluation = (simulationId, { responseText, evaluation }) =>
  updateDoc(doc(db, 'simulations', simulationId), {
    status: 'evaluated',
    response: { text: responseText, submittedAt: serverTimestamp() },
    evaluation: { ...evaluation, evaluatedAt: serverTimestamp() },
    updatedAt: serverTimestamp(),
  })
