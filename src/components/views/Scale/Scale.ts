import render from '../utils/render'

class Scale {
  element: HTMLElement
  subElement: HTMLElement
  endElement: HTMLElement

  constructor(
    private minValue: number,
    private maxValue: number,
    private scalePointCount: number = 2
  ) {
    this.toHtml()
  }

  toHtml(): void {
    this.element = render(`
    <div class="range-slider__scale">
    </div>
    `)

    let correctionValue = 0
    let styleValue = 0
    for (let i = 0; i < this.scalePointCount - 1; i++) {
      this.subElement = render(`
      <div class="range-slider__scale_point">${this.minValue + correctionValue}</div>
    `)
      styleValue = 100 / (this.scalePointCount - 1)
      correctionValue = +(
        ((this.maxValue - this.minValue) * (styleValue * (i + 1))) /
        100
      ).toFixed(0)
      this.subElement.style.left = styleValue * i + '%'

      this.element.append(this.subElement)
    }

    this.endElement = render(`
    <div class="range-slider__scale_point">${this.maxValue}</div>
    `)
    this.endElement.style.left = 100 + '%'

    this.element.append(this.endElement)
  }
}

export default Scale

// this.element = render(`
// <div class="range-slider__scale">
//   <div class="range-slider__scale_point">${this.minValue}</div>
//   <div class="range-slider__scale_point">50?</div>
//   <div class="range-slider__scale_point">${this.maxValue}</div>
// </div>
// `)
