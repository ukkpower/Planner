import type { Id } from '../../convex/_generated/dataModel'
import { api } from '../../convex/_generated/api'
import { convex } from '../lib/convex'
import type { BoardItem } from '../types/board'

type NewImageInput = {
  boardId: string
  file: File
  width?: number
  height?: number
  x: number
  y: number
  displayWidth: number
  displayHeight: number
  zIndex: number
}

type NewTextInput = {
  boardId: string
  text: string
  color: string
  fontSize: number
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

function mutableItemFields(item: BoardItem) {
  const common = {
    id: item.id,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    zIndex: item.zIndex,
    rotation: item.rotation,
    locked: item.locked,
  }

  return item.type === 'text'
    ? {
        ...common,
        text: item.text,
        color: item.color,
        fontSize: item.fontSize,
      }
    : common
}

export const boardRepository = {
  async addImage(input: NewImageInput) {
    const uploadUrl = await convex.mutation(api.boards.generateUploadUrl, {})
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': input.file.type },
      body: input.file,
    })

    if (!response.ok) {
      throw new Error(`Image upload failed (${response.status}).`)
    }

    const result = (await response.json()) as { storageId: Id<'_storage'> }
    return convex.mutation(api.boards.addImage, {
      boardId: input.boardId,
      storageId: result.storageId,
      mimeType: input.file.type,
      fileName: input.file.name,
      width: input.width,
      height: input.height,
      x: input.x,
      y: input.y,
      displayWidth: input.displayWidth,
      displayHeight: input.displayHeight,
      zIndex: input.zIndex,
    })
  },

  async addText(input: NewTextInput) {
    return convex.mutation(api.boards.addText, input)
  },

  async putItems(items: BoardItem[]) {
    if (items.length === 0) return
    await convex.mutation(api.boards.updateItems, { items: items.map(mutableItemFields) })
  },

  async deleteItem(itemId: string) {
    await convex.mutation(api.boards.removeItem, { itemId })
  },
}
