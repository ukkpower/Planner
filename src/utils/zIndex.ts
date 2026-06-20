import type { BoardItem } from '../types/board'

export function getNextZIndex(items: BoardItem[]) {
  return items.reduce((highest, item) => Math.max(highest, item.zIndex), 0) + 1
}

export function reorderItemLayer(items: BoardItem[], itemId: string, direction: 'forward' | 'backward') {
  const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex)
  const currentIndex = sorted.findIndex((item) => item.id === itemId)

  if (currentIndex === -1) {
    return items
  }

  const targetIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1

  if (targetIndex < 0 || targetIndex >= sorted.length) {
    return normalizeZIndexes(sorted)
  }

  const [item] = sorted.splice(currentIndex, 1)
  sorted.splice(targetIndex, 0, item)

  return normalizeZIndexes(sorted)
}

export function normalizeZIndexes(items: BoardItem[]) {
  return items.map((item, index) => ({
    ...item,
    zIndex: index + 1,
    updatedAt: new Date().toISOString(),
  }))
}
