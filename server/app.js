'use safe'
// Inspired by "https://github.com/christianalfoni/webpack-express-boilerplate"

const expressWs = require('express-ws')
const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bunyan = require('bunyan')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const sm = require('sitemap')
const fs = require('fs')

const config = require('./config')
const dirs = config.dirs
const DB_SCHEMA = require('./schema')
const staticPages = require('./pages')

const log = bunyan.createLogger({name: 'collaboard'})

const db = new sqlite3.Database('collaboard.db')
const app = express()
expressWs(app)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
  hostname: `${config.protocol}://${config.host}:${config.port}`
})
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

app.ws('/api/v1', (ws, request) => {
  log.info('Websocket connected')
  ws.on('message', (msg) => {
    log.info('Received ws message')
    log.info(msg)
  })
})

module.exports = app
