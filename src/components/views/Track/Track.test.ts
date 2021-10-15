import Track from './Track'

const options = {
  minValue: 0,
  maxValue: 100,
  isVertical: false,
  step: 1
}

const optionsVertical = {
  minValue: 50,
  maxValue: 180,
  isVertical: true,
  step: 2
}

describe('Track', () => {
  let track: Track, trackVertical: Track
  beforeEach(() => {
    track = new Track(
      options.minValue,
      options.maxValue,
      options.isVertical,
      options.step
    )

    trackVertical = new Track(
      optionsVertical.minValue,
      optionsVertical.maxValue,
      optionsVertical.isVertical,
      optionsVertical.step
    )
  })

  test('element is type of HTMLElement', () => {
    expect(track.element).toBeInstanceOf(HTMLElement)
  })

  test('element is type of HTMLElement, slider is vertical', () => {
    expect(trackVertical.element).toBeInstanceOf(HTMLElement)
  })

  test('call function when mousedown on track', () => {
    const fn = jest.fn()
    expect(fn).not.toHaveBeenCalled()
    track.subscribe('clickOnTrack', fn)
    track.element.dispatchEvent(new Event('mousedown'))
    expect(fn).toHaveBeenCalled()
  })

  test('call function when mousedown on track, slider is vertical', () => {
    const fn = jest.fn()
    expect(fn).not.toHaveBeenCalled()
    trackVertical.subscribe('clickOnTrack', fn)
    trackVertical.element.dispatchEvent(new Event('mousedown'))
    expect(fn).toHaveBeenCalled()
  })

  test('check getter min value', () => {
    expect(track.getMinValue()).toBe(0)
  })

  test('check getter max value', () => {
    expect(track.getMaxValue()).toBe(100)
  })

  test('check setter new options', () => {
    const newOptions = {
      minValue: 55,
      maxValue: 133,
      step: 3
    }
    track.setMaxMinValueAndStep(newOptions.maxValue, newOptions.minValue, newOptions.step)
    expect(track.getMaxValue()).toBe(133)
    expect(track.getMinValue()).toBe(55)
    expect(track.getStep()).toBe(3)
  })

  test('check correct change orientation to vertical', () => {
    track.setOrientation(true)
    expect(track.getOrientation()).toBeTruthy()
  })
})
