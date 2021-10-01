import { ModelOptions } from '../type'

import Model from '../model/Model'
import View from '../views/View'

class Presenter {
  constructor(private model: Model, private view: View) {
    this.render()
  }
  render() {
    this.view.render()
    this.connect()
  }

  getOptions() {
    this.model.getOptions()
  }

  setModelOptions(modelOptions: Partial<ModelOptions>) {
    this.model.setOptions(modelOptions)
    console.log(this.model.getOptions())
  }
  updateValue(valueOptions) {}

  connect() {
    this.view.subscribe('viewChanged', this.setModelOptions.bind(this))
  }
}

export default Presenter
