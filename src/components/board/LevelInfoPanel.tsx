import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react'
import { useState } from 'react'
import type { Level } from '../../types/level'

type LevelInfoPanelProps = {
  level: Level
  onEditLevel: (level: Level) => void
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function LevelInfoPanel({ level, onEditLevel }: LevelInfoPanelProps) {
  const [expanded, setExpanded] = useState(true)

  if (!expanded) {
    return (
      <aside className="z-10 flex w-12 shrink-0 flex-col items-center border-l border-white/10 bg-[#1d2028]/95 py-3">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="grid h-9 w-9 place-items-center rounded-[8px] border border-white/10 bg-white/[0.04] text-stone-300 transition hover:border-[#88c39d]/50 hover:text-[#b8e3c5]"
          title="Show level details"
          aria-label="Show level details"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="mt-4 [writing-mode:vertical-rl] text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Level Details
        </p>
      </aside>
    )
  }

  return (
    <aside className="z-10 flex w-1/5 min-w-[220px] max-w-[360px] shrink-0 flex-col border-l border-white/10 bg-[#1d2028]/95">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88c39d]">
            Level details
          </p>
          <h2 className="mt-2 break-words text-xl font-semibold text-white">
            Level {level.number}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onEditLevel(level)}
            className="grid h-9 w-9 place-items-center rounded-[8px] border border-white/10 bg-white/[0.04] text-stone-300 transition hover:border-[#88c39d]/50 hover:text-[#b8e3c5]"
            title="Edit level details"
            aria-label="Edit level details"
          >
            <Edit3 size={17} />
          </button>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="grid h-9 w-9 place-items-center rounded-[8px] text-stone-400 transition hover:bg-white/10 hover:text-white"
            title="Collapse level details"
            aria-label="Collapse level details"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <dl className="space-y-5">
          <DetailBlock label="Name" value={level.name} />
          <DetailBlock label="Theme" value={level.theme} emptyText="No theme set" />
          <DetailBlock
            label="Description"
            value={level.description}
            emptyText="No description added"
            multiline
          />
          <DetailBlock label="Notes" value={level.notes} emptyText="No notes added" multiline />
          <DetailBlock label="Created" value={formatDate(level.createdAt)} />
          <DetailBlock label="Updated" value={formatDate(level.updatedAt)} />
        </dl>
      </div>
    </aside>
  )
}

type DetailBlockProps = {
  label: string
  value?: string
  emptyText?: string
  multiline?: boolean
}

function DetailBlock({ label, value, emptyText = 'Not set', multiline = false }: DetailBlockProps) {
  return (
    <div className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        {label}
      </dt>
      <dd
        className={`mt-2 break-words text-sm leading-6 ${
          value ? 'text-stone-200' : 'text-stone-500'
        } ${multiline ? 'whitespace-pre-wrap' : ''}`}
      >
        {value || emptyText}
      </dd>
    </div>
  )
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}
