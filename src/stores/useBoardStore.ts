import { create } from 'zustand'
import { boardRepository } from '../repositories/boardRepository'
import type { Asset } from '../types/asset'
import type { Board, BoardItem } from '../types/board'
import { nowIso } from '../utils/dates'
import { getDefaultImageSize, getImageDimensions } from '../utils/image'
import { getNextZIndex, reorderItemLayer } from '../utils/zIndex'

type AssetEntry = Asset & {
  url: string
}

type BoardSnapshot = {
  board: Board
  items: BoardItem[]
  assets: Asset[]
}

type BoardState = {
  board?: Board
  items: BoardItem[]
  assetsById: Record<string, AssetEntry>
  selectedItemId?: string
  loading: boolean
  error?: string
  beginBoardLoad: (hasActiveBoard: boolean) => void
  syncBoard: (snapshot: BoardSnapshot | null) => void
  addImages: (files: FileList | File[]) => Promise<void>
  addNote: () => Promise<void>
  selectItem: (itemId?: string) => void
  updateItemFrame: (itemId: string, frame: Pick<BoardItem, 'x' | 'y' | 'width' | 'height'>) => void
  updateItemText: (itemId: string, text: string) => void
  deleteItem: (itemId: string) => Promise<void>
  deleteSelectedItem: () => Promise<void>
  moveSelectedItemLayer: (direction: 'forward' | 'backward') => Promise<void>
  flushPendingSave: () => Promise<void>
}

const pendingItems = new Map<string, BoardItem>()
let saveTimer: ReturnType<typeof setTimeout> | undefined

async function persistPendingItems() {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = undefined
  }

  const items = [...pendingItems.values()]
  pendingItems.clear()
  await boardRepository.putItems(items)
}

function scheduleItemSave(item: BoardItem) {
  pendingItems.set(item.id, item)

  if (saveTimer) {
    clearTimeout(saveTimer)
  }

  saveTimer = setTimeout(() => {
    void persistPendingItems()
  }, 450)
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: undefined,
  items: [],
  assetsById: {},
  selectedItemId: undefined,
  loading: false,
  error: undefined,

  beginBoardLoad(hasActiveBoard) {
    if (!hasActiveBoard) {
      set({
        board: undefined,
        items: [],
        assetsById: {},
        selectedItemId: undefined,
        loading: false,
        error: undefined,
      })
      return
    }
    set({ loading: true, error: undefined, selectedItemId: undefined })
  },

  syncBoard(snapshot) {
    if (!snapshot) {
      set({
        board: undefined,
        items: [],
        assetsById: {},
        loading: false,
        error: 'This level does not have a board for the selected section.',
      })
      return
    }

    const assetsById = snapshot.assets.reduce<Record<string, AssetEntry>>((result, asset) => {
      if (asset.url) {
        result[asset.id] = {
          ...asset,
          url: asset.url,
        }
      }
      return result
    }, {})
    const items = snapshot.items.map((item) => pendingItems.get(item.id) ?? item)

    set({
      board: snapshot.board,
      items,
      assetsById,
      loading: false,
      error: undefined,
    })
  },

  async addImages(filesInput) {
    const board = get().board

    if (!board) {
      return
    }

    const files = Array.from(filesInput).filter((file) => file.type.startsWith('image/'))

    if (files.length === 0) {
      return
    }

    const existingItems = get().items
    let selectedItemId: string | undefined

    for (const [index, file] of files.entries()) {
      const dimensions = await getImageDimensions(file)
      const displaySize = getDefaultImageSize(dimensions)
      const result = await boardRepository.addImage({
        boardId: board.id,
        file,
        width: dimensions.width,
        height: dimensions.height,
        x: 220 + ((existingItems.length + index) % 5) * 38,
        y: 180 + ((existingItems.length + index) % 4) * 34,
        displayWidth: displaySize.width,
        displayHeight: displaySize.height,
        zIndex: getNextZIndex(existingItems) + index,
      })
      selectedItemId = result.itemId
    }
    set({ selectedItemId })
  },

  async addNote() {
    const board = get().board

    if (!board) {
      return
    }

    const existingItems = get().items
    const itemOffset = existingItems.length
    const result = await boardRepository.addText({
      boardId: board.id,
      text: '',
      color: '#F5E98A',
      fontSize: 18,
      x: 260 + (itemOffset % 5) * 36,
      y: 200 + (itemOffset % 4) * 32,
      width: 280,
      height: 240,
      zIndex: getNextZIndex(existingItems),
    })

    set({ selectedItemId: result.itemId })
  },

  selectItem(itemId) {
    set({ selectedItemId: itemId })
  },

  updateItemFrame(itemId, frame) {
    set((state) => {
      const items = state.items.map((item) => {
        if (item.id !== itemId) {
          return item
        }

        const updatedItem: BoardItem = {
          ...item,
          ...frame,
          updatedAt: nowIso(),
        }
        scheduleItemSave(updatedItem)
        return updatedItem
      })

      return { items }
    })
  },

  updateItemText(itemId, text) {
    set((state) => {
      const items = state.items.map((item) => {
        if (item.id !== itemId || item.type !== 'text') {
          return item
        }

        const updatedItem: BoardItem = {
          ...item,
          text,
          updatedAt: nowIso(),
        }
        scheduleItemSave(updatedItem)
        return updatedItem
      })

      return { items }
    })
  },

  async deleteItem(itemId) {
    pendingItems.delete(itemId)
    await boardRepository.deleteItem(itemId)

    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
      selectedItemId: state.selectedItemId === itemId ? undefined : state.selectedItemId,
    }))
  },

  async deleteSelectedItem() {
    const selectedItemId = get().selectedItemId

    if (!selectedItemId) {
      return
    }

    await get().deleteItem(selectedItemId)
  },

  async moveSelectedItemLayer(direction) {
    const selectedItemId = get().selectedItemId

    if (!selectedItemId) {
      return
    }

    const items = reorderItemLayer(get().items, selectedItemId, direction)
    await boardRepository.putItems(items)
    set({ items })
  },

  async flushPendingSave() {
    await persistPendingItems()
  },
}))
