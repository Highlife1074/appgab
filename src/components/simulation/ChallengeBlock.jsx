function Field({ label, children }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-neutral-300">{children}</div>
    </div>
  )
}

export default function ChallengeBlock({ challenge, isExam }) {
  return (
    <section className="border border-neutral-800 p-4">
      <p className="text-xs tracking-widest text-danger uppercase">{isExam ? 'Examen de passage' : 'Épreuve'}</p>
      <h2 className="mt-1 text-lg font-semibold text-neutral-100">{challenge.title}</h2>
      <Field label="Ton rôle">{challenge.role}</Field>
      <Field label="Situation">
        <p className="whitespace-pre-line">{challenge.context}</p>
      </Field>
      <Field label="Ton interlocuteur">
        <p className="whitespace-pre-line">{challenge.counterpart}</p>
      </Field>
      <Field label="Enjeux">{challenge.stakes}</Field>
      {challenge.constraints.length > 0 && (
        <Field label="Contraintes">
          <ul className="list-disc space-y-1 pl-5">
            {challenge.constraints.map((constraint, i) => (
              <li key={i}>{constraint}</li>
            ))}
          </ul>
        </Field>
      )}
      <p className="mt-4 border-t border-neutral-800 pt-3 text-sm font-semibold text-neutral-100">{challenge.prompt}</p>
    </section>
  )
}
