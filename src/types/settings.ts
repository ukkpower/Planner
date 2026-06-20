import type { BoardSection } from './board'

export type AppSettings = {
  id: 'app'
  activeSection?: BoardSection
  activeLevelId?: string
  canvasWidth: number
  canvasHeight: number
  updatedAt: string
}
