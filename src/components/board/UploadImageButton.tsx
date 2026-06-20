import { ImagePlus } from 'lucide-react'
import { useRef, useState } from 'react'
import { useBoardStore } from '../../stores/useBoardStore'

type UploadImageButtonProps = {
  disabled?: boolean
}

export function UploadImageButton({ disabled }: UploadImageButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const addImages = useBoardStore((state) => state.addImages)
  const [busy, setBusy] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return
    }

    setBusy(true)
    try {
      await addImages(files)
    } finally {
      setBusy(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#88c39d] px-4 text-sm font-semibold text-[#111419] transition hover:bg-[#a1d9b3] disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ImagePlus size={18} />
        {busy ? 'Adding...' : 'Upload Image'}
      </button>
    </>
  )
}
