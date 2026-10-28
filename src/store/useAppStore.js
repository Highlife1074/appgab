import { create } from 'zustand'
import { SIMULATION_PHASE } from '../utils/constants'

const initialSimulation = {
  phase: SIMULATION_PHASE.IDLE,
  simulationId: null,
  domain: null,
  level: null,
  course: null,
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

  // Progression — miroir temps réel de users/{uid}.progress
  progress: null,
  progressStatus: 'idle',
  progressError: null,
  setProgress: (progress) => set({ progress, progressStatus: 'ready', progressError: null }),
  setProgressLoading: () => set({ progressStatus: 'loading' }),
  setProgressError: (progressError) => set({ progressStatus: 'error', progressError }),
  clearProgress: () => set({ progress: null, progressStatus: 'idle', progressError: null }),

  // Simulation en cours
  simulation: initialSimulation,
  patchSimulation: (patch) => set((state) => ({ simulation: { ...state.simulation, ...patch } })),
  resetSimulation: () => set({ simulation: initialSimulation }),
}))
