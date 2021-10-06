import render from '../utils/render'

class Handle {
  private elements: { handle: HTMLElement; tooltip: HTMLElement }
  element: HTMLElement

  constructor(
    public handleNumber: number = 1,
    public value: number = 10,
    private isTooltipDisabled: boolean = false,
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
    if (this.isTooltipDisabled) {
      this.elements.tooltip.remove()
    }
  }

  getElement(): HTMLElement {
    return this.elements.handle
  }

  getValue(): number {
    return +this.value
  }

  getStyleValue(): number {
    return +this.elements.handle.style.left.slice(0, -1)
  }

  setValue(value: number) {
    this.value = value
    this.elements.tooltip.textContent = this.value.toString()
  }
  setStyle(value: number) {
    this.elements.handle.style.left = value + '%'
  }

  updateValue(value: number): void {
    // this.movePin(pxValue);

    this.elements.tooltip.textContent = String(value)
  }
}

export default Handle
