import render from '../utils/render'

class Progress {
  element: HTMLElement

  constructor(private isVertical: boolean) {
    this.toHtml()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__progress"></div>
    `)
  }

  setStart(start: Number) {
    this.isVertical
      ? (this.element.style.top = start + '%')
      : (this.element.style.left = start + '%')
  }
  setEnd(end: number) {
    this.isVertical
      ? (this.element.style.bottom = 100 - end + '%')
      : (this.element.style.right = 100 - end + '%')
  }

  setStyle(start: number, end: number) {
    this.setStart(start)
    this.setEnd(end)
  }

  setOrientation(isVertical: boolean) {
    this.isVertical = isVertical
  }
}

export default Progress
