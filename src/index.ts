import Track from './components/views/Track/Track'
import View from './components/views/View'
import './scss/index.scss'

const view = new View('#app', {
  components: [Track]
})

console.log(view)
view.render()
