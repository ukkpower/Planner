import { useEffect, useRef, useState } from 'react'
import { GripHorizontal } from 'lucide-react'
import { Rnd } from 'react-rnd'
import { ItemToolbar } from './ItemToolbar'
import { useBoardStore } from '../../stores/useBoardStore'
import type { TextBoardItem as TextBoardItemType } from '../../types/board'

type TextBoardItemProps = {
  item: TextBoardItemType
}

type ItemFrame = Pick<TextBoardItemType, 'x' | 'y' | 'width' | 'height'>

function getResizedFrame(
  position: { x: number; y: number },
  width: number,
  height: number,
): ItemFrame {
  return {
    x: Math.round(position.x),
    y: Math.round(position.y),
    width: Math.round(width),
    height: Math.round(height),
  }
}

export function TextBoardItem({ item }: TextBoardItemProps) {
  const selectedItemId = useBoardStore((state) => state.selectedItemId)
  const selectItem = useBoardStore((state) => state.selectItem)
  const updateItemFrame = useBoardStore((state) => state.updateItemFrame)
  const updateItemText = useBoardStore((state) => state.updateItemText)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [liveFrame, setLiveFrame] = useState<ItemFrame>()
  const selected = selectedItemId === item.id
  const frame = liveFrame ?? item

  useEffect(() => {
    if (!selected || !textareaRef.current) {
      return
    }

    const textarea = textareaRef.current
    textarea.focus()
    textarea.setSelectionRange(textarea.value.length, textarea.value.length)
  }, [selected])

  return (
    <Rnd
      size={{ width: frame.width, height: frame.height }}
      position={{ x: frame.x, y: frame.y }}
      bounds="parent"
      minWidth={160}
      minHeight={120}
      dragHandleClassName="note-drag-handle"
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
      onResize={(_event, _direction, ref, _delta, position) => {
        setLiveFrame(getResizedFrame(position, ref.offsetWidth, ref.offsetHeight))
      }}
      onResizeStop={(_event, _direction, ref, _delta, position) => {
        updateItemFrame(
          item.id,
          getResizedFrame(position, ref.offsetWidth, ref.offsetHeight),
        )
        setLiveFrame(undefined)
      }}
      className={`group rounded-[4px] border shadow-[0_18px_35px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] ${
        selected
          ? 'border-[#fff6b3] ring-2 ring-[#f5e98a]/35'
          : 'border-[#d9cc72]'
      }`}
    >
      {selected ? <ItemToolbar /> : null}
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded-[3px]"
        style={{ backgroundColor: item.color ?? '#F5E98A' }}
      >
        <div
          className="note-drag-handle flex h-8 shrink-0 cursor-move items-center justify-center text-[#746c36]/55"
          title="Drag note"
          aria-label="Drag note"
        >
          <GripHorizontal size={18} strokeWidth={1.8} />
        </div>
        <textarea
          ref={textareaRef}
          value={item.text}
          onChange={(event) => updateItemText(item.id, event.target.value)}
          onMouseDown={(event) => {
            event.stopPropagation()
            selectItem(item.id)
          }}
          aria-label="Note text"
          placeholder="Type your note..."
          spellCheck
          className="min-h-0 w-full flex-1 resize-none overflow-hidden bg-transparent px-5 pb-5 text-[#2e2a1f] outline-none placeholder:text-[#746c36]/60"
          style={{
            fontSize: `${item.fontSize ?? 18}px`,
            lineHeight: 1.45,
          }}
        />
      </div>
    </Rnd>
  )
}
