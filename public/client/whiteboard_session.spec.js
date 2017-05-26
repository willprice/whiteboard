'use strict'
/* global describe, it, before, after, beforeEach */

const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect
chai.use(require('sinon-chai'))
const boardMother = require('../common/spec_helpers/object_mothers/board_mother')

const WhiteboardSession = require('./whiteboard_session')
const WhiteboardAPI = require('./whiteboard_api')

describe('WhiteboardSession', () => {
  let api = null
  let session = null

  before(() => {
    this.clock = sinon.useFakeTimers()
  })

  after(() => {
    this.clock.restore()
  })

  beforeEach(() => {
    api = sinon.createStubInstance(WhiteboardAPI)
    api.newBoard.returns(new Promise((resolve) => resolve(1)))

    session = new WhiteboardSession(api)
  })

  it('creates a new whiteboard for an unsaved whiteboard on newBoard', () => {
    return session.save().then(() => {
      expect(api.newBoard).to.be.calledWith(session.whiteboard)
    })
  })

  it('starts syncing after a new whiteboard has been saved', () => {
    sinon.spy(session, 'syncBoard')

    return session.save().then(() => {
      this.clock.tick(5000)
      expect(session.syncBoard).to.have.been.called
    })
  })

  it('only requests a new board for the first invocation of save', () => {
    return session.save().then(() => {
      return session.save()
    }).then(() => {
      expect(api.newBoard).to.have.been.calledOnce
    })
  })

  it('updates metadata on second invocation of save', () => {
    return session.save().then(() => {
      return session.save()
    }).then(() => {
      expect(api.updateMetadata).to.have.been.calledOnce
      expect(api.updateMetadata).to.have.been.calledWith(session.whiteboard)
    })
  })

  it('does not setup new sync timer if it is already running', () => {
    sinon.spy(session, 'syncBoard')

    return session.save()
      .then(() => session.save())
      .then(() => {
        this.clock.tick(2000)
        expect(session.syncBoard).to.have.been.calledOnce
      })
  })

  it('first sync sends all paths', () => {
    api.addPaths.returns(new Promise((resolve) => resolve()))

    return session.syncBoard().then(() => {
      expect(api.addPaths).to.have.been.calledWith(session.whiteboard.paths)
    })
  })

  it('sends path delta after first sync', () => {
    api.addPaths.returns(new Promise((resolve) => resolve()))

    session.whiteboard.startNewPath()
    session.whiteboard.updatePath(0, 0)
    session.whiteboard.updatePath(5, 5)
    session.whiteboard.endPath()

    return session.syncBoard().then(() => {
      session.whiteboard.startNewPath()
      session.whiteboard.updatePath(5, 10)
      session.whiteboard.updatePath(10, 5)
      session.whiteboard.endPath()
    })
      .then(session.syncBoard.bind(session))
      .then(() => {
        expect(api.addPaths).to.have.been.calledWith(session.whiteboard.paths.slice(0, 1))
      })
  })

  describe('loadWhiteboard', () => {
    let boardId = 1
    let whiteboard = boardMother.boardWithTriangles({ id: 1 })

    beforeEach(() => {
      sinon.spy(session, 'syncBoard')
      api.fetchBoard.resolves(whiteboard)
      return session.loadBoard(boardId)
    })

    it('sets session whiteboard to that returned from API', () => {
      expect(session.whiteboard).to.equal(whiteboard)
    })

    it('sets newBoard to false', () => {
      expect(session.newBoard).to.be.false
    })

    it('sets sync status to up-to-date', () => {
      expect(session.lastSyncedPathCount).to.eql(whiteboard.paths.length)
    })

    it('starts sync timer', () => {
      this.clock.tick(session.syncPeriod)

      expect(session.syncBoard).to.have.been.calledOnce
    })

    it('clears old sync timer', () => {
      sinon.stub(session, 'save').resolves()
      return session.save().then(() => {
        return session.loadBoard(boardId)
      }).then(() => {
        this.clock.tick(session.syncPeriod)
        expect(session.syncBoard).to.have.been.calledOnce
      })
    })
  })
})
