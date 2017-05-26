'use strict'
const Whiteboard = require('../common/whiteboard')

class WhiteboardSession {
  constructor (api) {
    this.api = api
    this.whiteboard = new Whiteboard()
    this.lastSyncedPathCount = 0
    this.newBoard = true
    this.syncPeriod = 2000 // ms
    this.syncRef = undefined
  }

  save () {
    if (this.newBoard) {
      return this.api.newBoard(this.whiteboard).then(() => {
        this.setupSync()
      }).then(() => { this.newBoard = false })
    } else {
      return this.api.updateMetadata(this.whiteboard)
    }
  }

  setupSync () {
    if (this.syncRef) {
      clearInterval(this.syncRef)
    }
    this.syncRef = setInterval(this.syncBoard.bind(this), this.syncPeriod)
  }

  listBoards () {
    return this.api.listBoards()
  }

  syncBoard () {
    let newPathCount = this.whiteboard.paths.length - this.lastSyncedPathCount
    let paths = this.whiteboard.paths.slice(0, newPathCount)
    this.lastSyncedPathCount += newPathCount
    return this.api.addPaths(paths)
  }

  loadBoard (id) {
    return this.api.fetchBoard(id).then((wb) => {
      this.whiteboard = wb
      this.newBoard = false
      this.lastSyncedPathCount = wb.paths.length
      this.setupSync()
    })
  }
}

module.exports = WhiteboardSession
