/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery';

import { Slider, SliderOptions } from '../components/type';
import Panel from '../components/Panel/Panel';
import '../components/slider';
import '../components/JQplugin';

const firstSelector = $('#app');
const slider = firstSelector.JQSlider() as JQuery;
const firstPanel = new Panel(
  firstSelector[0],
  slider.JQSlider('getSlider') as Slider
);

const sliderSecondConfig: Partial<SliderOptions> = {
  minValue: -0.11,
  maxValue: 0.1,
  step: 0.1,
  scalePointCount: 3,
  range: true
};

const sliderThirdConfig: Partial<SliderOptions> = {
  minValue: -500,
  maxValue: -400,
  valueStart: -450,
  range: true,
  showProgress: true,
  scalePointCount: 5
};

const sliderFourthConfig: Partial<SliderOptions> = {
  isVertical: true,
  showProgress: true
};

const secondSelector = $('#app_2');
const sliderSecond = secondSelector.JQSlider(sliderSecondConfig) as JQuery;
const sliderSecondPanel = new Panel(
  secondSelector[0],
  sliderSecond.JQSlider('getSlider') as Slider
);

const thirdSelector = $('#app_3');
const sliderThird = thirdSelector.JQSlider(sliderThirdConfig) as JQuery;
const sliderThirdPanel = new Panel(
  thirdSelector[0],
  sliderThird.JQSlider('getSlider') as Slider
);

const fourthSelector = $('#app_4');
const sliderFourth = fourthSelector.JQSlider(sliderFourthConfig) as JQuery;
const sliderFourthPanel = new Panel(
  fourthSelector[0],
  sliderFourth.JQSlider('getSlider') as Slider
);
