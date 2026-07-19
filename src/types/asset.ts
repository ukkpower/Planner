export type Asset = {
  id: string
  kind: 'image'
  mimeType: string
  fileName: string
  width?: number
  height?: number
  createdAt: string
  url?: string | null
}
