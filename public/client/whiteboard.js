'use strict'
import { localiseClick } from 'client/dom_utils'
import Path from 'common/path'

class Whiteboard {
  constructor (canvasElement) {
    this.canvas = canvasElement
    this.context = canvasElement.getContext('2d')

    this.currentPath = null
    this.currentColor = 'black'
    this.currentLineWidth = 1
    this.drawing = false
    this.paths = []
  }

  startNewPath (event) {
    this.drawing = true
    let path = new Path()
    path.setColor(this.currentColor)
    path.setWidth(this.currentLineWidth)
    this.paths.unshift(path)
    this.currentPath = path
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
    this.currentPath = null
  }

  setColor (color) {
    this.currentColor = color
    if (this.currentPath !== null) {
      this.currentPath.setColor(this.currentColor)
    }
  }

  setStrokeSize (size) {
    this.currentLineWidth = size
  }

  setupCallbacks () {
    this.canvas.addEventListener('mousedown', this.startNewPath.bind(this))
    this.canvas.addEventListener('mousemove', this.updatePath.bind(this))
    this.canvas.addEventListener('mouseup', this.endPath.bind(this))
    this.canvas.addEventListener('mouseout', this.endPath.bind(this))

    let colors = ['black', 'gray', 'blue', 'green', 'yellow', 'orange', 'red', 'white']
    let currentColor = document.getElementById('palette-black')

    colors.map((color) => {
      document.getElementById('palette-' + color).addEventListener('click', (event) => {
        this.setColor(color)
        currentColor.style.width = '20px'
        currentColor.style.height = '20px'
        document.querySelector('#brush-size > .circle').style.background = color

        currentColor = event.target
        currentColor.style.height = '30px'
        currentColor.style.width = '30px'
      })
    })
    document.getElementById('brush-adjuster').addEventListener('change', (event) => {
      document.querySelector('#brush-size > .circle').style.width = event.target.value.toString() + 'px'
      document.querySelector('#brush-size > .circle').style.height = event.target.value.toString() + 'px'
      this.setStrokeSize(parseInt(event.target.value))
    })
  }
}

export default Whiteboard
