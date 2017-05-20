'use strict'

class AdminToolsUI {
  constructor (element) {
    this.element = element
    this.saveDialogElement = document.querySelector('.drop-down__container')

    this.setupSidebarSaveButton()
    this.setupSaveDialog()
  }

  setupSaveDialog () {
    function hideSaveDialog () {
      this.saveDialogElement.style.visibility = 'hidden'
    }

    let cancelButton = this.saveDialogElement.querySelector('.save-form__button--cancel')
    cancelButton.addEventListener('click', hideSaveDialog.bind(this))
  }

  setupSidebarSaveButton () {
    function showSaveDialog () {
      this.saveDialogElement.style.visibility = 'visible'
    }

    let saveButton = this.element.querySelector('.whiteboard-tools__save')
    saveButton.addEventListener('click', showSaveDialog.bind(this))
  }
}

export default AdminToolsUI
