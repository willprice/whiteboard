'use strict'

import Point from '../common/point'

function localiseClick (obj, clickX, clickY) {
  const xRelativeToObj = clickX - obj.offsetLeft
  const yRelativeToObj = clickY - obj.offsetTop
  return new Point(xRelativeToObj, yRelativeToObj)
}

export { localiseClick }