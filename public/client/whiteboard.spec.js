'use strict'
/* global describe, it */

import chai from 'chai'
const assert = chai.assert
import Whiteboard from './whiteboard'

describe('Whiteboard', () => {
  describe('Path color', () => {
    it('sets the color of the current path', () => {
      let whiteboard = new Whiteboard()

      whiteboard.startNewPath({
        pageX: 50,
        pageY: 50,
        target: {
          offsetX: 0,
          offsetY: 0
        }
      })
      whiteboard.setColor('#fff')

      assert.equal(whiteboard.currentPath.color(), '#fff')
    })

    it('sets the color of a new path', () => {
      let whiteboard = new Whiteboard()
      whiteboard.setColor('#fff')
      whiteboard.startNewPath({
        pageX: 50,
        pageY: 50,
        target: {
          offsetX: 0,
          offsetY: 0
        }
      })
      assert.equal(whiteboard.currentPath.color(), '#fff')
    })
  })

  describe('Path width', () => {
    it('sets the width of the next path', () => {
      let whiteboard = new Whiteboard()

      whiteboard.brushTools.setStrokeSize(5)
      whiteboard.startNewPath({
        pageX: 50,
        pageY: 50,
        target: {
          offsetX: 0,
          offsetY: 0
        }
      })
      assert.equal(whiteboard.currentPath.width(), 5)
    })
  })
})
