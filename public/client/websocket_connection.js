'use strict'
/* globals WebSocket */

class WebsocketConnection {
  constructor (url) {
    this.url = url
    this.socket = new WebSocket(url)
    this.responsePromises = new Map()
    this.currentMessageId = 0

    this._setupCallbacks()
  }

  _setupCallbacks () {
    this.socket.addEventListener('open', this._onOpen.bind(this))
    this.socket.addEventListener('message', this._onMessage.bind(this))
    this.socket.addEventListener('close', this._onClose.bind(this))
    this.socket.addEventListener('error', this._onError.bind(this))
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
    let payload = JSON.parse(event.data)
    let id = payload.id
    this.responsePromises[id](payload.data)
  }

  send (command, data) {
    let id = this._nextMessageId()
    this.socket.send(JSON.stringify({
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
