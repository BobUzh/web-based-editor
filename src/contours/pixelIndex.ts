import type { ContourPoint, PixelIndex } from './types'

export type PixelCoordinate = ContourPoint

export function pointToPixelIndex(point: PixelCoordinate, width: number): PixelIndex {
  return point.y * width + point.x
}

export function pixelIndexToPoint(index: PixelIndex, width: number): PixelCoordinate {
  return {
    x: index % width,
    y: Math.floor(index / width),
  }
}
