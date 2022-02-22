/* eslint-disable no-unused-expressions */
import Scale from './Scale';

const options = {
  minValue: 0,
  maxValue: 100,
  scalePointCount: 3,
  step: 1,
  isVertical: false
};

const optionsVertical = {
  minValue: 10,
  maxValue: 105,
  scalePointCount: 50,
  step: 10,
  isVertical: true
};

describe('Scale', () => {
  let scale: Scale;
  let scaleVertical: Scale;
  beforeEach(() => {
    scale = new Scale({
      minValue: options.minValue,
      maxValue: options.maxValue,
      scalePointCount: options.scalePointCount,
      step: options.step,
      isVertical: options.isVertical
    });
    scaleVertical = new Scale({
      minValue: optionsVertical.minValue,
      maxValue: optionsVertical.maxValue,
      scalePointCount: optionsVertical.scalePointCount,
      step: optionsVertical.step,
      isVertical: optionsVertical.isVertical
    });
  });

  test('element is type of HTMLElement', () => {
    expect(scale.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('element is type of HTMLElement when slider is vertical', () => {
    expect(scaleVertical.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('correct delete scale point', () => {
    scale.deleteScalePoint();
    expect(scale.getElement().querySelector('.range-slider__scale_point')).toBe(
      null
    );
  });

  test('check set scale options is correct', () => {
    const newOptions = {
      maxValue: 200,
      minValue: 20,
      step: 30,
      scalePointCount: 3
    };
    scale.setScaleOptions(
      newOptions.maxValue,
      newOptions.minValue,
      newOptions.step,
      newOptions.scalePointCount
    );
    const arrayOfNewValue = scale.getArrayOfValue();
    expect(arrayOfNewValue[0]).toBe(20);
    expect(arrayOfNewValue[arrayOfNewValue.length - 1]).toBe(200);
  });

  test('check sub element as HTMLElement', () => {
    expect(scale.getSubElement()).toBeInstanceOf(HTMLElement);
  });

  test('check correct change orientation to vertical', () => {
    scale.setOrientation(true);
    const newOptions = {
      maxValue: 180,
      minValue: 33,
      step: 35,
      scalePointCount: 4
    };
    scale.setScaleOptions(
      newOptions.maxValue,
      newOptions.minValue,
      newOptions.step,
      newOptions.scalePointCount
    );
    expect(scale.getSubElement().style.top).toBe('100%');
  });

  test('check correct change orientation to horizontal', () => {
    scaleVertical.setOrientation(false);
    const newOptions = {
      maxValue: 333,
      minValue: 25,
      step: 18,
      scalePointCount: 4
    };
    scaleVertical.setScaleOptions(
      newOptions.maxValue,
      newOptions.minValue,
      newOptions.step,
      newOptions.scalePointCount
    );
    expect(scaleVertical.getSubElement().style.left).toBe('100%');
  });
});
