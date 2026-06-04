import { useEffect, useRef } from 'react'
import { Canvas, FabricImage, Point } from 'fabric'
import type { CanvasEvents, TMat2D } from 'fabric'
import type { ToolId } from '../layout/types'

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 1024
const MIN_ZOOM = 1
const MAX_ZOOM = 20
const ZOOM_STEP = 1.15

type CanvasContainerProps = {
  activeTool: ToolId
  imageFile?: File | null
}

function getClientPoint(event: MouseEvent | PointerEvent | TouchEvent) {
  if ('clientX' in event) {
    return { x: event.clientX, y: event.clientY }
  }

  const touch = event.touches[0] ?? event.changedTouches[0]

  if (!touch) {
    return null
  }

  return { x: touch.clientX, y: touch.clientY }
}

function clampViewportToWorkspace(canvas: Canvas) {
  const zoom = canvas.getZoom()

  if (zoom <= MIN_ZOOM) {
    canvas.setViewportTransform([MIN_ZOOM, 0, 0, MIN_ZOOM, 0, 0])
    return
  }

  const nextViewportTransform = [...canvas.viewportTransform] as TMat2D
  const minX = CANVAS_WIDTH - CANVAS_WIDTH * zoom
  const minY = CANVAS_HEIGHT - CANVAS_HEIGHT * zoom

  nextViewportTransform[4] = Math.min(0, Math.max(minX, nextViewportTransform[4]))
  nextViewportTransform[5] = Math.min(0, Math.max(minY, nextViewportTransform[5]))

  canvas.setViewportTransform(nextViewportTransform)
}

async function loadImageIntoCanvas(canvas: Canvas, imageFile: File, signal: AbortSignal) {
  const imageUrl = URL.createObjectURL(imageFile)

  try {
    const image = await FabricImage.fromURL(imageUrl, { signal })

    if (signal.aborted) {
      return
    }

    const imageWidth = image.width || CANVAS_WIDTH
    const imageHeight = image.height || CANVAS_HEIGHT
    const scale = Math.min(CANVAS_WIDTH / imageWidth, CANVAS_HEIGHT / imageHeight)

    image.set({
      evented: false,
      left: CANVAS_WIDTH / 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      top: CANVAS_HEIGHT / 2,
    })
    image.scale(scale)

    canvas.add(image)
    canvas.renderAll()
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

export function CanvasContainer({ activeTool, imageFile = null }: CanvasContainerProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRef = useRef<Canvas | null>(null)
  const isDraggingRef = useRef(false)
  const lastDragPointRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!canvasElementRef.current) {
      return
    }

    const abortController = new AbortController()
    const canvas = new Canvas(canvasElementRef.current, {
      backgroundColor: '#ffffff',
      height: CANVAS_HEIGHT,
      selection: false,
      width: CANVAS_WIDTH,
    })

    canvasRef.current = canvas
    canvas.renderAll()

    if (imageFile) {
      void loadImageIntoCanvas(canvas, imageFile, abortController.signal).catch((error: unknown) => {
        if (!abortController.signal.aborted) {
          console.error('Unable to load image into canvas.', error)
        }
      })
    }

    return () => {
      abortController.abort()
      canvasRef.current = null
      void canvas.dispose()
    }
  }, [imageFile])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const updateCursor = (cursor: 'grab' | 'grabbing' | 'default') => {
      canvas.defaultCursor = cursor
      canvas.hoverCursor = cursor
      canvas.upperCanvasEl.style.cursor = cursor
    }

    if (activeTool !== 'zoom') {
      isDraggingRef.current = false
      lastDragPointRef.current = null
      updateCursor('default')
      return
    }

    updateCursor('grab')
    clampViewportToWorkspace(canvas)
    canvas.requestRenderAll()

    const handleMouseWheel = ({ e, viewportPoint }: CanvasEvents['mouse:wheel']) => {
      e.preventDefault()
      e.stopPropagation()

      const currentZoom = canvas.getZoom()
      const unclampedZoom = e.deltaY < 0 ? currentZoom * ZOOM_STEP : currentZoom / ZOOM_STEP
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, unclampedZoom))

      if (nextZoom === currentZoom) {
        return
      }

      canvas.zoomToPoint(viewportPoint, nextZoom)
      clampViewportToWorkspace(canvas)
      canvas.requestRenderAll()
    }

    const handleMouseDown = ({ e }: CanvasEvents['mouse:down']) => {
      const point = getClientPoint(e)

      if (!point || canvas.getZoom() <= MIN_ZOOM) {
        return
      }

      isDraggingRef.current = true
      lastDragPointRef.current = point
      updateCursor('grabbing')
    }

    const handleMouseMove = ({ e }: CanvasEvents['mouse:move']) => {
      if (!isDraggingRef.current || !lastDragPointRef.current) {
        return
      }

      const nextPoint = getClientPoint(e)

      if (!nextPoint) {
        return
      }

      canvas.relativePan(new Point(nextPoint.x - lastDragPointRef.current.x, nextPoint.y - lastDragPointRef.current.y))
      clampViewportToWorkspace(canvas)
      lastDragPointRef.current = nextPoint
      canvas.requestRenderAll()
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      lastDragPointRef.current = null
      updateCursor('grab')
    }

    const disposeWheel = canvas.on('mouse:wheel', handleMouseWheel)
    const disposeDown = canvas.on('mouse:down', handleMouseDown)
    const disposeMove = canvas.on('mouse:move', handleMouseMove)
    const disposeUp = canvas.on('mouse:up', handleMouseUp)

    return () => {
      disposeWheel()
      disposeDown()
      disposeMove()
      disposeUp()
      isDraggingRef.current = false
      lastDragPointRef.current = null
    }
  }, [activeTool, imageFile])

  return (
    <div className="aspect-square w-full max-w-[min(74vh,1024px)] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm">
      <canvas ref={canvasElementRef} className="h-full w-full" />
    </div>
  )
}
