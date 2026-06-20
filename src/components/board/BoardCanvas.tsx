import { BoardItemRenderer } from './BoardItemRenderer'
import { EmptyBoardState } from './EmptyBoardState'
import { useBoardStore } from '../../stores/useBoardStore'
import type { Asset } from '../../types/asset'
import type { BoardItem } from '../../types/board'

type AssetEntry = Asset & {
  url: string
}

type BoardCanvasProps = {
  items: BoardItem[]
  assetsById: Record<string, AssetEntry>
}

export function BoardCanvas({ items, assetsById }: BoardCanvasProps) {
  const selectItem = useBoardStore((state) => state.selectItem)
  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="min-w-0 flex-1 overflow-auto bg-[#14171d]">
      <div
        className="relative h-[3000px] w-[4000px] bg-[#181c23]"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            selectItem(undefined)
          }
        }}
      >
        <div className="pointer-events-none absolute inset-0 board-grid opacity-70" />
        <div className="pointer-events-none absolute left-8 top-8 rounded-[8px] border border-white/10 bg-[#111419]/80 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
          4000 x 3000 workspace
        </div>
        {items.length === 0 ? <EmptyBoardState /> : null}
        {sortedItems.map((item) => (
          <BoardItemRenderer key={item.id} item={item} asset={assetsById[item.type === 'image' ? item.assetId : '']} />
        ))}
      </div>
    </div>
  )
}
