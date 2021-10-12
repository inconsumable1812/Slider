import { ModelOptions, ViewOptions } from './type'

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  valueStart: 44,
  valueEnd: 80,
  range: false
}

const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  scalePointCount: 11,
  showTooltip: true,
  isVertical: false,
  showProgress: false,
  showScale: true
}

export { DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS }
