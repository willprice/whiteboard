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
  let stubSerialise = null
  let stubDeserialise = null
  let mockConnection = null
  let api = null
  let whiteboard = null

  beforeEach(() => {
    mockConnection = sinon.mock(connectionInterface)
    stubSerialise = sinon.stub()
    stubDeserialise = sinon.stub()
    whiteboard = new Whiteboard()
    api = new WhiteboardAPI(connectionInterface, stubSerialise, stubDeserialise)
  })

  afterEach(() => {
    mockConnection.restore()
  })

  it('updates board metadata', () => {
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

    return api.updateMetadata(whiteboard, description, tags).then((success) => {
      expect(success).to.be.true
    })
  })

  it('fetches whiteboard by id', () => {
    let id = 123
    let serialisedWhiteboard = 'serialisedWhiteboardRepresentation'
    stubDeserialise
      .withArgs(serialisedWhiteboard)
      .returns(whiteboard)

    mockConnection.expects('send')
      .once()
      .withExactArgs('fetch_board', {
        id: id
      })
      .returns(new Promise((resolve) => { resolve(serialisedWhiteboard) }))

    return api.fetchBoard(id).then((wb) => {
      expect(wb).to.be.equal(whiteboard)
    })
  })

  it('#addPaths', () => {
    let wb = boardMother.boardWithTriangles()
    mockConnection.expects('send')
      .once()
      .withExactArgs('add_paths', wb.paths)
      .returns(new Promise((resolve) => resolve(true)))

    return api.addPaths(wb.paths)
  })

  describe('#save', () => {
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

    it('delegates save to api', () => {
      mockSend()

      return api.save(whiteboard).then((returnedId) => {
        expect(mockConnection.verify()).to.be.ok
      })
    })

    it('updates whiteboard id after save', () => {
      mockSend()

      return api.save(whiteboard).then(() => {
        expect(whiteboard.id).to.be.equal(id)
      })
    })
  })
})
