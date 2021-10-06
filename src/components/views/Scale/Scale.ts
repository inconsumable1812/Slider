import Observer from '../../observer/Observer'
import render from '../utils/render'

class Scale extends Observer {
  element: HTMLElement
  subElement: HTMLElement
  endElement: HTMLElement

  constructor(
    private minValue: number,
    private maxValue: number,
    private scalePointCount: number,
    private step: number
  ) {
    super()
    this.init()
  }

  private init() {
    this.toHtml()
    this.renderScalePoint()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__scale"></div>
    `)

    // const arrayOfValue = this.calculateStepValue()
    // console.log(arrayOfValue)

    // const arrayOfStepsValue = arrayOfValue[0]
    // const arrayOfStepsStyleValue = arrayOfValue[1]
    // const actualCount = arrayOfStepsValue.length

    // for (let i = 0; i < actualCount; i++) {
    //   this.subElement = render(`
    //   <div class="range-slider__scale_point">${arrayOfStepsValue[i]}</div>
    // `)
    //   this.subElement.style.left = arrayOfStepsStyleValue[i] + '%'
    //   this.element.append(this.subElement)
    // }
  }

  private renderScalePoint() {
    const arrayOfValue = this.calculateStepValue()
    const arrayOfStepsValue = arrayOfValue[0]
    const arrayOfStepsStyleValue = arrayOfValue[1]
    const actualCount = arrayOfStepsValue.length

    for (let i = 0; i < actualCount; i++) {
      this.subElement = render(`
      <div class="range-slider__scale_point">${arrayOfStepsValue[i]}</div>
    `)
      this.subElement.style.left = arrayOfStepsStyleValue[i] + '%'
      this.element.append(this.subElement)
    }
  }

  deleteScalePoint() {
    const points = this.element.querySelectorAll('.range-slider__scale_point')
    for (let point of points) {
      point.remove()
    }
  }

  private calculateStepValue(): number[][] {
    const { minValue, maxValue, step, scalePointCount } = this
    const range = Math.abs(maxValue - minValue)
    const isLastStepBigThanMaxValue = range % step
    const isCountBigThanScalePoint = Math.floor(Math.abs(range / step)) > scalePointCount
    const actualScaleSize = isCountBigThanScalePoint
      ? Math.floor(Math.abs(range / step)) / (scalePointCount - 1)
      : step
    let countOfSteps = isCountBigThanScalePoint
      ? scalePointCount - 1
      : Math.floor(Math.abs(range / step))

    countOfSteps = isLastStepBigThanMaxValue ? countOfSteps + 1 : countOfSteps

    const arrayOfStepsValue = []
    const arrayOfStepsStyleValue = []
    for (let i = 0; i <= countOfSteps; i++) {
      let stepsValue = minValue + actualScaleSize * i
      stepsValue = stepsValue > maxValue ? maxValue : stepsValue
      arrayOfStepsValue.push(stepsValue)

      let stepStyleValue = Math.abs(actualScaleSize / range) * i * 100
      stepStyleValue = stepStyleValue > 100 ? 100 : +stepStyleValue.toFixed(2)
      arrayOfStepsStyleValue.push(stepStyleValue)
    }
    const arrayOfValue = [arrayOfStepsValue, arrayOfStepsStyleValue]

    return arrayOfValue
  }

  public getArrayOfValue() {
    return this.calculateStepValue()[0]
  }

  getMaxValue() {
    return this.maxValue
  }
  getMinValue() {
    return this.minValue
  }

  setMaxMinValue(maxValue: number, minValue: number) {
    this.maxValue = maxValue
    this.minValue = minValue
    this.deleteScalePoint()
    this.renderScalePoint()
  }
}

export default Scale
