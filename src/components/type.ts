import Handle from './views/handle/Handle'
import Progress from './views/progress/Progress'
import Scale from './views/Scale/Scale'
import Track from './views/Track/Track'

type ModelOptions = {
  minValue: number
  maxValue: number
  step: number
  valueStart: number
  valueEnd: number
  range: boolean
}

type ViewOptions = {
  scalePointCount: number
  isTooltipDisabled: boolean
  isVertical: boolean
  showProgress: boolean
  showScale: boolean
}

type ViewComponents = {
  track: Track
  firstHandle: Handle
  secondHandle?: Handle
  progress?: Progress
  scale?: Scale
}

type sliderOptions = {
  minValue?: number
  maxValue?: number
  step?: number
  valueStart?: number
  valueEnd?: number
  range?: boolean
  scalePointCount?: number
  isTooltipDisabled?: boolean
  isVertical?: boolean
  showProgress?: boolean
  showScale?: boolean
}

export { ModelOptions, ViewOptions, ViewComponents, sliderOptions }
