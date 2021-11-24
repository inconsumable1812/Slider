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

export default $.fn.JQSlider;
