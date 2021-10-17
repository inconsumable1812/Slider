import Panel from './panel/Panel'
import { create } from './slider'
import { Slider, sliderOptions } from './type'

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><div id="app" class="container"></div>`)
const selector = dom.window.document.querySelector('#app')

const options: sliderOptions = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  valueStart: 40,
  valueEnd: 50,
  range: false,
  scalePointCount: 11,
  showTooltip: true,
  isVertical: false,
  showProgress: false,
  showScale: true
}

describe('Slider', () => {
  let slider: Slider, sliderDefault: Slider

  beforeEach(() => {
    slider = create(selector, options)
  })

  test('check correct return valueStart', () => {
    expect(slider.getFirstValue()).toBe(40)
  })

  test('check correct return valueStart when default options', () => {
    sliderDefault = create(selector)
    expect(sliderDefault.getFirstValue()).toBe(sliderDefault.getOptions().valueStart)
  })

  test('check correct return container', () => {
    expect(slider.getContainer()).toBe(selector)
  })

  test('check add control panel', () => {
    expect(slider.addControlPanel()).toBeInstanceOf(Panel)
  })
})
