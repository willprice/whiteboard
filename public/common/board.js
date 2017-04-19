'use strict'

class Board {
  constructor (id, name = null) {
    this.id = id
    if (name === null) {
      this.name = String(id)
    } else {
      this.name = name
    }
  }
}

export default Board
