import { BringToFront, SendToBack, Trash2 } from 'lucide-react'
import { useBoardStore } from '../../stores/useBoardStore'

export function ItemToolbar() {
  const deleteSelectedItem = useBoardStore((state) => state.deleteSelectedItem)
  const moveSelectedItemLayer = useBoardStore((state) => state.moveSelectedItemLayer)

  return (
    <div
      className="absolute -right-2 -top-12 flex items-center gap-1 rounded-[8px] border border-white/10 bg-[#111419]/95 p-1 shadow-2xl backdrop-blur"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        title="Send backward"
        onClick={() => void moveSelectedItemLayer('backward')}
        className="grid h-8 w-8 place-items-center rounded-[6px] text-stone-300 transition hover:bg-white/10 hover:text-white"
      >
        <SendToBack size={16} />
      </button>
      <button
        type="button"
        title="Bring forward"
        onClick={() => void moveSelectedItemLayer('forward')}
        className="grid h-8 w-8 place-items-center rounded-[6px] text-stone-300 transition hover:bg-white/10 hover:text-white"
      >
        <BringToFront size={16} />
      </button>
      <button
        type="button"
        title="Delete image"
        onClick={() => void deleteSelectedItem()}
        className="grid h-8 w-8 place-items-center rounded-[6px] text-red-200 transition hover:bg-red-500/15 hover:text-red-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
