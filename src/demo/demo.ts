/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery';

import { sliderOptions } from '../components/type';
import '../components/slider';
import '../components/JQplugin';

const slider = $('#app').JQSlider() as JQuery;
slider.JQSlider('addControlPanel');

const sliderSecondConfig: Partial<sliderOptions> = {
  minValue: -0.11,
  maxValue: 0.1,
  step: 0.1,
  scalePointCount: 3,
  range: true
};

const sliderThirdConfig: Partial<sliderOptions> = {
  minValue: -500,
  maxValue: -400,
  valueStart: -450,
  range: true,
  showProgress: true,
  scalePointCount: 5
};

const sliderFourthConfig: Partial<sliderOptions> = {
  isVertical: true,
  showProgress: true
};

const sliderSecond = $('#app_2').JQSlider(sliderSecondConfig) as JQuery;
const sliderSecondPanel = sliderSecond.JQSlider('addControlPanel');

const sliderThird = $('#app_3').JQSlider(sliderThirdConfig) as JQuery;
const sliderThirdPanel = sliderThird.JQSlider('addControlPanel');

const sliderFourth = $('#app_4').JQSlider(sliderFourthConfig) as JQuery;
const sliderFourthPanel = sliderFourth.JQSlider('addControlPanel');
