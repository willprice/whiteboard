'use strict'
/* global describe, it, beforeEach, afterEach */

const expect = require('chai').expect
const sinon = require('sinon')

const WhiteboardAPI = require('./whiteboard_api')
const Whiteboard = require('./../common/whiteboard')
const boardMother = require('../common/spec_helpers/object_mothers/board_mother')

describe('WhiteboardAPI', () => {
  let connectionInterface = {
    send: function send (command, args) {}
  }
  let mockConnection = null
  let api = null
  let whiteboard = null

  beforeEach(() => {
    mockConnection = sinon.mock(connectionInterface)
    whiteboard = new Whiteboard()
    api = new WhiteboardAPI(connectionInterface)
  })

  afterEach(() => {
    mockConnection.restore()
  })

  it('updates board metadata', () => {
    let name = 'Test Board Description'
    let tags = ['testTag1', 'testTag2']
    whiteboard.name = name
    whiteboard.tags = tags

    mockConnection.expects('send')
      .once()
      .withExactArgs('update_board_metadata', {
        id: whiteboard.id,
        name: name,
        tags: tags
      })
      .returns(new Promise((resolve) => { resolve(true) }))

    return api.updateMetadata(whiteboard).then((success) => {
      expect(success).to.be.true
      mockConnection.verify()
    })
  })

  it('fetches whiteboard by id', () => {
    let id = 123

    mockConnection.expects('send')
      .once()
      .withExactArgs('fetch_board', {
        id: id
      })
      .returns(new Promise((resolve) => { resolve(whiteboard) }))

    return api.fetchBoard(id).then((wb) => {
      expect(wb).to.be.equal(whiteboard)
      mockConnection.verify()
    })
  })

  it('#addPaths', () => {
    let wb = boardMother.boardWithTriangles()

    mockConnection.expects('send')
      .once()
      .withExactArgs('add_paths', wb.paths)
      .returns(new Promise((resolve) => resolve(true)))

    return api.addPaths(wb.paths).then(() => {
      mockConnection.verify()
    })
  })

  describe('#newBoard', () => {
    const name = 'TestWhiteboardName'
    const tags = ['TestTag1', 'TestTag2']
    const id = 3

    beforeEach(() => {
      whiteboard.name = name
      whiteboard.tags = tags
    })

    function mockSend () {
      mockConnection.expects('send')
        .once()
        .withExactArgs('new_board', {
          name: name,
          tags: tags
        }).returns(new Promise((resolve) => { resolve(id.toString()) }))
    }

    it('delegates newBoard to api', () => {
      mockSend()

      return api.newBoard(whiteboard).then((returnedId) => {
        expect(mockConnection.verify()).to.be.ok
      })
    })

    it('updates whiteboard id after newBoard', () => {
      mockSend()

      return api.newBoard(whiteboard).then(() => {
        expect(whiteboard.id).to.be.equal(id)
      })
    })
  })
})
