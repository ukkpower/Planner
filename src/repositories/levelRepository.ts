import { db } from '../db/db'
import { boardSections, type Board } from '../types/board'
import type { Level, NewLevelInput } from '../types/level'
import { nowIso } from '../utils/dates'

export const levelRepository = {
  async listLevels() {
    return db.levels.orderBy('number').toArray()
  },

  async createLevel(input: NewLevelInput) {
    const timestamp = nowIso()
    const level: Level = {
      id: crypto.randomUUID(),
      number: input.number.trim(),
      name: input.name.trim(),
      theme: input.theme?.trim() || undefined,
      description: input.description?.trim() || undefined,
      notes: input.notes?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    const boards: Board[] = boardSections.map((section) => ({
      id: crypto.randomUUID(),
      levelId: level.id,
      section,
      createdAt: timestamp,
      updatedAt: timestamp,
    }))

    await db.transaction('rw', db.levels, db.boards, async () => {
      await db.levels.add(level)
      await db.boards.bulkAdd(boards)
    })

    return level
  },

  async deleteLevel(levelId: string) {
    await db.transaction('rw', db.levels, db.boards, db.boardItems, db.assets, async () => {
      const boards = (
        await Promise.all(
          boardSections.map((section) =>
            db.boards.where('[levelId+section]').equals([levelId, section]).first(),
          ),
        )
      ).filter(Boolean) as Board[]
      const boardIds = boards.map((board) => board.id)

      const boardItems = (
        await Promise.all(
          boardIds.map((boardId) => db.boardItems.where('boardId').equals(boardId).toArray()),
        )
      ).flat()
      const assetIds = [
        ...new Set(
          boardItems
            .filter((item) => item.type === 'image')
            .map((item) => item.assetId),
        ),
      ]

      const reusedAssetIds = new Set(
        (
          await db.boardItems
            .filter(
              (item) =>
                item.type === 'image' &&
                assetIds.includes(item.assetId) &&
                !boardIds.includes(item.boardId),
            )
            .toArray()
        ).map((item) => (item.type === 'image' ? item.assetId : '')),
      )
      const orphanAssetIds = assetIds.filter((assetId) => !reusedAssetIds.has(assetId))

      await db.boardItems.bulkDelete(boardItems.map((item) => item.id))
      await db.boards.bulkDelete(boardIds)
      await db.levels.delete(levelId)

      if (orphanAssetIds.length > 0) {
        await db.assets.bulkDelete(orphanAssetIds)
      }
    })
  },
}
