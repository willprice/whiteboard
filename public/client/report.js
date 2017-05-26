'use strict'

const SlideShow = require('./ui/slide-show')

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line
  const pngSlideshow = new SlideShow(document.getElementById('png-slide-show'))
  // eslint-disable-next-line
  const svgSlideshow = new SlideShow(document.getElementById('svg-slide-show'))
})
