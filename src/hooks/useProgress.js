import { useAppStore } from '../store/useAppStore'
import { DOMAIN_IDS } from '../utils/constants'
import { createInitialDomainProgress } from '../utils/progress'

export function useProgress() {
  const progress = useAppStore((state) => state.progress)
  const status = useAppStore((state) => state.progressStatus)
  const error = useAppStore((state) => state.progressError)

  const getDomain = (domainId) => progress?.[domainId] ?? createInitialDomainProgress()

  return {
    progress,
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    getDomain,
    domains: DOMAIN_IDS.map((id) => ({ id, ...getDomain(id) })),
  }
}
