'use strict'

const sinon = require('sinon')

function mockContext () {
  return {
    moveTo: sinon.spy(),
    beginPath: sinon.spy(),
    closePath: sinon.spy(),
    lineTo: sinon.spy(),
    stroke: sinon.spy(),
    strokeStyle: 'black',
    lineWidth: 1
  }
}

module.exports = mockContext
