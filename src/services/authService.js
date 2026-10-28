import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { ensureUserDocument } from './progressService'

const AUTH_ERRORS = {
  'auth/invalid-credential': 'Identifiants incorrects.',
  'auth/email-already-in-use': 'Cet email est déjà utilisé.',
  'auth/weak-password': 'Mot de passe trop faible (6 caractères minimum).',
  'auth/invalid-email': 'Adresse email invalide.',
  'auth/popup-closed-by-user': 'Connexion Google annulée.',
  'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
}

export const toAuthErrorMessage = (error) =>
  AUTH_ERRORS[error?.code] ?? 'Échec de l’authentification.'

export const subscribeToAuth = (callback) => onAuthStateChanged(auth, callback)

export async function signInWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  await ensureUserDocument(user)
  return user
}

export async function signUpWithEmail(email, password, displayName) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) await updateProfile(user, { displayName })
  await ensureUserDocument(user)
  return user
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider)
  await ensureUserDocument(user)
  return user
}

export const signOut = () => firebaseSignOut(auth)

export const getIdToken = () => auth.currentUser?.getIdToken() ?? Promise.resolve(null)
