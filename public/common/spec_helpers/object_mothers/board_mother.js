'use strict'

const Whiteboard = require('../../whiteboard')
const pathMother = require('./path_mother')

module.exports.boardWithTriangles = function () {
  let wb = new Whiteboard([], -1, 'TestWhiteboard', ['TestTag1', 'TestTag2'])
  wb.paths.push(pathMother.trianglePath())
  wb.paths.push(pathMother.trianglePath(50, 0))
  wb.paths.push(pathMother.trianglePath(0, 30))
  return wb
}
