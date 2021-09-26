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
      this.components.scale = new Scale()
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

    this.el.append(this.root)
    this.bindBarClick()
  }

  private bindBarClick(): void {
    const { track, firstHandle, secondHandle } = this.components

    track.subscribe('NewBarValue', (value) => {
      const nearHandle = this.findNearestHandle(firstHandle, secondHandle, value)
      nearHandle.setValue(value)
    })
  }

  private findNearestHandle(
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
}

export default View
