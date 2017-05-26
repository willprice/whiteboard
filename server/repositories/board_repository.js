'use strict'
const Whiteboard = require('../../public/common/whiteboard')

class BoardRepository {
  constructor (db) {
    this.db = db
  }

  create (name, tags, owner) {
    let db = this.db

    function insertTags (boardId, tags) {
      return db.prepare('INSERT INTO tags (tag, board_id) VALUES ($tag, $board_id);')
        .then((tagInsertStatement) => {
          let tagInsertionPromises = []
          for (let tag of tags) {
            tagInsertionPromises.push(tagInsertStatement.run({ $tag: tag, $board_id: boardId }))
          }

          return Promise.all(tagInsertionPromises)
            .then(() => tagInsertStatement.finalize())
        })
    }

    return db.run('INSERT INTO boards (name, owner) VALUES ($name, $owner);', {
      $name: name,
      $owner: owner
    }).then((stmt) => {
      return stmt.lastID
    }).then((boardId) => {
      return insertTags(boardId, tags).then(() => new Whiteboard([], boardId, name, tags))
    })
  }

  appendPaths (boardId, paths) {
    let db = this.db

    return db.prepare(
      'INSERT INTO paths (color, width, board_id) VALUES ($color, $width, $board_id);').then((stmt) => {
        let pathInsertionPromises = []
        for (let path of paths) {
          pathInsertionPromises.push(stmt.run({
            $color: path.color,
            $width: path.width,
            $board_id: boardId
          }))
        }
        return Promise.all(pathInsertionPromises).then(() => stmt.finalize()).catch((err) => {
          stmt.finalize()
          throw err
        })
      })
  }
}

module.exports = BoardRepository
