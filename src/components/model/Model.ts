import Observer from '../observer/Observer'

class Model extends Observer {
  constructor(private options: ModelOptions = DEFAULT_MODEL_OPTIONS) {
    super()
  }

  getOptions(): ModelOptions {
    const { options } = this

    return options
  }

  setOptions(modelOptions: Partial<ModelOptions>) {
    this.options = { ...this.options, ...modelOptions }
  }
}

export default Model

type ModelOptions = {
  minValue: number
  maxValue: number
  step: number
  value: number[]
  steps: number
  range: boolean
}
const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  minValue: 20,
  maxValue: 100,
  step: 1,
  value: [50, 100],
  steps: 10,
  range: false
}
