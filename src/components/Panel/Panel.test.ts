import { create } from '../slider';
import { Slider, sliderOptions } from '../type';
import Panel from './Panel';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div id="app" class="container"></div>`);
const selector = dom.window.document.querySelector('#app');

const options: sliderOptions = {
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

describe('Panel', () => {
  let panel: Panel;
  let slider: Slider;
  const changeEvent = new InputEvent('change');
  const pointerdown = new Event('pointerdown');
  const pointerup = new Event('pointerup');
  const pointermove = new Event('pointermove');
  const click = new Event('click');
  const focus = new Event('focus');
  const blur = new Event('blur');

  beforeEach(() => {
    slider = create(selector, options);
    panel = new Panel(selector, slider);
    panel.init();
  });

  test('root is HTMLElement', () => {
    expect(panel.root).toBeInstanceOf(HTMLElement);
  });

  test('check correct change minValue', () => {
    const newMin = 20;
    const minValue = panel.getInputs().minValue;
    minValue.value = newMin.toString();
    minValue.dispatchEvent(changeEvent);
    expect(slider.getOptions().minValue).toBe(newMin);
  });

  test('check correct change maxValue', () => {
    const newMax = 200;
    const maxValue = panel.getInputs().maxValue;
    maxValue.value = newMax.toString();
    maxValue.dispatchEvent(changeEvent);
    expect(slider.getOptions().maxValue).toBe(newMax);
  });

  test('check correct change valueStart', () => {
    const newValue = 15;
    const valueStart = panel.getInputs().valueStart;
    valueStart.value = newValue.toString();
    valueStart.dispatchEvent(changeEvent);
    expect(slider.getOptions().valueStart).toBe(newValue);
  });

  test('check correct change valueEnd', () => {
    const newValue = 80;
    const valueEnd = panel.getInputs().valueEnd;
    valueEnd.value = newValue.toString();
    valueEnd.dispatchEvent(changeEvent);
    expect(slider.getOptions().valueEnd).toBe(newValue);
  });

  test('check correct change step', () => {
    const newStep = 3;
    const step = panel.getInputs().step;
    step.value = newStep.toString();
    step.dispatchEvent(changeEvent);
    expect(slider.getOptions().step).toBe(newStep);
  });

  test('check correct change scale point', () => {
    const newPoint = 5;
    const scalePointCount = panel.getInputs().scalePointCount;
    scalePointCount.value = newPoint.toString();
    scalePointCount.dispatchEvent(changeEvent);
    expect(slider.getOptions().scalePointCount).toBe(newPoint);
  });

  test('check correct change range', () => {
    const newRange = true;
    const range = panel.getInputs().range;
    range.checked = newRange;
    range.dispatchEvent(changeEvent);
    expect(slider.getOptions().range).toBe(newRange);
  });

  test('check correct change progress', () => {
    const newProgress = true;
    const showProgress = panel.getInputs().showProgress;
    showProgress.checked = newProgress;
    showProgress.dispatchEvent(changeEvent);
    expect(slider.getOptions().showProgress).toBe(newProgress);
  });

  test('check correct change tooltip', () => {
    const newTooltip = false;
    const showTooltip = panel.getInputs().showTooltip;
    showTooltip.checked = newTooltip;
    showTooltip.dispatchEvent(changeEvent);
    expect(slider.getOptions().showTooltip).toBe(newTooltip);
  });

  test('check correct change visibly of scale', () => {
    const newScale = false;
    const showScale = panel.getInputs().showScale;
    showScale.checked = newScale;
    showScale.dispatchEvent(changeEvent);
    expect(slider.getOptions().showScale).toBe(newScale);
  });

  test('check correct change orientation', () => {
    const newOrientation = true;
    const isVertical = panel.getInputs().isVertical;
    isVertical.checked = newOrientation;
    isVertical.dispatchEvent(changeEvent);
    expect(slider.getOptions().isVertical).toBe(newOrientation);
  });

  test('check correct change value when click on track', () => {
    const track = slider.getViewRoot();
    track.dispatchEvent(pointerdown);
    track.dispatchEvent(pointermove);
    track.dispatchEvent(pointerup);
    track.dispatchEvent(click);
    expect(slider.getOptions().valueStart).toBe(40);
  });

  describe('if new value is undefined', () => {
    test('check correct change minValue', () => {
      const newMin = '';
      const minValue = panel.getInputs().minValue;
      minValue.value = newMin;
      minValue.dispatchEvent(changeEvent);
      expect(slider.getOptions().minValue).toBe(0);
    });

    test('check correct change maxValue', () => {
      const newMax = '';
      const maxValue = panel.getInputs().maxValue;
      maxValue.value = newMax;
      maxValue.dispatchEvent(changeEvent);
      expect(slider.getOptions().maxValue).toBe(100);
    });

    test('check correct change valueStart', () => {
      const newValue = '';
      const valueStart = panel.getInputs().valueStart;
      valueStart.value = newValue;
      valueStart.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueStart).toBe(40);
    });

    test('check correct change valueEnd', () => {
      const newValue = '';
      const valueEnd = panel.getInputs().valueEnd;
      valueEnd.value = newValue;
      valueEnd.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueEnd).toBe(50);
    });

    test('check correct change step', () => {
      const newStep = '';
      const step = panel.getInputs().step;
      step.value = newStep;
      step.dispatchEvent(changeEvent);
      expect(slider.getOptions().step).toBe(1);
    });

    test('check correct change scale point', () => {
      const newPoint = '';
      const scalePointCount = panel.getInputs().scalePointCount;
      scalePointCount.value = newPoint;
      scalePointCount.dispatchEvent(changeEvent);
      expect(slider.getOptions().scalePointCount).toBe(11);
    });
  });

  describe('incorrect new values', () => {
    test('when new minValue bigger maxValue', () => {
      const newMin = 101;
      const minValue = panel.getInputs().minValue;
      minValue.value = newMin.toString();
      minValue.dispatchEvent(changeEvent);
      expect(slider.getOptions().minValue).toBe(99);
    });

    test('when new minValue bigger than range', () => {
      const newMin = 3;
      const newStep = 99;
      const minValue = panel.getInputs().minValue;
      const step = panel.getInputs().step;
      step.value = newStep.toString();
      step.dispatchEvent(changeEvent);
      minValue.value = newMin.toString();
      minValue.dispatchEvent(changeEvent);
      expect(slider.getOptions().minValue).toBe(1);
    });

    test('when new maxValue less minValue', () => {
      const newMax = -5;
      const maxValue = panel.getInputs().maxValue;
      maxValue.value = newMax.toString();
      maxValue.dispatchEvent(changeEvent);
      expect(slider.getOptions().maxValue).toBe(-5);
    });

    test('when new maxValue bigger than range', () => {
      const newMax = 90;
      const newStep = 99;
      const maxValue = panel.getInputs().maxValue;
      const step = panel.getInputs().step;
      step.value = newStep.toString();
      step.dispatchEvent(changeEvent);
      maxValue.value = newMax.toString();
      maxValue.dispatchEvent(changeEvent);
      expect(slider.getOptions().maxValue).toBe(100);
    });

    test('when new valueStart less minValue', () => {
      const newValue = -5;
      const valueStart = panel.getInputs().valueStart;
      valueStart.value = newValue.toString();
      valueStart.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueStart).toBe(0);
    });

    test('when new valueStart bigger maxValue', () => {
      const newValue = 150;
      const valueStart = panel.getInputs().valueStart;
      valueStart.value = newValue.toString();
      valueStart.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueStart).toBe(100);
    });

    test('when new valueStart bigger valueEnd, range true', () => {
      const newValue = 60;
      const rangeOptions = true;
      const valueStart = panel.getInputs().valueStart;
      const range = panel.getInputs().range;
      range.checked = rangeOptions;
      range.dispatchEvent(changeEvent);
      valueStart.value = newValue.toString();
      valueStart.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueStart).toBe(40);
    });

    test('when new valueEnd less minValue', () => {
      const newValue = -5;
      const valueEnd = panel.getInputs().valueEnd;
      valueEnd.value = newValue.toString();
      valueEnd.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueEnd).toBe(50);
    });

    test('when new valueEnd bigger maxValue', () => {
      const newValue = 150;
      const valueEnd = panel.getInputs().valueEnd;
      valueEnd.value = newValue.toString();
      valueEnd.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueEnd).toBe(100);
    });

    test('when new valueEnd less valueStart, range true', () => {
      const newValue = 20;
      const rangeOptions = true;
      const valueEnd = panel.getInputs().valueEnd;
      const range = panel.getInputs().range;
      range.checked = rangeOptions;
      range.dispatchEvent(changeEvent);
      valueEnd.value = newValue.toString();
      valueEnd.dispatchEvent(changeEvent);
      expect(slider.getOptions().valueEnd).toBe(50);
    });

    test('when new step bigger than range', () => {
      const newStep = 150;
      const step = panel.getInputs().step;
      step.value = newStep.toString();
      step.dispatchEvent(changeEvent);
      expect(slider.getOptions().step).toBe(1);
    });

    test('when new scale point less than 2', () => {
      const newScalePoint = -3;
      const scalePointCount = panel.getInputs().scalePointCount;
      scalePointCount.value = newScalePoint.toString();
      scalePointCount.dispatchEvent(changeEvent);
      expect(slider.getOptions().scalePointCount).toBe(2);
    });

    test('when new scale point bigger than 11', () => {
      const newScalePoint = 333;
      const scalePointCount = panel.getInputs().scalePointCount;
      scalePointCount.value = newScalePoint.toString();
      scalePointCount.dispatchEvent(changeEvent);
      expect(slider.getOptions().scalePointCount).toBe(11);
    });
  });

  describe('blur when input value is empty', () => {
    test('maxValue', () => {
      const newMax = '';
      const maxValue = panel.getInputs().maxValue;
      maxValue.dispatchEvent(focus);
      maxValue.value = newMax;
      maxValue.dispatchEvent(blur);
      expect(+maxValue.value).toBe(slider.getOptions().maxValue);
    });

    test('minValue', () => {
      const newMin = '';
      const minValue = panel.getInputs().minValue;
      minValue.dispatchEvent(focus);
      minValue.value = newMin;
      minValue.dispatchEvent(blur);
      expect(+minValue.value).toBe(slider.getOptions().minValue);
    });

    test('valueStart', () => {
      const newValue = '';
      const valueStart = panel.getInputs().valueStart;
      valueStart.dispatchEvent(focus);
      valueStart.value = newValue;
      valueStart.dispatchEvent(blur);
      expect(+valueStart.value).toBe(slider.getOptions().valueStart);
    });

    test('valueEnd', () => {
      const newValue = '';
      const valueEnd = panel.getInputs().valueEnd;
      valueEnd.dispatchEvent(focus);
      valueEnd.value = newValue;
      valueEnd.dispatchEvent(blur);
      expect(+valueEnd.value).toBe(slider.getOptions().valueEnd);
    });

    test('step', () => {
      const newStep = '';
      const step = panel.getInputs().step;
      step.dispatchEvent(focus);
      step.value = newStep;
      step.dispatchEvent(blur);
      expect(+step.value).toBe(slider.getOptions().step);
    });

    test('scalePointCount', () => {
      const newScaleCount = '';
      const scalePointCount = panel.getInputs().scalePointCount;
      scalePointCount.dispatchEvent(focus);
      scalePointCount.value = newScaleCount;
      scalePointCount.dispatchEvent(blur);
      expect(+scalePointCount.value).toBe(slider.getOptions().scalePointCount);
    });
  });
});
