'use safe'
// Inspired by "https://github.com/christianalfoni/webpack-express-boilerplate"

const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bunyan = require('bunyan')

const inDevelopment = process.env.NODE_ENV === 'dev'
const log = bunyan.createLogger({name: 'collaboard'})
const port = process.env.PORT || 3000
const app = express()

if (inDevelopment) {
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.config.js')
  const webpackCompiler = webpack(webpackConfig)

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  }))

  app.use(express.static('public'))

  const livereload = require('livereload')
  let lrserver = livereload.createServer()
  lrserver.watch(path.join(__dirname, 'public'))
}

app.get('/', (request, response) => {
  response.type('xhtml')
  ejs.renderFile('public/index.ejs', {}, {}, (err, str) => {
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
