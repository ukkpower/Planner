export type Asset = {
  id: string
  kind: 'image'
  blob: Blob
  mimeType: string
  fileName: string
  width?: number
  height?: number
  createdAt: string
}
