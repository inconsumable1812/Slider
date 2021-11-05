/* eslint-disable @typescript-eslint/no-var-requires */
import { ModelOptions, ViewOptions } from '../type';
import View from './View';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div id="app" class="container"></div>`);
const selector = dom.window.document.querySelector('#app');

const modelOptions1: ModelOptions = {
  minValue: 0,
  maxValue: 100,
  step: 1,
  valueStart: 44,
  valueEnd: 80,
  range: false
};

const modelOptions2: ModelOptions = {
  minValue: 0,
  maxValue: 100,
  step: 2,
  valueStart: 10,
  valueEnd: 99,
  range: true
};

const viewOptions2: ViewOptions = {
  scalePointCount: 5,
  showTooltip: true,
  isVertical: true,
  showProgress: true,
  showScale: true
};

const viewOptions3: ViewOptions = {
  scalePointCount: 0,
  showTooltip: false,
  isVertical: false,
  showProgress: false,
  showScale: false
};

const viewOptions4: ViewOptions = {
  scalePointCount: 15,
  showTooltip: false,
  isVertical: false,
  showProgress: true,
  showScale: true
};

describe('View', () => {
  let viewDefault: View;
  let viewAllTrue: View;
  let viewAllFalse: View;
  let view4: View;
  beforeEach(() => {
    viewDefault = new View(selector, modelOptions1);
    viewAllTrue = new View(selector, modelOptions2, viewOptions2);
    viewAllFalse = new View(selector, modelOptions1, viewOptions3);
    view4 = new View(selector, modelOptions1, viewOptions4);
  });

  test('root is HTMLElement', () => {
    viewDefault.render();
    expect(viewDefault.root).toBeInstanceOf(HTMLElement);
  });

  test('root is HTMLElement, 2 option', () => {
    viewAllTrue.render();
    expect(viewAllTrue.root).toBeInstanceOf(HTMLElement);
  });

  test('root is HTMLElement, 3 option', () => {
    viewAllFalse.render();
    expect(viewAllFalse.root).toBeInstanceOf(HTMLElement);
  });

  test('correct update viewDefault, 1 option', () => {
    viewDefault.render();
    viewDefault.setOptions({
      scalePointCount: 2,
      showTooltip: false,
      isVertical: true,
      showProgress: true,
      showScale: true
    });
    viewDefault.changeModelOptions({
      minValue: 40,
      maxValue: 144,
      step: 3,
      valueStart: 43,
      valueEnd: 144,
      range: true
    });
    viewDefault.updateView();
    expect(viewDefault.getModel().valueStart).toBe(43);
  });

  test('correct update viewDefault, 2 option', () => {
    viewAllTrue.render();
    viewAllTrue.setOptions({
      scalePointCount: 4,
      showTooltip: false,
      isVertical: false,
      showProgress: false,
      showScale: false
    });
    viewAllTrue.changeModelOptions({
      minValue: 50,
      maxValue: 150,
      step: 5,
      valueStart: 50,
      valueEnd: 150,
      range: false
    });
    viewAllTrue.updateView();
    expect(viewAllTrue.getOptions().scalePointCount).toBe(4);
  });

  test('correct update viewDefault, 3 option', () => {
    viewAllFalse.render();
    viewAllFalse.setOptions({
      scalePointCount: 4,
      showTooltip: true,
      isVertical: true,
      showProgress: true,
      showScale: true
    });
    viewAllFalse.changeModelOptions({
      minValue: 40,
      maxValue: 150,
      step: 5,
      valueStart: 45,
      valueEnd: 145,
      range: true
    });
    viewAllFalse.updateView();
    expect(viewAllFalse.getModel().valueStart).toBe(45);
  });

  test('correct update viewDefault, 4 option', () => {
    view4.render();
    view4.setOptions({
      scalePointCount: 4,
      showTooltip: false,
      isVertical: true,
      showProgress: true,
      showScale: true
    });
    view4.changeModelOptions({
      minValue: 40,
      maxValue: 150,
      step: 5,
      valueStart: 45,
      valueEnd: 145,
      range: false
    });
    view4.updateView();
    expect(view4.getModel().valueStart).toBe(45);
  });

  test('check click on track', () => {
    viewDefault.render();
    const fn = jest.fn();
    viewDefault.subscribe('viewChanged', fn);
    const track = viewDefault.getComponents().track;
    track.element.dispatchEvent(new Event('mousedown'));
    expect(fn).toBeCalled();
  });

  test('check click on track with range true', () => {
    viewAllTrue.render();
    const fn = jest.fn();
    viewAllTrue.subscribe('viewChanged', fn);
    const track = viewAllTrue.getComponents().track;
    track.element.dispatchEvent(new Event('mousedown'));
    expect(fn).toBeCalled();
  });

  test('check mousemove on track', () => {
    viewDefault.render();
    const fn = jest.fn();
    viewDefault.subscribe('viewChanged', fn);
    const firstHandle = viewDefault.getComponents().firstHandle;
    firstHandle.element.dispatchEvent(new Event('mousedown'));
    document.dispatchEvent(new Event('mousemove'));
    document.dispatchEvent(new Event('mouseup'));
    expect(fn).toBeCalled();
  });

  test('check mousemove on track with range true', () => {
    viewAllTrue.render();
    const fn = jest.fn();
    viewAllTrue.subscribe('viewChanged', fn);
    const firstHandle = viewAllTrue.getComponents().firstHandle;
    firstHandle.element.dispatchEvent(new Event('mousedown'));
    document.dispatchEvent(new Event('mousemove'));
    document.dispatchEvent(new Event('mouseup'));
    expect(fn).toBeCalled();
  });

  test('check mousemove on track with options 4', () => {
    view4.render();
    const fn = jest.fn();
    view4.subscribe('viewChanged', fn);
    const firstHandle = view4.getComponents().firstHandle;
    firstHandle.element.dispatchEvent(new Event('mousedown'));
    document.dispatchEvent(new Event('mousemove'));
    document.dispatchEvent(new Event('mouseup'));
    expect(fn).toBeCalled();
  });

  test('check click on scale with range true', () => {
    viewAllTrue.render();
    const fn = jest.fn();
    viewAllTrue.subscribe('viewChanged', fn);
    const scale = viewAllTrue.getComponents().scale;
    scale!.element.dispatchEvent(new Event('click'));
    expect(fn).toBeCalled();
  });

  test('check click on scale with range false', () => {
    view4.render();
    const fn = jest.fn();
    view4.subscribe('viewChanged', fn);
    const scale = view4.getComponents().scale;
    scale!.element.dispatchEvent(new Event('click'));
    expect(fn).toBeCalled();
  });

  test('check merge tooltip', () => {
    viewAllTrue.render();
    viewAllTrue.changeModelOptions({ valueStart: 97 });
    viewAllTrue.updateView();
    const firstTooltip: string = viewAllTrue.getComponents().firstHandle.getTooltipContent()!;
    expect(firstTooltip).toBe('97...99');
    viewAllTrue.changeModelOptions({ valueStart: 5 });
    viewAllTrue.updateView();
    const newFirstTooltip: string = viewAllTrue.getComponents().firstHandle.getTooltipContent()!;
    expect(newFirstTooltip).toBe('5');
  });
});
