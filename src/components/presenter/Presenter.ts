import { ModelOptions } from '../type'

import Model from '../model/Model'
import View from '../views/View'

// const ModelOptions = {
//   value: [500, 1000]
// }
class Presenter {
  constructor(private model: Model, private view: View) {
    this.render()
  }
  render() {
    // this.setOptions(ModelOptions)
    this.view.render()
    this.connect()
  }

  getOptions() {
    this.model.getOptions()
  }

  setOptions(modelOptions: Partial<ModelOptions>) {
    this.model.setOptions(modelOptions)
  }

  connect() {
    this.view.subscribe('viewChanged', (value) => console.log(value))
  }
}

export default Presenter
