export default class Universe {
  constructor(size = 100) {
    this.size = size
    this.axis = [...Array(size).keys()]

    this.life = this.randomLife()  
  }

  randomLife() {
    return this.axis.map((x) => {
      return this.axis.reduce((column, y) => { 
        if (y % 2 === 0 && Math.random() <= 0.5) column.push(y)
        return column 
      }, [])
    })
  }

  neighbours(x,y) {
    return [
      [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
      [x - 1, y    ],             [x + 1, y    ],
      [x - 1, y - 1], [x, y - 1], [x + 1, y - 1]
    ]
  }

  aliveNeighbours(x, y) {
    const neighbours = this.neighbours(x, y)
    let neighboursCount = 0

    for (let i = 0; i < 8; i++) {
      if (neighboursCount > 3) { break } 

      let neighbourX = neighbours[i][0]
      let neighbourY = neighbours[i][1]

      if(!this.life[neighbourX]) { return }
      if (this.life[neighbourX].includes(neighbourY)) { neighboursCount++ }
    }

    return neighboursCount;
  }

  isLifeAcceptable(x, y) {
    const neighboursCount = this.aliveNeighbours(x, y) 

    const isNew = neighboursCount === 3
    const isSurvived = !isNew && neighboursCount === 2 && this.life[x].includes(y)

    return isNew || isSurvived
  }

  expandPossibleLife(x, y) {
    const col = this.possibleLife[x]
    if (col) { col.add(y) }

    this.neighbours(x, y).forEach((point) => {
      const pointX = point[0]
      const pointY = point[1]
      const columnSet = this.possibleLife[pointX]

      if (columnSet && pointY >= 0 && pointY <= this.size) { columnSet.add(pointY) }
    })
  }

  populate() {
    this.possibleLife = new Array(this.size).fill(new Set);

    this.life.forEach((column, x) => {
      column.forEach((y) => this.expandPossibleLife(x, y))
    })
  }

  iterate() {
    this.populate()

    this.life = this.possibleLife.reduce((nextGeneration, column, x) => {
      nextGeneration[x] = []
      column.forEach((y) => {
        if (this.isLifeAcceptable(x, y)) { nextGeneration[x].push(y) }
      })

      return nextGeneration
    }, [])
  }
}
