import { MIN_STEP } from '../../constants';
import { ModelOptions } from '../type';
import Model from './Model';
import { DEFAULT_MODEL_OPTIONS } from '../default';

function getExampleDOM() {
  const div = document.createElement('div');
  return div;
}

const optionsMinBiggerMax: Partial<ModelOptions> = {
  minValue: 100,
  maxValue: 33,
  range: false
};

const optionsRangeLessThanStepSize: Partial<ModelOptions> = {
  minValue: 5,
  maxValue: 100,
  step: 99,
  range: false
};

const optionsStepNotLess1: Partial<ModelOptions> = {
  minValue: 5,
  maxValue: 100,
  step: -5,
  range: false
};

const optionsMinEqualMax: Partial<ModelOptions> = {
  minValue: 26,
  maxValue: 26,
  range: false
};

const optionsValueStartLessMin: Partial<ModelOptions> = {
  minValue: 20,
  maxValue: 35,
  valueStart: 18,
  range: false
};

const optionsValueStartBiggerMax: Partial<ModelOptions> = {
  minValue: 20,
  maxValue: 35,
  valueStart: 40,
  range: false
};

const optionsValueStartBiggerMaxWithRange: Partial<ModelOptions> = {
  minValue: 20,
  maxValue: 35,
  valueStart: 40,
  range: true
};

const optionsValueEndLessMin: Partial<ModelOptions> = {
  minValue: 20,
  maxValue: 35,
  valueEnd: 18,
  range: true
};

const optionsValueEndBiggerMax: Partial<ModelOptions> = {
  minValue: 20,
  maxValue: 35,
  valueEnd: 45,
  range: true
};

const optionsRangeTrueValueEqualValueEndMax: Partial<ModelOptions> = {
  minValue: 0,
  valueStart: 55,
  maxValue: 55,
  valueEnd: 55,
  range: true
};

const optionsRangeTrueValueEqualValueStartMin: Partial<ModelOptions> = {
  minValue: 0,
  valueStart: 0,
  maxValue: 55,
  valueEnd: 0,
  range: true
};

const optionsRangeTrueValueEqual: Partial<ModelOptions> = {
  minValue: 0,
  valueStart: 50,
  maxValue: 90,
  valueEnd: 50,
  range: true
};

const optionsRangeTrueValueStartBigger: Partial<ModelOptions> = {
  minValue: 0,
  valueStart: 55,
  maxValue: 90,
  valueEnd: 50,
  range: true
};

const optionsRangeFalseValueStartBiggerNotEqualMax: Partial<ModelOptions> = {
  minValue: 0,
  valueStart: 55,
  maxValue: 90,
  valueEnd: 50,
  range: false
};

const optionsRangeFalseValueStartEqualMax: Partial<ModelOptions> = {
  minValue: 0,
  valueStart: 90,
  maxValue: 90,
  valueEnd: 50,
  range: false
};

const optionsCorrectValueStartInStep: Partial<ModelOptions> = {
  minValue: 0,
  maxValue: 100,
  valueStart: 5,
  valueEnd: 90,
  step: 20,
  range: false
};

const optionsCorrectValueEndInStep: Partial<ModelOptions> = {
  minValue: 0,
  maxValue: 110,
  valueStart: 0,
  valueEnd: 90,
  step: 50,
  range: false
};

