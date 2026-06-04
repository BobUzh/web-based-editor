import { useState } from 'react'
import { CanvasContainer } from '../canvas/CanvasContainer'

export function EditorWorkspace() {
  const [isCanvasCreated, setIsCanvasCreated] = useState(false)

  return (
    <main className="flex min-w-0 flex-1 items-center justify-center bg-slate-100 p-5">
      {isCanvasCreated ? (
        <CanvasContainer />
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
              >
                Upload Image
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                onClick={() => setIsCanvasCreated(true)}
              >
                Create Blank Canvas
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
