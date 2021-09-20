import Handle from './handle/Handle'
import Progress from './progress/Progress'
import Scale from './Scale/Scale'
import Track from './Track/Track'
import render from './utils/render'

class View {
  root: HTMLElement
  el: HTMLElement
  components: any
  constructor(selector: string) {
    this.el = document.querySelector(selector)
  }

  render() {
    this.root = render(`
    <div class="range-slider">
    `)

    const track = new Track()
    this.root.innerHTML += track.toHtml()

    const handle = new Handle()
    this.root.innerHTML += handle.toHtml()

    const progress = new Progress()
    this.root.innerHTML += progress.toHtml()

    const scale = new Scale()
    this.root.innerHTML += scale.toHtml()

    this.el.append(this.root)
  }
}

export default View
