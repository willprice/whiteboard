'use strict'
/* globals WebSocket */
const serialisation = require('../common/serialisation')
const serialise = serialisation.serialise
const deserialise = serialisation.deserialise

class WebsocketConnection {
  constructor (url) {
    this.url = url
    this.connection = new WebSocket(url)
    this.responsePromises = new Map()
    this.currentMessageId = 0

    this._setupCallbacks()
  }

  setup () {
    return new Promise((resolve, reject) => {
      this.connection.addEventListener('open', resolve)
      this.connection.addEventListener('error', reject)
      this.connection.addEventListener('close', reject)
      if (this.connection.readyState === WebSocket.OPEN) {
        resolve()
      }
    })
  }

  _setupCallbacks () {
    this.connection.addEventListener('open', this._onOpen.bind(this))
    this.connection.addEventListener('message', this._onMessage.bind(this))
    this.connection.addEventListener('close', this._onClose.bind(this))
    this.connection.addEventListener('error', this._onError.bind(this))
  }

  _nextMessageId () {
    return this.currentMessageId++
  }

  _onOpen () {
    console.log(`Opened WebSocket connection to ${this.url}`)
  }

  _onError () {
    console.log(`Error with WebSocket connection to ${this.url}`)
  }

  _onClose () {
    console.log(`WebSocket connection to ${this.url} has been closed`)
  }

  _onMessage (event) {
    let payload = deserialise(event.data)
    let id = payload.id
    this.responsePromises[id](payload.data)
  }

  send (command, data) {
    let id = this._nextMessageId()
    this.connection.send(serialise({
      command: command,
      data: data,
      id: id
    }))
    return new Promise((resolve) => {
      this.responsePromises[id] = resolve
    })
  }
}

module.exports = WebsocketConnection
