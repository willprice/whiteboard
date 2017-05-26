'use strict'
/* global describe, it, before, after, beforeEach */

const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect
chai.use(require('sinon-chai'))

const WhiteboardSession = require('./whiteboard_session')
const WhiteboardAPI = require('./whiteboard_api')

describe('WhiteboardSession', () => {
  let api = sinon.createStubInstance(WhiteboardAPI)
  let session = null

  before(() => {
    this.clock = sinon.useFakeTimers()
  })

  after(() => {
    this.clock.restore()
  })

  beforeEach(() => {
    session = new WhiteboardSession(api)
    api.save.returns(new Promise((resolve) => resolve(1)))
  })

  it('creates a new whiteboard for an unsaved whiteboard on save', () => {
    return session.save().then(() => {
      expect(api.save).to.be.calledWith(session.whiteboard)
    })
  })

  it('starts syncing after a new whiteboard has been saved', () => {
    sinon.spy(session, 'syncBoard')

    return session.save().then(() => {
      this.clock.tick(5000)
      expect(session.syncBoard).to.have.been.called
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
})
