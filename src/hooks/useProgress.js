import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { DOMAIN_IDS, examStatus, getLevel, moduleState, normalizeDomainProgress } from '../utils/constants'

export function useProgress() {
  const raw = useAppStore((state) => state.progress)
  const status = useAppStore((state) => state.progressStatus)
  const error = useAppStore((state) => state.progressError)

  const domains = useMemo(
    () =>
      Object.fromEntries(
        DOMAIN_IDS.map((id) => {
          const progress = normalizeDomainProgress(raw?.[id])
          const levelData = getLevel(id, progress.level)
          const modules = levelData.modules.map((module) => ({
            ...module,
            ...moduleState(progress.modules[module.id]),
          }))
          return [
            id,
            {
              id,
              ...progress,
              levelData,
              modules,
              validatedCount: modules.filter((module) => module.validated).length,
              exam: { ...progress.exam, ...examStatus(progress, modules.map((module) => module.id)) },
            },
          ]
        }),
      ),
    [raw],
  )

  return {
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    domains,
    getDomain: (id) => domains[id],
  }
}
