import Handle from './Handle'

const jsdom = require('jsdom')
const { JSDOM } = jsdom

global.document = new JSDOM('').window.document

const handel = new Handle()

describe('TEST', () => {
  test('test', () => {
    expect(handel).toBeDefined()
  })
})
