/* eslint-disable @typescript-eslint/no-unused-vars */
import '../components/slider'
import { create } from '../components/slider'
import '../components/JQplugin'

import $ from 'jquery'

const slider = $('#app').JQSlider()
slider.JQSlider('addControlPanel')

const sliderSecondConfig = {
  minValue: 500,
  maxValue: 1000
}

const sliderThirdConfig = {
  minValue: 500,
  maxValue: 1000
}

const sliderSecond = $('#app_2').JQSlider()
const sliderSecondPanel = sliderSecond.JQSlider('addControlPanel')
sliderSecond.JQSlider('setOptions', { minValue: 5 })

const sliderThird = $('#app_3').JQSlider(sliderThirdConfig)
const sliderThirdPanel = sliderThird.JQSlider('addControlPanel')
