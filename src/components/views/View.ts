/* eslint-disable fsd/split-conditionals */
/* eslint-disable class-methods-use-this */
import { ModelOptions, ViewComponents, ViewOptions } from '../type'
import { DEFAULT_VIEW_OPTIONS } from '../default'

import Observer from '../observer/Observer'
import Handle from './handle/Handle'
import Progress from './progress/Progress'
import Scale from './Scale/Scale'
import Track from './Track/Track'
import render from './utils/render'

class View extends Observer {
  private components!: ViewComponents
  root!: HTMLElement
  private el: Element
  constructor(
    selector: Element,
    private modelOptions: ModelOptions,
    private viewOptions: Partial<ViewOptions> = DEFAULT_VIEW_OPTIONS
  ) {
    super()
    this.el = selector
    this.initViewOptions()
    this.checkScalePointCount()
  }

  private initViewOptions(): void {
    this.viewOptions = { ...DEFAULT_VIEW_OPTIONS, ...this.viewOptions }
  }

  // eslint-disable-next-line consistent-return
  private checkScalePointCount(): void | Partial<ViewOptions> {
    const { scalePointCount } = this.viewOptions
    if (scalePointCount! < 2) {
      return this.setOptions({ scalePointCount: 2 })
    }
    if (scalePointCount! > 11) {
      return this.setOptions({ scalePointCount: 11 })
    }
  }

  setOptions(viewOptions: Partial<ViewOptions>): void {
    this.viewOptions = { ...this.viewOptions, ...viewOptions }
    this.checkScalePointCount()
    this.emit('viewChanged', this.viewOptions)
  }

  changeModelOptions(modelOptions: Partial<ModelOptions>): void {
    this.modelOptions = { ...this.modelOptions, ...modelOptions }
  }

  updateView(): void {
    const { minValue, maxValue, step, valueStart, valueEnd, range } = this.modelOptions
    const { scalePointCount, showTooltip, isVertical, showProgress, showScale } =
      this.viewOptions
    const { track, firstHandle } = this.components

    firstHandle.setValue(valueStart)
    firstHandle.setStyle(this.searchStyleValue(minValue, maxValue, valueStart))

    if (showProgress) {
      if (this.components.progress === undefined) {
        this.components.progress = new Progress(isVertical!)
      }
      track.element.append(this.components.progress.element)
      this.components.progress.setOrientation(isVertical!)
    } else if (this.components.progress !== undefined) {
      this.components.progress.element.remove()
    }

    if (showScale) {
      if (this.components.scale === undefined) {
        this.components.scale = new Scale(
          minValue,
          maxValue,
          scalePointCount!,
          step,
          isVertical!
        )
      }
      this.components.scale.setOrientation(isVertical!)
      this.components.scale.setScaleOptions(maxValue, minValue, step, scalePointCount!)
    } else {
      this.components.scale!.deleteScalePoint()
    }

    if (range) {
      if (this.components.secondHandle === undefined) {
        this.components.secondHandle = new Handle(
          2,
          this.modelOptions.valueEnd,
          this.viewOptions.showTooltip,
          this.viewOptions.isVertical
        )
        this.bindListenersToHandle(this.components.secondHandle)
      }

      this.root.append(this.components.secondHandle.element)

      this.components.secondHandle.setValue(valueEnd)
      this.components.secondHandle.setStyle(
        this.searchStyleValue(minValue, maxValue, valueEnd)
      )
      if (showProgress) {
        this.components.progress!.setStyle(
          this.searchStyleValue(minValue, maxValue, valueStart),
          this.searchStyleValue(minValue, maxValue, valueEnd)
        )
      }
    } else {
      if (this.components.secondHandle !== undefined) {
        this.components.secondHandle.element.remove()
      }
      if (showProgress) {
        this.components.progress!.setStyle(
          0,
          this.searchStyleValue(minValue, maxValue, valueStart)
        )
      }
    }

    if (showTooltip) {
      firstHandle.showTooltipMethod()
      if (range) {
        this.components.secondHandle!.showTooltipMethod()
      }
    } else {
      firstHandle.hideTooltip()
      if (range) {
        this.components.secondHandle!.hideTooltip()
      }
    }

    track.setMaxMinValueAndStep(maxValue, minValue, step)

    const styleValueFirst = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      valueStart
    )

