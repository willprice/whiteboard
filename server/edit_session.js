'use strict'
const Whiteboard = require('../public/common/whiteboard')

class EditSession {
  constructor (boardRepo, owner = 'willprice') {
    this.boardRepo = boardRepo
    this.wb = new Whiteboard()
    this.owner = owner
  }

  newBoard (name, tags) {
    return this.boardRepo.create(name, tags, this.owner).then((wb) => { this.wb = wb })
  }

  addPaths (paths) {
    return this.boardRepo.appendPaths(this.wb.id, paths).then(this.wb.addPaths(paths))
  }

  listBoards () {
    return this.boardRepo.listBoards(this.owner)
  }
}

module.exports = EditSession
