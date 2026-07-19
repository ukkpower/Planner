import { api } from '../../convex/_generated/api'
import { convex } from '../lib/convex'
import type { NewLevelInput, UpdateLevelInput } from '../types/level'

function cleanOptional(value?: string) {
  return value?.trim() || undefined
}

export const levelRepository = {
  async createLevel(input: NewLevelInput) {
    return convex.mutation(api.levels.create, {
      number: input.number.trim(),
      name: input.name.trim(),
      theme: cleanOptional(input.theme),
      description: cleanOptional(input.description),
      notes: cleanOptional(input.notes),
    })
  },

  async updateLevel(levelId: string, input: UpdateLevelInput) {
    return convex.mutation(api.levels.update, {
      levelId,
      number: input.number.trim(),
      name: input.name.trim(),
      theme: cleanOptional(input.theme),
      description: cleanOptional(input.description),
      notes: cleanOptional(input.notes),
    })
  },

  async reorderLevels(orderedLevelIds: string[]) {
    await convex.mutation(api.levels.reorder, { orderedLevelIds })
  },

  async deleteLevel(levelId: string) {
    await convex.mutation(api.levels.remove, { levelId })
  },
}
