import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

// Lecture seule : seules les Cloud Functions écrivent la progression.
export const subscribeToProgress = (uid, onData, onError) =>
  onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => onData(snapshot.exists() ? snapshot.data().progress ?? {} : {}),
    onError,
  )
