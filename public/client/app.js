'use strict'
import WhiteboardUI from './ui/whiteboard_ui'
import Whiteboard from './whiteboard'

document.addEventListener('DOMContentLoaded', () => {
  let whiteboardCanvasElement = document.querySelector('.whiteboard-app')
  const whiteboard = new Whiteboard()
  // eslint-disable-next-line
  const whiteboardUI = new WhiteboardUI(whiteboardCanvasElement, whiteboard)
})

// function signOut () {
//   let auth2 = gapi.auth2.getAuthInstance()
//   auth2.signOut().then(() => {
//     console.log('User signed out.')
//   })
// }
