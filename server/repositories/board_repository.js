'use strict'
const assert = require('assert')
const Whiteboard = require('../../public/common/whiteboard')

class BoardRepository {
  constructor (db) {
    this.db = db
  }

  /**
   * Create and insert new whiteboard with details
   * @param {string} name
   * @param {[string]} tags
   * @param {string} owner
   * @return {Promise<Whiteboard>}
   */
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

  /**
   * Appends paths to whiteboard specified by boardId
   * @param {integer} boardId
   * @param {[Path]} paths
   * @return {Promise<>}
   */
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
          }).then((stmt) => this.appendPoints(stmt.lastID, path.points)))
        }
        return Promise.all(pathInsertionPromises).then(() => stmt.finalize()).catch((err) => {
          stmt.finalize()
          throw err
        })
      })
  }

  /**
   * Append points to path specified by pathId
   * @param {integer} pathId
   * @param {[Point]} points
   * @return {Promise<null>}
   */
  appendPoints (pathId, points) {
    return this.db.prepare('INSERT INTO points (x, y, path_id) VALUES ($x, $y, $path_id);').then((stmt) => {
      let pointInsertionPromises = []
      for (let point of points) {
        pointInsertionPromises.push(stmt.run({
          $x: point.x,
          $y: point.y,
          $path_id: pathId
        }))
      }
      return Promise.all(pointInsertionPromises).then(() => stmt.finalize()).catch((err) => {
        stmt.finalize()
        throw err
      })
    })
  }

  /**
   * Hydrates whiteboard model with tags from database
   * @param {Whiteboard} wb
   * @return {Promise<Whiteboard>}
   */
  getTags (wb) {
    assert(wb.id !== -1)
    return this.db.all('SELECT * FROM tags WHERE board_id = $board_id', { $board_id: wb.id }).then((rows) => {
      wb.tags = rows.map((row) => row.tag)
      return wb
    })
  }

  /**
   * Returns whiteboards owned by owner
   * @param {integer} owner
   * @return {Promise<Whiteboard>}
   */
  listBoards (owner) {
    return this.db.all('SELECT * FROM boards WHERE owner = $owner', { $owner: owner }).then((rows) => {
      let whiteboardPromises = []
      for (let row of rows) {
        let wb = new Whiteboard([], row.id, row.name)
        whiteboardPromises.push(this.getTags(wb))
      }
      return Promise.all(whiteboardPromises)
    })
  }
}

module.exports = BoardRepository
