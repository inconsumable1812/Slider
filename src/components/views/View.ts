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

class View extends Observer {
  root: HTMLElement
  el: Element
  components: any
  constructor(selector: Element, public model: ModelOptions) {
    super()
    this.el = selector
    console.log(this.model.value[0])
  }

  render() {
    this.root = render(`
    <div class="range-slider">
    `)

    const track = new Track()
    this.root.innerHTML += track.toHtml()

    const handle = new Handle(1, this.model.value[0])
    this.root.append(handle.element)

    const secondHandle = new Handle(2, this.model.value[1])
    this.root.append(secondHandle.element)

    const progress = new Progress()
    this.root.innerHTML += progress.toHtml()

    const scale = new Scale()
    this.root.innerHTML += scale.toHtml()

    this.el.append(this.root)
  }
}

export default View
