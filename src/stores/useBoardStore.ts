import { create } from 'zustand'
import { assetRepository } from '../repositories/assetRepository'
import { boardRepository } from '../repositories/boardRepository'
import type { Asset } from '../types/asset'
import type { Board, BoardItem, BoardSection, ImageBoardItem } from '../types/board'
import { nowIso } from '../utils/dates'
import { getDefaultImageSize, getImageDimensions } from '../utils/image'
import { getNextZIndex, reorderItemLayer } from '../utils/zIndex'

type AssetEntry = Asset & {
  url: string
}

type BoardState = {
  board?: Board
  items: BoardItem[]
  assetsById: Record<string, AssetEntry>
  selectedItemId?: string
  loading: boolean
  error?: string
  loadBoard: (levelId?: string, section?: BoardSection) => Promise<void>
  addImages: (files: FileList | File[]) => Promise<void>
  selectItem: (itemId?: string) => void
  updateItemFrame: (itemId: string, frame: Pick<BoardItem, 'x' | 'y' | 'width' | 'height'>) => void
  deleteSelectedItem: () => Promise<void>
  moveSelectedItemLayer: (direction: 'forward' | 'backward') => Promise<void>
  flushPendingSave: () => Promise<void>
}

const pendingItems = new Map<string, BoardItem>()
let saveTimer: ReturnType<typeof setTimeout> | undefined

function revokeAssetUrls(assetsById: Record<string, AssetEntry>) {
  Object.values(assetsById).forEach((asset) => URL.revokeObjectURL(asset.url))
}

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

  async loadBoard(levelId, section) {
    await persistPendingItems()
    revokeAssetUrls(get().assetsById)

    if (!levelId || !section) {
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

    try {
      const board = await boardRepository.getBoard(levelId, section)

      if (!board) {
        set({
          board: undefined,
          items: [],
          assetsById: {},
          loading: false,
          error: 'This level does not have a board for the selected section.',
        })
        return
      }

      const items = await boardRepository.listItems(board.id)
      const assetIds = items
        .filter((item): item is ImageBoardItem => item.type === 'image')
        .map((item) => item.assetId)
      const assets = await assetRepository.getAssets(assetIds)
      const assetsById = assets.reduce<Record<string, AssetEntry>>((result, asset) => {
        result[asset.id] = {
          ...asset,
          url: URL.createObjectURL(asset.blob),
        }
        return result
      }, {})

      set({
        board,
        items,
        assetsById,
        loading: false,
        error: undefined,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Could not load this board.',
      })
    }
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
    const newItems: ImageBoardItem[] = []
    const newAssets: Record<string, AssetEntry> = {}

    for (const file of files) {
      const timestamp = nowIso()
      const dimensions = await getImageDimensions(file)
      const displaySize = getDefaultImageSize(dimensions)
      const asset: Asset = {
        id: crypto.randomUUID(),
        kind: 'image',
        blob: file.slice(0, file.size, file.type),
        mimeType: file.type,
        fileName: file.name,
        width: dimensions.width,
        height: dimensions.height,
        createdAt: timestamp,
      }
      const item: ImageBoardItem = {
        id: crypto.randomUUID(),
        boardId: board.id,
        type: 'image',
        assetId: asset.id,
        alt: file.name,
        x: 220 + ((existingItems.length + newItems.length) % 5) * 38,
        y: 180 + ((existingItems.length + newItems.length) % 4) * 34,
        width: displaySize.width,
        height: displaySize.height,
        zIndex: getNextZIndex([...existingItems, ...newItems]),
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      await assetRepository.addAsset(asset)
      newAssets[asset.id] = {
        ...asset,
        url: URL.createObjectURL(asset.blob),
      }
      newItems.push(item)
    }

    await boardRepository.addItems(newItems)

    set((state) => ({
      items: [...state.items, ...newItems],
      assetsById: {
        ...state.assetsById,
        ...newAssets,
      },
      selectedItemId: newItems[newItems.length - 1]?.id,
    }))
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

  async deleteSelectedItem() {
    const selectedItemId = get().selectedItemId

    if (!selectedItemId) {
      return
    }

    pendingItems.delete(selectedItemId)
    await boardRepository.deleteItem(selectedItemId)
    set((state) => ({
      items: state.items.filter((item) => item.id !== selectedItemId),
      selectedItemId: undefined,
    }))
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
