import { ModelOptions, ViewComponents, ViewOptions } from '../type'
import { DEFAULT_VIEW_OPTIONS } from '../default'

import Observer from '../observer/Observer'
import Handle from './handle/Handle'
import Progress from './progress/Progress'
import Scale from './Scale/Scale'
import Track from './Track/Track'
import render from './utils/render'

class View extends Observer {
  private components: ViewComponents
  root: HTMLElement
  el: Element
  constructor(
    selector: Element,
    private modelOptions: ModelOptions,
    private viewOptions: ViewOptions = DEFAULT_VIEW_OPTIONS
  ) {
    super()
    this.el = selector
  }

  setOptions(viewOptions: Partial<ViewOptions>) {
    this.viewOptions = { ...this.viewOptions, ...viewOptions }
    this.emit('viewChanged', this.viewOptions)
  }

  changeModelOptions(modelOptions: Partial<ModelOptions>) {
    this.modelOptions = { ...this.modelOptions, ...modelOptions }
  }

  updateView() {
    const { minValue, maxValue, step, valueStart, valueEnd, range } = this.modelOptions
    const { scalePointCount, showTooltip, isVertical, showProgress, showScale } =
      this.viewOptions
    const { track, firstHandle, scale, progress } = this.components

    firstHandle.updateValue(valueStart)
    firstHandle.setStyle(this.searchStyleValue(minValue, maxValue, valueStart))

    if (showProgress) {
      if (this.components.progress === undefined) {
        this.components.progress = new Progress(isVertical)
      }
      track.element.append(this.components.progress.element)
      this.components.progress.setOrientation(isVertical)
    } else {
      if (this.components.progress !== undefined) {
        this.components.progress.element.remove()
      }
    }

    if (range) {
      if (this.components.secondHandle === undefined) {
        this.components.secondHandle = new Handle(
          2,
          this.modelOptions.valueEnd,
          this.viewOptions.showTooltip
        )
        this.bindListenersToHandle(this.components.secondHandle)
      }

      this.root.append(this.components.secondHandle.element)

      this.components.secondHandle.updateValue(valueEnd)
      this.components.secondHandle.setStyle(
        this.searchStyleValue(minValue, maxValue, valueEnd)
      )
      if (showProgress) {
        progress.setStyle(
          this.searchStyleValue(minValue, maxValue, valueStart),
          this.searchStyleValue(minValue, maxValue, valueEnd)
        )
      }
    } else {
      if (this.components.secondHandle !== undefined) {
        this.components.secondHandle.element.remove()
      }
      if (showProgress) {
        this.components.progress.setStyle(
          0,
          this.searchStyleValue(minValue, maxValue, valueStart)
        )
      }
    }

    if (
      showScale ||
      scale.getMaxValue() !== maxValue ||
      scale.getMinValue() !== minValue ||
      scale.getStep() !== step ||
      scale.getScaleCount() !== scalePointCount
    ) {
      scale.setScaleOptions(maxValue, minValue, step, scalePointCount)
    } else {
      scale.deleteScalePoint()
    }

    if (showTooltip) {
      firstHandle.showTooltipMethod()
      if (range) {
        this.components.secondHandle.showTooltipMethod()
      }
    } else {
      firstHandle.hideTooltip()
      if (range) {
        this.components.secondHandle.hideTooltip()
      }
    }

    track.setMaxMinValueAndStep(maxValue, minValue, step)

    const styleValueFirst = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      firstHandle.getValue()
    )

    if (range) {
      const styleValueSecond = this.searchStyleValue(
        track.getMinValue(),
        track.getMaxValue(),
        this.components.secondHandle.getValue() || 0
      )
      this.components.secondHandle.setOrientation(isVertical)
      this.components.secondHandle.clearStyle()
      this.components.secondHandle.setStyle(styleValueSecond)
    }

    scale.setOrientation(isVertical)
    scale.updateScalePoint()

    track.setOrientation(isVertical)
    firstHandle.setOrientation(isVertical)
    firstHandle.clearStyle()
    firstHandle.setStyle(styleValueFirst)
    if (showProgress) {
      this.components.progress.setOrientation(isVertical)
    }

