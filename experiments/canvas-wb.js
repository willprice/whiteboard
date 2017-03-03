'use strict'

window.addEventListener('load', () => {
  let canvas = document.getElementById('canvas')
  let context = canvas.getContext('2d')

  let paint = false

  let clickX = []
  let clickY = []
  let clickDrag = []

  function addClick (x, y, dragging) {
    clickX.push(x)
    clickY.push(y)
    clickDrag.push(dragging)
  }

  function redraw () {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height) // Clears the canvas

    context.strokeStyle = '#df4b26'
    context.lineJoin = 'round'
    context.lineWidth = 5

    for (var i = 0; i < clickX.length; i++) {
      clickX
      context.beginPath()
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1])
      } else {
        context.moveTo(clickX[i] - 1, clickY[i])
      }
      context.lineTo(clickX[i], clickY[i])
      context.closePath()
      context.stroke()
    }
  }

  canvas.addEventListener('mousedown', function (e) {
    var mouseX = e.pageX - this.offsetLeft
    var mouseY = e.pageY - this.offsetTop

    paint = true
    addClick(mouseX, mouseY, true)
    redraw()
  })

  canvas.addEventListener('mouseup', (e) => {
    paint = false
  })

  canvas.addEventListener('mouseout', (e) => {
    paint = false
  })

  canvas.addEventListener('mousemove', (e) => {
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true)
      redraw()
    }
  })
})

