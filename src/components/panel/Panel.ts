import render from '../views/utils/render'

class Panel {
  root: HTMLElement
  elements: any
  inputs: any
  track: any

  constructor(private selector: Element, private slider: any) {
    this.render()
    this.getTrack()
    this.setValueWhenClickOnSlider()
  }

  private getTrack() {
    this.track = this.slider.getContainer().querySelector('.range-slider')
  }

  private setValueWhenClickOnSlider() {
    this.track.addEventListener('mousedown', () => {
      this.inputs.valueStart.value = this.slider.getFirstValue()
      this.inputs.valueEnd.value = this.slider.getSecondValue()
    })

    this.track.addEventListener('mousemove', () => {
      this.inputs.valueStart.value = this.slider.getFirstValue()
      this.inputs.valueEnd.value = this.slider.getSecondValue()
    })

    this.track.addEventListener('click', () => {
      this.inputs.valueStart.value = this.slider.getFirstValue()
      this.inputs.valueEnd.value = this.slider.getSecondValue()
    })
  }

  render() {
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
      tooltipDisabledEl: render(`
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
      tooltipDisabledEl,
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
    this.root.append(tooltipDisabledEl)
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
      isTooltipDisabled: tooltipDisabledEl.querySelector('input'),
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

  private setOptionsFromSlider() {
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
    } = this.slider.getOptions()

    this.inputs.maxValue.value = maxValue
    this.inputs.minValue.value = minValue
    this.inputs.valueStart.value = valueStart
    this.inputs.valueEnd.value = valueEnd
    this.inputs.isTooltipDisabled.checked = !isTooltipDisabled
    this.inputs.range.checked = range
    this.inputs.step.value = step
    this.inputs.showScale.checked = showScale
    this.inputs.scalePointCount.value = scalePointCount
    this.inputs.showProgress.checked = showProgress
    this.inputs.isVertical.checked = isVertical
  }

  // private getInputsOptions() {
  //   const {
  //     scalePointCount,
  //     isTooltipDisabled,
  //     isVertical,
  //     showProgress,
  //     showScale,
  //     minValue,
  //     maxValue,
  //     step,
  //     valueStart,
  //     valueEnd,
  //     range
  //   } = this.inputs

  //   console.log()

  //   return {
  //     maxValue: maxValue.value === '' ? undefined : Number(maxValue.value),
  //     minValue: Number(minValue.value),
  //     valueStart: Number(valueStart.value),
  //     valueEnd: Number(valueEnd.value),
  //     isTooltipDisabled: isTooltipDisabled.checked,
  //     range: range.checked,
  //     step: Number(step.value),
  //     showScale: showScale.checked,
  //     scalePointCount: Number(scalePointCount.value),
  //     showProgress: showProgress.checked,
  //     isVertical: isVertical.checked
  //   }
  // }

  private getMaxValue() {
    const { maxValue } = this.inputs
    return { maxValue: maxValue.value === '' ? undefined : Number(maxValue.value) }
  }

  private getMinValue() {
    const { minValue } = this.inputs
    return { minValue: minValue.value === '' ? undefined : Number(minValue.value) }
  }

  private getValueStart() {
    const { valueStart } = this.inputs
    return { valueStart: valueStart.value === '' ? undefined : Number(valueStart.value) }
  }

  private getValueEnd() {
    const { valueEnd } = this.inputs
    return { valueEnd: valueEnd.value === '' ? undefined : Number(valueEnd.value) }
  }

  private getStep() {
    const { step } = this.inputs
    return { step: step.value === '' ? undefined : Number(step.value) }
  }

  private getScaleCount() {
    const { scalePointCount } = this.inputs
    return {
      scalePointCount:
        scalePointCount.value === '' ? undefined : Number(scalePointCount.value)
    }
  }

  private addListeners() {
    // MaxValue
    this.inputs.maxValue.addEventListener('change', () => {
      const isUndefined = this.getMaxValue().maxValue

      if (isUndefined === undefined) {
        const previousValue = this.slider.getOptions().maxValue
        this.inputs.maxValue.value = previousValue
      } else if (isUndefined !== undefined) {
        this.slider.setOptions(this.getMaxValue())
      }
    })

    // MinValue
    this.inputs.minValue.addEventListener('change', () => {
      const isUndefined = this.getMinValue().minValue

      if (isUndefined === undefined) {
        const previousValue = this.slider.getOptions().minValue
        this.inputs.minValue.value = previousValue
      } else if (isUndefined !== undefined) {
        this.slider.setOptions(this.getMinValue())
      }
    })

    // ValueStart
    this.inputs.valueStart.addEventListener('change', () => {
      const isUndefined = this.getValueStart().valueStart

      if (isUndefined === undefined) {
        const previousValue = this.slider.getOptions().valueStart
        this.inputs.valueStart.value = previousValue
      } else if (isUndefined !== undefined) {
        this.slider.setOptions(this.getValueStart())
      }
    })

    // ValueEnd
    this.inputs.valueEnd.addEventListener('change', () => {
      const maxValue = this.getMaxValue().maxValue
      const previousValue = this.slider.getOptions().valueEnd
      const isUndefined = this.getValueEnd().valueEnd
      const newValueBiggerThanMax = this.getValueEnd().valueEnd > maxValue

      const newValue = newValueBiggerThanMax
        ? { valueEnd: previousValue }
        : this.getValueEnd()

      if (isUndefined === undefined || newValueBiggerThanMax) {
        this.inputs.valueEnd.value = previousValue
      } else if (isUndefined !== undefined) {
        this.slider.setOptions(newValue)
      }
    })

    // Step
    this.inputs.step.addEventListener('change', () => {
      const isUndefined = this.getStep().step
      const previousValue = this.slider.getOptions().step
      const newStep = this.getStep().step < 1 ? { step: previousValue } : this.getStep()

      if (isUndefined === undefined || this.getStep().step < 1) {
        this.inputs.step.value = previousValue
      } else if (isUndefined !== undefined) {
        this.slider.setOptions(newStep)
      }
    })

    // ScaleCount
    this.inputs.scalePointCount.addEventListener('change', () => {
      const isUndefined = this.getScaleCount().scalePointCount
      const previousValue = this.slider.getOptions().scalePointCount
      const newScaleCount =
        this.getScaleCount().scalePointCount < 2
          ? { scalePointCount: previousValue }
          : this.getScaleCount()

      if (isUndefined === undefined || this.getScaleCount().scalePointCount < 2) {
        this.inputs.scalePointCount.value = previousValue
      } else if (isUndefined !== undefined) {
        this.slider.setOptions(newScaleCount)
      }
    })
  }
}

export default Panel
