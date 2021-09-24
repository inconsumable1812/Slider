import render from '../utils/render'

class Track {
  element: HTMLElement

  constructor(
    private minValue: number,
    private maxValue: number,
    private isVertical: boolean
  ) {
    this.toHtml()
  }
  toHtml(): void {
    this.element = render(`<div class="range-slider__track"></div>`)

    const clickEvent = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const { minValue, maxValue, isVertical } = this
      const widthOrHeight = target.getBoundingClientRect().width
      const borderWidthPx = getComputedStyle(target).borderWidth
      const borderWidth = Math.round(+borderWidthPx.slice(0, -2))
      const offset = event.offsetX + borderWidth

      const progress = offset / widthOrHeight
      const newValue = calculateNewValue(minValue, maxValue, progress)
      // console.log(progress)
    }

    this.element.addEventListener('mousedown', clickEvent)
  }
}

export default Track
function calculateNewValue(minValue: number, maxValue: number, progress: number) {
  const newVal = +((maxValue - minValue) * progress).toFixed(0)
  console.log(newVal)
}
