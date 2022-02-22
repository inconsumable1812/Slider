import Handle from './Handle';
import { ModelOptions, ViewOptions } from '../../type';
import Track from '../Track/Track';

const modelOptions: Omit<ModelOptions, 'valueEnd' | 'range'> = {
  minValue: 0,
  maxValue: 100,
  valueStart: 15,
  step: 1
};

const viewOptions: Pick<ViewOptions, 'showTooltip' | 'isVertical'> = {
  showTooltip: false,
  isVertical: true
};

const { minValue, maxValue, valueStart, step } = modelOptions;
const { showTooltip, isVertical } = viewOptions;
const isVerticalFalse = false;
const firstHandleNumber = 1;
const secondHandleNumber = 2;

const firstTrack = new Track({
  minValue,
  maxValue,
  isVertical: isVerticalFalse,
  step
});
const secondTrack = new Track({ minValue, maxValue, isVertical, step });

describe('Handle', () => {
  let handel: Handle;
  let handelVertical: Handle;
  beforeEach(() => {
    handel = new Handle({
      handleNumber: firstHandleNumber,
      value: valueStart,
      showTooltip: showTooltip,
      isVertical: isVerticalFalse,
      track: firstTrack,
      step
    });

    handelVertical = new Handle({
      handleNumber: secondHandleNumber,
      value: valueStart,
      showTooltip: showTooltip,
      isVertical: isVertical,
      track: secondTrack,
      step
    });
  });

  test('element must be as HTMLelement', () => {
    expect(handel.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('return correct value when create new instance', () => {
    expect(handel.getValue()).toBe(15);
  });

  test('check correct clear tooltip', () => {
    handel.clearTooltipContent();
    expect(handel.getTooltipContent()).toBe('');
  });

  test('check correct set z-index', () => {
    handel.setStyle(98);
    const element = handel.getElement();
    expect(element.style.zIndex).toBe('2');
  });

  describe('is vertical', () => {
    test('return correct style value when slider is vertical', () => {
      handelVertical.setStyle(15);
      expect(handelVertical.getStyleValue()).toBe(15);
    });

    test('return correct style value when slider is not vertical', () => {
      handel.setStyle(11);
      expect(handel.getStyleValue()).toBe(11);
    });

    test('return correct style value when switch to vertical', () => {
      handel.clearStyle();
      expect(handel.getElement().style.top).toBe('-4.5px');
    });

    test('return correct style value when switch to horizontal', () => {
      handelVertical.clearStyle();
      expect(handelVertical.getElement().style.left).toBe('-4.5px');
    });

    test('check correct change orientation to vertical', () => {
      handel.setOrientation(true);
      handel.clearStyle();
      expect(handel.getElement().style.left).toBe('-4.5px');
    });

    test('check correct change orientation to horizontal', () => {
      handelVertical.setOrientation(false);
      handelVertical.clearStyle();
      expect(handelVertical.getElement().style.top).toBe('-4.5px');
    });
  });

  test('return correct class to show tooltip', () => {
    handelVertical.showTooltipMethod();
    expect(
      handelVertical.getElement().querySelector('.range-slider__tooltip_hide')
    ).toBeNull();
  });

  test('return correct value when set new value', () => {
    handel.setValue(50);
    expect(handel.getValue()).toBe(50);
  });

  test('return correct text content of value when set new value', () => {
    handel.setValue(50);
    expect(handel.getTooltip().textContent).toBe('50');
  });
});
