'use strict'
import { localiseClick } from 'client/dom_utils'
import Path from 'common/path'

class Whiteboard {
  constructor (canvasElement) {
    this.canvas = canvasElement
    this.context = canvasElement.getContext('2d')

    this.currentPath = null
    this.currentColor = 'black'
    this.currentLineWidth = 5
    this.drawing = false
    this.paths = []
    this.colors = ['black', 'gray', 'blue', 'green', 'orange', 'red', 'yellow', 'white']

    this.brushNode = document.querySelector('.brush-tools > .currentbrush > .brush-icon')
    this.brushNode.style.width = this.currentLineWidth.toString() + 'px'
    this.brushNode.style.height = this.currentLineWidth.toString() + 'px'
    this.brushNode.style.backgroundColor = this.currentColor
    this.colorPaletteNode = document.querySelector('.brush-tools > .color-palette')

    function colorUpdateEventCallback (event) {
      // document.getElementById('palette-' + color).addEventListener('click', (event) => {
      //   this.setColor(color)
      //   currentColor.style.width = '20px'
      //   currentColor.style.height = '20px'
      //   document.querySelector('#brush-size > .circle').style.background = color
      //
      //   currentColor = event.target
      //   currentColor.style.height = '30px'
      //   currentColor.style.width = '30px'
      // event.
      event.stopPropagation()
    }

    document.querySelectorAll('.color-palette > .brush-icon').forEach((node, index) => {
      node.addEventListener('click', colorUpdateEventCallback.bind(this))
    })

    document.querySelector('.brush-sizer > .adjuster').addEventListener('change', (event) => {
      let containerSize = 60
      let newSize = parseInt(event.target.value)
      let marginRadius = (containerSize - newSize) / 2
      this.brushNode.style.width = newSize.toString() + 'px'
      this.brushNode.style.height = newSize.toString() + 'px'
      this.brushNode.style.margin = marginRadius.toString() + 'px'

      this.setStrokeSize(newSize)
    })
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
    this.brushNode.style.backgroundColor = color
    if (this.currentPath !== null) {
      this.currentPath.setColor(this.currentColor)
    }
  }

  setStrokeSize (size) {
    this.currentLineWidth = size
  }

  setupCallbacks () {
    function newPathEventCallback (event) {
      this.startNewPath(event)
      event.preventDefault()
    }

    function updatePathEventCallback (event) {
      this.updatePath(event)
      event.preventDefault()
    }

    function endPathEventCallback (event) {
      this.endPath(event)
      event.preventDefault()
    }

    this.canvas.addEventListener('mousedown', newPathEventCallback.bind(this))
    this.canvas.addEventListener('mousemove', updatePathEventCallback.bind(this))
    this.canvas.addEventListener('mouseup', endPathEventCallback.bind(this))
    this.canvas.addEventListener('mouseout', endPathEventCallback.bind(this))

    let colorPaletteNode = document.querySelector('.color-palette')
    for (let i = 0; i < this.colors.length; i++) {
      let color = this.colors[i]
      let node = document.createElement('div')
      node.className = `brush-icon`
      node.style.backgroundColor = color
      node.addEventListener('click', (event) => {
        this.setColor(color)
      })
      colorPaletteNode.appendChild(node)
    }
  }
}

export default Whiteboard
