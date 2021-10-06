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

  getModelOptions() {
    return this.model.getOptions()
  }

  getSliderOptions() {
    return { ...this.model.getOptions(), ...this.view.getOptions() }
  }

  setModelOptions(modelOptions: Partial<ModelOptions>) {
    this.model.setOptions(modelOptions)
    // console.log(this.model.getOptions())
  }
  updateValue(valueOptions) {}

  connect() {
    this.view.subscribe('viewChanged', this.setModelOptions.bind(this))
    this.model.subscribe('modelValueChange', () => this.getSliderOptions())
  }
}

export default Presenter
