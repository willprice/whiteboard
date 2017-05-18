'use strict'
/* globals process */

const path = require('path')

const rootDir = path.join(__dirname, '..')
const dirs = {
  public: path.join(rootDir, 'public'),
  templates: path.join(rootDir, 'public', 'templates')
}

module.exports = {
  dirs: dirs,
  host: '0.0.0.0',
  port: process.env.PORT || 3000,
  protocol: 'http',
  inDevelopment: process.env.NODE_ENV === 'dev'
}
