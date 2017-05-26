'use strict'

class SlideShow {
  constructor (element) {
    this.element = element
    this.slideIndex = 0
    this.imageElements = this.getImageElements()
    this.captionElement = this.getCaptionElement()

    this.setupCallbacks()
    this.updateCurrentSlide()
  }

  getImageCount () {
    return this.imageElements.length
  }

  getImageElements () {
    return this.element.querySelectorAll('.slide-show__image')
  }

  getCaptionElement () {
    return this.element.querySelector('.slide-show__caption')
  }

  setupCallbacks () {
    this.element.querySelector('.slide-show__button--prev').addEventListener('click', this.showPrevious.bind(this))
    this.element.querySelector('.slide-show__button--next').addEventListener('click', this.showNext.bind(this))
  }

  showNext () {
    if (this.slideIndex < this.imageCount - 1) {
      this.slideIndex++
    } else {
      this.slideIndex = 0
    }
    this.updateCurrentSlide()
  }

  get imageCount () {
    return this.imageElements.length
  }

  showPrevious () {
    if (this.slideIndex > 0) {
      this.slideIndex--
    } else {
      this.slideIndex = this.imageCount - 1
    }
    this.updateCurrentSlide()
  }

  get currentImageElement () {
    return this.imageElements[this.slideIndex]
  }

  updateCurrentSlide () {
    for (let imageElement of this.imageElements) {
      imageElement.style.display = 'none'
    }
    this.currentImageElement.style.display = 'block'

    let captionText = this.currentImageElement.alt
    if (captionText.length > 0) {
      captionText = (this.slideIndex + 1).toString() + '. ' + captionText
    }
    this.captionElement.innerHTML = captionText
  }
}

module.exports = SlideShow
