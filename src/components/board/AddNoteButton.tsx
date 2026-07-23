import { StickyNote } from 'lucide-react'
import { useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'

type AddNoteButtonProps = {
  disabled?: boolean
}

export function AddNoteButton({ disabled }: AddNoteButtonProps) {
  const addNote = useBoardStore((state) => state.addNote)
  const [busy, setBusy] = useState(false)

  async function handleAddNote() {
    setBusy(true)
    try {
      await addNote()
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={() => void handleAddNote()}
      className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-[#f5e98a]/35 bg-[#f5e98a]/10 px-4 text-sm font-semibold text-[#f5e98a] transition hover:border-[#f5e98a]/55 hover:bg-[#f5e98a]/15 hover:text-[#fff7b8] disabled:cursor-not-allowed disabled:opacity-45"
    >
      <StickyNote size={18} />
      {busy ? 'Adding...' : 'Add Note'}
    </button>
  )
}