    if (isVertical) {
      this.root.classList.add('range-slider_vertical')
    } else {
      this.root.classList.remove('range-slider_vertical')
    }
  }

  getModel() {
    return this.modelOptions
  }

  getOptions() {
    return this.viewOptions
  }

  render() {
    this.root = render(`
    <div class="range-slider">
    `)

    this.components = {
      track: new Track(
        this.modelOptions.minValue,
        this.modelOptions.maxValue,
        this.viewOptions.isVertical,
        this.modelOptions.step
      ),
      firstHandle: new Handle(
        1,
        this.modelOptions.valueStart,
        this.viewOptions.showTooltip
      )
    }

    if (this.modelOptions.range) {
      this.components.secondHandle = new Handle(
        2,
        this.modelOptions.valueEnd,
        this.viewOptions.showTooltip
      )
    }

    if (this.viewOptions.showProgress) {
      this.components.progress = new Progress(this.viewOptions.isVertical)
    }

    if (this.viewOptions.showScale) {
      this.components.scale = new Scale(
        this.modelOptions.minValue,
        this.modelOptions.maxValue,
        this.viewOptions.scalePointCount,
        this.modelOptions.step,
        this.viewOptions.isVertical
      )
    }
    this.init()
  }

  private init() {
    const { track, firstHandle, secondHandle, scale, progress } = this.components

    if (this.viewOptions.showProgress) {
      track.element.append(progress.element)
    }
    this.root.append(track.element)
    this.root.append(firstHandle.element)
    if (this.modelOptions.range) {
      this.root.append(secondHandle.element)
    }
    if (this.viewOptions.showScale) {
      this.root.append(scale.element)
    }

    const firstHandleStyleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      this.modelOptions.valueStart
    )
    const secondHandleStyleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      this.modelOptions.valueEnd
    )
    firstHandle.setStyle(firstHandleStyleValue)
    if (this.modelOptions.range) {
      secondHandle.setStyle(secondHandleStyleValue)
      if (this.viewOptions.showProgress) {
        progress.setStyle(firstHandleStyleValue, secondHandleStyleValue)
      }
    } else if (this.viewOptions.showProgress) {
      progress.setStyle(0, firstHandleStyleValue)
    }

    this.el.append(this.root)

    this.clickOnTrack()
    this.bindListenersToHandle(firstHandle)
    if (this.modelOptions.range) {
      this.bindListenersToHandle(secondHandle)
    }
    if (this.viewOptions.showScale) {
      this.clickOnScale(scale)
    }
    scale.subscribe('stepChanged', (newStep: number) =>
      this.emit('viewChanged', { step: newStep })
    )
  }

  private clickOnTrack(): void {
    const { track } = this.components

    track.subscribe(
      'clickOnTrack',
      ({ event, value, click }: { event: MouseEvent; value: number; click: number }) => {
        const { track, firstHandle, secondHandle, progress } = this.components
        let closetHandle = firstHandle
        const styleValue = this.searchStyleValue(
          track.getMinValue(),
          track.getMaxValue(),
          value
        )

        if (this.modelOptions.range) {
          closetHandle = this.findClosestHandle(firstHandle, secondHandle, value)

          if (
            click > styleValue / 100 &&
            firstHandle.getStyleValue() < styleValue &&
            Math.abs(firstHandle.getStyleValue() / 100 - click) >
              Math.abs(secondHandle.getStyleValue() / 100 - click)
          ) {
            closetHandle = secondHandle
          }
        }

        closetHandle.setValue(value)
        closetHandle.setStyle(styleValue)

        if (this.modelOptions.range && this.viewOptions.showProgress) {
          if (closetHandle === firstHandle) {
            progress.setStart(styleValue)
          } else if (closetHandle === secondHandle) {
            progress.setEnd(styleValue)
          }
        } else if (this.viewOptions.showProgress) {
          progress.setStart(0)
          progress.setEnd(styleValue)
        }
        if (closetHandle === firstHandle) {
          this.emit('viewChanged', { valueStart: closetHandle.getValue() })
        } else if (closetHandle === secondHandle) {
          this.emit('viewChanged', { valueEnd: closetHandle.getValue() })
        }

        this.handleMouseDown(event, closetHandle)
      }
    )
  }

  private findClosestHandle(
    firstHandle: Handle,
    secondHandle: Handle,
    clickValue: number
  ) {
    const firstValue = firstHandle.getValue()
    const secondValue = secondHandle.getValue()
    if (Math.abs(firstValue - clickValue) <= Math.abs(secondValue - clickValue)) {
      return firstHandle
    } else {
      return secondHandle
    }
  }

  private handleMouseDown(event: MouseEvent, handle: Handle) {
    event.preventDefault()

    const handleMouseMove = (event: MouseEvent) => this.handleMouseMove(event, handle)

    document.addEventListener('mousemove', handleMouseMove)

    const handleMouseUp = (): void => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }

    document.addEventListener('mouseup', handleMouseUp)
  }

  private handleMouseMove(event: MouseEvent, handle: Handle) {
    const { track, progress, firstHandle, secondHandle } = this.components
    const step = this.modelOptions.step
    const { isVertical } = this.viewOptions

    const prevValue = handle.getValue()

    const valueInPx = isVertical
      ? event.pageY - track.element.getBoundingClientRect().top
      : event.pageX - track.element.getBoundingClientRect().left

    const widthOrHeight = isVertical
      ? track.element.getBoundingClientRect().height
      : track.element.getBoundingClientRect().width

    const valueInPercent = valueInPx / widthOrHeight

    const delta = track.getMaxValue() - track.getMinValue()
    const isValueCorrectOfStep: boolean = !(Math.round(delta * valueInPercent) % step)

    let newValue = isValueCorrectOfStep
      ? Math.round(track.getMinValue() + delta * valueInPercent)
      : prevValue
    if (valueInPercent <= 0) {
      newValue = track.getMinValue()
    } else if (valueInPercent >= 1) {
      newValue = track.getMaxValue()

      this.emit('viewChanged', { valueEnd: newValue })
    }

    const styleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      newValue
    )

    if (this.modelOptions.range) {
      if (handle === firstHandle && newValue < secondHandle.getValue()) {
        handle.setValue(newValue)
        handle.setStyle(styleValue)
        if (this.viewOptions.showProgress) {
          progress.setStart(styleValue)
        }
      } else if (handle === secondHandle && newValue > firstHandle.getValue()) {
        handle.setValue(newValue)
        handle.setStyle(styleValue)

        if (this.viewOptions.showProgress) {
          progress.setEnd(styleValue)
        }
      }
    } else if (this.viewOptions.showProgress) {
      progress.setStart(0)
      progress.setEnd(styleValue)
    }
    if (!this.modelOptions.range) {
      handle.setValue(newValue)
      handle.setStyle(styleValue)
    }
    if (isValueCorrectOfStep) {
      if (handle === firstHandle) {
        this.emit('viewChanged', { valueStart: handle.getValue() })
      } else if (handle === secondHandle) {
        this.emit('viewChanged', { valueEnd: handle.getValue() })
      }
    }
  }

  private bindListenersToHandle(handle: Handle): void {
    handle.element.addEventListener('mousedown', (event: MouseEvent): void =>
      this.handleMouseDown(event, handle)
    )
  }

  private searchStyleValue(minValue: number, maxValue: number, progress: number) {
    return (100 / (maxValue - minValue)) * (progress - minValue)
  }

  private clickOnScale(scale: Scale) {
    scale.element.addEventListener('click', (event) => this.clickOnScaleFunction(event))
  }

  private clickOnScaleFunction(event: MouseEvent) {
    const { firstHandle, secondHandle, progress, track } = this.components

    const target = event.target as HTMLElement
    const value = +target.textContent

    let closetHandle = firstHandle
    if (this.modelOptions.range) {
      closetHandle = this.findClosestHandle(firstHandle, secondHandle, value)
    }
    closetHandle.setValue(value)

    const styleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      value
    )

    closetHandle.setStyle(styleValue)
    if (this.modelOptions.range && this.viewOptions.showProgress) {
      if (closetHandle === firstHandle) {
        progress.setStart(styleValue)
      } else if (closetHandle === secondHandle) {
        progress.setEnd(styleValue)
      }
    } else if (this.viewOptions.showProgress) {
      progress.setStart(0)
      progress.setEnd(styleValue)
    }

    if (closetHandle === firstHandle) {
      this.emit('viewChanged', { valueStart: closetHandle.getValue() })
    } else if (closetHandle === secondHandle) {
      this.emit('viewChanged', { valueEnd: closetHandle.getValue() })
    }
  }
}

export default View
