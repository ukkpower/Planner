import { X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { NewLevelInput } from '../../types/level'

type AddLevelModalProps = {
  onClose: () => void
  onCreate: (input: NewLevelInput) => Promise<void>
}

export function AddLevelModal({ onClose, onCreate }: AddLevelModalProps) {
  const [form, setForm] = useState<NewLevelInput>({
    number: '',
    name: '',
    theme: '',
    description: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.number.trim() || !form.name.trim()) {
      return
    }

    setSaving(true)
    try {
      await onCreate(form)
    } finally {
      setSaving(false)
    }
  }

  function updateField(field: keyof NewLevelInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-5 backdrop-blur-sm">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="w-full max-w-2xl rounded-[8px] border border-white/12 bg-[#1d2028] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88c39d]">
              New level
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">Add Level</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-[8px] text-stone-400 transition hover:bg-white/10 hover:text-white"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-300">Level number</span>
            <input
              value={form.number}
              onChange={(event) => updateField('number', event.target.value)}
              placeholder="01"
              required
              className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-[#12151b] px-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#88c39d]/70"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-300">Level name</span>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Irish Cottage Kitchen"
              required
              className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-[#12151b] px-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#88c39d]/70"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-300">Country / theme / style</span>
            <input
              value={form.theme}
              onChange={(event) => updateField('theme', event.target.value)}
              placeholder="Cosy Irish countryside, hand-built kitchen, warm ceramics"
              className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-[#12151b] px-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#88c39d]/70"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-300">Short description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={3}
              placeholder="A compact description of the level idea and visual direction."
              className="mt-2 w-full resize-none rounded-[8px] border border-white/10 bg-[#12151b] px-3 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#88c39d]/70"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-stone-300">Optional notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              rows={3}
              placeholder="Gameplay notes, object ideas, story references, or constraints."
              className="mt-2 w-full resize-none rounded-[8px] border border-white/10 bg-[#12151b] px-3 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#88c39d]/70"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-stone-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.number.trim() || !form.name.trim()}
            className="h-10 rounded-[8px] bg-[#88c39d] px-4 text-sm font-semibold text-[#111419] transition hover:bg-[#a1d9b3] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Level'}
          </button>
        </div>
      </form>
    </div>
  )
}
