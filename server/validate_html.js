'use strict'
/* global process */

const Mocha = require('mocha')
const chai = require('chai')
const request = require('supertest')
const vnu = require('validator-nu')
const vnuJarPath = require('vnu-jar')

const Dom = require('xmldom').DOMParser
const xpath = require('xpath')
const URL = require('url').URL

const assert = chai.assert

let server = require('./server')
const agent = request.agent(server)

function getSitemap () {
  return agent
    .get('/sitemap.xml')
    .then(response => {
      return new Dom().parseFromString(response.text)
    })
}

function collectUrls (sitemapXml) {
  let select = xpath.useNamespaces({
    sitemap: 'http://www.sitemaps.org/schemas/sitemap/0.9'
  })

  return select('/sitemap:urlset/sitemap:url/sitemap:loc/text()', sitemapXml)
    .map((element) => element.data)
}

function getPage (url) {
  let path = new URL(url).pathname
  return agent
    .get(path)
    .then(response => {
      return response.text
    })
}

function setupPageValidationTests (validator, urls) {
  const mocha = new Mocha()
  const suite = Mocha.Suite.create(mocha.suite, 'HTML5 page validation')

  for (let url of urls) {
    setupPageValidationTest(validator, suite, url)
  }

  suite.afterAll('Close servers', () => {
    let promises = [
      new Promise((resolve) => {
        server.close(resolve)
      }),
      validator.close()
    ]
    return Promise.all(promises)
  })

  mocha.run((failures) => {
    process.on('exit', () => {
      process.exit(failures)
    })
  })
}

function setupPageValidationTest (validator, suite, url) {
  suite.addTest(new Mocha.Test(url, () => {
    return getPage(url)
      .then(validatePage.bind(null, validator))
  }))
}

function validatePage (validator, htmlBody) {
  return validator.validate(htmlBody).then((validationResults) => {
    for (let result of validationResults) {
      assert(result.type !== 'error', result.message)
    }
  })
}

let validator = new vnu.Vnu(undefined, undefined, vnuJarPath)
validator
  .open()
  .then((pid) => {
    console.log(`validator server@pid:${pid}`)
  })
  .then(getSitemap)
  .then(collectUrls)
  .then(setupPageValidationTests.bind(null, validator))
  .catch((error) => {
    console.log('Failed to build test suite due to error')
    console.log(error)
  })

