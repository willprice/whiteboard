'use strict'

class WhiteboardAPI {
  constructor (connection, serialise) {
    this.socket = connection
    this.serialise = serialise
  }

  newBoard () {
    return this.socket.send('new_board')
  }

  updateBoard (whiteboard) {
    let serialisedBoard = this.serialise(whiteboard)
    return this.socket.send('update_board', serialisedBoard)
  }

  updateMetadata (whiteboard, description, tags) {
    return this.socket.send('update_board_metadata', {
      id: whiteboard.id,
      description: description,
      tags: tags
    })
  }
}

export default WhiteboardAPI
