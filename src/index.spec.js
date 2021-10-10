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
})
