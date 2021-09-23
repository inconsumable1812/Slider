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

  connect() {
    this.model.subscribe('1', (value) => {
      console.log('model', value)
    })
    this.model.emit('1', 20)
    this.view.subscribe('handle', (value) => console.log(value))
  }
}

export default Presenter
