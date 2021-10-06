import '../components/slider'
import { create } from '../components/slider'

const selector = document.querySelector('#app') as HTMLElement

const slider = create(selector)
slider.setOptions({
  minValue: 30,
  maxValue: 200
  // valueEnd: 35
  // showProgress: false
})
slider.addControlPanel()
