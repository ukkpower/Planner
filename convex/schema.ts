import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const boardSection = v.union(v.literal('research'), v.literal('planning'), v.literal('final'))

export default defineSchema({
  levels: defineTable({
    number: v.string(),
    name: v.string(),
    theme: v.optional(v.string()),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    coverAssetId: v.optional(v.id('assets')),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index('by_number', ['number']),

  boards: defineTable({
    levelId: v.id('levels'),
    section: boardSection,
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index('by_level_and_section', ['levelId', 'section']),

  boardItems: defineTable(
    v.union(
      v.object({
        boardId: v.id('boards'),
        type: v.literal('image'),
        assetId: v.id('assets'),
        alt: v.optional(v.string()),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        zIndex: v.number(),
        rotation: v.optional(v.number()),
        locked: v.optional(v.boolean()),
        createdAt: v.string(),
        updatedAt: v.string(),
      }),
      v.object({
        boardId: v.id('boards'),
        type: v.literal('text'),
        text: v.string(),
        color: v.optional(v.string()),
        fontSize: v.optional(v.number()),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        zIndex: v.number(),
        rotation: v.optional(v.number()),
        locked: v.optional(v.boolean()),
        createdAt: v.string(),
        updatedAt: v.string(),
      }),
    ),
  ).index('by_board', ['boardId']),

  assets: defineTable({
    kind: v.literal('image'),
    storageId: v.id('_storage'),
    mimeType: v.string(),
    fileName: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    createdAt: v.string(),
  }),
})
