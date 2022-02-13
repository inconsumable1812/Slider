import Model from '../Model/Model';
import { ModelOptions, ViewOptions } from '../type';
import View from '../View/View';
import Presenter from './Presenter';

function getExampleDOM() {
  const div = document.createElement('div');
  return div;
}

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  valueStart: 10,
  valueEnd: 80,
  range: false
};

const DEFAULT_VIEW_OPTIONS: ViewOptions = {
  scalePointCount: 11,
  showTooltip: true,
  isVertical: false,
  showProgress: false,
  showScale: true
};

describe('Presenter', () => {
  let container: HTMLElement;
  let presenter: Presenter;
  let view: View;
  let model: Model;

  beforeEach(() => {
    container = getExampleDOM();
    model = new Model(DEFAULT_MODEL_OPTIONS, container);
    view = new View({
      selector: container,
      modelOptions: DEFAULT_MODEL_OPTIONS,
      viewOptions: DEFAULT_VIEW_OPTIONS
    });
    presenter = new Presenter(model, view);
  });

  test('check return correct model options', () => {
    expect(presenter.getModelOptions().minValue).toBe(0);
  });

  test('check set correct model options', () => {
    presenter.setModelOptions({ minValue: 30 });
    expect(presenter.getModelOptions().minValue).toBe(30);
  });

  test('check correct update view', () => {
    model.setOptions({ valueStart: 40 });
    expect(view.getComponents().firstHandle.getValue()).toBe(40);
    expect(view.getComponents().firstHandle.getStyleValue()).toBe(40);
  });
  test('check unsubscribe', () => {
    presenter.unsubscribe();
    model.setOptions({ valueStart: 40 });
    expect(view.getComponents().firstHandle.getValue()).toBe(10);
    expect(view.getComponents().firstHandle.getStyleValue()).toBe(10);
  });
});
