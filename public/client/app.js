'use strict'
import Whiteboard from './whiteboard'

document.addEventListener('DOMContentLoaded', (event) => {
  let whiteboardCanvas = document.getElementById('whiteboard')
  // i
  const whiteboard = new Whiteboard(whiteboardCanvas)
  whiteboard.setupCallbacks()
})
