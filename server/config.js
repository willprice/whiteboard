'use strict'
/* globals process */

const path = require('path')

const rootDir = path.join(__dirname, '..')
const dirs = {
  public: path.join(rootDir, 'public'),
  partials: path.join(rootDir, 'public', 'partials')
}

module.exports = {
  dirs: dirs,
  dbPath: 'collaboard.db',
  host: '0.0.0.0',
  port: process.env.PORT || 3000,
  protocol: 'http',
  inDevelopment: process.env.NODE_ENV === 'dev'
}
