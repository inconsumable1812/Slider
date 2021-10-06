import Observer from '../../observer/Observer'
import render from '../utils/render'

class Track extends Observer {
  element: HTMLElement

  constructor(
    private minValue: number,
    private maxValue: number,
    private isVertical: boolean,
    private step: number
  ) {
    super()
    this.toHtml()
  }
  toHtml(): void {
    this.element = render(`<div class="range-slider__track"></div>`)

    const clickEvent = (event: MouseEvent) => {
      event.preventDefault()
      const target = event.target as HTMLElement
      const { minValue, maxValue, isVertical, step } = this
      const widthOrHeight = target.getBoundingClientRect().width
      const borderWidthPx = getComputedStyle(target).borderWidth
      const borderWidth = Math.round(+borderWidthPx.slice(0, -2))
      const offset = event.offsetX + borderWidth

      const progress = offset / widthOrHeight

      const newValue = calculateNewValue(minValue, maxValue, progress, step)

      this.emit('clickOnTrack', { event, value: newValue, click: progress })
    }

    this.element.addEventListener('mousedown', clickEvent)
  }

  getMinValue() {
    return this.minValue
  }

  getMaxValue() {
    return this.maxValue
  }
  setMaxMinValueAndStep(maxValue: number, minValue: number, step: number) {
    this.maxValue = maxValue
    this.minValue = minValue
    this.step = step
  }
}

export default Track

function calculateNewValue(
  minValue: number,
  maxValue: number,
  progress: number,
  step: number
) {
  let progressValue = Math.round((maxValue - minValue) * progress + minValue)
  let isCorrectNewValue = !((progressValue - minValue) % step)
  let value = progressValue

  let i = 1
  while (!isCorrectNewValue) {
    if ((progressValue - minValue) % step <= step / 2) {
      isCorrectNewValue = !((progressValue - i - minValue) % step)
      value = progressValue - i
      if (
        value + step > maxValue &&
        maxValue - progressValue < Math.abs(value - progressValue)
      ) {
        value = maxValue
        break
      }
      i++
    } else if ((progressValue - minValue) % step > step / 2) {
      isCorrectNewValue = !((progressValue + i - minValue) % step)
      value = progressValue + i
      i++
    } else {
      break
    }
  }

  return value
}
