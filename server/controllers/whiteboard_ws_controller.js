'use strict'
const bunyan = require('bunyan')
const serialisation = require('../../public/common/serialisation')
const serialise = serialisation.serialise
const deserialise = serialisation.deserialise

const log = bunyan.createLogger({ name: 'WhiteboardWSController' })

class WhiteboardWSController {
  constructor (ws, editSession, user = 'willprice') {
    this.ws = ws
    this.editSession = editSession
    this.user = user
    this.messageCallbacks = new Map()
    this.messageCallbacks['new_board'] = this.newBoard.bind(this)
    this.messageCallbacks['add_paths'] = this.addPaths.bind(this)
    this.messageCallbacks['list_boards'] = this.listBoards.bind(this)
  }

  listen () {
    this.ws.on('message', this.handleMessage.bind(this))
  }

  handleMessage (messageStr) {
    let message = deserialise(messageStr)
    log.info('Received WS message')
    log.info(message)

    let command = message.command
    let payload = message.data
    let id = message.id
    try {
      this.messageCallbacks[command](id, payload)
    } catch (err) {
      log.error(err)
    }
  }

  newBoard (id, payload) {
    return this.editSession.newBoard(payload.name, payload.tags, this.user).then(() => {
      this._respond(id, true)
    }).catch((err) => {
      log.error(err)
      this._respond(id, false)
    })
  }

  listBoards (id) {
    return this.editSession.listBoards().then((boards) => {
      this._respond(id, boards)
    })
  }

  _respond (id, data) {
    this.ws.send(serialise({
      id: id,
      data: data
    }))
  }

  addPaths (id, payload) {
    return this.editSession.addPaths(payload)
  }
}

module.exports = WhiteboardWSController
