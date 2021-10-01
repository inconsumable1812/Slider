import Model from './model/Model'
import Presenter from './presenter/Presenter'
import View from './views/View'

const root = document.querySelector('#app')

const model = new Model()
const view = new View(root, model.getOptions())
const presenter = new Presenter(model, view)
