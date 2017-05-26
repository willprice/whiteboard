'use strict'
const Path = require('../common/path')
const Brush = require('./brush')

class Whiteboard {
  constructor (paths = [], id = -1, name = new Date().toISOString(), tags = []) {
    this.paths = paths
    this.id = id
    this.name = name
    this.tags = tags
    this.brush = new Brush()

    this.currentlyDrawing = false
    this.currentPath = null
  }

  startNewPath () {
    this.currentlyDrawing = true
    let path = new Path()
    path.color = this.brush.currentColor
    path.width = this.brush.currentLineWidth
    this.currentPath = path
  }

  updatePath (x, y) {
    this.currentPath.add(x, y)
  }

  setColor (color) {
    this.brush.setColor(color)
    if (this.currentPath !== null) {
      this.currentPath.color = this.brush.currentColor
    }
  }

  endPath () {
    this.currentlyDrawing = false
    this.paths.unshift(this.currentPath)
    this.currentPath = null
  }

  addPaths (paths) {
    for (let path of paths) {
      this.paths = this.paths.concat(path)
    }
  }
}

module.exports = Whiteboard
