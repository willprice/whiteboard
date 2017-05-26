'use strict'
const serialijse = require('serialijse')
const Whiteboard = require('./../common/whiteboard')
const BrushTools = require('./../common/brush')
const Path = require('../common/path')
const Point = require('../common/point')

serialijse.declarePersistable(Whiteboard)
serialijse.declarePersistable(BrushTools)
serialijse.declarePersistable(Path)
serialijse.declarePersistable(Point)

function serialise (obj) {
  return serialijse.serialize(obj)
}

function deserialise (str) {
  return serialijse.deserialize(str)
}

module.exports = {
  serialise: serialise,
  deserialise: deserialise
}
