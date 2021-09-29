import { DEFAULT_MODEL_OPTIONS } from '../default'
import { ModelOptions } from '../type'

import Observer from '../observer/Observer'

class Model extends Observer {
  constructor(private options: ModelOptions = DEFAULT_MODEL_OPTIONS) {
    super()
    this.checkMinValueLessMax(
      this.options.minValue,
      this.options.maxValue,
      this.options.step
    )
    this.checkValueStartInRange(
      this.options.minValue,
      this.options.maxValue,
      this.options.step,
      this.options.valueStart
    )
    this.checkValueEndInRange(
      this.options.minValue,
      this.options.maxValue,
      this.options.step,
      this.options.valueEnd
    )
    this.checkValueStartLessValueEnd(
      this.options.valueStart,
      this.options.valueEnd,
      this.options.step,
      this.options.minValue,
      this.options.maxValue
    )
  }

  getOptions(): ModelOptions {
    const { options } = this

    return options
  }

  setOptions(modelOptions: Partial<ModelOptions>) {
    this.options = { ...this.options, ...modelOptions }
  }

  checkMinValueLessMax(minValue: number, maxValue: number, step: number) {
    if (minValue === maxValue) {
      return this.setOptions({ maxValue: minValue + step })
    } else if (minValue > maxValue) {
      return this.setOptions({ minValue: maxValue - step })
    }
  }

  checkValueStartInRange(
    minValue: number,
    maxValue: number,
    step: number,
    valueStart: number
  ) {
    if (valueStart < minValue) {
      return this.setOptions({ valueStart: minValue })
    } else if (valueStart > maxValue) {
      return this.setOptions({ valueStart: maxValue - step })
    }
  }

  checkValueEndInRange(
    minValue: number,
    maxValue: number,
    step: number,
    valueEnd: number
  ) {
    if (valueEnd < minValue) {
      return this.setOptions({ valueEnd: minValue + step })
    } else if (valueEnd > maxValue) {
      return this.setOptions({ valueEnd: maxValue })
    }
  }

  checkValueStartLessValueEnd(
    valueStart: number,
    valueEnd: number,
    step: number,
    minValue: number,
    maxValue: number
  ) {
    if (valueStart === valueEnd) {
      if (valueEnd === maxValue) {
        return this.setOptions({ valueStart: valueStart - step })
      } else if (valueStart === minValue) {
        return this.setOptions({ valueEnd: valueEnd + step })
      } else {
        return this.setOptions({ valueEnd: valueEnd + step })
      }
    } else if (valueStart > valueEnd) {
      return this.setOptions({ valueStart: valueStart - step })
    }
  }
}

export default Model
