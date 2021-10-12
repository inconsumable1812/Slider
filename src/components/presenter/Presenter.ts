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

  setModelOptions(modelOptions: Partial<ModelOptions>) {
    this.model.setOptions(modelOptions)
  }
  updateView(modelOptions: Partial<ModelOptions>) {
    this.view.changeModelOptions(modelOptions)
    this.view.updateView()
  }

  connect() {
    this.view.subscribe('viewChanged', this.setModelOptions.bind(this))
    this.model.subscribe('modelValueChange', this.updateView.bind(this))
  }
}

export default Presenter
