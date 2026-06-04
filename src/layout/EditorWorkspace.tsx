import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { CanvasContainer } from '../canvas/CanvasContainer'
import type { ToolId } from './types'

type EditorWorkspaceProps = {
  activeTool: ToolId
}

export function EditorWorkspace({ activeTool }: EditorWorkspaceProps) {
  const [isCanvasCreated, setIsCanvasCreated] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    setImageFile(selectedFile)
    setIsCanvasCreated(true)
  }

  const handleCreateBlankCanvas = () => {
    setImageFile(null)
    setIsCanvasCreated(true)
  }

  return (
    <main className="flex min-w-0 flex-1 items-center justify-center bg-slate-100 p-5">
      {isCanvasCreated ? (
        <CanvasContainer imageFile={imageFile} activeTool={activeTool} />
      ) : (
        <section className="flex aspect-square w-full max-w-[min(74vh,900px)] items-center justify-center rounded-lg border border-slate-300 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-12 w-12 rounded-md border border-dashed border-slate-300 bg-slate-50"
              aria-hidden="true"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                onClick={handleUploadClick}
              >
                Upload Image
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                onClick={handleCreateBlankCanvas}
              >
                Create Blank Canvas
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </section>
      )}
    </main>
  )
}
