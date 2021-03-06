'use strict'
/* global describe, it, beforeEach */

const assert = require('chai').assert
const mockContext = require('./spec_helpers/2d_context_mock')

const Path = require('./path')
const Point = require('./point')

describe('Path', () => {
  it('adding point to path', () => {
    let path = new Path()
    path.add(0, 1)
    assert.deepEqual([new Point(0, 1)], path.points)
  })

  let context

  beforeEach(() => {
    context = mockContext()
  })

  function createAndDrawPath () {
    let path = new Path()
    path.add(0, 1)
    path.color = '#fff'
    path.width = 5

    path.draw(context)
    return path
  }

  describe('draw', () => {
    it('begins and closes a path', () => {
      createAndDrawPath()

      assert(context.beginPath.called)
      assert(context.closePath.called)
    })

    it('strokes the path', () => {
      createAndDrawPath()

      assert(context.stroke.called)
    })

    it('sets stroke color of path', () => {
      createAndDrawPath()

      assert.equal(context.strokeStyle, '#fff')
    })

    it('sets lineWidth', () => {
      createAndDrawPath()

      assert.equal(context.lineWidth, 5)
    })
  })
})
