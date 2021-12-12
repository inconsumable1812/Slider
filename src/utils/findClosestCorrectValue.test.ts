import findClosestCorrectValue from './findClosestCorrectValue';

const options1 = {
  step: 1,
  value: 21,
  maxValue: 100,
  minValue: 0
};
const options2 = {
  step: 31,
  value: 40,
  maxValue: 101,
  minValue: 10
};

describe('calculate new value', () => {
  test('check return correct value with options1', () => {
    expect(
      findClosestCorrectValue(
        options1.step,
        options1.value,
        options1.maxValue,
        options1.minValue
      )
    ).toBe(21);
  });

  test('check return correct closest value when value bigger max', () => {
    expect(
      findClosestCorrectValue(
        options2.step,
        150,
        options2.maxValue,
        options2.minValue
      )
    ).toBe(101);
  });

  test('check return correct closest value with options2', () => {
    expect(
      findClosestCorrectValue(
        options2.step,
        88,
        options2.maxValue,
        options2.minValue
      )
    ).toBe(101);
  });

  test('check return correct closest value when value less min', () => {
    expect(
      findClosestCorrectValue(
        options2.step,
        -50,
        options2.maxValue,
        options2.minValue
      )
    ).toBe(10);
  });

  test('check return correct value with options2', () => {
    expect(
      findClosestCorrectValue(
        options2.step,
        options2.value,
        options2.maxValue,
        options2.minValue
      )
    ).toBe(41);
  });
});
