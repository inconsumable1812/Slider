/* eslint-disable @typescript-eslint/no-var-requires */
import Model from '../model/Model'
import { ModelOptions, ViewOptions } from '../type'
import View from '../views/View'
import Presenter from './Presenter'

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><div id="app" class="container"></div>`)
const selector = dom.window.document.querySelector('#app')

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  valueStart: 10,
  valueEnd: 80,
  range: false
}

const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  scalePointCount: 11,
  showTooltip: true,
  isVertical: false,
  showProgress: false,
  showScale: true
}

describe('Presenter', () => {
  let presenter: Presenter
  let view: View
  let model: Model

  beforeEach(() => {
    model = new Model(DEFAULT_MODEL_OPTIONS)
    view = new View(selector, DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS)
    presenter = new Presenter(model, view)
  })

  test('check return correct model options', () => {
    expect(presenter.getModelOptions().minValue).toBe(0)
  })

  test('check set correct model options', () => {
    presenter.setModelOptions({ minValue: 30 })
    expect(presenter.getModelOptions().minValue).toBe(30)
  })

  test('check correct update view', () => {
    presenter.updateView({ valueStart: 40 })
    expect(view.getComponents().firstHandle.getValue()).toBe(40)
    expect(view.getComponents().firstHandle.getStyleValue()).toBe(40)
  })
})
