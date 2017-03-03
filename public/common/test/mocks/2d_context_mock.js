'use strict'

import sinon from 'sinon'

function mockContext () {
  return {
    moveTo: sinon.spy(),
    beginPath: sinon.spy(),
    closePath: sinon.spy(),
    lineTo: sinon.spy(),
    stroke: sinon.spy()
  }
}

export default mockContext
