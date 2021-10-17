import { ModelOptions, panelElements, panelInputs, Slider, ViewOptions } from '../type'
import render from '../views/utils/render'

class Panel {
  root: HTMLElement
  elements: panelElements
  inputs: panelInputs
  track: HTMLElement

  constructor(private selector: Element, private slider: Slider) {}

  public init() {
    this.render()
    this.getTrack()
    this.setValueWhenClickOnSlider()
  }

  private getTrack(): void {
    this.track = this.slider.getViewRoot()
  }

  public getInputs(): panelInputs {
    return this.inputs
  }

  private setValueWhenClickOnSlider(): void {
    const setValue = () => {
      this.inputs.valueStart.value = this.slider.getFirstValue().toString()
      this.inputs.valueEnd.value = this.slider.getSecondValue().toString()
    }
    this.track.addEventListener('mousedown', () => {
      this.inputs.valueStart.value = this.slider.getFirstValue().toString()
      this.inputs.valueEnd.value = this.slider.getSecondValue().toString()
      document.addEventListener('mousemove', setValue)
    })
    this.track.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', setValue)
    })

    this.track.addEventListener('click', () => {
      this.inputs.valueStart.value = this.slider.getFirstValue().toString()
      this.inputs.valueEnd.value = this.slider.getSecondValue().toString()
    })
  }

  render(): void {
    this.root = render(`
    <div class="panel"></div>
    `)
    this.elements = {
      maxValueEl: render(`
        <div class="panel__input-max panel__option">Max value
        <input type="number" value=5>
        </div>
        `),
      minValueEl: render(`
        <div class="panel__input-min panel__option">Min value
        <input type="number" value=5>
        </div>
      `),
      firstValueEl: render(`
        <div class="panel__value-first panel__option">First value
        <input type="number" value=5>
        </div>
      `),
      secondValueEl: render(`
        <div class="panel__value-second panel__option">Second value
        <input type="number" value=5>
        </div>
      `),
      showTooltipEL: render(`
        <div class="panel__tooltip panel__option">Show tooltip
        <input type="checkbox">
        </div>
      `),
      rangeEl: render(`
        <div class="panel__range panel__option">Range
        <input type="checkbox">
        </div>
      `),
      stepEl: render(`
      <div class="panel__step panel__option">Step
      <input type="number" value=1>
      </div>
      `),
      showScaleEl: render(`
        <div class="panel__scale-show panel__option">Show scale
        <input type="checkbox">
        </div>
      `),
      scalePointEl: render(`
        <div class="panel__scale-point panel__option">Scale point
        <input type="number" value=1>
        </div>
      `),
      progressEl: render(`
        <div class="panel__progress panel__option">Show progress
        <input type="checkbox">
        </div>
      `),
      verticalEl: render(`
        <div class="panel__vertical panel__option">Is vertical
        <input type="checkbox">
        </div>
        `)
    }

    const {
      maxValueEl,
      minValueEl,
      firstValueEl,
      secondValueEl,
      showTooltipEL,
      rangeEl,
      stepEl,
      showScaleEl,
      scalePointEl,
      progressEl,
      verticalEl
    } = this.elements

    this.root.append(maxValueEl)
    this.root.append(minValueEl)
    this.root.append(firstValueEl)
    this.root.append(secondValueEl)
    this.root.append(showTooltipEL)
    this.root.append(rangeEl)
    this.root.append(stepEl)
    this.root.append(showScaleEl)
    this.root.append(scalePointEl)
    this.root.append(progressEl)
    this.root.append(verticalEl)

    this.selector.append(this.root)

    this.inputs = {
      maxValue: maxValueEl.querySelector('input'),
      minValue: minValueEl.querySelector('input'),
      valueStart: firstValueEl.querySelector('input'),
      valueEnd: secondValueEl.querySelector('input'),
      showTooltip: showTooltipEL.querySelector('input'),
      range: rangeEl.querySelector('input'),
      step: stepEl.querySelector('input'),
      showScale: showScaleEl.querySelector('input'),
      scalePointCount: scalePointEl.querySelector('input'),
      showProgress: progressEl.querySelector('input'),
      isVertical: verticalEl.querySelector('input')
    }

    this.addListeners()
    this.setOptionsFromSlider()
  }

  public setOptionsFromSlider(): void {
    const {
      scalePointCount,
      showTooltip,
      isVertical,
      showProgress,
      showScale,
      minValue,
      maxValue,
      step,
      valueStart,
      valueEnd,
      range
    } = this.slider.getOptions()

    this.inputs.maxValue.value = maxValue.toString()
    this.inputs.minValue.value = minValue.toString()
    this.inputs.valueStart.value = valueStart.toString()
    this.inputs.valueEnd.value = valueEnd.toString()
    this.inputs.valueEnd.disabled = !range.toString()
    this.inputs.showTooltip.checked = showTooltip
    this.inputs.range.checked = range
    this.inputs.step.value = step.toString()
    this.inputs.showScale.checked = showScale
    this.inputs.scalePointCount.value = scalePointCount.toString()
    this.inputs.showProgress.checked = showProgress
    this.inputs.isVertical.checked = isVertical
  }

  private getMaxValue(): Partial<ModelOptions> {
    const { maxValue } = this.inputs
    return { maxValue: maxValue.value === '' ? undefined : Number(maxValue.value) }
  }

  private getMinValue(): Partial<ModelOptions> {
    const { minValue } = this.inputs
    return { minValue: minValue.value === '' ? undefined : Number(minValue.value) }
  }

  private getValueStart(): Partial<ModelOptions> {
    const { valueStart } = this.inputs
    return { valueStart: valueStart.value === '' ? undefined : Number(valueStart.value) }
  }

  private getValueEnd(): Partial<ModelOptions> {
    const { valueEnd } = this.inputs
    return { valueEnd: valueEnd.value === '' ? undefined : Number(valueEnd.value) }
  }

  private getStep(): Partial<ModelOptions> {
    const { step } = this.inputs
    return { step: step.value === '' ? undefined : Number(step.value) }
  }

  private getScaleCount(): Partial<ViewOptions> {
    const { scalePointCount } = this.inputs
    return {
      scalePointCount:
        scalePointCount.value === '' ? undefined : Number(scalePointCount.value)
    }
  }

  private getRange(): Partial<ModelOptions> {
    const { range } = this.inputs
    return { range: range.checked }
  }

  private getProgress(): Partial<ViewOptions> {
    const { showProgress } = this.inputs
    return { showProgress: showProgress.checked }
  }

  private getTooltip(): Partial<ViewOptions> {
    const { showTooltip } = this.inputs
    return { showTooltip: showTooltip.checked }
  }

  private getScale(): Partial<ViewOptions> {
    const { showScale } = this.inputs
    return { showScale: showScale.checked }
  }

  private getVertical(): Partial<ViewOptions> {
    const { isVertical } = this.inputs
    return { isVertical: isVertical.checked }
  }

  private addListeners(): void {
    // MaxValue
    this.inputs.maxValue.addEventListener('change', () => {
      const isUndefined = this.getMaxValue().maxValue
      const previousValue = this.slider.getOptions().maxValue
      const MaxValueLessThanMin =
        this.getMaxValue().maxValue <= this.getMinValue().minValue
      const rangeLessThanStep =
        Math.abs(this.getMaxValue().maxValue - this.getMinValue().minValue) <
        this.getStep().step

      let newValue = MaxValueLessThanMin
        ? { maxValue: previousValue }
        : this.getMaxValue()
      newValue = rangeLessThanStep ? { maxValue: previousValue } : this.getMaxValue()

      if (isUndefined !== undefined) {
        this.slider.setOptions(newValue)
      }
    })

    // MinValue
    this.inputs.minValue.addEventListener('change', () => {
      const isUndefined = this.getMinValue().minValue

      const newValue = this.getMinValue()

      if (isUndefined !== undefined) {
        this.slider.setOptions(newValue)
      }
    })

    // ValueStart
    this.inputs.valueStart.addEventListener('change', () => {
      const range = this.inputs.range.checked
      const maxValue = this.getMaxValue().maxValue
      const isUndefined = this.getValueStart().valueStart
      const previousValue = this.slider.getOptions().valueStart
      const newValueBiggerThanMax = this.getValueStart().valueStart > maxValue
      const newValueBiggerThanSecond =
        this.getValueStart().valueStart >= this.getValueEnd().valueEnd

      let newValue = this.getValueStart()

      newValue = newValueBiggerThanMax ? { valueStart: maxValue } : this.getValueStart()

      newValue =
        newValueBiggerThanSecond && range
          ? { valueStart: previousValue }
          : this.getValueStart()

      if (isUndefined !== undefined) {
        this.slider.setOptions(newValue)
      }
    })

    // ValueEnd
    this.inputs.valueEnd.addEventListener('change', () => {
      const previousValue = this.slider.getOptions().valueEnd
      const isUndefined = this.getValueEnd().valueEnd
      const newValueLessThanFirst =
        this.getValueEnd().valueEnd <= this.getValueStart().valueStart

      let newValue = this.getValueEnd()
      newValue = newValueLessThanFirst ? { valueEnd: previousValue } : this.getValueEnd()

      if (isUndefined !== undefined) {
        this.slider.setOptions(newValue)
      }
    })

    // Step
    this.inputs.step.addEventListener('change', () => {
      const isUndefined = this.getStep().step
      const previousValue = this.slider.getOptions().step

      let newStep = this.getStep()
      const isStepBiggerRange =
        Math.abs(this.getMaxValue().maxValue - this.getMinValue().minValue) <=
        newStep.step
      newStep = isStepBiggerRange ? { step: previousValue } : this.getStep()

      if (isUndefined !== undefined) {
        this.slider.setOptions(newStep)
      }
    })

    // ScaleCount
    this.inputs.scalePointCount.addEventListener('change', () => {
      const isUndefined = this.getScaleCount().scalePointCount
      const newScaleCount = this.getScaleCount()

      if (isUndefined !== undefined) {
        this.slider.setOptions(newScaleCount)
      }
    })

    // Range
    this.inputs.range.addEventListener('change', () => {
      this.slider.setOptions(this.getRange())
      this.inputs.valueEnd.disabled = !this.getRange().range
    })

    // Progress
    this.inputs.showProgress.addEventListener('change', () => {
      this.slider.setOptions(this.getProgress())
    })

    // Tooltip
    this.inputs.showTooltip.addEventListener('change', () => {
      this.slider.setOptions(this.getTooltip())
    })

    //showScale
    this.inputs.showScale.addEventListener('change', () => {
      this.slider.setOptions(this.getScale())
    })

    //Vertical
    this.inputs.isVertical.addEventListener('change', () => {
      this.slider.setOptions(this.getVertical())
    })
  }
}

export default Panel
