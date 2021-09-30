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
      console.log(progress)

      const newValue = calculateNewValue(minValue, maxValue, progress)

      this.emit('clickOnTrack', { event, value: newValue })
    }

    this.element.addEventListener('mousedown', clickEvent)
  }

  getMinValue() {
    return this.minValue
  }

  getMaxValue() {
    return this.maxValue
  }
}

export default Track
function calculateNewValue(minValue: number, maxValue: number, progress: number) {
  const range = maxValue - minValue

  return +((maxValue - minValue) * progress + minValue).toFixed(0)
}
