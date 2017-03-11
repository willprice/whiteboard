'use strict'
/* global describe, it */

import chai from 'chai'
import Whiteboard from './whiteboard'
import mockContext from 'common/test/mocks/2d_context_mock'
const assert = chai.assert

describe('Whiteboard', () => {
  let stubCanvas = {
    getContext: (type) => mockContext()
  }
  describe('Path color', () => {
    it('sets the color of the current path', () => {
      let whiteboard = new Whiteboard(stubCanvas)

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
      let whiteboard = new Whiteboard(stubCanvas)
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
      let whiteboard = new Whiteboard(stubCanvas)

      whiteboard.setStrokeSize(5)
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
