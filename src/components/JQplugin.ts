import $ from 'jquery';

import '../scss/slider.scss';
import { create } from './slider';
import { sliderOptions } from './type';

declare global {
  interface JQuery {
    JQSlider(
      methodOrOptions?: string | sliderOptions,
      newOptions?: sliderOptions
    ): JQuery;
  }
}

$.fn.extend({
  JQSlider(options: sliderOptions) {
    return create((<JQuery>this)[0], options);
  }
});

const sliders = document.querySelectorAll(
  '.super-slider-here'
) as NodeListOf<HTMLElement>;

sliders.forEach((slider) => create(slider));
