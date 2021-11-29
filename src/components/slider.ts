/* eslint-disable no-shadow */
import { DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS } from './default';
import { ModelOptions, sliderOptions, ViewOptions } from './type';
import Model from './Model/Model';
import Panel from './Panel/Panel';
import Presenter from './Presenter/Presenter';
import View from './View/View';

const create = (selector: HTMLElement, options: sliderOptions = {}) => {
  function prepareOptions(
    newOptions: sliderOptions,
    target: ViewOptions | ModelOptions
  ): Partial<ModelOptions> | Partial<ViewOptions> {
    const state: Partial<ViewOptions | ModelOptions> = {};
    const keys = Object.keys(target) as Array<keyof typeof target>;
    return keys.reduce((acc, key) => {
      if (newOptions[key] !== undefined) {
        acc[key] = newOptions[key];
      }

      return acc;
    }, state);
  }
  const updateModelOptions = prepareOptions(
    options,
    DEFAULT_MODEL_OPTIONS
  ) as Partial<ModelOptions>;
  const updateViewOptions = prepareOptions(
    options,
    DEFAULT_VIEW_OPTIONS
  ) as Partial<ViewOptions>;

  const model = new Model(updateModelOptions);
  const modelOptionsInit = model.getOptions();

  const view = new View(
    selector,
    modelOptionsInit,
    updateViewOptions as ViewOptions
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const presenter = new Presenter(model, view);

  let panel: Panel;

  const slider = {
    getContainer(): HTMLElement {
      return selector;
    },
    getViewRoot(): HTMLElement {
      return view.root;
    },
    getOptions(): sliderOptions {
      const modelOptions = model.getOptions();
      const viewOptions = view.getOptions();

      return { ...modelOptions, ...viewOptions };
    },
    setOptions(options: sliderOptions): void {
      const updateModelOptions = prepareOptions(
        options,
        DEFAULT_MODEL_OPTIONS
      ) as Partial<ModelOptions>;
      const updateViewOptions = prepareOptions(
        options,
        DEFAULT_VIEW_OPTIONS
      ) as Partial<ViewOptions>;

      if (updateModelOptions) {
        model.setOptions(updateModelOptions);
      }

      view.setOptions(updateViewOptions);
      if (panel) {
        panel.setOptionsFromSlider();
      }
    },
    getFirstValue(): number {
      return model.getFirstValue();
    },
    getSecondValue(): number {
      return model.getSecondValue();
    },
    addControlPanel(): Panel {
      panel = new Panel(selector, slider);
      panel.init();
      return panel;
    },

    JQSlider(method: string, newOptions?: Partial<sliderOptions>) {
      switch (method) {
        case 'getContainer':
          return this.getContainer();

        case 'getOptions':
          return this.getOptions();

        case 'setOptions':
          return this.setOptions(newOptions!);

        case 'getFirstValue':
          return this.getFirstValue();

        case 'getSecondValue':
          return this.getSecondValue();

        case 'addControlPanel':
          return this.addControlPanel();

        default:
          return null;
      }
    }
  };

  return slider;
};

export { create };
