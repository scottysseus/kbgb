import assert from 'assert'
import { getKeyboardJSRegistrationFunc } from './keyboardjs.js'
import { KBGB } from './index.js'

import('jsdom').then(async module => {
  const window = new module.JSDOM().window
  globalThis.window = window
  const keyboardjs = await import('keyboardjs')
  const document = window.document
  return { keyboardjs, document }
}).then(({ keyboardjs, document }) => {
  describe('#getKeyboardJSRegistrationFunc', () => {
    it('pushes keyboardjs events to the queue', () => {
      const kbgb = new KBGB({ keys: ['left > right'], registrationFunc: getKeyboardJSRegistrationFunc(keyboardjs) })

      const e1 = new window.KeyboardEvent('keydown', { key: 'ArrowLeft' })
      const e2 = new window.KeyboardEvent('keydown', { key: 'ArrowRight' })

      document.dispatchEvent(e1)
      document.dispatchEvent(e2)

      kbgb.flush()

      assert.equal(kbgb.getDown('left > right'), true)
    })
  })
})
