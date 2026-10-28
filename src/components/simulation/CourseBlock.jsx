function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h3 className="text-xs tracking-widest text-accent uppercase">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

const Paragraphs = ({ text }) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph, i) => (
      <p key={i} className="mt-3 text-sm leading-relaxed text-neutral-300 first:mt-0">
        {paragraph}
      </p>
    ))

function List({ items, ordered = false }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className={`space-y-2 pl-5 text-sm leading-relaxed text-neutral-300 ${ordered ? 'list-decimal' : 'list-disc'}`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  )
}

function Example({ example, index }) {
  return (
    <div className="border border-neutral-800 p-4">
      <p className="text-xs tracking-widest text-neutral-500 uppercase">Exemple {index + 1}</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-200">{example.situation}</p>
      <div className="mt-4 border-l-2 border-danger pl-3">
        <p className="text-xs font-semibold text-danger uppercase">Ce que dirait un débutant</p>
        <p className="mt-1 text-sm text-neutral-300 italic">{example.badResponse}</p>
        <p className="mt-2 text-sm text-neutral-400">{example.badWhy}</p>
      </div>
      <div className="mt-4 border-l-2 border-success pl-3">
        <p className="text-xs font-semibold text-success uppercase">Ce que dirait un expert</p>
        <p className="mt-1 text-sm text-neutral-200 italic">{example.goodResponse}</p>
        <p className="mt-2 text-sm text-neutral-400">{example.goodWhy}</p>
      </div>
    </div>
  )
}

export default function CourseBlock({ course }) {
  return (
    <article className="border-l-2 border-accent pl-4">
      <p className="text-xs tracking-widest text-accent uppercase">Masterclass</p>
      <h2 className="mt-1 text-xl font-semibold text-neutral-100">{course.title}</h2>
      <p className="mt-3 text-sm font-semibold text-neutral-200">Objectif : {course.objective}</p>

      {course.glossary.length > 0 && (
        <Section title="Vocabulaire">
          <dl className="space-y-2 text-sm">
            {course.glossary.map(({ term, definition }) => (
              <div key={term}>
                <dt className="inline font-semibold text-neutral-100">{term} : </dt>
                <dd className="inline text-neutral-300">{definition}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section title="Le principe">
        <Paragraphs text={course.concept} />
      </Section>
      <Section title="Pourquoi ça marche">
        <Paragraphs text={course.why} />
      </Section>
      <Section title="La méthode">
        <List items={course.steps} ordered />
      </Section>
      <Section title="Exemples">
        <div className="space-y-4">
          {course.examples.map((example, i) => (
            <Example key={i} example={example} index={i} />
          ))}
        </div>
      </Section>
      <Section title="Phrases à utiliser">
        <List items={course.phrases} />
      </Section>
      <Section title="Pièges à éviter">
        <List items={course.pitfalls} />
      </Section>
      <Section title="Avant l'épreuve">
        <p className="text-sm leading-relaxed text-neutral-300">{course.exercise}</p>
      </Section>
      <p className="mt-8 border border-accent/40 bg-accent/5 p-4 text-sm font-semibold text-neutral-100">
        {course.takeaway}
      </p>
    </article>
  )
}
