import '../components/slider'
import { create } from '../components/slider'

const selector = document.querySelector('#app') as HTMLElement

const slider = create(selector)
slider.setOptions({
  minValue: 0,
  maxValue: 100
  // valueEnd: 35
  // showProgress: false
})
slider.addControlPanel()
