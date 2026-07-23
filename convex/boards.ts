import { v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

const boardSection = v.union(v.literal('research'), v.literal('planning'), v.literal('final'))

function publicBoard(board: Doc<'boards'>) {
  return {
    id: board._id,
    levelId: board.levelId,
    section: board.section,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  }
}

function publicItem(item: Doc<'boardItems'>) {
  const common = {
    id: item._id,
    boardId: item.boardId,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    zIndex: item.zIndex,
    rotation: item.rotation,
    locked: item.locked,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }

  return item.type === 'image'
    ? { ...common, type: item.type, assetId: item.assetId, alt: item.alt }
    : {
        ...common,
        type: item.type,
        text: item.text,
        color: item.color,
        fontSize: item.fontSize,
      }
}

export const get = query({
  args: { levelId: v.string(), section: boardSection },
  handler: async (ctx, args) => {
    const levelId = ctx.db.normalizeId('levels', args.levelId)
    if (!levelId) return null

    const board = await ctx.db
      .query('boards')
      .withIndex('by_level_and_section', (queryBuilder) =>
        queryBuilder.eq('levelId', levelId).eq('section', args.section),
      )
      .unique()
    if (!board) return null

    const items = await ctx.db
      .query('boardItems')
      .withIndex('by_board', (queryBuilder) => queryBuilder.eq('boardId', board._id))
      .collect()
    items.sort((a, b) => a.zIndex - b.zIndex)

    const assets = await Promise.all(
      items
        .filter((item) => item.type === 'image')
        .map(async (item) => {
          const asset = await ctx.db.get(item.assetId)
          if (!asset) return null
          return {
            id: asset._id,
            kind: asset.kind,
            mimeType: asset.mimeType,
            fileName: asset.fileName,
            width: asset.width,
            height: asset.height,
            createdAt: asset.createdAt,
            url: await ctx.storage.getUrl(asset.storageId),
          }
        }),
    )

    return {
      board: publicBoard(board),
      items: items.map(publicItem),
      assets: assets.filter((asset) => asset !== null),
    }
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
})

export const addImage = mutation({
  args: {
    boardId: v.string(),
    storageId: v.id('_storage'),
    mimeType: v.string(),
    fileName: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    x: v.number(),
    y: v.number(),
    displayWidth: v.number(),
    displayHeight: v.number(),
    zIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const boardId = ctx.db.normalizeId('boards', args.boardId)
    if (!boardId || !(await ctx.db.get(boardId))) throw new Error('Board not found.')

    const timestamp = new Date().toISOString()
    const assetId = await ctx.db.insert('assets', {
      kind: 'image',
      storageId: args.storageId,
      mimeType: args.mimeType,
      fileName: args.fileName,
      width: args.width,
      height: args.height,
      createdAt: timestamp,
    })
    const itemId = await ctx.db.insert('boardItems', {
      boardId,
      type: 'image',
      assetId,
      alt: args.fileName,
      x: args.x,
      y: args.y,
      width: args.displayWidth,
      height: args.displayHeight,
      zIndex: args.zIndex,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    return { itemId, assetId }
  },
})

export const addText = mutation({
  args: {
    boardId: v.string(),
    text: v.string(),
    color: v.string(),
    fontSize: v.number(),
    x: v.number(),
    y: v.number(),
    width: v.number(),
    height: v.number(),
    zIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const boardId = ctx.db.normalizeId('boards', args.boardId)
    if (!boardId || !(await ctx.db.get(boardId))) throw new Error('Board not found.')

    const timestamp = new Date().toISOString()
    const itemId = await ctx.db.insert('boardItems', {
      boardId,
      type: 'text',
      text: args.text,
      color: args.color,
      fontSize: args.fontSize,
      x: args.x,
      y: args.y,
      width: args.width,
      height: args.height,
      zIndex: args.zIndex,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    return { itemId }
  },
})

const itemUpdate = v.object({
  id: v.string(),
  x: v.number(),
  y: v.number(),
  width: v.number(),
  height: v.number(),
  zIndex: v.number(),
  rotation: v.optional(v.number()),
  locked: v.optional(v.boolean()),
  text: v.optional(v.string()),
  color: v.optional(v.string()),
  fontSize: v.optional(v.number()),
})

export const updateItems = mutation({
  args: { items: v.array(itemUpdate) },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString()
    await Promise.all(
      args.items.map(async (item) => {
        const itemId = ctx.db.normalizeId('boardItems', item.id)
        if (!itemId) return

        const existingItem = await ctx.db.get(itemId)
        if (!existingItem) return

        const frameUpdate = {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          zIndex: item.zIndex,
          rotation: item.rotation,
          locked: item.locked,
          updatedAt: timestamp,
        }

        if (existingItem.type === 'text') {
          await ctx.db.patch(itemId, {
            ...frameUpdate,
            text: item.text ?? existingItem.text,
            color: item.color ?? existingItem.color,
            fontSize: item.fontSize ?? existingItem.fontSize,
          })
          return
        }

        await ctx.db.patch(itemId, frameUpdate)
      }),
    )
  },
})

export const removeItem = mutation({
  args: { itemId: v.string() },
  handler: async (ctx, args) => {
    const itemId = ctx.db.normalizeId('boardItems', args.itemId)
    if (!itemId) return
    const item = await ctx.db.get(itemId)
    if (!item) return

    await ctx.db.delete(itemId)
    if (item.type === 'image') {
      const reused = await ctx.db
        .query('boardItems')
        .filter((queryBuilder) => queryBuilder.eq(queryBuilder.field('assetId'), item.assetId))
        .first()
      if (!reused) {
        const asset = await ctx.db.get(item.assetId)
        if (asset) {
          await ctx.storage.delete(asset.storageId)
          await ctx.db.delete(asset._id)
        }
      }
    }
  },
})
