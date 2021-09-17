class View {
  element: HTMLElement
  components: any
  constructor(selector: string, options: any) {
    this.element = document.querySelector(selector)
    this.components = options.component || []
  }

  render() {
    console.log(this.components)
  }
}

export default View
