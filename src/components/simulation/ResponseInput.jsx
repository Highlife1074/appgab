import { useState } from 'react'
import Button from '../ui/Button'
import { MIN_RESPONSE_LENGTH } from '../../utils/constants'

export default function ResponseInput({ onSubmit, disabled }) {
  const [text, setText] = useState('')
  const length = text.trim().length

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(text)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="response" className="text-xs tracking-widest text-neutral-500 uppercase">
        Ta réponse — mot pour mot
      </label>
      <textarea
        id="response"
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={disabled}
        rows={10}
        className="w-full resize-y border border-neutral-700 bg-neutral-900 p-3 text-sm leading-relaxed text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-400 focus:outline-none"
        placeholder="Ce que tu dis. Ce que tu fais. Rien d'autre."
      />
      <div className="flex items-center justify-between gap-4">
        <span className={`text-xs tabular-nums ${length < MIN_RESPONSE_LENGTH ? 'text-neutral-600' : 'text-neutral-400'}`}>
          {length} / {MIN_RESPONSE_LENGTH} min.
        </span>
        <Button type="submit" disabled={disabled || length < MIN_RESPONSE_LENGTH}>
          Soumettre
        </Button>
      </div>
    </form>
  )
}
