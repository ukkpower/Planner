import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import type { BoardSection } from '../../types/board'
import { sectionLabels } from '../../types/board'
import type { Level } from '../../types/level'

type LevelRailProps = {
  levels: Level[]
  activeLevelId?: string
  activeSection: BoardSection
  onLevelChange: (levelId: string) => void
  onAddLevel: () => void
  onDeleteLevel: (levelId: string) => Promise<void>
}

export function LevelRail({
  levels,
  activeLevelId,
  activeSection,
  onLevelChange,
  onAddLevel,
  onDeleteLevel,
}: LevelRailProps) {
  const [levelToDelete, setLevelToDelete] = useState<Level>()
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>()

  async function confirmDeleteLevel() {
    if (!levelToDelete) {
      return
    }

    setDeleting(true)
    setDeleteError(undefined)

    try {
      await onDeleteLevel(levelToDelete.id)
      setLevelToDelete(undefined)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Could not delete this level.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <aside className="z-10 flex h-screen w-[272px] shrink-0 flex-col border-r border-white/10 bg-[#1d2028]/95">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88c39d]">
          {sectionLabels[activeSection]}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-[-0.01em] text-white">Level Boards</h1>
          <button
            type="button"
            onClick={onAddLevel}
            className="grid h-9 w-9 place-items-center rounded-[8px] border border-white/10 bg-white/[0.04] text-stone-200 transition hover:border-[#88c39d]/50 hover:text-[#b8e3c5]"
            title="Add level"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {levels.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-white/14 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-stone-200">No levels yet</p>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Add your first level to create Research, Planning, and Final boards.
            </p>
            <button
              type="button"
              onClick={onAddLevel}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#88c39d] px-3 text-sm font-semibold text-[#111419] transition hover:bg-[#a1d9b3]"
            >
              <Plus size={16} />
              Add Level
            </button>
          </div>
        ) : (
          <nav className="space-y-2">
            {levels.map((level) => {
              const active = level.id === activeLevelId
              return (
                <div
                  key={level.id}
                  className="group relative"
                >
                  <button
                    type="button"
                    onClick={() => onLevelChange(level.id)}
                    className={`w-full rounded-[8px] border p-4 pr-11 text-left transition ${
                      active
                        ? 'border-[#88c39d]/45 bg-[#26312b] shadow-[0_12px_36px_rgba(0,0,0,0.24)]'
                        : 'border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.045]'
                    }`}
                  >
                    <span className="block text-sm font-semibold text-stone-100">
                      Level {level.number}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-stone-400">
                      {level.name}
                    </span>
                    {level.theme ? (
                      <span className="mt-3 inline-flex rounded-[6px] border border-white/10 px-2 py-1 text-[11px] text-stone-400">
                        {level.theme}
                      </span>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(undefined)
                      setLevelToDelete(level)
                    }}
                    className="pointer-events-none absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-[8px] border border-red-300/15 bg-[#1d2028]/95 text-stone-400 opacity-0 shadow-lg transition hover:border-red-300/35 hover:bg-red-500/12 hover:text-red-200 focus:pointer-events-auto focus:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                    title={`Delete Level ${level.number}`}
                    aria-label={`Delete Level ${level.number}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </nav>
        )}
      </div>

      {levelToDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[8px] border border-white/12 bg-[#1d2028] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                  Delete level
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Level {levelToDelete.number}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setLevelToDelete(undefined)}
                disabled={deleting}
                className="grid h-9 w-9 place-items-center rounded-[8px] text-stone-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-stone-300">
                Delete "{levelToDelete.name}" and all of its Research, Planning, and Final board
                content?
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
                onClick={() => setLevelToDelete(undefined)}
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
      ) : null}
    </aside>
  )
}
