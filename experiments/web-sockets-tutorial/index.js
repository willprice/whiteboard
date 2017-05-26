const WebSocket = require('ws')
const express = require('express')
const http = require('http')
const url = require('url')

const app = express()
app.use((req, res) => {
  res.send('Hello World!')
})

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('socket', (ws) => {
  const location = url.parse(ws.upgradeReq.url, true)
  ws.on('message', (message) => {
    console.log('got message: %s', message)
    ws.send('I got your message!')
  })
})

server.listen(8080, function listening () {
  console.log('Listening on %d', server.address().port)
})
