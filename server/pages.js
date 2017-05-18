'use strict'
/*
 Pages with static content are still created dynamically by use of partials (as in partial pages), so we can reuse
  the headers and other repetitive aspects (e.g. stylesheet and script includes)
 */

const STATIC_PAGES_DEFINITIONS = {
  '/': {
    title: 'Welcome to CollaBoard',
    page: 'landing.html.ejs',
    pageLocals: {},
    scripts: [],
    stylesheets: []
  },

  '/whiteboard': {
    title: 'CollaBoard App',
    page: 'components/whiteboard.html.ejs',
    pageLocals: {},
    scripts: [
      '/build/whiteboard.js'
    ],
    stylesheets: [
      '/styles/components/admin-tools.css',
      '/styles/components/brush-icon.css',
      '/styles/components/brush-sizer.css',
      '/styles/components/brush-tools.css',
      '/styles/components/color-palette.css',
      '/styles/components/user-icon.css',
      '/styles/components/whiteboard-app.css',
      '/styles/components/whiteboard-canvas.css'
    ]
  },

  '/about': {
    title: 'About CollaBoard',
    page: 'about.html.ejs',
    pageLocals: {},
    scripts: [],
    stylesheets: []
  },

  '/report': {
    title: 'CollaBoard WebTech report',
    page: 'report.html.ejs',
    pageLocals: {},
    scripts: [],
    stylesheets: []
  },

  '/tutorial': {
    title: 'CollaBoard Tutorial',
    page: 'tutorial.html.ejs',
    pageLocals: {},
    scripts: [],
    stylesheets: []
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
    let pageDefinition = STATIC_PAGES_DEFINITIONS[route]
    let pageHandler = genStaticPageHandler(pageDefinition, masterPageTemplate)
    app.get(route, pageHandler)
  }
}

module.exports = staticPages
