import { create } from 'zustand'
import { SIMULATION_PHASE } from '../utils/constants'

const initialSimulation = {
  key: null, // `${domain}:${moduleId}` ou `${domain}:exam`
  phase: SIMULATION_PHASE.IDLE,
  course: null,
  simulationId: null,
  challenge: null,
  evaluation: null,
  outcome: null,
  error: null,
}

export const useAppStore = create((set) => ({
  // Auth — 'loading' tant que Firebase n'a pas résolu la session persistée.
  user: null,
  authStatus: 'loading',
  setUser: (user) => set({ user, authStatus: user ? 'authenticated' : 'anonymous' }),

  // Progression brute de users/{uid}.progress (normalisée dans useProgress)
  progress: null,
  progressStatus: 'idle',
  progressError: null,
  setProgress: (progress) => set({ progress, progressStatus: 'ready', progressError: null }),
  setProgressLoading: () => set({ progressStatus: 'loading' }),
  setProgressError: (progressError) => set({ progressStatus: 'error', progressError }),
  clearProgress: () => set({ progress: null, progressStatus: 'idle', progressError: null }),

  // Séance en cours : une seule à la fois
  simulation: initialSimulation,
  patchSimulation: (patch) => set((state) => ({ simulation: { ...state.simulation, ...patch } })),
  resetSimulation: (key = null) => set({ simulation: { ...initialSimulation, key } }),
}))
