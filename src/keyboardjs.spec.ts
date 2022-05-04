import { assert } from 'chai'
import { getKeyboardJSRegistrationFunc } from './keyboardjs'
import { KBGB } from './kbgb'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      document: Document
      window: Window
      navigator: Navigator
    }
  }
}

import('jsdom').then(async module => {
  const { window } = new module.JSDOM('<!doctype html><html><body></body></html>')
  global.document = window.document
  // global.window = global.document.defaultView
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

      assert.equal(kbgb.isDown('left > right'), true)
    })
  })
}).catch(() => {})
