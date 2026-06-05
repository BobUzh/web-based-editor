export type PixelIndex = number

export type ContourComponentId = string
export type ContourSegmentId = string
export type ContourSplitPointId = string

export type ContourPoint = {
  x: number
  y: number
}

export type ContourBounds = {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export type ContourSplitPointKind = 'endpoint' | 'intersection' | 'corner'

export type ContourSplitPoint = {
  id: ContourSplitPointId
  kind: ContourSplitPointKind
  componentId: ContourComponentId
  center: ContourPoint
  pixelIndices: PixelIndex[]
  bounds: ContourBounds
  connectedSegmentIds: ContourSegmentId[]
}

export type ContourSegment = {
  id: ContourSegmentId
  componentId: ContourComponentId
  startSplitPointId: ContourSplitPointId | null
  endSplitPointId: ContourSplitPointId | null
  isClosed: boolean
  pixelIndices: PixelIndex[]
  bounds: ContourBounds
  thicknessEstimate?: number
}

export type ContourComponent = {
  id: ContourComponentId
  pixelIndices: PixelIndex[]
  splitPointIds: ContourSplitPointId[]
  segmentIds: ContourSegmentId[]
  bounds: ContourBounds
}

export type ContourModel = {
  version: 1
  width: number
  height: number
  sourceImageId: string

  lineMask: Uint8Array

  componentIndexByPixel: Int32Array
  segmentIndexByPixel: Int32Array
  splitPointIndexByPixel: Int32Array

  components: ContourComponent[]
  segments: ContourSegment[]
  splitPoints: ContourSplitPoint[]
}

export type ContourAnalysisOptions = {
  lineThreshold?: number
  minComponentPixels?: number
  intersectionRadius?: number
  cornerAngleThresholdDegrees?: number
  minCornerDistancePixels?: number
}
