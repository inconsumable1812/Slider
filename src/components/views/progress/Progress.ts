/* eslint-disable no-unused-expressions */
import render from '../utils/render'

class Progress {
  element!: HTMLElement

  constructor(private isVertical: boolean) {
    this.toHtml()
  }

  private toHtml(): void {
    this.element = render(`
    <div class="range-slider__progress"></div>
    `)
  }

  setStart(start: number): void {
    this.isVertical
      ? (this.element.style.top = start + '%')
      : (this.element.style.left = start + '%')
  }
  setEnd(end: number): void {
    this.isVertical
      ? (this.element.style.bottom = 100 - end + '%')
      : (this.element.style.right = 100 - end + '%')
  }

  setStyle(start: number, end: number): void {
    this.setStart(start)
    this.setEnd(end)
  }

  setOrientation(isVertical: boolean): void {
    this.isVertical = isVertical
  }
}

export default Progress
