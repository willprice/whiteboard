'use strict'

const Point = require('./point')

class Path {
  constructor () {
    this.points = []
    this._color = 'black'
    this._width = 1
  }

  set color (color) {
    this._color = color
  }

  get color () {
    return this._color
  }

  set width (width) {
    this._width = width
  }

  get width () {
    return this._width
  }

  add (x, y) {
    this.points.push(new Point(x, y))
  }

  draw (canvas) {
    canvas.beginPath()
    canvas.strokeStyle = this.color
    canvas.fillStyle = this.color
    canvas.lineWidth = this.width
    for (let i = 1; i < this.points.length; i++) {
      canvas.moveTo(this.points[i - 1].x, this.points[i - 1].y)
      canvas.lineTo(this.points[i].x, this.points[i].y)
      canvas.fillRect(this.points[i].x - this.width / 3, this.points[i].y - this.width / 3, this.width * 2 / 3, this.width * 2 / 3)
    }
    canvas.stroke()
    canvas.closePath()
  }
}
module.exports = Path
