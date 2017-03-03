'use strict'
import { localiseClick } from 'client/dom_utils'
import Path from 'common/path'

class Whiteboard {
  constructor (canvasElement) {
    this.canvas = canvasElement
    this.context = canvasElement.getContext('2d')

    this.drawing = false
    this.paths = []
  }

  startNewPath (event) {
    this.drawing = true
    this.paths.unshift(new Path())
    this.updatePath(event)
  }

  updatePath (event) {
    if (this.drawing) {
      let clickPoint = localiseClick(event.target, event.pageX, event.pageY)
      this.paths[0].add(clickPoint.x, clickPoint.y)
      this.paths[0].draw(this.context)
    }
  }

  endPath () {
    this.drawing = false
  }

  setColor (color) {
    this.context.strokeStyle = color
  }

  setStrokeSize (size) {
    console.log(size)
    this.context.lineWidth = size
  }

  setupCallbacks () {
    this.canvas.addEventListener('mousedown', this.startNewPath.bind(this))
    this.canvas.addEventListener('mousemove', this.updatePath.bind(this))
    this.canvas.addEventListener('mouseup', this.endPath.bind(this))
    this.canvas.addEventListener('mouseout', this.endPath.bind(this))

    let colors = ['black', 'gray', 'blue', 'green', 'yellow', 'orange', 'red']
    colors.map((color) => {
      document.getElementById('palette-' + color).addEventListener('click', this.setColor.bind(this, color))
    })
    document.getElementById('brush-size').addEventListener('change', (event) => {
      this.setStrokeSize(parseInt(event.target.value))
    })
  }
}

export default Whiteboard
