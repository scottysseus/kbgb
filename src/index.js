export class KBGB {
  constructor ({ keys, document = window.document }) {
    this.keys = keys
    this.document = document
    this.queue = []

    this.down = {}
    this.downPrev = {}

    setupKeyboard(this.document, this.keys, this.queue)
  }

  /**
   *
   * @returns the set of keys which are down
   */
  down () {
    return this.down
  }

  /**
   *
   * @returns the set of keys which were pressed since the last flush
   */
  pressed () {
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
  released () {
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
    this.queue = []

    this.downPrev = this.down
    while (snapshot.length > 0) {
      const event = snapshot
      switch (event.type) {
        case eventTypes.KEY_DOWN:
          this.down[event.key] = true
          break
        case eventTypes.KEY_UP:
          delete this.down[event.key]
          break
      }
    }
  }
}

const eventTypes = {
  KEY_UP: 0,
  KEY_DOWN: 1
}

function setupKeyboard (document, keys, queue) {
  document.addEventListener('keydown', (event) => {
    const keyName = event.key
    if (keys.includes(keyName)) {
      queue.push({ key: keyName, type: eventTypes.KEY_DOWN })
    }
  }, false)

  document.addEventListener('keyup', (event) => {
    const keyName = event.key
    if (keys.includes(keyName)) {
      queue.push({ key: keyName, type: eventTypes.KEY_UP })
    }
  }, false)
}
