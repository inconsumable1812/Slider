import { ModelOptions, ViewOptions } from './type'

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  minValue: 0,
  maxValue: 100,
  step: 15,
  valueStart: 30,
  valueEnd: 80,
  range: true
}

const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  scalePointCount: 11,
  isTooltipDisabled: false,
  isVertical: false,
  showProgress: true,
  showScale: true
}

export { DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS }
