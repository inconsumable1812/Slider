import Handle from './Handle'

const options = {
  handleNumber: 1,
  value: 10,
  showTooltip: true,
  isVertical: false
}

const optionsVertical = {
  handleNumber: 2,
  value: 15,
  showTooltip: false,
  isVertical: true
}

describe('Handle', () => {
  let handel: Handle, handelVertical: Handle
  beforeEach(() => {
    handel = new Handle(
      options.handleNumber,
      options.value,
      options.showTooltip,
      options.isVertical
    )

    handelVertical = new Handle(
      optionsVertical.handleNumber,
      optionsVertical.value,
      optionsVertical.showTooltip,
      optionsVertical.isVertical
    )
  })

  test('element must be as HTMLelement', () => {
    expect(handel.getElement()).toBeInstanceOf(HTMLElement)
  })

  test('return correct value when create new instance', () => {
    expect(handel.getValue()).toBe(10)
  })

  describe('is vertical', () => {
    test('return correct style value when slider is vertical', () => {
      handelVertical.setStyle(15)
      expect(handelVertical.getStyleValue()).toBe(15)
    })

    test('return correct style value when slider is not vertical', () => {
      handel.setStyle(11)
      expect(handel.getStyleValue()).toBe(11)
    })

    test('return correct style value when switch to vertical', () => {
      handel.clearStyle()
      expect(handel.getElement().style.top).toBe('-4.5px')
    })

    test('return correct style value when switch to horizontal', () => {
      handelVertical.clearStyle()
      expect(handelVertical.getElement().style.left).toBe('-4.5px')
    })

    test('correct change orientation to vertical', () => {
      handel.setOrientation(true)
      handel.clearStyle()
      expect(handel.getElement().style.left).toBe('-4.5px')
    })

    test('correct change orientation to horizontal', () => {
      handelVertical.setOrientation(false)
      handelVertical.clearStyle()
      expect(handelVertical.getElement().style.top).toBe('-4.5px')
    })
  })

  test('return correct class to show tooltip', () => {
    handelVertical.showTooltipMethod()
    expect(
      handelVertical.getElement().querySelector('.range-slider__tooltip_hide')
    ).toBeNull()
  })

  test('return correct value when set new value', () => {
    handel.setValue(50)
    expect(handel.getValue()).toBe(50)
  })

  test('return correct text content of value when set new value', () => {
    handel.setValue(50)
    expect(handel.getElement().querySelector('.range-slider__tooltip').textContent).toBe(
      '50'
    )
  })

  test('return correct text content of value when slider update', () => {
    handel.updateValue(33)
    expect(handel.getElement().querySelector('.range-slider__tooltip').textContent).toBe(
      '33'
    )
  })
})
