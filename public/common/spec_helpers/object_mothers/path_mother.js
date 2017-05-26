'use strict'
const Path = require('../../path')

module.exports.trianglePath = function (xOffset = 0, yOffset = 0) {
  let path = new Path()
  path.add(0 + xOffset, 0 + yOffset)
  path.add(10 + xOffset, 0 + yOffset)
  path.add(0 + xOffset, 10 + yOffset)
  path.add(0 + xOffset, 0 + yOffset)
  return path
}

module.exports.squarePath = function (xOffset = 0, yOffset = 0) {
  let path = new Path()
  path.add(0 + xOffset, 0 + yOffset)
  path.add(10 + xOffset, 0 + yOffset)
  path.add(10 + xOffset, 10 + yOffset)
  path.add(0 + xOffset, 10 + yOffset)
  path.add(0 + xOffset, 0 + yOffset)
  return path
}
