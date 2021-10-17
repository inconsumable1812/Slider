import Panel from './panel/Panel'
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
  showTooltip: boolean
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
  showTooltip?: boolean
  isVertical?: boolean
  showProgress?: boolean
  showScale?: boolean
}

type Slider = {
  getContainer(): HTMLElement
  getViewRoot(): HTMLElement
  getOptions(): sliderOptions
  setOptions(options: sliderOptions): void
  getFirstValue(): number
  getSecondValue(): number
  addControlPanel(): Panel
}

export { ModelOptions, ViewOptions, ViewComponents, sliderOptions, Slider }
