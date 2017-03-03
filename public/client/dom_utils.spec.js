'use strict'
/* global describe, it */

import chai from 'chai'
const assert = chai.assert

import { localiseClick } from './dom_utils'
import Point from 'common/point'

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
