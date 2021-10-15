import Observer from '../../observer/Observer'
import calculateNewValue from '../utils/calculateNewValue'
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
      const widthOrHeight = isVertical
        ? target.getBoundingClientRect().height
        : target.getBoundingClientRect().width

      const borderWidthPx = getComputedStyle(target).borderWidth
      const borderWidth = Math.round(+borderWidthPx.slice(0, -2))
      const offset = isVertical
        ? event.offsetY + borderWidth
        : event.offsetX + borderWidth

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

  getStep() {
    return this.step
  }

  getOrientation() {
    return this.isVertical
  }

  setMaxMinValueAndStep(maxValue: number, minValue: number, step: number) {
    this.maxValue = maxValue
    this.minValue = minValue
    this.step = step
  }

  setOrientation(isVertical: boolean) {
    this.isVertical = isVertical
  }
}

export default Track
