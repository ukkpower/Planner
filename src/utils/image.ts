export type ImageDimensions = {
  width: number
  height: number
}

export function getImageDimensions(file: Blob): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const dimensions = {
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      }
      URL.revokeObjectURL(url)
      resolve(dimensions)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image dimensions.'))
    }

    image.src = url
  })
}

export function getDefaultImageSize(dimensions: ImageDimensions) {
  const maxWidth = 460
  const maxHeight = 340
  const ratio = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height, 1)

  return {
    width: Math.max(160, Math.round(dimensions.width * ratio)),
    height: Math.max(120, Math.round(dimensions.height * ratio)),
  }
}
