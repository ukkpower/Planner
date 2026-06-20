export type BoardSection = 'research' | 'planning' | 'final'

export type Board = {
  id: string
  levelId: string
  section: BoardSection
  createdAt: string
  updatedAt: string
}

export type BoardItemBase = {
  id: string
  boardId: string
  type: 'image' | 'text'
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  rotation?: number
  locked?: boolean
  createdAt: string
  updatedAt: string
}

export type ImageBoardItem = BoardItemBase & {
  type: 'image'
  assetId: string
  alt?: string
}

export type TextBoardItem = BoardItemBase & {
  type: 'text'
  text: string
  color?: string
  fontSize?: number
}

export type BoardItem = ImageBoardItem | TextBoardItem

export const boardSections: BoardSection[] = ['research', 'planning', 'final']

export const sectionLabels: Record<BoardSection, string> = {
  research: 'Research',
  planning: 'Planning',
  final: 'Final',
}
