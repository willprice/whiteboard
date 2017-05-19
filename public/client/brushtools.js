'use strict'

class BrushTools {
  constructor () {
    this.colors = ['black', 'gray', 'blue', 'green', 'orange', 'red', 'yellow', 'white']
    this.currentColor = this.colors[0]
    this.currentLineWidth = 5
  }

  setStrokeSize (size) {
    this.currentLineWidth = size
  }

  setColor (color) {
    this.currentColor = color
  }
}

export default BrushTools
