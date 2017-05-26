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
  let owner = 'jonn'

  beforeEach(() => {
    boardRepo = sinon.createStubInstance(BoardRepository)
    editSession = new EditSession(boardRepo, owner)
    wb = boardMother.boardWithTriangles()
  })

  it('creates new board in db', () => {
    boardRepo.create.resolves(wb)

    return editSession.newBoard(wb.name, wb.tags, owner).then(() => {
      expect(boardRepo.create).to.have.been.calledWithExactly(wb.name, wb.tags, owner)
    })
  })

  describe('addPaths', () => {
    it('appends new paths to board in db', () => {
      let id = 1
      boardRepo.create.resolves(new Whiteboard([], id, wb.name, wb.tags))
      boardRepo.appendPaths.resolves()

      return editSession.newBoard(wb.name, wb.tags).then(() => {
        return editSession.addPaths(wb.paths)
      }).then(() => {
        expect(boardRepo.appendPaths).to.have.been.calledWithExactly(id, wb.paths)
      })
    })

    it('appends new paths to in memory board', () => {
      boardRepo.create.resolves(new Whiteboard([], 1, wb.name, wb.tags))
      boardRepo.appendPaths.resolves()

      return editSession.newBoard(wb.name, wb.tags).then(() => {
        return editSession.addPaths(wb.paths)
      }).then(() => {
        expect(editSession.wb.paths).to.be.deep.equal(wb.paths)
      })
    })

    it('lists all available whiteboards for user', () => {
      let whiteboards = [
        boardMother.boardWithTriangles({ name: 'WB1' }),
        boardMother.boardWithTriangles({ name: 'WB2' })
      ]
      boardRepo.listBoards.resolves(whiteboards)

      return editSession.listBoards().then((whiteboardsFromRepo) => {
        expect(whiteboardsFromRepo).to.equal(whiteboards)
      }).then(() => {
        expect(boardRepo.listBoards).to.have.been.calledWith(owner)
      })
    })
  })
})
