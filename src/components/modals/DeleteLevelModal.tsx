import { X } from 'lucide-react'
import { useState } from 'react'
import type { Level } from '../../types/level'

type DeleteLevelModalProps = {
  level: Level
  onClose: () => void
  onDelete: (levelId: string) => Promise<void>
}

export function DeleteLevelModal({ level, onClose, onDelete }: DeleteLevelModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>()

  async function confirmDeleteLevel() {
    setDeleting(true)
    setDeleteError(undefined)

    try {
      await onDelete(level.id)
      onClose()
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Could not delete this level.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[8px] border border-white/12 bg-[#1d2028] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
              Delete level
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">Level {level.number}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="grid h-9 w-9 place-items-center rounded-[8px] text-stone-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-stone-300">
            Delete "{level.name}" and all of its Research, Planning, and Final board content?
          </p>
          {deleteError ? (
            <p className="mt-4 rounded-[8px] border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {deleteError}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-10 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-stone-300 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void confirmDeleteLevel()}
            disabled={deleting}
            className="h-10 rounded-[8px] bg-red-300 px-4 text-sm font-semibold text-[#111419] transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Level'}
          </button>
        </div>
      </div>
    </div>
  )
}
