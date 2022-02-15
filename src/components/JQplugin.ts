import $ from 'jquery';

import '../scss/slider.scss';
import { create } from './slider';
import { SliderOptions } from './type';

declare global {
  interface JQuery {
    JQSlider(
      methodOrOptions?: string | SliderOptions,
      newOptions?: SliderOptions
    ): JQuery | SliderOptions;
  }
}

$.fn.extend({
  JQSlider(options?: SliderOptions) {
    return create((<JQuery>this)[0], options);
  }
});

const sliders = document.querySelectorAll(
  '.super-slider-here'
) as NodeListOf<HTMLElement>;

sliders.forEach((slider) => create(slider));
