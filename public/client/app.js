'use strict'
/* globals location */

import WhiteboardUI from './ui/whiteboard_ui'
import WhiteboardToolsUI from './ui/whiteboard_tools'
import Whiteboard from './whiteboard'
import WebSocketConnection from './websocket_connection'
import WhiteboardAPI from './whiteboard_api'
import serialise from './serilialise'

function wsUrl () {
  return `ws://${location.host}/api/v1`
}

document.addEventListener('DOMContentLoaded', () => {
  const wsConnection = new WebSocketConnection(wsUrl())
  const whiteboard = new Whiteboard()
  const whiteboardApi = new WhiteboardAPI(wsConnection, serialise)
  // eslint-disable-next-line
  const whiteboardUI = new WhiteboardUI(document.querySelector('.whiteboard-app'), whiteboard)
  // eslint-disable-next-line
  const whiteboardTools = new WhiteboardToolsUI(document.querySelector('.whiteboard-tools'), whiteboard, whiteboardApi)
})

// function signOut () {
//   let auth2 = gapi.auth2.getAuthInstance()
//   auth2.signOut().then(() => {
//     console.log('User signed out.')
//   })
// }
