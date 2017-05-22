'use strict'
import serialijse from 'serialijse'
import Whiteboard from './whiteboard'
import BrushTools from './brushtools'
import Path from '../common/path'
import Point from '../common/point'

serialijse.declarePersistable(Whiteboard)
serialijse.declarePersistable(BrushTools)
serialijse.declarePersistable(Path)
serialijse.declarePersistable(Point)

function serialise (obj) {
  return serialijse.serialize(obj)
}

export default serialise
