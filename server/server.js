'use safe'
// Inspired by "https://github.com/christianalfoni/webpack-express-boilerplate"
/* globals: process */

const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bunyan = require('bunyan')

const inDevelopment = process.env.NODE_ENV === 'dev'
const log = bunyan.createLogger({name: 'collaboard'})
const port = process.env.PORT || 3000
const app = express()

const ROOT_DIR = path.join(__dirname, '..')
const dirs = {
  public: path.join(ROOT_DIR, 'public')
}

if (inDevelopment) {
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

app.get('/', (request, response) => {
  response.type('xhtml')
  ejs.renderFile(path.join(dirs.public, 'index.ejs'), {}, {}, (err, str) => {
    if (err) {
      log.error(err)
    }
    response.send(str)
    response.end()
  })
})

app.listen(port, (error) => {
  if (error) {
    log.error(error)
  }
  log.info(`Listening on port ${port}. Open http://localhost:${port}`)
})
