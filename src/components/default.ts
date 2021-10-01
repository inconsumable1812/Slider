import { ModelOptions, ViewOptions } from './type'

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  minValue: 20,
  maxValue: 100,
  step: 15,
  valueStart: 0,
  valueEnd: 100,
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
