import { create } from 'zustand'
import { levelRepository } from '../repositories/levelRepository'
import { settingsRepository } from '../repositories/settingsRepository'
import type { BoardSection } from '../types/board'
import type { Level, NewLevelInput, UpdateLevelInput } from '../types/level'

type AppState = {
  initialized: boolean
  levels: Level[]
  activeSection: BoardSection
  activeLevelId?: string
  isAddLevelOpen: boolean
  syncLevels: (levels: Level[]) => void
  setActiveSection: (section: BoardSection) => Promise<void>
  setActiveLevel: (levelId: string) => Promise<void>
  openAddLevelModal: () => void
  closeAddLevelModal: () => void
  createLevel: (input: NewLevelInput) => Promise<void>
  updateLevel: (levelId: string, input: UpdateLevelInput) => Promise<void>
  reorderLevels: (orderedLevelIds: string[]) => Promise<void>
  deleteLevel: (levelId: string) => Promise<void>
}

const initialSettings = settingsRepository.getSettings()

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  levels: [],
  activeSection: initialSettings.activeSection ?? 'research',
  activeLevelId: initialSettings.activeLevelId,
  isAddLevelOpen: false,

  syncLevels(levels) {
    const activeLevelId = get().activeLevelId
    const nextActiveLevelId = levels.some((level) => level.id === activeLevelId)
      ? activeLevelId
      : levels[0]?.id
    set({ initialized: true, levels, activeLevelId: nextActiveLevelId })
  },

  async setActiveSection(section) {
    const activeLevelId = get().activeLevelId
    set({ activeSection: section })
    settingsRepository.updateActiveContext(section, activeLevelId)
  },

  async setActiveLevel(levelId) {
    const activeSection = get().activeSection
    set({ activeLevelId: levelId })
    settingsRepository.updateActiveContext(activeSection, levelId)
  },

  openAddLevelModal() {
    set({ isAddLevelOpen: true })
  },

  closeAddLevelModal() {
    set({ isAddLevelOpen: false })
  },

  async createLevel(input) {
    const level = await levelRepository.createLevel(input)
    const activeSection = get().activeSection
    set((state) => ({
      levels: [...state.levels, level].sort((a, b) => a.number.localeCompare(b.number)),
      activeLevelId: level.id,
      isAddLevelOpen: false,
    }))
    settingsRepository.updateActiveContext(activeSection, level.id)
  },

  async updateLevel(levelId, input) {
    const level = await levelRepository.updateLevel(levelId, input)
    set((state) => ({
      levels: state.levels
        .map((currentLevel) => (currentLevel.id === levelId ? level : currentLevel))
        .sort((a, b) => a.number.localeCompare(b.number)),
    }))
  },

  async reorderLevels(orderedLevelIds) {
    const levelById = new Map(get().levels.map((level) => [level.id, level]))
    const reorderedLevels = orderedLevelIds
      .map((levelId, index) => {
        const level = levelById.get(levelId)
        return level ? { ...level, number: String(index + 1).padStart(2, '0') } : undefined
      })
      .filter((level): level is Level => Boolean(level))
    set({ levels: reorderedLevels })
    await levelRepository.reorderLevels(orderedLevelIds)
  },

  async deleteLevel(levelId) {
    await levelRepository.deleteLevel(levelId)

    const { activeLevelId, activeSection, levels } = get()
    const deletedIndex = levels.findIndex((level) => level.id === levelId)
    const remainingLevels = levels.filter((level) => level.id !== levelId)
    const nextActiveLevelId =
      activeLevelId === levelId
        ? remainingLevels[deletedIndex]?.id ?? remainingLevels[deletedIndex - 1]?.id
        : activeLevelId

    set({
      levels: remainingLevels,
      activeLevelId: nextActiveLevelId,
    })
    settingsRepository.updateActiveContext(activeSection, nextActiveLevelId)
  },
}))
