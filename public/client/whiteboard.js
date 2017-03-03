'use strict'
import { localiseClick } from 'client/dom_utils'
import Path from 'common/path'

document.addEventListener('DOMContentLoaded', (event) => {
  let whiteboard = document.getElementById('whiteboard')
  let path = new Path()
  let drawing = false
  let context = whiteboard.getContext('2d')
  whiteboard.addEventListener('mousedown', (e) => {
    drawing = true
    let clickPoint = localiseClick(whiteboard, e.pageX, e.pageY)
    path.add(clickPoint.x, clickPoint.y)
  })
  whiteboard.addEventListener('mousemove', (e) => {
    if (drawing) {
      let clickPoint = localiseClick(whiteboard, e.pageX, e.pageY)
      path.add(clickPoint.x, clickPoint.y)
      path.draw(context)
    }
  })
  whiteboard.addEventListener('mouseup', (e) => {
    drawing = false
    console.log(path)
  })
})
