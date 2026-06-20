import { db } from '../db/db'
import type { BoardSection, BoardItem } from '../types/board'
import { nowIso } from '../utils/dates'

export const boardRepository = {
  async getBoard(levelId: string, section: BoardSection) {
    return db.boards.where('[levelId+section]').equals([levelId, section]).first()
  },

  async listItems(boardId: string) {
    return db.boardItems.where('boardId').equals(boardId).sortBy('zIndex')
  },

  async addItems(items: BoardItem[]) {
    await db.boardItems.bulkAdd(items)
  },

  async putItems(items: BoardItem[]) {
    if (items.length === 0) {
      return
    }

    await db.boardItems.bulkPut(items)
  },

  async updateItem(item: BoardItem) {
    await db.boardItems.put({
      ...item,
      updatedAt: nowIso(),
    })
  },

  async deleteItem(itemId: string) {
    await db.boardItems.delete(itemId)
  },
}
