import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

const boardSections = ['research', 'planning', 'final'] as const

function publicLevel(level: Doc<'levels'>) {
  return {
    id: level._id,
    number: level.number,
    name: level.name,
    theme: level.theme,
    description: level.description,
    notes: level.notes,
    coverAssetId: level.coverAssetId,
    createdAt: level.createdAt,
    updatedAt: level.updatedAt,
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const levels = await ctx.db.query('levels').withIndex('by_number').collect()
    return levels.map(publicLevel)
  },
})

export const create = mutation({
  args: {
    number: v.string(),
    name: v.string(),
    theme: v.optional(v.string()),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString()
    const levelId = await ctx.db.insert('levels', {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    await Promise.all(
      boardSections.map((section) =>
        ctx.db.insert('boards', {
          levelId,
          section,
          createdAt: timestamp,
          updatedAt: timestamp,
        }),
      ),
    )

    const level = await ctx.db.get(levelId)
    if (!level) throw new Error('Level could not be created.')
    return publicLevel(level)
  },
})

export const update = mutation({
  args: {
    levelId: v.string(),
    number: v.string(),
    name: v.string(),
    theme: v.optional(v.string()),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const levelId = ctx.db.normalizeId('levels', args.levelId)
    if (!levelId || !(await ctx.db.get(levelId))) throw new Error('Level not found.')

    await ctx.db.patch(levelId, {
      number: args.number,
      name: args.name,
      theme: args.theme,
      description: args.description,
      notes: args.notes,
      updatedAt: new Date().toISOString(),
    })

    const level = await ctx.db.get(levelId)
    if (!level) throw new Error('Level not found.')
    return publicLevel(level)
  },
})

export const reorder = mutation({
  args: { orderedLevelIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const levels = await ctx.db.query('levels').collect()
    const levelById = new Map(levels.map((level) => [level._id, level]))
    const orderedIds = args.orderedLevelIds.map((id) => ctx.db.normalizeId('levels', id))

    if (
      orderedIds.some((id) => !id) ||
      orderedIds.length !== levels.length ||
      orderedIds.some((id) => !levelById.has(id as Id<'levels'>))
    ) {
      throw new Error('Level order is out of date.')
    }

    const numericWidths = levels
      .map((level) => level.number.trim())
      .filter((number) => /^\d+$/.test(number))
      .map((number) => number.length)
    const numberWidth = Math.max(2, ...numericWidths)
    const timestamp = new Date().toISOString()

    await Promise.all(
      orderedIds.map(async (levelId, index) => {
        const level = levelById.get(levelId as Id<'levels'>)
        const number = String(index + 1).padStart(numberWidth, '0')
        if (level && level.number !== number) {
          await ctx.db.patch(level._id, { number, updatedAt: timestamp })
        }
      }),
    )
  },
})

export const remove = mutation({
  args: { levelId: v.string() },
  handler: async (ctx, args) => {
    const levelId = ctx.db.normalizeId('levels', args.levelId)
    if (!levelId) throw new Error('Level not found.')

    const boards = await ctx.db
      .query('boards')
      .filter((queryBuilder) => queryBuilder.eq(queryBuilder.field('levelId'), levelId))
      .collect()
    const assetIds = new Set<Id<'assets'>>()

    for (const board of boards) {
      const items = await ctx.db
        .query('boardItems')
        .withIndex('by_board', (queryBuilder) => queryBuilder.eq('boardId', board._id))
        .collect()

      for (const item of items) {
        if (item.type === 'image') assetIds.add(item.assetId)
        await ctx.db.delete(item._id)
      }
      await ctx.db.delete(board._id)
    }

    for (const assetId of assetIds) {
      const reused = await ctx.db
        .query('boardItems')
        .filter((queryBuilder) => queryBuilder.eq(queryBuilder.field('assetId'), assetId))
        .first()
      if (!reused) {
        const asset = await ctx.db.get(assetId)
        if (asset) {
          await ctx.storage.delete(asset.storageId)
          await ctx.db.delete(assetId)
        }
      }
    }

    await ctx.db.delete(levelId)
  },
})
