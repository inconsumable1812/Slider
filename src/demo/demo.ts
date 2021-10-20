/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery'
import '../components/slider'
import '../components/JQplugin'
import { sliderOptions } from 'components/type'

const slider = $('#app').JQSlider()
slider.JQSlider('addControlPanel')

const sliderSecondConfig: Partial<sliderOptions> = {
  minValue: 500,
  maxValue: 1000
}

const sliderThirdConfig: Partial<sliderOptions> = {
  minValue: -500,
  maxValue: -400,
  valueStart: -450,
  range: true,
  showProgress: true,
  scalePointCount: 5
}

const sliderFourthConfig: Partial<sliderOptions> = {
  isVertical: true,
  showProgress: true
}

const sliderSecond = $('#app_2').JQSlider()
const sliderSecondPanel = sliderSecond.JQSlider('addControlPanel')
sliderSecond.JQSlider('setOptions', { minValue: 5 })

const sliderThird = $('#app_3').JQSlider(sliderThirdConfig)
const sliderThirdPanel = sliderThird.JQSlider('addControlPanel')

const sliderFourth = $('#app_3').JQSlider(sliderFourthConfig)
const sliderFourthPanel = sliderFourth.JQSlider('addControlPanel')
