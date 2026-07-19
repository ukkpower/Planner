import { useState } from 'react'
import { Rnd } from 'react-rnd'
import { Trash2 } from 'lucide-react'
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

type ItemFrame = Pick<ImageBoardItemType, 'x' | 'y' | 'width' | 'height'>

function getImageAspectRatio(item: ImageBoardItemType, asset?: AssetEntry) {
  if (asset?.width && asset.height) {
    return asset.width / asset.height
  }

  return item.width / item.height
}

function getAspectLockedFrame(
  direction: string,
  position: { x: number; y: number },
  width: number,
  aspectRatio: number,
) {
  const normalizedWidth = Math.round(width)
  const normalizedHeight = Math.round(normalizedWidth / aspectRatio)
  const normalizedDirection = direction.toLowerCase()
  const roundedPosition = {
    x: Math.round(position.x),
    y: Math.round(position.y),
  }

  return {
    x: normalizedDirection.includes('left')
      ? Math.round(position.x + width - normalizedWidth)
      : roundedPosition.x,
    y: normalizedDirection.includes('top')
      ? Math.round(position.y + width / aspectRatio - normalizedHeight)
      : roundedPosition.y,
    width: normalizedWidth,
    height: normalizedHeight,
  }
}

export function ImageBoardItem({ item, asset }: ImageBoardItemProps) {
  const selectedItemId = useBoardStore((state) => state.selectedItemId)
  const selectItem = useBoardStore((state) => state.selectItem)
  const updateItemFrame = useBoardStore((state) => state.updateItemFrame)
  const deleteItem = useBoardStore((state) => state.deleteItem)
  const selected = selectedItemId === item.id
  const aspectRatio = getImageAspectRatio(item, asset)
  const [liveFrame, setLiveFrame] = useState<ItemFrame>()
  const frame = liveFrame ?? item

  return (
    <Rnd
      size={{ width: frame.width, height: frame.height }}
      position={{ x: frame.x, y: frame.y }}
      bounds="parent"
      minWidth={96}
      minHeight={72}
      lockAspectRatio={aspectRatio}
      disableDragging={item.locked}
      style={{ zIndex: item.zIndex }}
      onMouseDown={(event) => {
        event.stopPropagation()
        selectItem(item.id)
      }}
      onDragStart={() => {
        setLiveFrame({
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
        })
      }}
      onDrag={(_event, data) => {
        setLiveFrame({
          x: data.x,
          y: data.y,
          width: item.width,
          height: item.height,
        })
      }}
      onDragStop={(_event, data) => {
        updateItemFrame(item.id, {
          x: Math.round(data.x),
          y: Math.round(data.y),
          width: item.width,
          height: item.height,
        })
        setLiveFrame(undefined)
      }}
      onResizeStart={() => {
        setLiveFrame({
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
        })
      }}
      onResize={(_event, direction, ref, _delta, position) => {
        setLiveFrame(getAspectLockedFrame(direction, position, ref.offsetWidth, aspectRatio))
      }}
      onResizeStop={(_event, direction, ref, _delta, position) => {
        updateItemFrame(
          item.id,
          getAspectLockedFrame(direction, position, ref.offsetWidth, aspectRatio),
        )
        setLiveFrame(undefined)
      }}
      className={`group rounded-[8px] border bg-[#0f1217] shadow-2xl transition-colors ${
        selected ? 'border-[#88c39d] ring-2 ring-[#88c39d]/25' : 'border-white/12'
      }`}
    >
      <button
        type="button"
        title="Delete image"
        aria-label="Delete image"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          void deleteItem(item.id)
        }}
        className="pointer-events-none absolute -right-3 -top-3 z-20 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-[#111419]/95 text-red-200 opacity-0 shadow-xl backdrop-blur transition hover:bg-red-500 hover:text-white focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#88c39d] group-hover:pointer-events-auto group-hover:opacity-100"
      >
        <Trash2 size={15} />
      </button>
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
