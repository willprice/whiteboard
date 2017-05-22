'use strict'
/* global describe, it, beforeEach, afterEach */

import chai from 'chai'
const assert = chai.assert
import sinon from 'sinon'

import WhiteboardAPI from './whiteboard_api'
import Whiteboard from './whiteboard'

describe('WhiteboardAPI', () => {
  let connectionInterface = {
    send: function send (command, args) {}
  }
  let stubSerialise = sinon.stub()
  let mockConnection = null
  let api = null
  let whiteboard = null

  beforeEach(() => {
    mockConnection = sinon.mock(connectionInterface)
    stubSerialise = sinon.stub()
    whiteboard = new Whiteboard()
    api = new WhiteboardAPI(connectionInterface, stubSerialise)
  })

  afterEach(() => {
    mockConnection.restore()
  })

  it('returns the board id on requesting a new board', (done) => {
    var boardId = 1234
    mockConnection.expects('send')
      .once()
      .withExactArgs('new_board')
      .returns(new Promise((resolve) => { resolve(boardId) }))

    api.newBoard()
      .then((specifiedBoardId) => {
        assert(specifiedBoardId === boardId)
      }).then(done)
  })

  it('serialises the whiteboard when updating', (done) => {
    let serialisedWhiteboard = {
      paths: []
    }
    stubSerialise.withArgs(whiteboard).returns(serialisedWhiteboard)
    mockConnection.expects('send')
      .once()
      .withExactArgs('update_board', serialisedWhiteboard)
      .returns(new Promise((resolve) => { resolve(true) }))

    api.updateBoard(whiteboard)
      .then((success) => {
        assert(success)
      }).then(done)
  })

  it('updates board metadata', (done) => {
    let description = 'Test Board Description'
    let tags = ['testTag1', 'testTag2']
    mockConnection.expects('send')
      .once()
      .withExactArgs('update_board_metadata', {
        id: whiteboard.id,
        description: description,
        tags: tags
      })
      .returns(new Promise((resolve) => { resolve(true) }))

    api.updateMetadata(whiteboard, description, tags).then((success) => {
      assert(success)
    }).then(done)
  })
})
