import render from '../utils/render'

class Scale {
  element: HTMLElement

  constructor(private minValue: number, private maxValue: number) {
    this.toHtml()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__scale">
      <div class="range-slider__scale_point">${this.minValue}</div>
      <div class="range-slider__scale_point">50?</div>
      <div class="range-slider__scale_point">${this.maxValue}</div>
    </div>
    `)
  }
}

export default Scale
