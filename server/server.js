'use strict'
/* globals: process */

const bunyan = require('bunyan')
const express = require('express')

const app = require('./app')
const config = require('./config')
const dirs = config.dirs

const log = bunyan.createLogger({name: 'collaboard'})

if (config.inDevelopment) {
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config.js')
  const webpackCompiler = webpack(webpackConfig)

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  }))

  app.use(express.static(dirs.public))

  const livereload = require('livereload')
  let lrserver = livereload.createServer()
  lrserver.watch(dirs.public)
} else {
  app.use(express.static(dirs.public))
}

const server = app.listen(config.port, config.host, (error) => {
  if (error) {
    log.error(error)
  }
  log.info(`Listening on port ${config.port}. Open http://${config.host}:${config.port}`)
})

module.exports = server
