import { JSDOM } from 'jsdom'
import assert from 'assert'
import { KBGB, getDefaultRegistrationFunc } from './index.js'

const window = new JSDOM().window
const document = window.document

describe('kbgb', () => {
  describe('#isDown', () => {
    it('returns down keys', () => {
      const kbgb = new KBGB({ keys: ['ArrowLeft'], registrationFunc: getDefaultRegistrationFunc(document) })

      const e = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })

      document.dispatchEvent(e)
      kbgb.flush()
      assert.equal(kbgb.isDown('ArrowLeft'), true)
    })
  })

  describe('#flush', () => {
    it('handles multiple events', () => {
      const kbgb = new KBGB({ keys: ['ArrowLeft', 'ArrowRight', 'ArrowUp'], registrationFunc: getDefaultRegistrationFunc(document) })

      const e1 = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })
      const e2 = new window.KeyboardEvent('keydown', { key: 'ArrowRight' })
      const e3 = new window.KeyboardEvent('keydown', { key: 'ArrowUp' })

      document.dispatchEvent(e1)
      document.dispatchEvent(e2)
      document.dispatchEvent(e3)
      kbgb.flush()
      assert.deepEqual(kbgb.getDown(), { ArrowLeft: true, ArrowRight: true, ArrowUp: true })
    })
  })
})
