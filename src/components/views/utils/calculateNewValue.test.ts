import calculateNewValue from './calculateNewValue'

const options1 = {
  minValue: 0,
  maxValue: 100,
  progressInPercents: 0.2,
  step: 1
}
const options2 = {
  minValue: 10,
  maxValue: 101,
  progressInPercents: 0.9,
  step: 31
}

describe('calculate new value', () => {
  test('check return correct value with options1', () => {
    expect(
      calculateNewValue(
        options1.minValue,
        options1.maxValue,
        options1.progressInPercents,
        options1.step
      )
    ).toBe(20)
  })

  test('check return correct closest value with options2', () => {
    expect(
      calculateNewValue(options2.minValue, options2.maxValue, 0.4, options2.step)
    ).toBe(41)
  })

  test('check return correct closest value with options2', () => {
    expect(
      calculateNewValue(options2.minValue, options2.maxValue, 0.55, options2.step)
    ).toBe(72)
  })

  test('check return correct value with options2', () => {
    expect(
      calculateNewValue(
        options2.minValue,
        options2.maxValue,
        options2.progressInPercents,
        options2.step
      )
    ).toBe(101)
  })
})
