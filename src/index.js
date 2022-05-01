export class KBGB {
  /**
   * Constructs a KBGB instance with the provided options.
   *
   * The options are:
   *    registrationFunc: a function(keys = [], eventHandler = func(event)) for registering
   *        key event listeners. The default registration function uses document
   *        event listeners.
   *
   *    keys: a list of keys to register. key syntax ultimately depends on the registration
   *        func. If the KeyboardJS registration func is used, the keys list must use KeyboardJS
   *        syntax.
   *
   *
   * @param {*} KBGB options
   */
  constructor ({ keys, registrationFunc = getDefaultRegistrationFunc() }) {
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
  getDown () {
    return this.down
  }

  /**
   *
   * @returns the set of keys which were pressed since the last flush
   */
  getPressed () {
    const pressed = {}
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
  getReleased () {
    const released = {}
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
  isDown (key) {
    return this.down[key]
  }

  /**
   * isPressed checks if the specified key was pressed since the last flush
   * @param {*} key the key to check
   * @returns true if the key was pressed since the last flush; false otherwise
   */
  isPressed (key) {
    return !this.downPrev[key] && this.down[key]
  }

  /**
   * isReleased checks if the key was down and then released since the last flush
   * @param {*} key the key to check
   * @returns true if the key was released since the last flush; false otherwise
   */
  isReleased (key) {
    return this.downPrev[key] && !this.down[key]
  }

  /**
   * flush clears the keyboard event queue. It captures all events registered since the last flush.
   * This function should be called in a render function.
   */
  flush () {
    // TODO could events be lost between these two lines?
    const snapshot = [...this.queue]
    this.queue.length = 0

    this.downPrev = Object.assign({}, this.down)
    while (snapshot.length > 0) {
      const event = snapshot.shift()
      switch (event.type) {
        case EventTypes.KEY_DOWN:
          this.down[event.key] = true
          break
        case EventTypes.KEY_UP:
          delete this.down[event.key]
          break
      }
    }
  }
}

export const EventTypes = {
  KEY_UP: 0,
  KEY_DOWN: 1
}

export function getDefaultRegistrationFunc (document = window.document) {
  return (keys, eventHandler) => {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key
      if (keys.includes(keyName)) {
        eventHandler({ key: keyName, type: EventTypes.KEY_DOWN })
      }
    }, false)

    document.addEventListener('keyup', (event) => {
      const keyName = event.key
      if (keys.includes(keyName)) {
        eventHandler({ key: keyName, type: EventTypes.KEY_UP })
      }
    }, false)
  }
}