describe('Model', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = getExampleDOM();
  });

  test('check default options and set options', () => {
    const modelDefault = new Model(container, DEFAULT_MODEL_OPTIONS);
    modelDefault.setOptions({
      minValue: 200,
      maxValue: 300,
      step: 2
    });
    expect(modelDefault.getFirstValue()).toBe(200);
    expect(modelDefault.getSecondValue()).toBe(202);
  });

  test('check when min value are bigger that max value', () => {
    const modelMinBiggerMax = new Model(container, optionsMinBiggerMax);
    expect(modelMinBiggerMax.getOptions().maxValue).toBe(
      modelMinBiggerMax.getOptions().minValue +
        modelMinBiggerMax.getOptions().step
    );
  });

  test('check step are not bigger than range', () => {
    const modelRangeLessThanStepSize = new Model(
      container,
      optionsRangeLessThanStepSize
    );
    expect(modelRangeLessThanStepSize.getOptions().step).toBe(95);
  });

  test('check when range are less than step size', () => {
    const modelsStepNotLess1 = new Model(container, optionsStepNotLess1);
    expect(modelsStepNotLess1.getOptions().step).toBe(MIN_STEP);
  });

  test('check when min value are equal max value', () => {
    const modelMinEqualMax = new Model(container, optionsMinEqualMax);
    expect(modelMinEqualMax.getOptions().maxValue).toBe(
      modelMinEqualMax.getOptions().minValue +
        modelMinEqualMax.getOptions().step
    );
  });

  test('check when value start are less that min value', () => {
    const ModelValueStartLessMin = new Model(
      container,
      optionsValueStartLessMin
    );
    expect(ModelValueStartLessMin.getOptions().minValue).toBeLessThanOrEqual(
      ModelValueStartLessMin.getOptions().valueStart
    );
  });

  test('check when value start are bigger that max value, range false', () => {
    const ModelValueStartBiggerMax = new Model(
      container,
      optionsValueStartBiggerMax
    );
    expect(ModelValueStartBiggerMax.getOptions().maxValue).toBe(
      ModelValueStartBiggerMax.getOptions().valueStart
    );
  });

  test('check when value start are bigger that max value, range true', () => {
    const ModelValueStartBiggerMaxWithRange = new Model(
      container,
      optionsValueStartBiggerMaxWithRange
    );
    expect(
      ModelValueStartBiggerMaxWithRange.getOptions().maxValue
    ).toBeGreaterThan(
      ModelValueStartBiggerMaxWithRange.getOptions().valueStart
    );
  });

  test('check when value end are less that min value', () => {
    const ModelValueEndLessMin = new Model(container, optionsValueEndLessMin);
    expect(ModelValueEndLessMin.getOptions().minValue).toBeLessThan(
      ModelValueEndLessMin.getOptions().valueEnd
    );
  });

  test('check when value end are bigger that max value', () => {
    const ModelValueEndBiggerMax = new Model(
      container,
      optionsValueEndBiggerMax
    );
    expect(ModelValueEndBiggerMax.getOptions().maxValue).toBe(
      ModelValueEndBiggerMax.getOptions().valueEnd
    );
  });

  test('check when range true, value start === value end and value end === max', () => {
    const ModelRangeTrueValueEqualValueEndMax = new Model(
      container,
      optionsRangeTrueValueEqualValueEndMax
    );
    expect(
      ModelRangeTrueValueEqualValueEndMax.getOptions().valueStart
    ).toBeLessThan(ModelRangeTrueValueEqualValueEndMax.getOptions().valueEnd);
  });

  test('check when range true, value start === value end and value start === min', () => {
    const ModelRangeTrueValueEqualValueStartMin = new Model(
      container,
      optionsRangeTrueValueEqualValueStartMin
    );
    expect(
      ModelRangeTrueValueEqualValueStartMin.getOptions().valueStart
    ).toBeLessThan(ModelRangeTrueValueEqualValueStartMin.getOptions().valueEnd);
  });

  test('check when range true, value start === value end', () => {
    const ModelRangeTrueValueEqual = new Model(
      container,
      optionsRangeTrueValueEqual
    );
    expect(ModelRangeTrueValueEqual.getOptions().valueStart).toBeLessThan(
      ModelRangeTrueValueEqual.getOptions().valueEnd
    );
  });

  test('check when range true, value start > value end', () => {
    const ModelRangeTrueValueStartBigger = new Model(
      container,
      optionsRangeTrueValueStartBigger
    );
    expect(ModelRangeTrueValueStartBigger.getOptions().valueStart).toBeLessThan(
      ModelRangeTrueValueStartBigger.getOptions().valueEnd
    );
  });

  test('check when range false, value start >= value end and value start !== max', () => {
    const ModelRangeFalseValueStartBiggerNotEqualMax = new Model(
      container,
      optionsRangeFalseValueStartBiggerNotEqualMax
    );
    expect(
      ModelRangeFalseValueStartBiggerNotEqualMax.getOptions().valueStart
    ).toBeLessThan(
      ModelRangeFalseValueStartBiggerNotEqualMax.getOptions().valueEnd
    );
  });

  test('check when range false, value start === max', () => {
    const ModelRangeFalseValueStartEqualMax = new Model(
      container,
      optionsRangeFalseValueStartEqualMax
    );
    expect(ModelRangeFalseValueStartEqualMax.getOptions().valueStart).toBe(
      ModelRangeFalseValueStartEqualMax.getOptions().valueEnd
    );
  });

  test('check correct value start in step size', () => {
    const ModelCorrectValueStartInStep = new Model(
      container,
      optionsCorrectValueStartInStep
    );
    expect(ModelCorrectValueStartInStep.getOptions().valueStart).toBe(
      ModelCorrectValueStartInStep.getOptions().minValue
    );
  });

  test('check correct value end in step size', () => {
    const ModelCorrectValueEndInStep = new Model(
      container,
      optionsCorrectValueEndInStep
    );
    expect(ModelCorrectValueEndInStep.getOptions().valueEnd).toBe(100);
  });
});
