'use strict'
/* global describe, it, afterEach, beforeEach */

const chai = require('chai')
const expect = chai.expect

const sqlite = require('sqlite')
const boardMother = require('../../public/common/spec_helpers/object_mothers/board_mother')
const BoardRepository = require('./board_repository')
const TestDb = require('./spec_helpers/test_db')
const Whiteboard = require('../../public/common/whiteboard')

describe('BoardRepository', () => {
  let testDb = null
  let repository = null

  let wb = boardMother.boardWithTriangles()
  let boardName = 'testBoardName'
  let tags = ['TestTag1', 'TestTag2']
  let owner = 'TestOwner'
  let id = 1

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
    it('returns whiteboard with newly created id', () => {
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
  })

  describe('append paths', () => {
    beforeEach(() => {
      return repository.create(wb.name, wb.tags, owner).then((newWb) => {
        return repository.appendPaths(newWb.id, wb.paths)
      })
    })

    function selectAllPaths () {
      return testDb.db.all('SELECT * from paths')
    }

    it('appends the correct number of paths', () => {
      return selectAllPaths().then((rows) => {
        expect(rows.length).to.be.equal(wb.paths.length)
      })
    })

    it('persists color of paths', () => {
      return selectAllPaths().then((rows) => {
        for (let row of rows) {
          expect(row.color).to.equal(wb.paths[row.id - 1].color)
        }
      })
    })

    it('persists width of paths', () => {
      return selectAllPaths().then((rows) => {
        for (let row of rows) {
          expect(row.width).to.equal(wb.paths[row.id - 1].width)
        }
      })
    })

    it('persists board id of paths', () => {
      return selectAllPaths().then((rows) => {
        for (let row of rows) {
          expect(row.board_id).to.equal(1)
        }
      })
    })

    describe('points', () => {
      function selectAllPoints (pathId) {
        if (pathId === undefined) {
          return testDb.db.all(`SELECT * FROM points;`)
        } else {
          return testDb.db.all(`SELECT * FROM points WHERE path_id = ${pathId};`)
        }
      }

      it('appends all points for all paths', () => {
        return selectAllPoints().then((rows) => {
          let pointCount = wb.paths
            .map((path) => path.length)
            .reduce((acc, val) => acc + val, 0)
          expect(rows.length).to.equal(pointCount)
        })
      })

      it('associates the points with the correct path', () => {
        let promises = []
        for (let i = 0; i < wb.paths.length; i++) {
          promises.push(selectAllPoints(i + 1).then((rows) => {
            expect(rows.length).to.equal(wb.paths[i].length)
          }))
        }
        return Promise.all(promises)
      })
    })
  })

  describe('list boards', () => {
    let boards = new Map()
    boards.set('john', [
      boardMother.boardWithTriangles({ name: 'johnWb', tags: ['T1', 'T2', 'T3'] }),
      boardMother.boardWithTriangles({ name: 'johnWb2' })])
    boards.set('terry', [boardMother.boardWithTriangles({ name: 'terryWb' })])

    beforeEach(() => {
      return insertWhiteboards(boards)
    })

    it('returns whiteboards', () => {
      return repository.listBoards('john').then((johnsBoards) => {
        for (let wb of johnsBoards) {
          expect(wb).to.be.an.instanceOf(Whiteboard)
        }
      })
    })

    it('returns whiteboards with correct names', () => {
      return repository.listBoards('john').then((johnsBoards) => {
        expect(johnsBoards.length).to.equal(boards.get('john').length)

        const expectBoardNames = new Set(boards.get('john').map((board) => board.name))
        const actualBoardNames = new Set(johnsBoards.map((board) => board.name))
        expect(actualBoardNames).to.deep.equal(expectBoardNames)
      })
    })

    it('returns whiteboards with correct tags', () => {
      return repository.listBoards('john').then((johnsBoards) => {
        expect(johnsBoards.length).to.equal(boards.get('john').length)
        const expectedTags = new Set(boards.get('john').map((board) => new Set(board.tags)))
        const actualTags = new Set(johnsBoards.map((board) => new Set(board.tags)))
        expect(actualTags).to.eql(expectedTags)
      })
    })
  })

  describe('fetchBoard', () => {
    it('returns whiteboard with correct id', () => {

    })
  })

  function insertWhiteboards (wbs) {
    let insertionPromises = []
    wbs.forEach(function (boards, owner) {
      insertionPromises.push(insertWhiteboardsForOwner(boards, owner))
    })
    return Promise.all(insertionPromises)
  }

  function insertWhiteboardsForOwner (boards, owner) {
    let insertionPromises = []
    for (let wb of boards) {
      insertionPromises.push(insertWhiteboard(wb, owner))
    }
    return Promise.all(insertionPromises)
  }

  function insertWhiteboard (wb, owner) {
    return repository.create(wb.name, wb.tags, owner).then((newWb) => {
      return repository.appendPaths(newWb.id, wb.paths)
    })
  }
})
