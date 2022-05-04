import { Event, EventType } from './kbgb'

export function getKeyboardJSRegistrationFunc (keyboardjs: any) {
  return (keys: string[], eventHandler: (event: Event) => any) => {
    keys.forEach((key: string) => {
      keyboardjs.bind(key, () => {
        eventHandler({ key, type: EventType.KEY_DOWN })
      }, () => {
        eventHandler({ key, type: EventType.KEY_UP })
      })
    })
  }
}
