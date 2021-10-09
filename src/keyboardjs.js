import { EventTypes } from '.'

export function getKeyboardJSRegistrationFunc (keyboardjs) {
  return (keys, queue) => {
    keys.forEach(key => {
      keyboardjs.bind(key, () => {
        queue.push({ key, type: EventTypes.KEY_DOWN })
      }, () => {
        queue.push({ key, type: EventTypes.KEY_UP })
      })
    })
  }
}
