'use strict'

class WhiteboardToolsUI {
  constructor (element, whiteboard, whiteboardApi) {
    this.whiteboard = whiteboard
    this.whiteboardApi = whiteboardApi
    this.element = element
    this.saveDialogElement = document.querySelector('.drop-down__container')

    this.setupSidebarSaveButton()
    this.setupSaveDialog()
  }

  setupSaveDialog () {
    let cancelButton = this.saveDialogElement.querySelector('.save-form__button--cancel')
    cancelButton.addEventListener('click', this.hideSaveDialog.bind(this))

    let saveButton = this.saveDialogElement.querySelector('.save-form__button--save')
    saveButton.addEventListener('click', () => {
      this.whiteboardApi.updateMetadata(this.whiteboard, this.getName(), this.getTags())
      this.hideSaveDialog()
    })
  }

  setupSidebarSaveButton () {
    let saveButton = this.element.querySelector('.whiteboard-tools__save')
    saveButton.addEventListener('click', this.showSaveDialog.bind(this))
  }

  hideSaveDialog () {
    this.saveDialogElement.style.visibility = 'hidden'
  }

  showSaveDialog () {
    this.saveDialogElement.style.visibility = 'visible'
  }

  getName () {
    return this.saveDialogElement.querySelector('.save-form__field[name="name"]').value
  }

  getTags () {
    return this.saveDialogElement.querySelector('.save-form__field[name="tags"]')
      .value
      .split(',')
      .map((tag) => tag.trim())
  }
}

export default WhiteboardToolsUI
