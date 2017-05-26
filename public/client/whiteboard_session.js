'use strict'
const Whiteboard = require('../common/whiteboard')

class WhiteboardSession {
  constructor (api) {
    this.api = api
    this.whiteboard = new Whiteboard()
    this.lastSyncedPathCount = 0
    this.syncPeriod = 2000 // ms
    this.syncing = false
  }

  save () {
    return this.api.save(this.whiteboard).then(() => {
      if (!this.syncing) {
        setInterval(this.syncBoard.bind(this), this.syncPeriod)
        this.syncing = true
      }
    })
  }

  syncBoard () {
    let newPathCount = this.whiteboard.paths.length - this.lastSyncedPathCount
    let paths = this.whiteboard.paths.slice(0, newPathCount)
    this.lastSyncedPathCount += newPathCount
    return this.api.addPaths(paths)
  }
}

module.exports = WhiteboardSession
