import { EventTypes } from './index.js'

export function getKeyboardJSRegistrationFunc (keyboardjs) {
  return (keys, eventHandler) => {
    keys.forEach(key => {
      keyboardjs.bind(key, () => {
        eventHandler({ key, type: EventTypes.KEY_DOWN })
      }, () => {
        eventHandler({ key, type: EventTypes.KEY_UP })
      })
    })
  }
}
