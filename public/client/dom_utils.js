'use strict'

const Point = require('../common/point')

function localiseClick (obj, clickX, clickY) {
  const xRelativeToObj = clickX - obj.offsetLeft
  const yRelativeToObj = clickY - obj.offsetTop
  return new Point(xRelativeToObj, yRelativeToObj)
}

function toPx (integer) {
  return integer.toString() + 'px'
}

module.exports = {
  localiseClick: localiseClick,
  toPx: toPx
}
