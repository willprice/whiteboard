'use strict'
/* global describe, it */

const assert = require('chai').assert
const Whiteboard = require('./whiteboard')

describe('Whiteboard', () => {
  describe('Path color', () => {
    it('sets the color of the current path', () => {
      let whiteboard = new Whiteboard()

      whiteboard.startNewPath()
      whiteboard.setColor('#fff')

      assert.equal(whiteboard.currentPath.color, '#fff')
    })

    it('sets the color of a new path', () => {
      let whiteboard = new Whiteboard()
      whiteboard.setColor('#fff')
      whiteboard.startNewPath()
      assert.equal(whiteboard.currentPath.color, '#fff')
    })
  })

  describe('Path width', () => {
    it('sets the width of the next path', () => {
      let whiteboard = new Whiteboard()

      whiteboard.brush.setStrokeSize(5)
      whiteboard.startNewPath()
      assert.equal(whiteboard.currentPath.width, 5)
    })
  })

  it('Adds current path to paths when complete', () => {
    let whiteboard = new Whiteboard()

    let pathCount = whiteboard.paths.length
    whiteboard.startNewPath()
    whiteboard.endPath()
    assert.equal(pathCount + 1, whiteboard.paths.length)
  })
})
