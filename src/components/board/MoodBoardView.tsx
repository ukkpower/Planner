import { BoardCanvas } from './BoardCanvas'
import type { Level } from '../../types/level'
import { useBoardStore } from '../../stores/useBoardStore'

type MoodBoardViewProps = {
  initialized: boolean
  activeLevel?: Level
}

export function MoodBoardView({ initialized, activeLevel }: MoodBoardViewProps) {
  const { board, items, assetsById, loading, error } = useBoardStore()

  if (!initialized || loading) {
    return (
      <section className="grid min-h-0 flex-1 place-items-center bg-[#161920]">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-stone-300">
          Loading planner...
        </div>
      </section>
    )
  }

  if (!activeLevel) {
    return (
      <section className="grid min-h-0 flex-1 place-items-center bg-[#161920] px-8">
        <div className="max-w-md rounded-[8px] border border-dashed border-white/15 bg-white/[0.035] p-7 text-center">
          <p className="text-lg font-semibold text-white">Create your first level</p>
          <p className="mt-3 text-sm leading-6 text-stone-400">
            Each level automatically gets separate Research, Planning, and Final mood boards.
          </p>
        </div>
      </section>
    )
  }

  if (error || !board) {
    return (
      <section className="grid min-h-0 flex-1 place-items-center bg-[#161920] px-8">
        <div className="max-w-md rounded-[8px] border border-red-400/20 bg-red-950/20 p-7 text-center">
          <p className="text-lg font-semibold text-red-100">Could not open board</p>
          <p className="mt-3 text-sm leading-6 text-red-200/70">{error}</p>
        </div>
      </section>
    )
  }

  return <BoardCanvas items={items} assetsById={assetsById} />
}
