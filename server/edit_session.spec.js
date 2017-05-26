'use strict'
/* global it, describe, beforeEach */

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = chai.expect
const boardMother = require('../public/common/spec_helpers/object_mothers/board_mother')

const Whiteboard = require('../public/common/whiteboard')
const EditSession = require('./edit_session')
const BoardRepository = require('./repositories/board_repository')

describe('EditSession', () => {
  let boardRepo = null
  let editSession = null
  let wb = null

  beforeEach(() => {
    boardRepo = sinon.createStubInstance(BoardRepository)
    editSession = new EditSession(boardRepo)
    wb = boardMother.boardWithTriangles()
  })

  it('creates new board in db', () => {
    boardRepo.create.returns(new Promise((resolve) => resolve(wb)))

    return editSession.newBoard(wb.name, wb.tags).then(() => {
      expect(boardRepo.create).to.have.been.calledWithExactly(wb.name, wb.tags)
    })
  })

  describe('addPaths', () => {
    it('appends new paths to board in db', () => {
      let id = 1
      boardRepo.create.returns(new Promise((resolve) => resolve(new Whiteboard([], id, wb.name, wb.tags))))
      boardRepo.appendPaths.returns(new Promise((resolve) => resolve()))

      return editSession.newBoard(wb.name, wb.tags).then(() => {
        return editSession.addPaths(wb.paths)
      }).then(() => {
        expect(boardRepo.appendPaths).to.have.been.calledWithExactly(id, wb.paths)
      })
    })

    it('appends new paths to in memory board', () => {
      boardRepo.create.returns(new Promise((resolve) => resolve(new Whiteboard([], 1, wb.name, wb.tags))))
      boardRepo.appendPaths.returns(new Promise((resolve) => resolve()))

      return editSession.newBoard(wb.name, wb.tags).then(() => {
        return editSession.addPaths(wb.paths)
      }).then(() => {
        expect(editSession.wb.paths).to.be.deep.equal(wb.paths)
      })
    })
  })
})
