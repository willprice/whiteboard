'use strict'
import WhiteboardUI from './ui/whiteboard_ui'
import AdminToolsUI from './ui/whiteboard-tools'
import Whiteboard from './whiteboard'

document.addEventListener('DOMContentLoaded', () => {
  const whiteboard = new Whiteboard()
  // eslint-disable-next-line
  const whiteboardUI = new WhiteboardUI(document.querySelector('.whiteboard-app'), whiteboard)
  // eslint-disable-next-line
  const whiteboardTools = new AdminToolsUI(document.querySelector('.whiteboard-tools'))
})

// function signOut () {
//   let auth2 = gapi.auth2.getAuthInstance()
//   auth2.signOut().then(() => {
//     console.log('User signed out.')
//   })
// }
