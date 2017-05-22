import { localiseClick } from '../dom_utils'
import BrushToolsUI from './brushtools_ui'

class WhiteboardUI {
  constructor (element, whiteboard) {
    this.element = element
    this.canvas = this.getCanvas()
    this.context = this.canvas.getContext('2d')
    this.whiteboard = whiteboard

    this.brushToolsUI = new BrushToolsUI(element.querySelector('.brush-tools'), this.whiteboard)
    this.setupCallbacks()
    this.resizeCanvas()
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
  }

  resizeCanvas () {
    let container = this.getCanvasContainer()
    let newWidth = container.offsetWidth
    let newHeight = container.offsetHeight

    this.canvas.width = newWidth
    this.canvas.height = newHeight
  }

  getCanvasContainer () {
    return this.element.querySelector('.whiteboard-canvas')
  }

  getCanvas () {
    return this.element.querySelector('.whiteboard-canvas--canvas')
  }

  startNewPath (event) {
    this.whiteboard.startNewPath()
    this.updatePath(event)
  }

  updatePath (event) {
    if (this.whiteboard.currentlyDrawing) {
      let clickPoint = localiseClick(event.target, event.pageX, event.pageY)
      this.whiteboard.updatePath(clickPoint.x, clickPoint.y)
      this.whiteboard.paths[0].draw(this.context)
    }
  }

  endPath () {
    this.whiteboard.endPath()
  }

  setColor (color) {
    this.whiteboard.setColor(color)
    this.brushToolsUI.setColor(color)
  }
}

export default WhiteboardUI
