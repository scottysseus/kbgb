import { JSDOM } from 'jsdom'
import { assert } from 'chai'
import { KBGB, getDefaultRegistrationFunc } from './kbgb'

const window = new JSDOM().window
const document = window.document

describe('kbgb', () => {
  describe('#constructor', () => {
    it('can use a default registration func', () => {
      assert.throws(() => {
        const kbgb = new KBGB({ keys: ['ArrowLeft'] })
      }, ReferenceError)
    })
  })

  describe('#getPressed', () => {
    it('returns buttons pressed since the previous flush', () => {
      const kbgb = new KBGB({ keys: ['ArrowLeft', 'ArrowRight', 'ArrowUp'], registrationFunc: getDefaultRegistrationFunc(document) })

      const e1 = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })
      const e2 = new window.KeyboardEvent('keydown', { key: 'ArrowRight' })
      const e3 = new window.KeyboardEvent('keydown', { key: 'ArrowUp' })

      document.dispatchEvent(e1)
      document.dispatchEvent(e2)
      kbgb.flush()
      document.dispatchEvent(e3)
      kbgb.flush()
      assert.deepEqual(kbgb.getPressed(), { ArrowUp: true })
    })
  })

  describe('#getReleased', () => {
    it('returns buttons released since the previous flush', () => {
      const kbgb = new KBGB({ keys: ['ArrowLeft', 'ArrowRight', 'ArrowUp'], registrationFunc: getDefaultRegistrationFunc(document) })

      const e1 = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })
      const e2 = new window.KeyboardEvent('keydown', { key: 'ArrowRight' })
      const e3 = new window.KeyboardEvent('keydown', { key: 'ArrowUp' })
      const e4 = new window.KeyboardEvent('keyup', { key: 'ArrowLeft' })

      document.dispatchEvent(e1)
      document.dispatchEvent(e2)
      kbgb.flush()
      document.dispatchEvent(e3)
      document.dispatchEvent(e4)
      kbgb.flush()
      assert.deepEqual(kbgb.getReleased(), { ArrowLeft: true })
    })
  })

  describe('#isDown', () => {
    it('returns true if a key is down', () => {
      const kbgb = new KBGB({ keys: ['ArrowLeft'], registrationFunc: getDefaultRegistrationFunc(document) })

      const e = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })

      document.dispatchEvent(e)
      kbgb.flush()
      assert.equal(kbgb.isDown('ArrowLeft'), true)
    })
  })

  describe('#isPressed', () => {
    it('returns true if a key was pressed since the previous flush', () => {
      const kbgb = new KBGB({ keys: ['ArrowLeft'], registrationFunc: getDefaultRegistrationFunc(document) })

      const e1 = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })

      document.dispatchEvent(e1)
      kbgb.flush()
      assert.equal(kbgb.isPressed('ArrowLeft'), true)
    })
  })

  describe('#isReleased', () => {
    it('returns true if a key was released since the previous flush', () => {
      const kbgb = new KBGB({ keys: ['ArrowLeft'], registrationFunc: getDefaultRegistrationFunc(document) })

      const e1 = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })
      const e2 = new window.KeyboardEvent('keyup', { key: 'ArrowLeft' })

      document.dispatchEvent(e1)
      kbgb.flush()
      document.dispatchEvent(e2)
      kbgb.flush()
      assert.equal(kbgb.isReleased('ArrowLeft'), true)
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
