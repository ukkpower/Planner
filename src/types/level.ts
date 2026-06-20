export type Level = {
  id: string
  number: string
  name: string
  theme?: string
  description?: string
  notes?: string
  coverAssetId?: string
  createdAt: string
  updatedAt: string
}

export type NewLevelInput = {
  number: string
  name: string
  theme?: string
  description?: string
  notes?: string
}