    if (range) {
      const styleValueSecond = this.searchStyleValue(
        track.getMinValue(),
        track.getMaxValue(),
        valueEnd
      )
      this.components.secondHandle!.setOrientation(isVertical!)
      this.components.secondHandle!.clearStyle()
      this.components.secondHandle!.setStyle(styleValueSecond)
    }

    track.setOrientation(isVertical!)
    firstHandle.setOrientation(isVertical!)
    firstHandle.clearStyle()
    firstHandle.setStyle(styleValueFirst)
    if (showProgress) {
      this.components.progress!.setOrientation(isVertical!)
    }

    if (isVertical) {
      this.root.classList.add('range-slider_vertical')
    } else {
      this.root.classList.remove('range-slider_vertical')
    }
  }

  getModel(): ModelOptions {
    return this.modelOptions
  }

  getOptions(): ViewOptions {
    return this.viewOptions as ViewOptions
  }

  getComponents(): ViewComponents {
    return this.components
  }

  render(): void {
    const isVertical = this.viewOptions.isVertical ? 'range-slider_vertical' : ''
    this.root = render(`
    <div class="range-slider ${isVertical}">
    `)

    this.components = {
      track: new Track(
        this.modelOptions.minValue,
        this.modelOptions.maxValue,
        this.viewOptions.isVertical!,
        this.modelOptions.step
      ),
      firstHandle: new Handle(
        1,
        this.modelOptions.valueStart,
        this.viewOptions.showTooltip,
        this.viewOptions.isVertical
      )
    }

    if (this.modelOptions.range) {
      this.components.secondHandle = new Handle(
        2,
        this.modelOptions.valueEnd,
        this.viewOptions.showTooltip,
        this.viewOptions.isVertical
      )
    }

    if (this.viewOptions.showProgress) {
      this.components.progress = new Progress(this.viewOptions.isVertical!)
    }

    if (this.viewOptions.showScale) {
      this.components.scale = new Scale(
        this.modelOptions.minValue,
        this.modelOptions.maxValue,
        this.viewOptions.scalePointCount!,
        this.modelOptions.step,
        this.viewOptions.isVertical!
      )
    }
    this.init()
  }

  private init(): void {
    const { track, firstHandle, secondHandle, scale, progress } = this.components

    if (this.viewOptions.showProgress) {
      track.element.append(progress!.element)
    }
    this.root.append(track.element)
    this.root.append(firstHandle.element)
    if (this.modelOptions.range) {
      this.root.append(secondHandle!.element)
    }
    if (this.viewOptions.showScale) {
      this.root.append(scale!.element)
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
      secondHandle!.setStyle(secondHandleStyleValue)
      if (this.viewOptions.showProgress) {
        progress!.setStyle(firstHandleStyleValue, secondHandleStyleValue)
      }
    } else if (this.viewOptions.showProgress) {
      progress!.setStyle(0, firstHandleStyleValue)
    }

    this.el.append(this.root)

    this.clickOnTrack()
    this.bindListenersToHandle(firstHandle)
    if (this.modelOptions.range) {
      this.bindListenersToHandle(secondHandle!)
    }
    if (this.viewOptions.showScale) {
      this.clickOnScale(scale!)
    }
  }

  private clickOnTrack(): void {
    this.components.track.subscribe(
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
          closetHandle = this.findClosestHandle(firstHandle, secondHandle!, value)

          if (
            click > styleValue / 100 &&
            firstHandle.getStyleValue() < styleValue &&
            Math.abs(firstHandle.getStyleValue() / 100 - click) >
              Math.abs(secondHandle!.getStyleValue() / 100 - click)
          ) {
            closetHandle = secondHandle!
          }
        }

        closetHandle.setValue(value)
        closetHandle.setStyle(styleValue)

        if (this.modelOptions.range && this.viewOptions.showProgress) {
          if (closetHandle === firstHandle) {
            progress!.setStart(styleValue)
          } else if (closetHandle === secondHandle) {
            progress!.setEnd(styleValue)
          }
        } else if (this.viewOptions.showProgress) {
          progress!.setStart(0)
          progress!.setEnd(styleValue)
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
  ): Handle {
    const firstValue: number = firstHandle.getValue()
    const secondValue: number = secondHandle.getValue()
    if (Math.abs(firstValue - clickValue) <= Math.abs(secondValue - clickValue)) {
      return firstHandle
    }
    return secondHandle
  }

  private handleMouseDown(event: MouseEvent, handle: Handle): void {
    event.preventDefault()

    const handleMouseMove = (e: MouseEvent) => this.handleMouseMove(e, handle)

    document.addEventListener('mousemove', handleMouseMove)

    const handleMouseUp = (): void => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }

    document.addEventListener('mouseup', handleMouseUp)
  }

  private handleMouseMove(event: MouseEvent, handle: Handle): void {
    const { track, progress, firstHandle, secondHandle } = this.components
    const step: number = this.modelOptions.step
    const { isVertical } = this.viewOptions

    const prevValue: number = handle.getValue()

    const valueInPx: number = isVertical
      ? event.clientY - track.element.getBoundingClientRect().top
      : event.clientX - track.element.getBoundingClientRect().left

    const widthOrHeight: number = isVertical
      ? track.element.getBoundingClientRect().height
      : track.element.getBoundingClientRect().width

    const valueInPercent: number = valueInPx / widthOrHeight

    const delta: number = track.getMaxValue() - track.getMinValue()
    const isValueCorrectOfStep = !(Math.round(delta * valueInPercent) % step)

    let newValue: number = isValueCorrectOfStep
      ? Math.round(track.getMinValue() + delta * valueInPercent)
      : prevValue
    if (valueInPercent <= 0) {
      newValue = track.getMinValue()
    } else if (valueInPercent >= 1) {
      newValue = track.getMaxValue()

      this.emit('viewChanged', { valueEnd: newValue })
    }

    const styleValue: number = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      newValue
    )

    if (this.modelOptions.range) {
      if (handle === firstHandle && newValue < secondHandle!.getValue()) {
        handle.setValue(newValue)
        handle.setStyle(styleValue)
        if (this.viewOptions.showProgress) {
          progress!.setStart(styleValue)
        }
      } else if (handle === secondHandle && newValue > firstHandle.getValue()) {
        handle.setValue(newValue)
        handle.setStyle(styleValue)

        if (this.viewOptions.showProgress) {
          progress!.setEnd(styleValue)
        }
      }
    } else if (this.viewOptions.showProgress) {
      progress!.setStart(0)
      progress!.setEnd(styleValue)
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
    const handleMouseDown = (event: MouseEvent): void =>
      this.handleMouseDown(event, handle)
    handle.element.addEventListener('mousedown', handleMouseDown)
  }

  private searchStyleValue(minValue: number, maxValue: number, progress: number): number {
    return (100 / (maxValue - minValue)) * (progress - minValue)
  }

  private clickOnScale(scale: Scale): void {
    const clickOnScaleFunction = (event: MouseEvent) => this.clickOnScaleFunction(event)
    scale.element.addEventListener('click', clickOnScaleFunction)
  }

  private clickOnScaleFunction(event: MouseEvent): void {
    const { firstHandle, secondHandle, progress, track } = this.components

    const target: HTMLElement = event.target as HTMLElement
    const value: number = +target.textContent!

    let closetHandle: Handle = firstHandle
    if (this.modelOptions.range) {
      closetHandle = this.findClosestHandle(firstHandle, secondHandle!, value)
    }
    closetHandle.setValue(value)

    const styleValue: number = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      value
    )

    closetHandle.setStyle(styleValue)
    if (this.modelOptions.range && this.viewOptions.showProgress) {
      if (closetHandle === firstHandle) {
        progress!.setStart(styleValue)
      } else if (closetHandle === secondHandle) {
        progress!.setEnd(styleValue)
      }
    } else if (this.viewOptions.showProgress) {
      progress!.setStart(0)
      progress!.setEnd(styleValue)
    }

    if (closetHandle === firstHandle) {
      this.emit('viewChanged', { valueStart: closetHandle.getValue() })
    } else if (closetHandle === secondHandle) {
      this.emit('viewChanged', { valueEnd: closetHandle.getValue() })
    }
  }
}

export default View
