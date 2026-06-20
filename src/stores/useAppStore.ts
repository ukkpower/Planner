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
  initialize: () => Promise<void>
  setActiveSection: (section: BoardSection) => Promise<void>
  setActiveLevel: (levelId: string) => Promise<void>
  openAddLevelModal: () => void
  closeAddLevelModal: () => void
  createLevel: (input: NewLevelInput) => Promise<void>
  updateLevel: (levelId: string, input: UpdateLevelInput) => Promise<void>
  reorderLevels: (orderedLevelIds: string[]) => Promise<void>
  deleteLevel: (levelId: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  levels: [],
  activeSection: 'research',
  activeLevelId: undefined,
  isAddLevelOpen: false,

  async initialize() {
    const [levels, settings] = await Promise.all([
      levelRepository.listLevels(),
      settingsRepository.getSettings(),
    ])
    const activeLevelId = levels.some((level) => level.id === settings.activeLevelId)
      ? settings.activeLevelId
      : levels[0]?.id

    set({
      initialized: true,
      levels,
      activeSection: settings.activeSection ?? 'research',
      activeLevelId,
    })
  },

  async setActiveSection(section) {
    const activeLevelId = get().activeLevelId
    set({ activeSection: section })
    await settingsRepository.updateActiveContext(section, activeLevelId)
  },

  async setActiveLevel(levelId) {
    const activeSection = get().activeSection
    set({ activeLevelId: levelId })
    await settingsRepository.updateActiveContext(activeSection, levelId)
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
    await settingsRepository.updateActiveContext(activeSection, level.id)
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
    const reorderedLevels = await levelRepository.reorderLevels(orderedLevelIds)
    set({ levels: reorderedLevels })
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
    await settingsRepository.updateActiveContext(activeSection, nextActiveLevelId)
  },
}))
