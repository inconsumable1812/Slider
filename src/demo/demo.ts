import '../components/slider'
import { create } from '../components/slider'
import '../components/JQplugin'

import $ from 'jquery'

const selector = document.querySelector('#app') as HTMLElement

const slider = create(selector, {
  minValue: 25,
  maxValue: 200,
  isVertical: false
})
// slider.setOptions({
//   minValue: 30,
//   maxValue: 200
//   // valueEnd: 35
//   // showProgress: false
// })
slider.addControlPanel()

const sliderOneConfig = {
  minValue: 500,
  maxValue: 1000
}

const sliderOne = $('#app_2').JQSlider(sliderOneConfig)
const sliderOnePanel = sliderOne.JQSlider('addControlPanel')
