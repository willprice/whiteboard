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
const serialisation = require('../../public/common/serialisation')
const serialise = serialisation.serialise

describe('WhiteboardWSController', () => {
  let editSession = null
  // eslint-disable-next-line
  let controller = null
  let ws = null

  let name = 'TestWhiteboardName'
  let tags = ['TestTag1', 'TestTag2']
  let owner = 'willprice'

  let messageId = 1

  beforeEach(() => {
    editSession = sinon.createStubInstance(WhiteboardEditSession)
    editSession.user = owner
    ws = new FakeWebSocket()

    controller = new WhiteboardWSController(ws, editSession)
    controller.listen()
  })

  describe('message: new_board', () => {
    it('calls newBoard when receiving new_board message', () => {
      editSession.newBoard.resolves()

      return sendMessage('new_board', { name: name, tags: tags }).then(() => {
        expect(editSession.newBoard).to.have.been.calledWithExactly(name, tags, owner)
      })
    })

    it('responds with success of adding new board', () => {
      let sendSpy = sinon.spy(ws, 'send')
      editSession.newBoard.resolves()
      let messageId = 1

      return sendMessage('new_board', { name: name, tags: tags }).then(() => {
        expect(sendSpy).to.have.been.calledWith(serialise({
          id: messageId,
          data: true
        }))
      })
    })
  })

  it('calls add_paths when receiving add_paths message', () => {
    let wb = boardMother.boardWithTriangles()
    return sendMessage('add_paths', wb.paths).then(() => {
      expect(editSession.addPaths).to.have.been.calledWithExactly(wb.paths)
    })
  })

  describe('message: list_boards', () => {
    it('returns skeleton whiteboards', () => {
      const availableWhiteboards = [boardMother.boardWithTriangles()]
      editSession.listBoards.resolves(availableWhiteboards)
      let sendSpy = sinon.spy(ws, 'send')

      return sendMessage('list_boards', null).then(() => {
        expect(sendSpy).to.have.been.calledWith(serialise({
          id: messageId,
          data: availableWhiteboards
        }))
      })
    })
  })

  function sendMessage (command, data, id = messageId) {
    return ws.triggerEvent('message', serialise({
      command: command,
      id: id,
      data: data
    }))
  }
})
