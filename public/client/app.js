'use strict'
import Whiteboard from './whiteboard'

document.addEventListener('DOMContentLoaded', (event) => {
  let whiteboardCanvas = document.getElementById('whiteboard')
  const whiteboard = new Whiteboard(whiteboardCanvas)
  whiteboard.setupCallbacks()
})
