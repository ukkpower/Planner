import { useRef, useState, type PointerEvent } from 'react'
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
  const viewportRef = useRef<HTMLDivElement>(null)
  const panStartRef = useRef({
    pointerId: -1,
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  })
  const panningRef = useRef(false)
  const [panning, setPanning] = useState(false)
  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex)

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.target !== event.currentTarget || !viewportRef.current) {
      return
    }

    selectItem(undefined)
    panStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    panningRef.current = true
    setPanning(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!panningRef.current || event.pointerId !== panStartRef.current.pointerId || !viewportRef.current) {
      return
    }

    event.preventDefault()
    viewportRef.current.scrollLeft =
      panStartRef.current.scrollLeft - (event.clientX - panStartRef.current.x)
    viewportRef.current.scrollTop =
      panStartRef.current.scrollTop - (event.clientY - panStartRef.current.y)
  }

  function stopPanning(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerId !== panStartRef.current.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    panStartRef.current.pointerId = -1
    panningRef.current = false
    setPanning(false)
  }

  return (
    <div ref={viewportRef} className="min-w-0 flex-1 overflow-auto bg-[#14171d]">
      <div
        className={`relative h-[3000px] w-[4000px] bg-[#181c23] ${
          panning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPanning}
        onPointerCancel={stopPanning}
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
