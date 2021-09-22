import Observer from '../observer/Observer'

class Model extends Observer {
  constructor(private options: ModelOptions = DEFAULT_MODEL_OPTIONS) {
    super()
    //this.init(options)
  }

  // init(options: ModelOptions): void {
  //   this.options = { ...options }

  //   // console.log(this.options)

  //   // const { minValue, maxValue, step } = this.getOptions();
  //   // this.options.steps = calculateSteps({ minValue, maxValue, step });
  // }

  getOptions(): ModelOptions {
    const { options } = this

    console.log(options)
    return { ...options }
  }

  // private initValues() {
  //   const { minValue, stepSize, handlerCount } = this.options

  //   this.values = []

  //   for (let i = 0; i < handlerCount; i += 1) {
  //     this.values[i] = minValue + i * stepSize * this.directionMod
  //   }
  // }
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
  minValue: 0,
  maxValue: 100,
  step: 1,
  value: [50, 100],
  steps: 10,
  range: false
}
