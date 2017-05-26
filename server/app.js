'use safe'
// Inspired by "https://github.com/christianalfoni/webpack-express-boilerplate"

const expressWs = require('express-ws')
const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bunyan = require('bunyan')
const bodyParser = require('body-parser')
const sm = require('sitemap')
const fs = require('fs')

const WhiteboardWSController = require('./controllers/whiteboard_ws_controller')
const BoardRepository = require('./repositories/board_repository')
const EditSession = require('./edit_session')

const config = require('./config')
const dirs = config.dirs
const staticPages = require('./pages')
const log = bunyan.createLogger({name: 'collaboard'})

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

const masterPageTemplatePath = path.join(dirs.partials, 'page.html.ejs')
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

app.get('/view-src/*', (request, response) => {
  let srcPath = path.join(__dirname, '..', request.path.substring('/view-src/'.length - 1))
  log.info(srcPath)
  if (fs.existsSync(srcPath)) {
    fs.readFile(srcPath, 'utf8', (err, src) => {
      if (err) {
        response.status(500).end()
      } else {
        response.send(masterPageTemplate({
          title: path.basename(srcPath),
          page: '../partials/src_viewer.ejs.html',
          inlineTemplates: [],
          pageLocals: {
            src_path: srcPath,
            src: src,
            lines: request.query.lines || '',
            language: request.query.language || path.extname(srcPath).substring(1)
          },
          scripts: ['/vendor/prism/prism.js'],
          stylesheets: ['/vendor/prism/prism.css']
        }))
      }
    })
  } else {
    response.status(404).end()
  }
})

const sqlite = require('sqlite')
sqlite.open(config.dbPath).then((db) => {
  const boardRepo = new BoardRepository(db)

  app.ws('/api/v1', (ws, request) => {
    log.info('WebSocket connected')
    const controller = new WhiteboardWSController(ws, new EditSession(boardRepo))
    controller.listen()
  })
})

module.exports = app
