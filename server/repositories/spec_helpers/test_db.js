'use strict'
const fs = require('fs')
const path = require('path')

const sqlFilesRootPath = path.join(__dirname, '..', '..')

class TestDb {
  constructor (db) {
    this.db = db
    this.setupDbSql = fs.readFileSync(path.join(sqlFilesRootPath, 'setup_db.sql'), 'utf8')
    this.dropDbSql = fs.readFileSync(path.join(sqlFilesRootPath, 'clear_db.sql'), 'utf8')
  }

  setupDb () {
    return this.db.exec(this.setupDbSql)
  }

  dropDb () {
    return this.db.exec(this.dropDbSql)
  }
}

module.exports = TestDb
