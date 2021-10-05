import { DEFAULT_MODEL_OPTIONS } from '../default'
import { ModelOptions } from '../type'

import Observer from '../observer/Observer'

class Model extends Observer {
  constructor(private options: ModelOptions = DEFAULT_MODEL_OPTIONS) {
    super()
    this.checkMinValueLessMax()
    this.checkValueStartInRange()
    this.checkValueEndInRange()
    this.checkValueStartLessValueEnd()
    this.checkValueStartCorrectStep()
    this.checkValueEndCorrectStep()
  }

  getOptions(): ModelOptions {
    const { options } = this

    return options
  }

  setOptions(modelOptions: Partial<ModelOptions>) {
    this.options = { ...this.options, ...modelOptions }
    this.emit('modelValueChange', this.options)
  }

  checkMinValueLessMax() {
    const { minValue, maxValue, step } = this.options
    if (minValue === maxValue) {
      return this.setOptions({ maxValue: minValue + step })
    } else if (minValue > maxValue) {
      return this.setOptions({ minValue: maxValue - step })
    }
  }

  checkValueStartInRange() {
    const { minValue, maxValue, step, valueStart } = this.options
    if (valueStart < minValue) {
      return this.setOptions({ valueStart: minValue })
    } else if (valueStart > maxValue) {
      return this.setOptions({ valueStart: maxValue - step })
    }
  }

  checkValueEndInRange() {
    const { minValue, maxValue, step, valueEnd } = this.options
    if (valueEnd < minValue) {
      return this.setOptions({ valueEnd: minValue + step })
    } else if (valueEnd > maxValue) {
      return this.setOptions({ valueEnd: maxValue })
    }
  }

  checkValueStartLessValueEnd() {
    const { minValue, maxValue, step, valueEnd, valueStart } = this.options
    if (valueStart === valueEnd) {
      if (valueEnd === maxValue) {
        return this.setOptions({ valueStart: valueStart - step })
      } else if (valueStart === minValue) {
        return this.setOptions({ valueEnd: valueEnd + step })
      } else {
        return this.setOptions({ valueEnd: valueEnd + step })
      }
    } else if (valueStart > valueEnd) {
      return this.setOptions({ valueStart: minValue })
    }
  }

  checkValueStartCorrectStep() {
    const { minValue, step, valueStart } = this.options
    if (valueStart % step) {
      return this.setOptions({ valueStart: minValue })
    }
  }

  checkValueEndCorrectStep() {
    const { maxValue, step, valueEnd } = this.options
    if (valueEnd % step) {
      return this.setOptions({ valueEnd: maxValue })
    }
  }
}

export default Model
