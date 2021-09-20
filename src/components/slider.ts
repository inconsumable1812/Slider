import Presenter from './presenter/Presenter'
import View from './views/View'

const root = document.querySelector('#app')

const view = new View(root)
const presenter = new Presenter(view)
