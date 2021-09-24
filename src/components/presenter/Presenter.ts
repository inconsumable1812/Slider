import Model from '../model/Model'
import View from '../views/View'

const ModelOptions = {
  value: [500, 1000]
}
class Presenter {
  constructor(private model: Model, private view: View) {
    this.render()
  }
  render() {
    this.setOptions(ModelOptions)
    this.view.render()
    this.connect()
  }

  getOptions() {
    this.model.getOptions()
  }

  setOptions(modelOptions) {
    this.model.setOptions(modelOptions)
  }

  connect() {
    this.view.subscribe('handle', (value) => console.log(value))
  }
}

export default Presenter
