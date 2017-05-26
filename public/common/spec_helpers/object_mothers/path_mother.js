'use strict'
const Path = require('../../path')

module.exports.trianglePath = function (options = {}) {
  let {
    xOffset = 0,
    yOffset = 0,
    color = 'black',
    width = 1
  } = options

  let path = new Path()
  path.color = color
  path.width = width
  path.add(0 + xOffset, 0 + yOffset)
  path.add(10 + xOffset, 0 + yOffset)
  path.add(0 + xOffset, 10 + yOffset)
  path.add(0 + xOffset, 0 + yOffset)
  return path
}

module.exports.squarePath = function (options = {}) {
  let {
    xOffset = 0,
    yOffset = 0,
    color = 'black',
    width = 1
  } = options

  let path = new Path()
  path.color = color
  path.width = width
  path.add(0 + xOffset, 0 + yOffset)
  path.add(10 + xOffset, 0 + yOffset)
  path.add(10 + xOffset, 10 + yOffset)
  path.add(0 + xOffset, 10 + yOffset)
  path.add(0 + xOffset, 0 + yOffset)
  return path
}
