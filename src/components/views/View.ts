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

// type TObjects = {
//   bar: BarView
//   firstPin: PinView
//   secondPin?: PinView
//   input: InputView
//   progress?: ProgressView
//   scale?: ScaleView
// }

class View extends Observer {
  private objects: any
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

    const track = new Track()
    this.root.append(track.element)

    const handle = new Handle(1, this.model.value[0])
    this.root.append(handle.element)
    handle.element.addEventListener('mousedown', () => {
      console.log('ok')
      this.emit('handle', handle.getValue())
    })
    console.log(handle.getValue())

    const secondHandle = new Handle(2, this.model.value[1])
    this.root.append(secondHandle.element)

    const progress = new Progress()
    this.root.append(progress.element)

    const scale = new Scale()
    this.root.append(scale.element)

    this.el.append(this.root)
  }
}

export default View
