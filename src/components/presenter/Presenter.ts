import Model from '../model/Model'
import View from '../views/View'

class Presenter {
  constructor(private model: Model, private view: View) {
    this.render()
    //this.getOptions()
  }
  render() {
    this.view.render()
  }
  getOptions() {
    this.model.getOptions()
  }
}

export default Presenter
