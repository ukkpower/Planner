import { Plus, Trash2 } from 'lucide-react'
import type { BoardSection } from '../../types/board'
import { sectionLabels } from '../../types/board'
import type { Level } from '../../types/level'

type LevelRailProps = {
  levels: Level[]
  activeLevelId?: string
  activeSection: BoardSection
  onLevelChange: (levelId: string) => void
  onAddLevel: () => void
  onDeleteLevel: (level: Level) => void
}

export function LevelRail({
  levels,
  activeLevelId,
  activeSection,
  onLevelChange,
  onAddLevel,
  onDeleteLevel,
}: LevelRailProps) {
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
                    onClick={() => onDeleteLevel(level)}
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
    </aside>
  )
}
