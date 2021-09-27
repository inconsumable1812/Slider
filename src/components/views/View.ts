import Observer from '../observer/Observer'
import Handle from './handle/Handle'
import Progress from './progress/Progress'
import Scale from './Scale/Scale'
import Track from './Track/Track'
import render from './utils/render'

type ModelOptions = {
  minValue: number
  maxValue: number
  step: number
  value: number[]
  steps: number
  range: boolean
}

type Components = {
  track: Track
  firstHandle: Handle
  secondHandle?: Handle
  progress?: Progress
  scale?: Scale
}

class View extends Observer {
  private components: Components
  root: HTMLElement
  el: Element
  constructor(selector: Element, public model: ModelOptions) {
    super()
    this.el = selector
  }

  render() {
    this.root = render(`
    <div class="range-slider">
    `)

    this.components = {
      track: new Track(this.model.minValue, this.model.maxValue, false),
      firstHandle: new Handle(1, this.model.value[0])
    }

    // handle.element.addEventListener('mousedown', () => {
    //   handle.setValue(5000)
    //   this.emit('handle', handle.getValue())
    // })

    if (true) {
      this.components.secondHandle = new Handle(2, this.model.value[1])
    }

    if (true) {
      this.components.progress = new Progress()
    }

    if (true) {
      this.components.scale = new Scale(this.model.minValue, this.model.maxValue)
    }

    const { track, firstHandle, secondHandle, scale, progress } = this.components

    if (true) {
      track.element.append(progress.element)
    }
    this.root.append(track.element)
    this.root.append(firstHandle.element)
    this.root.append(secondHandle.element)
    if (true) {
      this.root.append(scale.element)
    }
    firstHandle.setStyle(
      this.searchStyleValue(track.getMinValue(), track.getMaxValue(), this.model.value[0])
    )
    secondHandle.setStyle(
      this.searchStyleValue(track.getMinValue(), track.getMaxValue(), this.model.value[1])
    )

    this.el.append(this.root)

    this.clickOnTrack()
    this.bindListenersToHandle(firstHandle)
  }

  private clickOnTrack(): void {
    const { track, firstHandle, secondHandle } = this.components

    track.subscribe('clickOnTrack', (value) => {
      const nearHandle = this.findClosestHandle(firstHandle, secondHandle, value)
      nearHandle.setValue(value)

      const styleValue = this.searchStyleValue(
        track.getMinValue(),
        track.getMaxValue(),
        value
      )

      nearHandle.setStyle(styleValue)
    })
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
    const target = event.target as HTMLElement
    const { track } = this.components

    // const delta =
    // console.log(target.getBoundingClientRect())
    // console.log(event.clientX)
    // console.log(track.element.getBoundingClientRect())

    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, handle))
  }

  private handleMouseMove(event: MouseEvent, handle: Handle) {
    const { track } = this.components

    let valueInPx = event.pageX - track.element.getBoundingClientRect().left
    if (valueInPx < 0) {
      valueInPx = 0
    } else if (valueInPx > track.element.getBoundingClientRect().width) {
      valueInPx = track.element.getBoundingClientRect().width
    }

    const valueInPercent = valueInPx / track.element.getBoundingClientRect().width

    const minValue = track.getMinValue()
    const maxValue = track.getMaxValue()
    console.log(valueInPercent)
  }

  private bindListenersToHandle(handle: Handle): void {
    handle.element.addEventListener('mousedown', (event: MouseEvent): void =>
      this.handleMouseDown(event, handle)
    )
  }

  private searchStyleValue(minValue: number, maxValue: number, progress: number) {
    return (100 / (maxValue - minValue)) * (progress - minValue)
  }
}

export default View
