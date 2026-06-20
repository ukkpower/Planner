import { FilePlus2, FlaskConical, Layers3, Sparkles } from 'lucide-react'
import type { BoardSection } from '../../types/board'
import { sectionLabels } from '../../types/board'

type MainSidebarProps = {
  activeSection: BoardSection
  onSectionChange: (section: BoardSection) => void
  onAddLevel: () => void
}

const navItems: Array<{ section: BoardSection; icon: typeof FlaskConical }> = [
  { section: 'research', icon: FlaskConical },
  { section: 'planning', icon: Layers3 },
  { section: 'final', icon: Sparkles },
]

export function MainSidebar({ activeSection, onSectionChange, onAddLevel }: MainSidebarProps) {
  return (
    <aside className="z-10 flex h-screen w-[92px] shrink-0 flex-col border-r border-white/10 bg-[#171a21]/95">
      <div className="flex h-24 items-center justify-center">
        <div className="grid h-12 w-12 place-items-center rounded-[8px] border border-white/20 bg-[#20242d] shadow-xl">
          <div className="h-7 w-7 rounded-[6px] bg-[#88c39d]" />
        </div>
      </div>

      <div className="px-3">
        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          Levels
        </p>
        <nav className="space-y-3">
          {navItems.map(({ section, icon: Icon }) => {
            const active = section === activeSection
            return (
              <button
                key={section}
                type="button"
                title={sectionLabels[section]}
                onClick={() => onSectionChange(section)}
                className={`group grid h-14 w-full place-items-center rounded-[8px] border transition ${
                  active
                    ? 'border-[#88c39d]/45 bg-[#26312b] text-[#b8e3c5]'
                    : 'border-transparent bg-transparent text-stone-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-stone-100'
                }`}
              >
                <Icon size={21} strokeWidth={1.8} />
                <span className="sr-only">{sectionLabels[section]}</span>
              </button>
            )
          })}
          <button
            type="button"
            title="Add Level"
            onClick={onAddLevel}
            className="grid h-14 w-full place-items-center rounded-[8px] border border-dashed border-white/15 text-stone-400 transition hover:border-[#88c39d]/50 hover:bg-[#26312b] hover:text-[#b8e3c5]"
          >
            <FilePlus2 size={21} strokeWidth={1.8} />
            <span className="sr-only">Add Level</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}
