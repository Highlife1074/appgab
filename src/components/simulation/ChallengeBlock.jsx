export default function ChallengeBlock({ challenge }) {
  return (
    <section className="border border-neutral-800 p-4">
      <p className="text-xs tracking-widest text-danger uppercase">Épreuve</p>
      <h2 className="mt-1 text-lg font-semibold text-neutral-100">{challenge.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-300">{challenge.context}</p>
      {challenge.stakes && (
        <p className="mt-3 text-sm text-neutral-400">
          <span className="font-semibold text-neutral-200">Enjeux : </span>
          {challenge.stakes}
        </p>
      )}
      <p className="mt-4 text-sm font-semibold text-neutral-100">{challenge.prompt}</p>
    </section>
  )
}
