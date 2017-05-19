'use strict'
import Path from 'common/path'
import BrushTools from './brushtools'

class Whiteboard {
  constructor (paths = []) {
    this.paths = paths
    this.brushTools = new BrushTools()

    this.currentlyDrawing = false
    this.currentPath = null
  }

  startNewPath () {
    this.currentlyDrawing = true
    let path = new Path()
    path.setColor(this.brushTools.currentColor)
    path.setWidth(this.brushTools.currentLineWidth)
    this.paths.unshift(path)
    this.currentPath = path
  }

  updatePath (x, y) {
    this.paths[0].add(x, y)
  }

  setColor (color) {
    this.brushTools.setColor(color)
    if (this.currentPath !== null) {
      this.currentPath.setColor(this.brushTools.currentColor)
    }
  }

  endPath () {
    this.currentlyDrawing = false
    this.currentPath = null
  }
}

export default Whiteboard
