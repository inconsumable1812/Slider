import render from '../utils/render'

class Handle {
  private elements: { handle: HTMLElement; tooltip: HTMLElement }
  element: HTMLElement

  constructor(
    public handleNumber: number = 1,
    public value: string | number = '10%',
    private isVertical?: boolean,
    private container?: HTMLElement
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

  // private movePin(): void {
  //   const {
  //     isVertical,
  //     elements: { tooltip },
  //     elements: { handle }
  //   } = this

  //   const sliderSize = Math.max(handle.clientWidth, handle.clientHeight)
  //   console.log(sliderSize)

  // tooltip.style[isVertical ? 'bottom' : 'left'] = `${(value / sliderSize) * 100}%`
  // }
}

export default Handle
