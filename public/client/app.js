'use strict'
/* globals location */

const WhiteboardUI = require('./ui/whiteboard_ui')
const WhiteboardToolsUI = require('./ui/whiteboard_tools')
const WebSocketConnection = require('./websocket_connection')
const WhiteboardAPI = require('./whiteboard_api')
const WhiteboardSession = require('./whiteboard_session')
const serialisationTools = require('../common/serialisation')

function wsUrl () {
  return `ws://${location.host}/api/v1`
}

document.addEventListener('DOMContentLoaded', () => {
  const wsConnection = new WebSocketConnection(wsUrl())
  wsConnection.setup().then(() => {
    const whiteboardApi = new WhiteboardAPI(wsConnection, serialisationTools.serialise, serialisationTools.deserialise)
    const whiteboardSession = new WhiteboardSession(whiteboardApi)

    // eslint-disable-next-line
    const whiteboardUI = new WhiteboardUI(document.querySelector('.whiteboard-app'), whiteboardSession.whiteboard)
    // eslint-disable-next-line
    const whiteboardTools = new WhiteboardToolsUI(document.querySelector('.whiteboard-tools'), whiteboardSession)
  })
})

// function signOut () {
//   let auth2 = gapi.auth2.getAuthInstance()
//   auth2.signOut().then(() => {
//     console.log('User signed out.')
//   })
// }
