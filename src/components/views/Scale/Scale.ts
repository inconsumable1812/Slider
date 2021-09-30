import render from '../utils/render'

class Scale {
  element: HTMLElement
  subElement: HTMLElement
  endElement: HTMLElement

  constructor(
    private minValue: number,
    private maxValue: number,
    private scalePointCount: number,
    private step: number
  ) {
    this.toHtml()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__scale"></div>
    `)

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

  private checkStep(): number {
    const { minValue, maxValue, scalePointCount, step } = this
    const stepsCount = Math.abs((maxValue - minValue) / step)
    let actualStep = step
    if (stepsCount > scalePointCount) {
      actualStep = step * Math.ceil(stepsCount / (scalePointCount - 1))
    }

    return actualStep
  }

  private calculateStepValue(): number[][] {
    const { minValue, maxValue } = this
    const step = this.checkStep()
    const range = Math.abs(maxValue - minValue)
    const isLastStepBigThanMaxValue = range % step
    let countOfSteps = Math.floor(Math.abs(range / step))
    countOfSteps = isLastStepBigThanMaxValue ? countOfSteps + 1 : countOfSteps

    const arrayOfStepsValue = []
    const arrayOfStepsStyleValue = []
    for (let i = 0; i <= countOfSteps; i++) {
      let stepsValue = minValue + step * i
      stepsValue = stepsValue > maxValue ? maxValue : stepsValue
      arrayOfStepsValue.push(stepsValue)

      let stepStyleValue = Math.abs(step / range) * i * 100
      stepStyleValue = stepStyleValue > 100 ? 100 : +stepStyleValue.toFixed(2)
      arrayOfStepsStyleValue.push(stepStyleValue)
    }
    const arrayOfValue = [arrayOfStepsValue, arrayOfStepsStyleValue]
    console.log(arrayOfValue)
    return arrayOfValue
  }
}

export default Scale
