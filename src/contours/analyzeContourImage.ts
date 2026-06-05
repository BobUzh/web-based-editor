import type { ContourAnalysisOptions, ContourBounds, ContourComponent, ContourModel, PixelIndex } from './types'

const DEFAULT_LINE_THRESHOLD = 160
const DEFAULT_MIN_COMPONENT_PIXELS = 1
const UNASSIGNED_PIXEL = -1

type MutableBounds = ContourBounds

function createEmptyBounds(): MutableBounds {
  return {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  }
}

function expandBounds(bounds: MutableBounds, x: number, y: number) {
  bounds.minX = Math.min(bounds.minX, x)
  bounds.minY = Math.min(bounds.minY, y)
  bounds.maxX = Math.max(bounds.maxX, x)
  bounds.maxY = Math.max(bounds.maxY, y)
}

function getLuminance(red: number, green: number, blue: number) {
  return red * 0.299 + green * 0.587 + blue * 0.114
}

function createSourceImageId(imageData: ImageData) {
  let hash = 2166136261
  const data = imageData.data

  for (let index = 0; index < data.length; index += 4) {
    hash ^= data[index] ?? 0
    hash = Math.imul(hash, 16777619)
    hash ^= data[index + 1] ?? 0
    hash = Math.imul(hash, 16777619)
    hash ^= data[index + 2] ?? 0
    hash = Math.imul(hash, 16777619)
    hash ^= data[index + 3] ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return `image-data-${imageData.width}x${imageData.height}-${(hash >>> 0).toString(16)}`
}

function buildLineMask(imageData: ImageData, lineThreshold: number) {
  const { data, width, height } = imageData
  const lineMask = new Uint8Array(width * height)

  for (let pixelIndex = 0; pixelIndex < lineMask.length; pixelIndex += 1) {
    const dataIndex = pixelIndex * 4
    const alpha = data[dataIndex + 3] ?? 0

    if (alpha <= 0) {
      continue
    }

    const luminance = getLuminance(data[dataIndex] ?? 255, data[dataIndex + 1] ?? 255, data[dataIndex + 2] ?? 255)

    if (luminance < lineThreshold) {
      lineMask[pixelIndex] = 1
    }
  }

  return lineMask
}

function findConnectedComponents(lineMask: Uint8Array, width: number, height: number, minComponentPixels: number) {
  const componentIndexByPixel = new Int32Array(lineMask.length)
  const queue = new Int32Array(lineMask.length)
  const components: ContourComponent[] = []

  componentIndexByPixel.fill(UNASSIGNED_PIXEL)

  for (let startIndex = 0; startIndex < lineMask.length; startIndex += 1) {
    if (lineMask[startIndex] === 0 || componentIndexByPixel[startIndex] !== UNASSIGNED_PIXEL) {
      continue
    }

    const componentPixelIndices: PixelIndex[] = []
    const bounds = createEmptyBounds()
    let queueStart = 0
    let queueEnd = 0

    queue[queueEnd] = startIndex
    queueEnd += 1
    componentIndexByPixel[startIndex] = -2

    while (queueStart < queueEnd) {
      const pixelIndex = queue[queueStart]
      queueStart += 1

      componentPixelIndices.push(pixelIndex)

      const x = pixelIndex % width
      const y = Math.floor(pixelIndex / width)
      expandBounds(bounds, x, y)

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        const nextY = y + offsetY

        if (nextY < 0 || nextY >= height) {
          continue
        }

        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) {
            continue
          }

          const nextX = x + offsetX

          if (nextX < 0 || nextX >= width) {
            continue
          }

          const nextIndex = nextY * width + nextX

          if (lineMask[nextIndex] === 0 || componentIndexByPixel[nextIndex] !== UNASSIGNED_PIXEL) {
            continue
          }

          componentIndexByPixel[nextIndex] = -2
          queue[queueEnd] = nextIndex
          queueEnd += 1
        }
      }
    }

    if (componentPixelIndices.length < minComponentPixels) {
      for (const pixelIndex of componentPixelIndices) {
        componentIndexByPixel[pixelIndex] = UNASSIGNED_PIXEL
        lineMask[pixelIndex] = 0
      }

      continue
    }

    const componentIndex = components.length
    const componentId = `component-${componentIndex}`

    for (const pixelIndex of componentPixelIndices) {
      componentIndexByPixel[pixelIndex] = componentIndex
    }

    components.push({
      id: componentId,
      pixelIndices: componentPixelIndices,
      splitPointIds: [],
      segmentIds: [],
      bounds,
    })
  }

  return { componentIndexByPixel, components }
}

export function analyzeContourImage(imageData: ImageData, options: ContourAnalysisOptions = {}): ContourModel {
  const lineThreshold = options.lineThreshold ?? DEFAULT_LINE_THRESHOLD
  const minComponentPixels = options.minComponentPixels ?? DEFAULT_MIN_COMPONENT_PIXELS
  const { width, height } = imageData
  const lineMask = buildLineMask(imageData, lineThreshold)
  const { componentIndexByPixel, components } = findConnectedComponents(lineMask, width, height, minComponentPixels)
  const segmentIndexByPixel = new Int32Array(width * height)
  const splitPointIndexByPixel = new Int32Array(width * height)

  segmentIndexByPixel.fill(UNASSIGNED_PIXEL)
  splitPointIndexByPixel.fill(UNASSIGNED_PIXEL)

  // TODO: Phase 2 will detect editable split points: endpoints, intersections, and corners.
  // TODO: Phase 2 will extract contour segments between split points.
  // TODO: Phase 2 will populate segmentIndexByPixel after segment extraction.
  // TODO: Phase 2 will populate splitPointIndexByPixel after split point detection.

  return {
    version: 1,
    width,
    height,
    sourceImageId: createSourceImageId(imageData),
    lineMask,
    componentIndexByPixel,
    segmentIndexByPixel,
    splitPointIndexByPixel,
    components,
    segments: [],
    splitPoints: [],
  }
}
