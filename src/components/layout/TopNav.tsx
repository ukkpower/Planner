import { BookOpen, Settings2 } from 'lucide-react'
import { UploadImageButton } from '../board/UploadImageButton'
import type { BoardSection } from '../../types/board'
import { sectionLabels } from '../../types/board'
import type { Level } from '../../types/level'

type TopNavProps = {
  activeSection: BoardSection
  activeLevel?: Level
  onOpenLevelGuide: () => void
}

export function TopNav({ activeSection, activeLevel, onOpenLevelGuide }: TopNavProps) {
  return (
    <header className="z-10 flex h-24 shrink-0 items-center justify-between border-b border-white/10 bg-[#1b1e26]/90 px-7 backdrop-blur">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          {sectionLabels[activeSection]} board
        </p>
        <h2 className="mt-2 truncate text-2xl font-semibold text-white">
          {activeLevel ? `Level ${activeLevel.number} - ${activeLevel.name}` : 'No level selected'}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenLevelGuide}
          className="hidden h-11 w-[260px] items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] px-4 text-left text-stone-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white lg:flex"
          aria-haspopup="dialog"
        >
          <BookOpen size={18} />
          <span className="text-sm">Level Guide</span>
        </button>
        <UploadImageButton disabled={!activeLevel} />
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-[8px] border border-white/10 bg-white/[0.035] text-stone-300 transition hover:border-white/20 hover:bg-white/[0.06]"
          title="Board settings"
        >
          <Settings2 size={18} />
        </button>
      </div>
    </header>
  )
}
