'use strict'

import Point from './point'

class Path {
  constructor () {
    this.points = []
  }

  add (x, y) {
    this.points.push(new Point(x, y))
  }

  draw (canvas) {
    canvas.beginPath()
    for (let i = 1; i < this.points.length; i++) {
      canvas.moveTo(this.points[i - 1].x, this.points[i - 1].y)
      canvas.lineTo(this.points[i].x, this.points[i].y)
    }
    canvas.closePath()
    canvas.stroke()
  }
}
export default Path
