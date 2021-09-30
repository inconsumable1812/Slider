import { ModelOptions, ViewOptions } from './type'

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  minValue: 30,
  maxValue: 100,
  step: 1,
  valueStart: 50,
  valueEnd: 80,
  range: false
}

const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  scalePointCount: 11,
  isTooltipDisabled: false,
  isVertical: false,
  showProgress: true,
  showScale: true
}

export { DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS }
