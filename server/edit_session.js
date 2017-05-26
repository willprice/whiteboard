'use strict'
const Whiteboard = require('../public/common/whiteboard')

class EditSession {
  constructor (boardRepo) {
    this.boardRepo = boardRepo
    this.wb = new Whiteboard()
  }

  newBoard (name, tags) {
    return this.boardRepo.create(name, tags).then((wb) => { this.wb = wb })
  }

  addPaths (paths) {
    return this.boardRepo.appendPaths(this.wb.id, paths).then(this.wb.addPaths(paths))
  }
}

module.exports = EditSession
