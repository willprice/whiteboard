'use strict'
/*
 Pages with static content are still created dynamically by use of partials (as in partial pages), so we can reuse
  the headers and other repetitive aspects (e.g. stylesheet and script includes)
 */
const fs = require('fs')
const path = require('path')

const STATIC_PAGES_DEFINITIONS = {
  '/': {
    title: 'Welcome to CollaBoard',
    page: '../partials/landing.html.ejs'
  },

  '/whiteboard/*': {
    title: 'CollaBoard App',
    page: '../partials/components/whiteboard.html.ejs',
    options: {
      scripts: [
        '/build/whiteboard.js'
      ],
      inlineTemplates: {
        board_gallery: '../public/partials/components/board-gallery.html.ejs',
        board_icon: '../public/partials/components/board-icon.html.ejs'
      },
      stylesheets: [
        '/styles/components/admin-tools.css',
        '/styles/components/board-gallery.css',
        '/styles/components/board-icon.css',
        '/styles/components/brush-icon.css',
        '/styles/components/brush-sizer.css',
        '/styles/components/brush-tools.css',
        '/styles/components/color-palette.css',
        '/styles/components/drop-down.css',
        '/styles/components/save-form.css',
        '/styles/components/user-icon.css',
        '/styles/components/whiteboard-app.css',
        '/styles/components/whiteboard-canvas.css',
        '/styles/components/whiteboard-tools.css'
      ]
    }
  },

  '/about': {
    title: 'About CollaBoard',
    page: '../partials/about.html.ejs'
  },

  '/report': {
    title: 'CollaBoard WebTech report',
    page: '../partials/report.html.ejs',
    options: {
      scripts: [
        '/build/report.js'
      ],
      stylesheets: [
        '/styles/components/slide-show.css'
      ]
    }
  },

  '/tutorial': {
    title: 'CollaBoard Tutorial',
    page: '../partials/tutorial.html.ejs'
  }
}

function genStaticPageHandler (pageDefinition, masterPageTemplate) {
  return function pageHandler (request, response) {
    let renderedPage = masterPageTemplate(pageDefinition)
    response.send(renderedPage)
  }
}

function staticPages (app, sitemap, masterPageTemplate) {
  for (let route in STATIC_PAGES_DEFINITIONS) {
    sitemap.add({url: route})
    let routeDefinition = STATIC_PAGES_DEFINITIONS[route]

    let {
      inlineTemplates = [],
      pageLocals = {},
      scripts = [],
      stylesheets = []
    } = STATIC_PAGES_DEFINITIONS[route].options || {}

    for (let templateName in inlineTemplates) {
      let templatePath = path.join(__dirname, inlineTemplates[templateName])
      inlineTemplates[templateName] = fs.readFileSync(templatePath, 'utf8')
    }

    let pageDefinition = {
      title: routeDefinition.title,
      page: routeDefinition.page,
      inlineTemplates: inlineTemplates,
      pageLocals: pageLocals,
      scripts: scripts,
      stylesheets: stylesheets
    }

    let pageHandler = genStaticPageHandler(pageDefinition, masterPageTemplate)
    app.get(route, pageHandler)
  }
}

module.exports = staticPages
