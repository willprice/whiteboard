'use strict'
const ejs = require('ejs')

class WhiteboardToolsUI {
  constructor (element, whiteboardSession) {
    this.whiteboardSession = whiteboardSession
    this.element = element
    this.saveDialogElement = document.querySelector('.drop-down__container')

    this.setupCallbacks()
    this.setupGallery()
  }

  setupGallery () {
    this.whiteboardSession.listBoards().then((boards) => {
      let template = this.getGalleryTemplate()
      let hydratedGalleryTemplate = ejs.render(template, { boards: boards })
      this.getGalleryElement().innerHTML = hydratedGalleryTemplate
      this.getGalleryElement().querySelector('.board-gallery__headerbutton--close')
        .addEventListener('click', this.hideGallery.bind(this))
    }).then(this.setupGalleryEntries.bind(this))
  }

  setupGalleryEntries () {
    this.getGalleryElement().querySelectorAll('.board-icon').forEach((boardIconElement) => {
      let id = parseInt(boardIconElement.querySelector('.board-icon__field--id').innerText)
      boardIconElement.addEventListener('click', () => {
        console.log('Fetching ' + id)
        this.whiteboardSession.loadBoard(id)
        this.hideGallery()
      })
    })
  }

  setupCallbacks () {
    this.setupSaveDialogCallbacks()
    this.getSidebarSaveButton().addEventListener('click', this.showSaveDialog.bind(this))
  }

  setupSaveDialogCallbacks () {
    this.getNameInputField().addEventListener('input', this.updateName.bind(this))
    this.getTagsInputField().addEventListener('input', this.updateTags.bind(this))

    this.getSaveDialogCancelButton().addEventListener('click', this.hideSaveDialog.bind(this))
    this.getSaveDialogSaveButton().addEventListener('click', this.onSave.bind(this))
    this.getSidebarGalleryButton().addEventListener('click', this.showGallery.bind(this))
  }

  getNameInputField () {
    return this.saveDialogElement
      .querySelector('.save-form__field[name="name"]')
  }

  getTagsInputField () {
    return this.saveDialogElement
      .querySelector('.save-form__field[name="tags"]')
  }

  getSaveDialogCancelButton () {
    return this.saveDialogElement.querySelector('.save-form__button--cancel')
  }

  getSaveDialogSaveButton () {
    return this.saveDialogElement.querySelector('.save-form__button--save')
  }

  getSidebarSaveButton () {
    return this.element.querySelector('.whiteboard-tools__save')
  }

  getSidebarGalleryButton () {
    return this.element.querySelector('.whiteboard-tools__gallery')
  }

  updateName (event) {
    this.whiteboardSession.whiteboard.name = event.target.value
  }

  onSave () {
    this.whiteboardSession.save()
    this.hideSaveDialog()
    this.getSidebarSaveButton().innerText = 'Update'
    this.getSaveDialogSaveButton().innerText = 'Update'
  }

  updateTags (event) {
    let value = event.target.value
    let tags = value.split(',').map((tag) => tag.trim())
    this.whiteboardSession.whiteboard.tags = tags
  }

  hideSaveDialog () {
    this.saveDialogElement.style.visibility = 'hidden'
  }

  showSaveDialog () {
    this.saveDialogElement.style.visibility = 'visible'
  }

  getGalleryTemplate () {
    let templateText = document.getElementById('board-gallery').innerText
    return templateText
  }

  getGalleryElement () {
    return document.querySelector('.board-gallery')
  }

  getGalleryContainer () {
    return document.querySelector('.board-gallery__backdrop')
  }

  showGallery () {
    this.getGalleryContainer().style.visibility = 'visible'
  }

  hideGallery () {
    this.getGalleryContainer().style.visibility = 'hidden'
  }
}

module.exports = WhiteboardToolsUI
