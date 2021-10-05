import Model from './model/Model'
import Panel from './panel/Panel'
import Presenter from './presenter/Presenter'
import View from './views/View'

const root = document.querySelector('#app')

const model = new Model()
const modelOptions = model.getOptions()

const view = new View(root, modelOptions)
const sliderOptions = view.getOptions()

const presenter = new Presenter(model, view)
const panel = new Panel(root, sliderOptions)

console.log(sliderOptions)
