/**
 * Options for creating a KBGB instance.
 */
export interface KBGBOptions {
  /**
   * A list of keys to register. Key syntax ultimately depends on the registration
   * func. If the KeyboardJS registration func is used, the keys list must use KeyboardJS
   * syntax.
   */
  keys: string[]
  registrationFunc?: (keys: string[], registrationFunc: (event: Event) => any) => any
}

export enum EventType {
  KEY_UP = 0,
  KEY_DOWN= 1
}

export interface Event {
  type: EventType
  key: string
}

export interface KeyMap {
  [key: string]: boolean
}

export class KBGB {
  keys: string[]
  queue: Event[]
  down: KeyMap
  downPrev: KeyMap

  /**
   *
   * @param opts the options for this KBGB instance.
   */
  constructor ({ keys, registrationFunc = getDefaultRegistrationFunc() }: KBGBOptions) {
    this.keys = keys
    this.queue = []

    this.down = {}
    this.downPrev = {}

    registrationFunc(this.keys, (event) => this.queue.push(event))
  }

  /**
   *
   * @returns the set of keys which are down
   */
  getDown (): KeyMap {
    return this.down
  }

  /**
   *
   * @returns the set of keys which were pressed since the last flush
   */
  getPressed (): KeyMap {
    const pressed: KeyMap = {}
    Object.keys(this.down).forEach(key => {
      if (!this.downPrev[key]) {
        pressed[key] = true
      }
    })
    return pressed
  }

  /**
   *
   * @returns the keys which were released since the last flush
   */
  getReleased (): KeyMap {
    const released: KeyMap = {}
    Object.keys(this.downPrev).forEach(key => {
      if (!this.down[key]) {
        released[key] = true
      }
    })
    return released
  }

  /**
   * isDown checks if the specified key is down currently
   * @param {*} key the key to check
   * @returns true if the key is down; false otherwise
   */
  isDown (key: string): boolean {
    return this.down[key]
  }

  /**
   * isPressed checks if the specified key was pressed since the last flush
   * @param {*} key the key to check
   * @returns true if the key was pressed since the last flush; false otherwise
   */
  isPressed (key: string): boolean {
    return !this.downPrev[key] && this.down[key]
  }

  /**
   * isReleased checks if the key was down and then released since the last flush
   * @param {*} key the key to check
   * @returns true if the key was released since the last flush; false otherwise
   */
  isReleased (key: string): boolean {
    return this.downPrev[key] && !this.down[key]
  }

  /**
   * flush clears the keyboard event queue. It captures all events registered since the last flush.
   * This function should be called in a render function.
   */
  flush (): any {
    // TODO could events be lost between these two lines?
    const snapshot = [...this.queue]
    this.queue.length = 0

    this.downPrev = Object.assign({}, this.down)
    while (snapshot.length > 0) {
      const event = snapshot.shift()
      if (event == null) {
        break
      }
      switch (event.type) {
        case EventType.KEY_DOWN:
          this.down[event.key] = true
          break
        case EventType.KEY_UP:
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.down[event.key]
          break
      }
    }
  }
}

export function getDefaultRegistrationFunc (document: Document = window.document) {
  return (keys: string[], eventHandler: (event: Event) => any) => {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key
      if (keys.includes(keyName)) {
        eventHandler({ key: keyName, type: EventType.KEY_DOWN })
      }
    }, false)

    document.addEventListener('keyup', (event) => {
      const keyName = event.key
      if (keys.includes(keyName)) {
        eventHandler({ key: keyName, type: EventType.KEY_UP })
      }
    }, false)
  }
}
