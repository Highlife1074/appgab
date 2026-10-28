export default function Loader({ label = 'Chargement' }) {
  return (
    <div role="status" className="flex items-center gap-3 py-6 text-sm text-neutral-400">
      <span className="size-3 animate-pulse bg-accent" aria-hidden="true" />
      <span className="tracking-wide uppercase">{label}…</span>
    </div>
  )
}
