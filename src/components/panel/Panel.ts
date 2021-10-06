import render from '../views/utils/render'

class Panel {
  root: HTMLElement
  elements: any
  inputs: any
  constructor(private selector: Element, private sliderOptions?: any) {
    this.render()
  }

  render() {
    this.root = render(`
    <div class="panel"></div>
    `)
    this.elements = {
      maxValue: render(`
        <div class="panel__input-max panel__option">Max value
        <input type="number" value=5>
        </div>
        `),
      minValue: render(`
        <div class="panel__input-min panel__option">Min value
        <input type="number" value=5>
        </div>
      `),
      firstValue: render(`
        <div class="panel__value-first panel__option">First value
        <input type="number" value=5>
        </div>
      `),
      secondValue: render(`
        <div class="panel__value-second panel__option">Second value
        <input type="number" value=5>
        </div>
      `),
      tooltipDisabled: render(`
        <div class="panel__tooltip panel__option">Show tooltip
        <input type="checkbox">
        </div>
      `),
      range: render(`
        <div class="panel__range panel__option">Range
        <input type="checkbox">
        </div>
      `),
      step: render(`
      <div class="panel__step panel__option">Step
      <input type="number" value=1>
      </div>
      `),
      showScale: render(`
        <div class="panel__scale-show panel__option">Show scale
        <input type="checkbox">
        </div>
      `),
      scalePoint: render(`
        <div class="panel__scale-point panel__option">Scale point
        <input type="number" value=1>
        </div>
      `),
      progress: render(`
        <div class="panel__progress panel__option">Show progress
        <input type="checkbox">
        </div>
      `),
      vertical: render(`
        <div class="panel__vertical panel__option">Is vertical
        <input type="checkbox">
        </div>
        `)
    }

    const {
      maxValue,
      minValue,
      firstValue,
      secondValue,
      tooltipDisabled,
      range,
      step,
      showScale,
      scalePoint,
      progress,
      vertical
    } = this.elements

    this.root.append(maxValue)
    this.root.append(minValue)
    this.root.append(firstValue)
    this.root.append(secondValue)
    this.root.append(tooltipDisabled)
    this.root.append(range)
    this.root.append(step)
    this.root.append(showScale)
    this.root.append(scalePoint)
    this.root.append(progress)
    this.root.append(vertical)

    this.selector.append(this.root)

    this.inputs = {
      maxInput: maxValue.querySelector('input'),
      minInput: minValue.querySelector('input'),
      firstInput: firstValue.querySelector('input'),
      secondInput: secondValue.querySelector('input'),
      tooltipInput: tooltipDisabled.querySelector('input'),
      rangeInput: range.querySelector('input'),
      stepInput: step.querySelector('input'),
      scaleInput: showScale.querySelector('input'),
      scalePointInput: scalePoint.querySelector('input'),
      progressInput: progress.querySelector('input'),
      verticalInput: vertical.querySelector('input')
    }
    Object.values(this.inputs).forEach((input) =>
      (input as HTMLElement).addEventListener('change', () => this.getInputsOptions())
    )

    this.setOptionsFromSlider()
  }

  private setOptionsFromSlider() {
    let {
      maxInput,
      minInput,
      firstInput,
      secondInput,
      tooltipInput,
      rangeInput,
      stepInput,
      scaleInput,
      scalePointInput,
      progressInput,
      verticalInput
    } = this.inputs

    const {
      scalePointCount,
      isTooltipDisabled,
      isVertical,
      showProgress,
      showScale,
      minValue,
      maxValue,
      step,
      valueStart,
      valueEnd,
      range
    } = this.sliderOptions

    maxInput.value = maxValue
    minInput.value = minValue
    firstInput.value = valueStart
    secondInput.value = valueEnd
    tooltipInput.checked = !isTooltipDisabled
    rangeInput.checked = range
    stepInput.value = step
    scaleInput.checked = showScale
    scalePointInput.value = scalePointCount
    progressInput.checked = showProgress
    verticalInput.checked = isVertical
  }

  private getInputsOptions() {
    const {
      maxInput,
      minInput,
      firstInput,
      secondInput,
      tooltipInput,
      rangeInput,
      stepInput,
      scaleInput,
      scalePointInput,
      progressInput,
      verticalInput
    } = this.inputs
    return console.log({
      maxInput: Number(maxInput.value),
      minInput: Number(minInput.value),
      firstInput: Number(firstInput.value),
      secondInput: Number(secondInput.value),
      tooltipInput: tooltipInput.checked,
      rangeInput: rangeInput.checked,
      stepInput: Number(stepInput.value),
      scaleInput: scaleInput.checked,
      scalePointInput: Number(scalePointInput.value),
      progressInput: progressInput.checked,
      verticalInput: verticalInput.checked
    })
  }
}

export default Panel
