'use strict'

const Whiteboard = require('../../whiteboard')
const pathMother = require('./path_mother')

module.exports.boardWithTriangles = function (options = {}) {
  let {
    id = 1,
    name = 'TestWhiteboard',
    tags = ['TestTag1', 'TestTag2']
  } = options
  let wb = new Whiteboard([], id, name, tags)
  wb.paths.push(pathMother.trianglePath({ width: 2 }))
  wb.paths.push(pathMother.trianglePath({ xOffset: 30, yOffset: 50, color: 'green' }))
  wb.paths.push(pathMother.trianglePath({ xOffset: 60, yOffset: 20, color: 'pink' }))
  return wb
}
