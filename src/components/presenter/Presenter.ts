import View from '../views/View'

class Presenter {
  constructor(private view: View) {
    this.render()
  }
  render() {
    this.view.render()
  }
}

export default Presenter
