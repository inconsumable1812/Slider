import Scale from './Scale'

const options = {
  minValue: 0,
  maxValue: 100,
  scalePointCount: 3,
  step: 1,
  isVertical: false
}

const optionsVertical = {
  minValue: 10,
  maxValue: 105,
  scalePointCount: 50,
  step: 10,
  isVertical: true
}

describe('Scale', () => {
  let scale: Scale, scaleVertical: Scale
  beforeEach(() => {
    scale = new Scale(
      options.minValue,
      options.maxValue,
      options.scalePointCount,
      options.step,
      options.isVertical
    )
    scaleVertical = new Scale(
      optionsVertical.minValue,
      optionsVertical.maxValue,
      optionsVertical.scalePointCount,
      optionsVertical.step,
      optionsVertical.isVertical
    )
  })

  test('element is type of HTMLElement', () => {
    expect(scale.element).toBeInstanceOf(HTMLElement)
  })

  test('element is type of HTMLElement when slider is vertical', () => {
    expect(scaleVertical.element).toBeInstanceOf(HTMLElement)
  })

  test('correct delete scale point', () => {
    scale.deleteScalePoint()
    expect(scale.element.querySelector('.range-slider__scale_point')).toBeNull
  })

  test('check set scale options is correct', () => {
    const newOptions = { maxValue: 200, minValue: 20, step: 30, scalePointCount: 3 }
    scale.setScaleOptions(
      newOptions.maxValue,
      newOptions.minValue,
      newOptions.step,
      newOptions.scalePointCount
    )
    const arrayOfNewValue = scale.getArrayOfValue()
    expect(arrayOfNewValue[0]).toBe(20)
    expect(arrayOfNewValue[arrayOfNewValue.length - 1]).toBe(200)
  })

  test('check sub element as HTMLElement', () => {
    expect(scale.getSubElement()).toBeInstanceOf(HTMLElement)
  })

  test('check correct change orientation to vertical', () => {
    scale.setOrientation(true)
    const newOptions = { maxValue: 180, minValue: 33, step: 35, scalePointCount: 4 }
    scale.setScaleOptions(
      newOptions.maxValue,
      newOptions.minValue,
      newOptions.step,
      newOptions.scalePointCount
    )
    expect(scale.subElement.style.top).toBe('100%')
  })

  test('check correct change orientation to horizontal', () => {
    scaleVertical.setOrientation(false)
    const newOptions = { maxValue: 333, minValue: 25, step: 18, scalePointCount: 4 }
    scaleVertical.setScaleOptions(
      newOptions.maxValue,
      newOptions.minValue,
      newOptions.step,
      newOptions.scalePointCount
    )
    expect(scaleVertical.subElement.style.left).toBe('100%')
  })
})
