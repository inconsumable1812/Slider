import { ModelOptions, ViewListeners, ViewOptions } from '../type';
import Handle from './Handle/Handle';
import Track from './Track/Track';
import View from './View';
import {
  findClosestHandle,
  findClosestHandleFromPercent
} from './view.function';

function getExampleDOM() {
  const div = document.createElement('div');
  return div;
}

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
  let container: HTMLElement;
  let viewDefault: View;
  let viewAllTrue: View;
  let viewAllFalse: View;
  let view4: View;
  beforeEach(() => {
    container = getExampleDOM();
    viewDefault = new View({
      selector: container,
      modelOptions: modelOptions1
    });
    viewAllTrue = new View({
      selector: container,
      modelOptions: modelOptions2,
      options: viewOptions2
    });
    viewAllFalse = new View({
      selector: container,
      modelOptions: modelOptions1,
      options: viewOptions3
    });
    view4 = new View({
      selector: container,
      modelOptions: modelOptions1,
      options: viewOptions4
    });
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
    viewDefault.subscribe(ViewListeners.viewChangeModel, fn);
    const track = viewDefault.getComponents().track;
    track.element.dispatchEvent(new Event('pointerdown'));
    expect(fn).toBeCalled();
  });

  test('check click on track with range true', () => {
    viewAllTrue.render();
    const fn = jest.fn();
    viewAllTrue.subscribe(ViewListeners.viewChangeModel, fn);
    const track = viewAllTrue.getComponents().track;
    track.element.dispatchEvent(new Event('pointerdown'));
    expect(fn).toBeCalled();
  });

  test('check click on handle', () => {
    viewDefault.render();
    const fn = jest.fn();
    viewDefault.subscribe(ViewListeners.viewChangeModel, fn);
    const firstHandle = viewDefault.getComponents().firstHandle;
    firstHandle.element.dispatchEvent(new Event('pointerdown'));
    document.dispatchEvent(new Event('pointermove'));
    document.dispatchEvent(new Event('pointerup'));
    expect(fn).toBeCalled();
  });

  test('check click on handle with range true', () => {
    viewAllTrue.render();
    const fn = jest.fn();
    viewAllTrue.subscribe(ViewListeners.viewChangeModel, fn);
    const secondHandle = viewAllTrue.getComponents().secondHandle;
    secondHandle.element.dispatchEvent(new Event('pointerdown'));
    document.dispatchEvent(new Event('pointermove'));
    document.dispatchEvent(new Event('pointerup'));
    expect(fn).toBeCalled();
  });

  test('check click on handle with options 4', () => {
    view4.render();
    const fn = jest.fn();
    view4.subscribe(ViewListeners.viewChangeModel, fn);
    const firstHandle = view4.getComponents().firstHandle;
    firstHandle.element.dispatchEvent(new Event('pointerdown'));
    document.dispatchEvent(new Event('pointermove'));
    document.dispatchEvent(new Event('pointerup'));
    expect(fn).toBeCalled();
  });

  test('check click on scale with range true', () => {
    viewAllTrue.render();
    const fn = jest.fn();
    viewAllTrue.subscribe(ViewListeners.viewChanged, fn);
    const scale = viewAllTrue.getComponents().scale;
    scale.element.dispatchEvent(new Event('click'));
    expect(fn).toBeCalled();
  });

  test('check click on scale with range false', () => {
    view4.render();
    const fn = jest.fn();
    view4.subscribe(ViewListeners.viewChanged, fn);
    const scale = view4.getComponents().scale;
    scale.element.dispatchEvent(new Event('click'));
    expect(fn).toBeCalled();
  });

  test('check merge tooltip', () => {
    viewAllTrue.render();
    viewAllTrue.changeModelOptions({ valueStart: 97 });
    viewAllTrue.updateView();
    const firstTooltip: string = viewAllTrue
      .getComponents()
      .firstHandle.getTooltipContent()!;

    const firstHandle = viewAllTrue.getComponents().firstHandle;
    const secondHandle = viewAllTrue.getComponents().secondHandle;
    firstHandle.getRectangleTooltip = jest.fn().mockReturnValue({
      bottom: 84.48,
      height: 21.99,
      left: 544.1,
      right: 602.7,
      top: 62.49,
      width: 58.55,
      x: 544.1,
      y: 62.49
    });
    secondHandle.getRectangleTooltip = jest.fn().mockReturnValue({
      bottom: 84.48,
      height: 21.99,
      left: 544.1,
      right: 602.7,
      top: 62.49,
      width: 58.55,
      x: 544.1,
      y: 62.49
    });
    expect(firstTooltip).toBe('97...99');
    firstHandle.getRectangleTooltip = jest.fn().mockReturnValue({
      bottom: 8.48,
      height: 2.99,
      left: 54.1,
      right: 60.7,
      top: 6.49,
      width: 5.55,
      x: 54.1,
      y: 6.49
    });
    viewAllTrue.changeModelOptions({ valueStart: 5 });
    viewAllTrue.updateView();
    const newFirstTooltip: string = viewAllTrue
      .getComponents()
      .firstHandle.getTooltipContent()!;
    expect(newFirstTooltip).toBe('5');
  });

  test('check unMerge tooltip, when range became false', () => {
    viewAllTrue.render();
    viewAllTrue.changeModelOptions({ valueStart: 97 });
    viewAllTrue.updateView();
    const firstTooltip: string = viewAllTrue
      .getComponents()
      .firstHandle.getTooltipContent()!;
    expect(firstTooltip).toBe('97...99');
    viewAllTrue.changeModelOptions({ range: false });
    viewAllTrue.updateView();
    const newFirstTooltip: string = viewAllTrue
      .getComponents()
      .firstHandle.getTooltipContent()!;
    expect(newFirstTooltip).toBe('97');
  });
});

