'use safe'
// Inspired by "https://github.com/christianalfoni/webpack-express-boilerplate"
/* globals: process */

const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bunyan = require('bunyan')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const sm = require('sitemap')
const fs = require('fs')

const DB_SCHEMA = require('./schema')

const log = bunyan.createLogger({name: 'collaboard'})

const host = '0.0.0.0'
const inDevelopment = process.env.NODE_ENV === 'dev'
const port = process.env.PORT || 3000
const rootDir = path.join(__dirname, '..')
const dirs = {
  public: path.join(rootDir, 'public'),
  templates: path.join(rootDir, 'public', 'templates')
}

const db = new sqlite3.Database('collaboard.db')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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

// API methods are defined as PUT or POST as defined in
// this SO answer: https://stackoverflow.com/questions/630453/put-vs-post-in-rest
//
// > Better is to choose between PUT and POST based on idempotence of the action.
// >
// > PUT implies putting a resource - completely replacing whatever is available at the given URL with a different thing.
// > By definition, a PUT is idempotent. Do it as many times as you like, and the result is the same. x=5 is
// > idempotent. You can PUT a resource whether it previously exists, or not (eg, to Create, or to Update)!
// >
// > POST updates a resource, adds a subsidiary resource, or causes a change. A POST is not idempotent, in the way that
// > POST updates a resource, adds a subsidiary resource, or causes a change. A POST is not idempotent, in the way that > POST updates a resource, adds a subsidiary resource, or causes a change. A POST is not idempotent, in the way that
// > x++ is not idempotent.

const masterPageTemplatePath = path.join(dirs.templates, 'page.html.ejs')
const masterPageTemplateString = fs.readFileSync(masterPageTemplatePath, 'utf8')
const masterPageTemplate = ejs.compile(masterPageTemplateString, { filename: masterPageTemplatePath })

const sitemap = sm.createSitemap({
  hostname: `http://${host}:${port}`
})

const staticPages = require('./pages')
staticPages(app, sitemap, masterPageTemplate)

app.get('/sitemap.xml', (request, response) => {
  sitemap.toXML((error, xml) => {
    if (error) {
      return response.status(500).end()
    }
    response.header('Content-Type', 'application/xml')
    response.send(xml)
  })
})

app.get('/api/board/:boardId', (request, response) => {
  response.type('html')
  ejs.renderFile(path.join(dirs.public, 'index.ejs'), {}, {}, (err, str) => {
    if (err) {
      log.error(err)
      response.status(404)
    } else {
      response.send(str)
    }
    response.end()
  })
})

app.get('/api/board/', (request, response) => {
  db.run(`INSERT INTO ${DB_SCHEMA.boards_table} DEFAULT VALUES`, function (error) {
    if (error) {
      log.error('Error creating new board')
      log.error(error)
      response.status(500)
    } else {
      log.info(this.lastID)
      response.send('' + this.lastID)
    }
    response.end()
  })
})

app.listen(port, host, (error) => {
  if (error) {
    log.error(error)
  }
  log.info(`Listening on port ${port}. Open http://${host}:${port}`)
})
