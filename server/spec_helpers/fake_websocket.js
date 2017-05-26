'use strict'

/**
 * Fake of WebSocket (https://github.com/websockets/ws/blob/master/doc/ws.md)
 */
class FakeWebSocket {
  constructor () {
    this.callbacks = new Map()
    let events = [
      'close',
      'error',
      'headers',
      'message',
      'open',
      'ping',
      'pong',
      'unexpected-response'
    ]
    for (let event of events) {
      this.callbacks[event] = []
    }
  }

  on (event, cb) {
    this.callbacks[event].push(cb)
  }

  close (code, reason) {
    this.triggerEvent('close', code, reason)
  }

  triggerEvent (event, ...args) {
    for (let callback of this.callbacks[event]) {
      callback(...args)
    }
  }
}

module.exports = FakeWebSocket
