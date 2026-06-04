import { useEffect, useRef } from 'react'
import { Canvas } from 'fabric'

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 1024

export function CanvasContainer() {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasElementRef.current) {
      return
    }

    const canvas = new Canvas(canvasElementRef.current, {
      backgroundColor: '#ffffff',
      height: CANVAS_HEIGHT,
      selection: false,
      width: CANVAS_WIDTH,
    })

    canvas.renderAll()

    return () => {
      void canvas.dispose()
    }
  }, [])

  return (
    <div className="aspect-square w-full max-w-[min(74vh,1024px)] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
      <canvas ref={canvasElementRef} className="h-full w-full" />
    </div>
  )
}
