import $ from 'jquery';

import '../scss/slider.scss';
import { create } from './slider';
import { JQResult, JQueryMethod, SliderOptions } from './type';

declare global {
  interface JQuery {
    JQSlider(options?: Partial<SliderOptions>): JQuery;
    JQSlider(method: JQueryMethod, newOptions?: SliderOptions): JQResult;
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
