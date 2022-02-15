/* eslint-disable no-shadow */
import {
  atrOldValueIsBoolean,
  atrOldValueIsNumber,
  camelCase,
  camelCaseToDash,
  isNeedToChangeNewVal,
  toBoolean,
  toNumber
} from '../utils/utils';
import { DEFAULT_MODEL_OPTIONS, DEFAULT_VIEW_OPTIONS } from './default';
import { JQResult, ModelOptions, SliderOptions, ViewOptions } from './type';
import Model from './Model/Model';
import Panel from './Panel/Panel';
import Presenter from './Presenter/Presenter';
import View from './View/View';

const create = (
  selector: HTMLElement,
  options: Partial<SliderOptions> = {}
) => {
  function prepareOptions(
    newOptions: Partial<SliderOptions>,
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

  const model = new Model(selector, updateModelOptions);
  const modelOptionsInit = model.getOptions();

  const view = new View({
    selector,
    modelOptions: modelOptionsInit,
    options: updateViewOptions
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const presenter = new Presenter(model, view);

  let panel: Panel;
  const oldValues: Record<string, number | boolean> = {};
  const newValues: Record<string, string> = {};
  const currentValues: Record<string, number | boolean> = {};

  const slider = {
    getContainer(): Element {
      return selector;
    },
    getViewRoot(): HTMLElement {
      return view.root;
    },
    getOptions(): SliderOptions {
      const modelOptions = model.getOptions();
      const viewOptions = view.getOptions();

      return { ...modelOptions, ...viewOptions };
    },
    getModel(): Model {
      return model;
    },
    getView(): View {
      return view;
    },
    setDataAtr(): void {
      const keys = Object.keys(this.getOptions());
      const values = Object.values(this.getOptions());
      const container = this.getContainer();

      const keysDash = keys.map((el) => camelCaseToDash(el));
      keysDash.forEach((el, i) =>
        container.setAttribute('data-' + el, values[i].toString())
      );
    },
    setOptions(newOptions: Partial<SliderOptions>): void {
      const newModelOptions = prepareOptions(
        newOptions,
        DEFAULT_MODEL_OPTIONS
      ) as Partial<ModelOptions>;
      const newViewOptions = prepareOptions(
        newOptions,
        DEFAULT_VIEW_OPTIONS
      ) as Partial<ViewOptions>;

      if (newModelOptions) {
        model.setOptions(newModelOptions);
      }

      view.setOptions(newViewOptions);
      if (panel) {
        panel.setOptionsFromSlider();
      }

      this.setDataAtr();
    },
    getFirstValue(): number {
      return model.getFirstValue();
    },
    getSecondValue(): number {
      return model.getSecondValue();
    },
    addControlPanel(): Panel {
      panel = new Panel({ selector, slider, model, view });
      panel.init();
      return panel;
    },
    observeDataAtr(): void {
      const callback: MutationCallback = (mutationRecords) => {
        let currentAtrName = '';
        mutationRecords.forEach((el) => {
          const atrName = el.attributeName as string;
          currentAtrName = atrName;
          const atrOldValue = el.oldValue as string;
          let oldValue: number | boolean;

          const camelCaseName: keyof SliderOptions = camelCase(
            atrName.slice(5)
          ) as keyof SliderOptions;
          const valFromOptions = this.getOptions()[camelCaseName];
          const newValueString = selector.dataset[camelCaseName] as string;

          if (atrOldValueIsNumber(atrName)) {
            oldValue = toNumber(atrOldValue, valFromOptions as number);
            oldValues[atrName] = oldValue;
          } else if (atrOldValueIsBoolean(atrName)) {
            oldValue = toBoolean(atrOldValue);
            oldValues[atrName] = oldValue;
          }

          newValues[atrName] = newValueString;
          currentValues[atrName] = valFromOptions;
          return { oldValues, newValues, currentValues };
        });

        if (isNeedToChangeNewVal(currentAtrName, newValues)) {
          selector.setAttribute(
            currentAtrName,
            currentValues[currentAtrName].toString()
          );
          newValues[currentAtrName] = currentValues[currentAtrName].toString();
        }

        if (
          newValues[currentAtrName] !== oldValues[currentAtrName].toString()
        ) {
          const value = camelCase(currentAtrName.slice(5));
          this.setOptions({ [value]: newValues[currentAtrName] });
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(selector, {
        attributes: true,
        attributeOldValue: true
      });
    },

    JQSlider(method: string, newOptions?: Partial<SliderOptions>): JQResult {
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
  slider.observeDataAtr();
  return slider;
};

export { create };
