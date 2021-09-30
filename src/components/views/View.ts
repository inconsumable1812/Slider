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
    private model: ModelOptions,
    private view: ViewOptions = DEFAULT_VIEW_OPTIONS
  ) {
    super()
    this.el = selector
  }

  render() {
    this.root = render(`
    <div class="range-slider">
    `)

    this.components = {
      track: new Track(
        this.model.minValue,
        this.model.maxValue,
        this.view.isVertical,
        this.model.step
      ),
      firstHandle: new Handle(1, this.model.valueStart, this.view.isTooltipDisabled)
    }

    if (this.model.range) {
      this.components.secondHandle = new Handle(
        2,
        this.model.valueEnd,
        this.view.isTooltipDisabled
      )
    }

    if (this.view.showProgress) {
      this.components.progress = new Progress()
    }

    if (this.view.showScale) {
      this.components.scale = new Scale(
        this.model.minValue,
        this.model.maxValue,
        this.view.scalePointCount,
        this.model.step
      )
    }
    this.init()
  }

  private init() {
    const { track, firstHandle, secondHandle, scale, progress } = this.components

    if (this.view.showProgress) {
      track.element.append(progress.element)
    }
    this.root.append(track.element)
    this.root.append(firstHandle.element)
    if (this.model.range) {
      this.root.append(secondHandle.element)
    }
    if (this.view.showScale) {
      this.root.append(scale.element)
    }

    const firstHandleStyleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      this.model.valueStart
    )
    const secondHandleStyleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      this.model.valueEnd
    )
    firstHandle.setStyle(firstHandleStyleValue)
    if (this.model.range) {
      secondHandle.setStyle(secondHandleStyleValue)
      if (this.view.showProgress) {
        progress.setStyle(firstHandleStyleValue, secondHandleStyleValue)
      }
    } else if (this.view.showProgress) {
      progress.setStyle(0, firstHandleStyleValue)
    }

    this.el.append(this.root)

    this.clickOnTrack()
    this.bindListenersToHandle(firstHandle)
    if (this.model.range) {
      this.bindListenersToHandle(secondHandle)
    }
    if (this.view.showScale) {
      this.clickOnScale(scale)
    }

    console.log(scale.getArrayOfValue())
  }

  private clickOnTrack(): void {
    const { track, firstHandle, secondHandle, progress } = this.components

    track.subscribe(
      'clickOnTrack',
      ({ event, value }: { event: MouseEvent; value: number }) => {
        let closetHandle = firstHandle
        if (this.model.range) {
          closetHandle = this.findClosestHandle(firstHandle, secondHandle, value)
        }

        closetHandle.setValue(value)

        const styleValue = this.searchStyleValue(
          track.getMinValue(),
          track.getMaxValue(),
          value
        )
        closetHandle.setStyle(styleValue)

        if (this.model.range && this.view.showProgress) {
          if (closetHandle === firstHandle) {
            progress.setStart(styleValue)
          } else if (closetHandle === secondHandle) {
            progress.setEnd(styleValue)
          }
        } else if (this.view.showProgress) {
          progress.setStart(0)
          progress.setEnd(styleValue)
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
    const step = this.model.step

    const prevValue = handle.getValue()

    let valueInPx = event.pageX - track.element.getBoundingClientRect().left

    const valueInPercent = valueInPx / track.element.getBoundingClientRect().width

    const delta = track.getMaxValue() - track.getMinValue()
    const isValueCorrectOfStep: boolean = !(Math.round(delta * valueInPercent) % step)

    let newValue = isValueCorrectOfStep
      ? Math.round(track.getMinValue() + delta * valueInPercent)
      : prevValue
    if (valueInPercent <= 0) {
      newValue = track.getMinValue()
    } else if (valueInPercent >= 1) {
      newValue = track.getMaxValue()
    }

    handle.setValue(newValue)

    const styleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      newValue
    )

    handle.setStyle(styleValue)
    if (this.model.range) {
      if (handle === firstHandle) {
        if (handle.getValue() > secondHandle.getValue()) {
          handle.setValue(secondHandle.getValue() - 1)
          handle.setStyle(
            this.searchStyleValue(
              track.getMinValue(),
              track.getMaxValue(),
              secondHandle.getValue() - 1
            )
          )
        }
        if (this.view.showProgress) {
          progress.setStart(styleValue)
        }
      } else if (handle === secondHandle) {
        if (handle.getValue() < firstHandle.getValue()) {
          handle.setValue(firstHandle.getValue() + 1)
          handle.setStyle(
            this.searchStyleValue(
              track.getMinValue(),
              track.getMaxValue(),
              firstHandle.getValue() + 1
            )
          )
        }
        if (this.view.showProgress) {
          progress.setEnd(styleValue)
        }
      }
    } else if (this.view.showProgress) {
      progress.setStart(0)
      progress.setEnd(styleValue)
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
    if (this.model.range) {
      closetHandle = this.findClosestHandle(firstHandle, secondHandle, value)
    }
    closetHandle.setValue(value)

    const styleValue = this.searchStyleValue(
      track.getMinValue(),
      track.getMaxValue(),
      value
    )

    closetHandle.setStyle(styleValue)
    if (this.model.range && this.view.showProgress) {
      if (closetHandle === firstHandle) {
        progress.setStart(styleValue)
      } else if (closetHandle === secondHandle) {
        progress.setEnd(styleValue)
      }
    } else if (this.view.showProgress) {
      progress.setStart(0)
      progress.setEnd(styleValue)
    }
  }
}

export default View
