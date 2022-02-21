import $ from 'jquery';

import '../components/JQplugin';
import '../components/slider';
import { Slider, SliderOptions } from './type';

function getExampleDOM() {
  const div = document.createElement('div');
  return div;
}

describe('JQuery plugin', () => {
  let container: HTMLElement;
  let slider: JQuery<HTMLElement>;

  beforeEach(() => {
    container = getExampleDOM();
  });

  test('check getOptions', () => {
    slider = $(container).JQSlider() as JQuery<HTMLElement>;
    const options = slider.JQSlider('getOptions') as SliderOptions;
    expect(options.minValue).toBe(0);
  });

  test('check getContainer', () => {
    slider = $(container).JQSlider() as JQuery<HTMLElement>;
    const containerFromOptions = slider.JQSlider('getContainer');
    expect(containerFromOptions).toBeInstanceOf(HTMLElement);
  });

  test('check setOptions', () => {
    slider = $(container).JQSlider() as JQuery<HTMLElement>;
    slider.JQSlider('setOptions', {
      maxValue: 155
    });
    const options = slider.JQSlider('getOptions') as SliderOptions;
    expect(options.maxValue).toBe(155);
  });

  test('check getFirstValue', () => {
    slider = $(container).JQSlider() as JQuery<HTMLElement>;
    const valueStart = slider.JQSlider('getFirstValue');
    expect(valueStart).toBe(40);
  });

  test('check getSecondValue', () => {
    slider = $(container).JQSlider() as JQuery<HTMLElement>;
    const valueEnd = slider.JQSlider('getSecondValue');
    expect(valueEnd).toBe(50);
  });

  test('check get slider', () => {
    slider = $(container).JQSlider() as JQuery<HTMLElement>;
    const sliderFn = slider.JQSlider('getSlider') as Slider;
    expect(sliderFn.getFirstValue()).toBe(40);
  });

  test('check return default null', () => {
    slider = $(container).JQSlider() as JQuery<HTMLElement>;
    const sliderFn = slider.JQSlider();
    expect(sliderFn).toBe(null);
  });
});
