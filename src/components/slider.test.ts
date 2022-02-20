import Model from './Model/Model';
import Panel from './Panel/Panel';
import { create } from './slider';
import { Slider, SliderOptions } from './type';
import View from './View/View';

function getExampleDOM() {
  const div = document.createElement('div');
  return div;
}

const options: SliderOptions = {
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
};

describe('Slider', () => {
  let container: HTMLElement;
  let slider: Slider;
  let sliderDefault: Slider;

  beforeEach(() => {
    container = getExampleDOM();
    slider = create(container, options);
  });

  test('check correct return valueStart', () => {
    expect(slider.getFirstValue()).toBe(40);
  });

  test('check correct return valueEnd', () => {
    expect(slider.getSecondValue()).toBe(50);
  });

  test('check correct return valueStart when default options', () => {
    sliderDefault = create(container);
    expect(sliderDefault.getFirstValue()).toBe(
      sliderDefault.getOptions().valueStart
    );
  });

  test('check correct return container', () => {
    expect(slider.getContainer()).toBe(container);
  });

  test('check add control panel', () => {
    expect(slider.addControlPanel()).toBeInstanceOf(Panel);
  });

  test('check correct change options with control panel', () => {
    slider.addControlPanel();
    slider.setOptions({ minValue: 10 });
    expect(slider.getOptions().minValue).toBe(10);
  });

  test('check get Model', () => {
    const model = slider.getModel();
    expect(model).toBeInstanceOf(Model);
  });

  test('check get View', () => {
    const view = slider.getView();
    expect(view).toBeInstanceOf(View);
  });
});
