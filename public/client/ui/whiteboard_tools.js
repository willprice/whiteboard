'use strict'

class WhiteboardToolsUI {
  constructor (element, whiteboardSession) {
    this.whiteboardSession = whiteboardSession
    this.element = element
    this.saveDialogElement = document.querySelector('.drop-down__container')

    this.setupCallbacks()
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

  showGallery () {
  }
}

module.exports = WhiteboardToolsUI
