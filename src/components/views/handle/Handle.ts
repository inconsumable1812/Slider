import render from '../utils/render'

class Handle {
  private elements: { handle: HTMLElement; tooltip: HTMLElement }
  element: HTMLElement

  constructor(
    public handleNumber: number = 1,
    public value: number = 10,
    private showTooltip: boolean = true,
    private isVertical: boolean = false
  ) {
    this.toHtml()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__handle range-slider__handle_num_${this.handleNumber}">
      <div class="range-slider__tooltip js-range-slider__tooltip">${this.value}</div>
    </div>`)
    this.elements = {
      handle: this.element,
      tooltip: this.element.querySelector(`.js-range-slider__tooltip`) as HTMLElement
    }
    if (!this.showTooltip) {
      this.hideTooltip()
    }
  }

  showTooltipMethod() {
    this.elements.tooltip.classList.remove('range-slider__tooltip_hide')
  }

  hideTooltip() {
    this.elements.tooltip.classList.add('range-slider__tooltip_hide')
  }

  getElement(): HTMLElement {
    return this.elements.handle
  }

  getValue(): number {
    return +this.value
  }

  getStyleValue(): number {
    return this.isVertical
      ? +this.elements.handle.style.top.slice(0, -1)
      : +this.elements.handle.style.left.slice(0, -1)
  }

  setValue(value: number) {
    this.value = value
    this.elements.tooltip.textContent = this.value.toString()
  }
  setStyle(value: number) {
    this.isVertical
      ? (this.elements.handle.style.top = value + '%')
      : (this.elements.handle.style.left = value + '%')
  }

  clearStyle() {
    this.isVertical
      ? (this.elements.handle.style.left = -4.5 + 'px')
      : (this.elements.handle.style.top = -4.5 + 'px')
  }

  setOrientation(isVertical: boolean) {
    this.isVertical = isVertical
  }
}

export default Handle