describe('check change data attribute, view', () => {
  let container: HTMLElement;
  let viewDefault: View;

  test('check data-scale-point-count', () => {
    container = getExampleDOM();
    viewDefault = new View({
      selector: container,
      modelOptions: modelOptions1
    });
    viewDefault.render();
    container.setAttribute('data-scale-point-count', 'error');
    expect(viewDefault.getOptions().scalePointCount).toBe(11);
  });

  test('check data-show-tooltip', () => {
    container = getExampleDOM();
    viewDefault = new View({
      selector: container,
      modelOptions: modelOptions1
    });
    viewDefault.render();
    container.setAttribute('data-show-tooltip', 'error');
    expect(viewDefault.getOptions().showTooltip).toBeTruthy();
  });

  test('check data-is-vertical', () => {
    container = getExampleDOM();
    viewDefault = new View({
      selector: container,
      modelOptions: modelOptions1
    });
    viewDefault.render();
    container.setAttribute('data-is-vertical', 'error');
    expect(viewDefault.getOptions().isVertical).toBeFalsy();
  });

  test('check data-show-progress', () => {
    container = getExampleDOM();
    viewDefault = new View({
      selector: container,
      modelOptions: modelOptions1
    });
    viewDefault.render();
    container.setAttribute('data-show-progress', 'error');
    expect(viewDefault.getOptions().showProgress).toBeFalsy();
  });

  test('check data-show-scale', () => {
    container = getExampleDOM();
    viewDefault = new View({
      selector: container,
      modelOptions: modelOptions1
    });
    viewDefault.render();
    container.setAttribute('data-show-scale', 'error');
    expect(viewDefault.getOptions().showScale).toBeTruthy();
  });

  test('check find closest Handle', () => {
    const track = new Track({
      minValue: 0,
      maxValue: 100,
      isVertical: false,
      step: 1
    });
    const firstHandle = new Handle({
      handleNumber: 1,
      isVertical: false,
      showTooltip: false,
      step: 1,
      track,
      value: 40
    });
    const secondHandle = new Handle({
      handleNumber: 2,
      isVertical: false,
      showTooltip: false,
      step: 1,
      track,
      value: 50
    });
    const closestHandle = findClosestHandle({
      firstHandle,
      secondHandle,
      clickValue: 49
    });
    expect(closestHandle).toBe(secondHandle);
  });

  test('check find closest Handle from percent', () => {
    const track = new Track({
      minValue: 0,
      maxValue: 100,
      isVertical: false,
      step: 1
    });
    const firstHandle = new Handle({
      handleNumber: 1,
      isVertical: false,
      showTooltip: false,
      step: 1,
      track,
      value: 40
    });
    const secondHandle = new Handle({
      handleNumber: 2,
      isVertical: false,
      showTooltip: false,
      step: 1,
      track,
      value: 50
    });
    const closestHandle = findClosestHandleFromPercent({
      firstHandle,
      secondHandle,
      percent: 0.41
    });
    expect(closestHandle).toBe(firstHandle);
  });
});
