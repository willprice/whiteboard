'use strict'

class WhiteboardAPI {
  /**
   *
   * @param {WebSocketConnection} connection
   */
  constructor (connection) {
    this.connection = connection
  }

  /**
   * Save new whiteboard
   * @param {Whiteboard} whiteboard
   * @returns {integer} id
   */
  newBoard (whiteboard) {
    return this.connection.send('new_board', {
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
    return this.connection.send('add_paths', paths)
  }

  /**
   * Update metadata of whiteboard
   * @param whiteboard
   * @param description
   * @param tags
   */
  updateMetadata (whiteboard) {
    return this.connection.send('update_board_metadata', {
      id: whiteboard.id,
      name: whiteboard.name,
      tags: whiteboard.tags
    })
  }

  listBoards () {
    return this.connection.send('list_boards', null)
  }

  /**
   * @param id - The id of the desired whiteboard (must exist)
   * @return {Promise<Whiteboard>} whiteboard corresponding to id
   */
  fetchBoard (id) {
    return this.connection.send('fetch_board', {
      id: id
    })
  }
}

module.exports = WhiteboardAPI
