export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <p role="alert" className="border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  )
}
