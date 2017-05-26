'use strict'
/* global describe, it, afterEach, beforeEach */

const expect = require('chai').expect

const sqlite = require('sqlite')
const boardMother = require('../../public/common/spec_helpers/object_mothers/board_mother')
const BoardRepository = require('./board_repository')
const TestDb = require('./spec_helpers/test_db')

describe('BoardRepository', () => {
  let testDb = null
  let repository = null

  beforeEach(() => {
    return sqlite.open(':memory:', { verbose: true }).then((db) => {
      testDb = new TestDb(db)
      repository = new BoardRepository(db)
    }).then(() => testDb.setupDb())
  })

  afterEach(() => {
    return testDb.db.close()
  })

  describe('create', () => {
    let wb = boardMother.boardWithTriangles()
    let boardName = 'testBoardName'
    let tags = ['TestTag1', 'TestTag2']
    let owner = 'TestOwner'
    let id = 1

    it('returns whiteboard with newly created id', () => {
      console.log('startgin test')
      return repository.create(boardName, tags, owner)
        .then((whiteboard) => {
          expect(whiteboard.id).to.equal(id)
        })
    })

    it('returns whiteboard with correct name', () => {
      return repository.create(boardName, tags, owner)
        .then((whiteboard) => {
          expect(whiteboard.name).to.equal(boardName)
        })
    })

    it('persists new board', () => {
      let rowCount = 0
      const allBoardsQuery = 'SELECT * FROM boards;'
      return testDb.db.all(allBoardsQuery).then((rows) => {
        rowCount = rows.length
      }).then(() => repository.create(boardName, tags, owner))
        .then(() => testDb.db.all(allBoardsQuery)).then((rows) => {
          expect(rows.length).to.be.equal(rowCount + 1)
        })
    })

    it('persists tags', () => {
      return repository.create(boardName, tags, owner).then(() =>
        testDb.db.all(`SELECT * FROM tags WHERE board_id = ${id}`)
      ).then((rows) => {
        expect(rows.map((row) => row.tag)).to.deep.equal(tags)
      })
    })

    it('returns whiteboard with tags', () => {
      return repository.create(boardName, tags, owner)
        .then((whiteboard) => {
          expect(whiteboard.tags).to.equal(tags)
        })
    })

    it('appends new paths', () => {
      return repository.create(wb.name, wb.tags, owner).then((newWb) => {
        return repository.appendPaths(newWb.id, wb.paths)
      }).then(() => {
        return testDb.db.all('SELECT * FROM paths;')
      }).then((rows) => {
        expect(rows.length).to.be.equal(wb.paths.length)
      })
    })
  })
})
