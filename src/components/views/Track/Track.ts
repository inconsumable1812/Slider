import render from '../utils/render'

class Track {
  element: HTMLElement

  constructor() {
    this.toHtml()
  }
  toHtml(): void {
    this.element = render(`<div class="range-slider__track"></div>`)
  }
}

export default Track
