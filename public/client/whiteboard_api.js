'use strict'

class WhiteboardAPI {
  constructor (connection, serialise, deserialise) {
    this.socket = connection
    this.serialise = serialise
    this.deserialise = deserialise
  }

  /**
   * Save new whiteboard
   * @param {Whiteboard} whiteboard
   * @returns {integer} id
   */
  save (whiteboard) {
    return this.socket.send('new_board', {
      name: whiteboard.name,
      tags: whiteboard.tags
    }).then((id) => {
      whiteboard.id = parseInt(id)
    })
  }

  /**
   * Synchronises paths in whiteboard with server
   * @param {Whiteboard} whiteboard
   */
  addPaths (paths) {
    return this.socket.send('add_paths', paths)
  }

  /**
   * Update metadata of whiteboard
   * @param whiteboard
   * @param description
   * @param tags
   */
  updateMetadata (whiteboard, description, tags) {
    return this.socket.send('update_board_metadata', {
      id: whiteboard.id,
      description: description,
      tags: tags
    })
  }

  /**
   * @param id - The id of the desired whiteboard (must exist)
   * @return {Promise<Whiteboard>} whiteboard corresponding to id
   */
  fetchBoard (id) {
    return this.socket.send('fetch_board', {
      id: id
    }).then((serialisedWhiteboard) => {
      return this.deserialise(serialisedWhiteboard)
    })
  }
}

module.exports = WhiteboardAPI
