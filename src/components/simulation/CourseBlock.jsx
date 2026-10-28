export default function CourseBlock({ course }) {
  return (
    <section className="border-l-2 border-accent pl-4">
      <p className="text-xs tracking-widest text-accent uppercase">Masterclass</p>
      <h2 className="mt-1 text-lg font-semibold text-neutral-100">{course.title}</h2>
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-neutral-300">{course.content}</p>
    </section>
  )
}
