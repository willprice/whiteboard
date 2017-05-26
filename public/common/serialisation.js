'use strict'
const serialijse = require('serialijse')
const Whiteboard = require('./whiteboard')
const Path = require('./path')
const Point = require('./point')
const BrushTools = require('./brush')

serialijse.declarePersistable(Point)
serialijse.declarePersistable(Path)
serialijse.declarePersistable(Whiteboard)
serialijse.declarePersistable(BrushTools)

module.exports = {
  serialise: serialijse.serialize,
  deserialise: serialijse.deserialize
}
