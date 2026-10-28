import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import ErrorBanner from '../components/ui/ErrorBanner'

const inputClass =
  'w-full border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm text-neutral-100 focus:border-neutral-400 focus:outline-none'

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, pending, error } = useAuth()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const isSignUp = mode === 'signup'

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isSignUp) signUpWithEmail(form.email, form.password, form.name)
    else signInWithEmail(form.email, form.password)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="text-xl font-bold tracking-[0.3em] text-neutral-100 uppercase">L'Éminence</h1>
      <p className="mt-2 text-sm text-neutral-500">On ne t'apprendra pas à être aimé. On t'apprendra à être incontournable.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        {isSignUp && (
          <input className={inputClass} placeholder="Nom" value={form.name} onChange={update('name')} autoComplete="name" />
        )}
        <input
          className={inputClass}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update('email')}
          autoComplete="email"
          required
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={update('password')}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          minLength={6}
          required
        />
        <ErrorBanner message={error} />
        <Button type="submit" disabled={pending} className="w-full">
          {isSignUp ? 'Créer le compte' : 'Entrer'}
        </Button>
      </form>

      <Button variant="secondary" onClick={signInWithGoogle} disabled={pending} className="mt-3 w-full">
        Continuer avec Google
      </Button>

      <Button variant="ghost" onClick={() => setMode(isSignUp ? 'signin' : 'signup')} className="mt-4">
        {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? En créer un'}
      </Button>
    </div>
  )
}
