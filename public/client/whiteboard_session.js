'use strict'
const Whiteboard = require('../common/whiteboard')

class WhiteboardSession {
  constructor (api) {
    this.api = api
    this.whiteboard = new Whiteboard()
    this.lastSyncedPathCount = 0
    this.newBoard = true
    this.syncPeriod = 2000 // ms
  }

  save () {
    if (this.newBoard) {
      return this.api.newBoard(this.whiteboard).then(() => {
        setInterval(this.syncBoard.bind(this), this.syncPeriod)
      }).then(() => { this.newBoard = false })
    } else {
      return this.api.updateMetadata(this.whiteboard)
    }
  }

  syncBoard () {
    let newPathCount = this.whiteboard.paths.length - this.lastSyncedPathCount
    let paths = this.whiteboard.paths.slice(0, newPathCount)
    this.lastSyncedPathCount += newPathCount
    return this.api.addPaths(paths)
  }
}

module.exports = WhiteboardSession
