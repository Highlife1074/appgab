const VARIANTS = {
  primary: 'uppercase bg-neutral-100 text-neutral-950 hover:bg-white disabled:bg-neutral-700 disabled:text-neutral-400',
  secondary: 'uppercase border border-neutral-700 text-neutral-200 hover:border-neutral-400 disabled:text-neutral-600',
  ghost: 'text-neutral-400 hover:text-neutral-100',
}

export default function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm font-semibold tracking-wide disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
