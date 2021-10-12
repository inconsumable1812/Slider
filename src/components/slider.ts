import { DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS } from './default'
import { ModelOptions, sliderOptions, ViewOptions } from './type'

import Model from './model/Model'
import Panel from './panel/Panel'
import Presenter from './presenter/Presenter'
import View from './views/View'

const create = (selector: HTMLElement, options: sliderOptions = {}) => {
  const updateModelOptions = prepareOptions(
    options,
    DEFAULT_MODEL_OPTIONS
  ) as Partial<ModelOptions>
  const updateViewOptions = prepareOptions(
    options,
    DEFAULT_VIEW_OPTIONS
  ) as Partial<ViewOptions>

  const model = new Model(updateModelOptions)
  const modelOptions = model.getOptions()

  const view = new View(selector, modelOptions, updateViewOptions)
  const presenter = new Presenter(model, view)

  function prepareOptions(
    options: sliderOptions,
    target: ViewOptions | ModelOptions
  ): Partial<ModelOptions> | Partial<ViewOptions> {
    const state: Partial<ViewOptions | ModelOptions> = {}
    const keys = Object.keys(target) as Array<keyof typeof target>
    return keys.reduce((acc, key) => {
      if (options[key] !== undefined) {
        acc[key] = options[key]
      }

      return acc
    }, state)
  }

  const slider = {
    getContainer() {
      return selector
    },
    getOptions() {
      const modelOptions = model.getOptions()
      const viewOptions = view.getOptions()

      return { ...modelOptions, ...viewOptions }
    },
    setOptions(options: sliderOptions) {
      const updateModelOptions = prepareOptions(
        options,
        DEFAULT_MODEL_OPTIONS
      ) as Partial<ModelOptions>
      const updateViewOptions = prepareOptions(
        options,
        DEFAULT_VIEW_OPTIONS
      ) as Partial<ViewOptions>

      const modelOptions = model.setOptions(updateModelOptions)
      const viewOptions = view.setOptions(updateViewOptions)
    },
    getFirstValue() {
      return model.getFirstValue()
    },
    getSecondValue() {
      return model.getSecondValue()
    },
    addControlPanel() {
      return new Panel(selector, slider)
    },

    JQSlider(method: string, payload?: any) {
      switch (method) {
        case 'getContainer':
          return this.getContainer()

        case 'getOptions':
          return this.getOptions()

        case 'getFirstValue':
          return this.getFirstValue()

        case 'getSecondValue':
          return this.getSecondValue()

        case 'addControlPanel':
          return this.addControlPanel()

        default:
          return null
      }
    }
  }

  return slider
}

export { create }
