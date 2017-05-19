'use strict'
import { toPx } from '../dom_utils'

class BrushToolsUI {
  constructor (element, whiteboard) {
    this.element = element
    this.colorPaletteElement = element.querySelector('.color-palette')
    this.brushElement = element.querySelector('.currentbrush > .brush-icon')
    this.brushSliderElement = element.querySelector('.brush-sizer > .adjuster')

    this.whiteboard = whiteboard
    this.brushTools = whiteboard.brushTools

    this.setupBrush()
    this.setupPalette()
    this.setupBrushSlider()
  }

  setupBrushSlider () {
    function updateBrushSizeCallback (event) {
      let containerSize = this.brushElement.parentNode.offsetWidth
      let newSize = parseInt(event.target.value)
      let marginRadius = (containerSize - newSize) / 2

      this.brushElement.style.width = newSize.toString() + 'px'
      this.brushElement.style.height = newSize.toString() + 'px'
      this.brushElement.style.margin = marginRadius.toString() + 'px'

      this.brushTools.setStrokeSize(newSize)
    }
    this.brushSliderElement.addEventListener('input', updateBrushSizeCallback.bind(this))
  }

  setupBrush () {
    this.brushElement.style.width = toPx(this.brushTools.currentLineWidth)
    this.brushElement.style.height = toPx(this.brushTools.currentLineWidth)
    this.brushElement.style.backgroundColor = this.brushTools.currentColor
  }

  setupPalette () {
    for (let i = 0; i < this.brushTools.colors.length; i++) {
      let color = this.brushTools.colors[i]
      let colorElement = document.createElement('div')
      colorElement.className = 'brush-icon'
      colorElement.style.backgroundColor = color
      colorElement.addEventListener('click', () => {
        this.setColor(color)
      })
      this.colorPaletteElement.appendChild(colorElement)
    }
  }

  setColor (color) {
    this.brushElement.style.backgroundColor = color
    this.brushTools.setColor(color)
  }
}

export default BrushToolsUI
