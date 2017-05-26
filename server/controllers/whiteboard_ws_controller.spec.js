'use strict'
/* globals describe, it, beforeEach */

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const expect = chai.expect
chai.use(sinonChai)

const WhiteboardWSController = require('./whiteboard_ws_controller')
const WhiteboardEditSession = require('../edit_session')
const FakeWebSocket = require('../spec_helpers/fake_websocket')
const boardMother = require('../../public/common/spec_helpers/object_mothers/board_mother')

describe('WhiteboardWSController', () => {
  let editSession = null
  // eslint-disable-next-line
  let controller = null
  let ws = null

  let name = 'TestWhiteboardName'
  let tags = ['TestTag1', 'TestTag2']

  beforeEach(() => {
    editSession = sinon.createStubInstance(WhiteboardEditSession)
    ws = new FakeWebSocket()
    controller = new WhiteboardWSController(ws, editSession)
  })

  it('calls save when receiving new_board message', () => {
    ws.triggerEvent('message', JSON.stringify({
      command: 'new_board',
      data: {
        name: name,
        tags: tags
      }
    }))

    expect(editSession.newBoard).to.have.been.calledWithExactly(name, tags)
  })

  it('calls add_paths when receiving add_paths message', () => {
    let wb = boardMother.boardWithTriangles()
    ws.triggerEvent('message', JSON.stringify({
      command: 'add_paths',
      data: wb.paths
    }))

    expect(editSession.addPaths).to.have.been.calledWithExactly(wb.paths)
  })
})
