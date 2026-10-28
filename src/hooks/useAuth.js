import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import {
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
  subscribeToAuth,
  toAuthErrorMessage,
} from '../services/authService'
import { subscribeToProgress } from '../services/progressService'

/** À monter une seule fois (dans App) : synchronise session et progression dans le store. */
export function useAuthBootstrap() {
  const { setUser, setProgress, setProgressLoading, setProgressError, clearProgress, resetSimulation } =
    useAppStore.getState()

  useEffect(() => {
    let unsubscribeProgress = () => {}

    const unsubscribeAuth = subscribeToAuth((user) => {
      unsubscribeProgress()
      setUser(user)

      if (!user) {
        clearProgress()
        resetSimulation()
        return
      }

      setProgressLoading()
      unsubscribeProgress = subscribeToProgress(user.uid, setProgress, (error) =>
        setProgressError(error.message),
      )
    })

    return () => {
      unsubscribeProgress()
      unsubscribeAuth()
    }
  }, [setUser, setProgress, setProgressLoading, setProgressError, clearProgress, resetSimulation])
}

export function useAuth() {
  const user = useAppStore((state) => state.user)
  const authStatus = useAppStore((state) => state.authStatus)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const run = useCallback(async (action) => {
    setPending(true)
    setError(null)
    try {
      return await action()
    } catch (err) {
      setError(toAuthErrorMessage(err))
      return null
    } finally {
      setPending(false)
    }
  }, [])

  return {
    user,
    authStatus,
    isAuthenticated: authStatus === 'authenticated',
    pending,
    error,
    signInWithEmail: (email, password) => run(() => signInWithEmail(email, password)),
    signUpWithEmail: (email, password, name) => run(() => signUpWithEmail(email, password, name)),
    signInWithGoogle: () => run(signInWithGoogle),
    signOut,
  }
}
