'use strict'
/* global describe, it, beforeEach */

import chai from 'chai'
const assert = chai.assert
import mockContext from './test/mocks/2d_context_mock'

import Path from './path'
import Point from './point'

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
  })
})
