export const MAX_SCALE_POINT_COUNT = 11;
export const MIN_SCALE_POINT_COUNT = 2;
export const VERTICAL_CLASS = 'range-slider_vertical';
export const TOOLTIP_HIDE_CLASS = 'range-slider__tooltip_hide';
export const JS_SCALE_POINT_CLASS = 'js-range-slider__scale_point';

export const MIN_STEP = 0.1;
export const STEP_DECIMAL_PART: number = MIN_STEP < 1 ? 1 / MIN_STEP : 1;
export const STEP_NUMBER_OF_ZEROS: number =
  MIN_STEP < 1 ? STEP_DECIMAL_PART.toString().length - 1 : 0;

export const Z_INDEX_DEFAULT = '1';
export const Z_INDEX_BIG = '2';
