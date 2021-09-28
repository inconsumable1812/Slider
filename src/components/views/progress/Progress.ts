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

  setStart(start: Number) {
    this.element.style.left = start + '%'
  }
  setEnd(end: number) {
    this.element.style.right = 100 - end + '%'
  }

  setStyle(start: number, end: number) {
    this.setStart(start)
    this.setEnd(end)
  }
}

export default Progress
