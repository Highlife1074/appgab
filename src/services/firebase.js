import { initializeApp, getApps, getApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { connectFirestoreEmulator, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

// Identifiants publics de l'application web (non secrets) : la sécurité des données
// repose sur firestore.rules. Les variables VITE_FIREBASE_* permettent de cibler un autre projet.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAOEQuS2zkOgS2l_NBAJ-kiKTjP1RXk3Y0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'eminence-3d407.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'eminence-3d407',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'eminence-3d407.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '537979105730',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:537979105730:web:05399a55485b730dc2a65b',
}

// Évite la double initialisation lors du hot-reload Vite.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
auth.languageCode = 'fr'

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// Cache IndexedDB multi-onglets : le dashboard reste lisible hors ligne.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})

// Même région que les Cloud Functions (functions/src/index.js).
export const functions = getFunctions(app, 'europe-west1')

// Développement local : `VITE_USE_EMULATORS=true npm run dev` avec `firebase emulators:start`.
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}
