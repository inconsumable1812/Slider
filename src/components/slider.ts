import { DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS } from './default'
import { ModelOptions, sliderOptions, ViewOptions } from './type'

import Model from './model/Model'
import Panel from './panel/Panel'
import Presenter from './presenter/Presenter'
import View from './views/View'

const create = (selector: HTMLElement, options: sliderOptions = {}) => {
  const model = new Model()
  const modelOptions = model.getOptions()

  const view = new View(selector, modelOptions)
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
      console.log(selector)
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
    addControlPanel() {
      return new Panel(selector, slider)
    }
  }

  return slider
}

export { create }
