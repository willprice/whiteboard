'use strict'
/* global describe, it */

const assert = require('chai').assert

const localiseClick = require('./dom_utils').localiseClick
const Point = require('../common/point')

describe('dom_utils', () => {
  it('localising click', () => {
    let clickX = 12
    let clickY = 24
    let obj = {
      offsetLeft: 10,
      offsetTop: 20
    }
    assert.deepEqual(new Point(2, 4), localiseClick(obj, clickX, clickY))
  })
})
