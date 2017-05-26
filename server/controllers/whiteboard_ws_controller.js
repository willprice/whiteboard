'use strict'

class WhiteboardWSController {
  constructor (ws, editSession) {
    this.ws = ws
    this.editSession = editSession
    this.messageCallbacks = new Map()
    this.messageCallbacks['new_board'] = this.newBoard.bind(this)
    this.messageCallbacks['add_paths'] = this.addPaths.bind(this)

    this.ws.on('message', this.handleMessage.bind(this))
  }

  handleMessage (messageStr) {
    let message = JSON.parse(messageStr)
    let command = message.command
    let payload = message.data
    this.messageCallbacks[command](payload)
  }

  newBoard (payload) {
    this.editSession.newBoard(payload.name, payload.tags)
  }

  addPaths (payload) {
    this.editSession.addPaths(payload)
  }
}

module.exports = WhiteboardWSController
