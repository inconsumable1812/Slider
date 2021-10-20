import Handle from './Handle'

const optionsVertical = {
  handleNumber: 2,
  value: 15,
  showTooltip: false,
  isVertical: true
}

describe('Handle', () => {
  let handel: Handle
  let handelVertical: Handle
  beforeEach(() => {
    handel = new Handle()

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

    test('check correct change orientation to vertical', () => {
      handel.setOrientation(true)
      handel.clearStyle()
      expect(handel.getElement().style.left).toBe('-4.5px')
    })

    test('check correct change orientation to horizontal', () => {
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
    expect(handel.getTooltip().textContent).toBe('50')
  })
})