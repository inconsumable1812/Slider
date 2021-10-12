import { create } from './slider'
import { sliderOptions } from './type'
import $ from 'jquery'

declare global {
  interface JQuery {
    JQSlider(options?: sliderOptions | string): JQuery
  }
}

$.fn.extend({
  JQSlider(options: sliderOptions) {
    return create((<JQuery>this)[0], options)
  }
})

export default $.fn.JQSlider
