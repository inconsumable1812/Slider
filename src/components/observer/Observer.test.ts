/* eslint-disable dot-notation */
import Observer from './Observer'

describe('Observer', () => {
  let observer: Observer
  beforeEach(() => {
    observer = new Observer()
  })
  test('check subscribe', () => {
    const fn = jest.fn()
    const secondFn = jest.fn()
    const thirdFn = jest.fn()

    observer.subscribe('check', fn)
    observer.subscribe('check', secondFn)
    observer.subscribe('check', thirdFn)

    expect(observer.listeners['check']!.length).toBe(3)
  })

  test('check emit', () => {
    const secondFn = jest.fn()
    observer.subscribe('check', secondFn)
    observer.emit('check')
    expect(secondFn).toHaveBeenCalled()
  })

  test('check emit if there are no subscribe', () => {
    const secondFn = jest.fn()
    observer.subscribe('check1', secondFn)
    expect(observer.emit('check')).toBeFalsy()
  })

  test('check unsubscribe', () => {
    const secondFn = jest.fn()
    const unsub = observer.subscribe('check', secondFn)
    unsub()
    observer.emit('check')
    expect(secondFn).not.toHaveBeenCalled()
  })
})
