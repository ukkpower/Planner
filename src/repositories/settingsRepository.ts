import { db } from '../db/db'
import type { BoardSection } from '../types/board'
import type { AppSettings } from '../types/settings'
import { nowIso } from '../utils/dates'

const defaultSettings: AppSettings = {
  id: 'app',
  activeSection: 'research',
  canvasWidth: 4000,
  canvasHeight: 3000,
  updatedAt: nowIso(),
}

export const settingsRepository = {
  async getSettings() {
    const existing = await db.settings.get('app')

    if (existing) {
      return existing
    }

    await db.settings.put(defaultSettings)
    return defaultSettings
  },

  async updateActiveContext(activeSection: BoardSection, activeLevelId?: string) {
    const current = await this.getSettings()
    await db.settings.put({
      ...current,
      activeSection,
      activeLevelId,
      updatedAt: nowIso(),
    })
  },
}
