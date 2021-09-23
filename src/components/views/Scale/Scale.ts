import render from '../utils/render'

class Scale {
  element: HTMLElement

  constructor() {
    this.toHtml()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__scale">
      <div class="range-slider__scale_point">0</div>
      <div class="range-slider__scale_point">50</div>
      <div class="range-slider__scale_point">100</div>
    </div>
    `)
  }
}

export default Scale
