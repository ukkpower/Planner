import type { BoardSection } from '../types/board'
import type { AppSettings } from '../types/settings'
import { nowIso } from '../utils/dates'

const storageKey = 'cosy-level-planner-settings'

const defaultSettings: AppSettings = {
  id: 'app',
  activeSection: 'research',
  canvasWidth: 4000,
  canvasHeight: 3000,
  updatedAt: nowIso(),
}

export const settingsRepository = {
  getSettings() {
    try {
      const storedSettings = localStorage.getItem(storageKey)
      if (storedSettings) {
        return { ...defaultSettings, ...JSON.parse(storedSettings) } as AppSettings
      }
    } catch {
      // Invalid or unavailable browser storage should not prevent the shared app from loading.
    }
    return defaultSettings
  },

  updateActiveContext(activeSection: BoardSection, activeLevelId?: string) {
    const current = this.getSettings()
    const settings: AppSettings = {
      ...current,
      activeSection,
      activeLevelId,
      updatedAt: nowIso(),
    }
    localStorage.setItem(storageKey, JSON.stringify(settings))
  },
}
