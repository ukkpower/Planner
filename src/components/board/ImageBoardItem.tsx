import { Rnd } from 'react-rnd'
import { ItemToolbar } from './ItemToolbar'
import { useBoardStore } from '../../stores/useBoardStore'
import type { Asset } from '../../types/asset'
import type { ImageBoardItem as ImageBoardItemType } from '../../types/board'

type AssetEntry = Asset & {
  url: string
}

type ImageBoardItemProps = {
  item: ImageBoardItemType
  asset?: AssetEntry
}

export function ImageBoardItem({ item, asset }: ImageBoardItemProps) {
  const selectedItemId = useBoardStore((state) => state.selectedItemId)
  const selectItem = useBoardStore((state) => state.selectItem)
  const updateItemFrame = useBoardStore((state) => state.updateItemFrame)
  const selected = selectedItemId === item.id

  return (
    <Rnd
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      bounds="parent"
      minWidth={96}
      minHeight={72}
      disableDragging={item.locked}
      style={{ zIndex: item.zIndex }}
      onMouseDown={(event) => {
        event.stopPropagation()
        selectItem(item.id)
      }}
      onDragStop={(_event, data) => {
        updateItemFrame(item.id, {
          x: Math.round(data.x),
          y: Math.round(data.y),
          width: item.width,
          height: item.height,
        })
      }}
      onResizeStop={(_event, _direction, ref, _delta, position) => {
        updateItemFrame(item.id, {
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: Math.round(ref.offsetWidth),
          height: Math.round(ref.offsetHeight),
        })
      }}
      className={`group rounded-[8px] border bg-[#0f1217] shadow-2xl transition ${
        selected ? 'border-[#88c39d] ring-2 ring-[#88c39d]/25' : 'border-white/12'
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[7px]">
        {asset ? (
          <img
            src={asset.url}
            alt={item.alt ?? asset.fileName}
            draggable={false}
            className="h-full w-full select-none object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-white/[0.04] text-sm text-stone-500">
            Missing image
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 py-2 opacity-0 transition group-hover:opacity-100">
          <p className="truncate text-xs font-medium text-white/90">{item.alt ?? asset?.fileName}</p>
        </div>
        {selected ? <ItemToolbar /> : null}
      </div>
    </Rnd>
  )
}
