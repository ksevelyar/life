export default class Universe {
  constructor(size = 100) {
    this.size = size
    this._axis = [...Array(size).keys()]

    this.life = this._randomLife()  
  }

  iterate() {
    this._populate()

    this.life = this._possibleLife.reduce((nextGeneration, column, x) => {
      nextGeneration[x] = []
      column.forEach((y) => {
        if (this._isLifeAcceptable(x, y)) { nextGeneration[x].push(y) }
      })

      return nextGeneration
    }, [])
  }

  _randomLife() {
    return this._axis.map(() => {
      return this._axis.reduce((column, y) => { 
        if (y % 2 === 0 && Math.random() <= 0.5) column.push(y)
        return column 
      }, [])
    })
  }

  _neighbours(x,y) {
    return [
      [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
      [x - 1, y    ],             [x + 1, y    ],
      [x - 1, y - 1], [x, y - 1], [x + 1, y - 1]
    ]
  }

  _aliveNeighbours(x, y) {
    const neighbours = this._neighbours(x, y)
    let neighboursCount = 0

    for (const neighbour of neighbours) {
      if (neighboursCount > 3) { break } 
      
      const [neighbourX, neighbourY] = neighbour
      const xAxis = this.life[neighbourX]

      if (xAxis && xAxis.includes(neighbourY)) { neighboursCount++ }
    }

    return neighboursCount
  }

  _isLifeAcceptable(x, y) {
    const neighboursCount = this._aliveNeighbours(x, y) 

    const isNew = neighboursCount === 3
    const isSurvived = neighboursCount === 2 && this.life[x] && this.life[x].includes(y)

    return isNew || isSurvived
  }

  _expandPossibleLife(x, y) {
    const col = this._possibleLife[x]
    if (col) { col.add(y) }

    this._neighbours(x, y).forEach((point) => {
      const [pointX, pointY] = point
      const columnSet = this._possibleLife[pointX]

      if (columnSet && pointY >= 0 && pointY < this.size) { columnSet.add(pointY) }
    })
  }

  _populate() {
    this._possibleLife = new Array(this.size).fill(new Set)

    this.life.forEach((column, x) => {
      column.forEach((y) => this._expandPossibleLife(x, y))
    })
  }
}
