'use strict'
/* global gapi */
import Whiteboard from './whiteboard'

document.addEventListener('DOMContentLoaded', (event) => {
  let whiteboardCanvas = document.getElementById('whiteboard')
  const whiteboard = new Whiteboard(whiteboardCanvas)
  whiteboard.setupCallbacks()

  document.getElementById('sign-out').addEventListener('click', signOut)
})

function signOut () {
  let auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(() => {
    console.log('User signed out.')
  })
}
