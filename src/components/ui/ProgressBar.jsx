import { MAX_LEVEL } from '../../utils/constants'

export default function ProgressBar({ level, max = MAX_LEVEL }) {
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={max}
      aria-valuenow={level}
    >
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-1.5 ${i < level ? 'bg-accent' : 'bg-neutral-800'}`} />
      ))}
    </div>
  )
}
