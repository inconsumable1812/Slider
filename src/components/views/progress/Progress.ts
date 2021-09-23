import render from '../utils/render'

class Progress {
  element: HTMLElement

  constructor() {
    this.toHtml()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__progress"></div>
    `)
  }
}

export default Progress
