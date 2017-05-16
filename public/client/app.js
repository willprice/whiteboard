'use strict'
import Whiteboard from './whiteboard'

document.addEventListener('DOMContentLoaded', (event) => {
  let whiteboardCanvas = document.getElementsByClassName('whiteboard-canvas--canvas')
  console.log(whiteboardCanvas)
  const whiteboard = new Whiteboard(whiteboardCanvas.item(0))
  whiteboard.setupCallbacks()
})

// function signOut () {
//   let auth2 = gapi.auth2.getAuthInstance()
//   auth2.signOut().then(() => {
//     console.log('User signed out.')
//   })
// }
