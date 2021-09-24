import render from '../utils/render'

class Handle {
  private elements: { handle: HTMLElement; tooltip: HTMLElement }
  element: HTMLElement

  constructor(
    public handleNumber: number = 1,
    public value: string | number = '10%',
    private isVertical?: boolean
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
  }

  getElement(): HTMLElement {
    return this.elements.handle
  }

  getValue(): number | string {
    return this.value
  }

  setValue(value: number) {
    this.value = value
    this.elements.tooltip.textContent = this.value.toString()
  }
}

export default Handle
