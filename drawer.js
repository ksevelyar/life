export default class Drawer {
  constructor(color = '#5b5b5b', pixel = 3, canvasPadding = 100) {
    this.color = color
    this.pixel = pixel
    this.canvasPadding = canvasPadding

    this.canvas = document.querySelector('canvas')
    this.context = this.canvas.getContext('2d')

    this.side = this.fitSquareSideToScreen()
    this.canvas.width = this.side
    this.canvas.height = this.side
  }

  fitSquareSideToScreen() {
    const smallestSide = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight
    const titleHeight = document.querySelector('.title').offsetHeight

    return smallestSide - titleHeight - this.canvasPadding
  }

  dots() {
    return Math.trunc(this.side / this.pixel)
  }

  drawPixel(x, y) {
    this.context.fillStyle = this.color
    this.context.fillRect(x * this.pixel, y * this.pixel, this.pixel, this.pixel)
  }

  fill(life) {
    this.context.clearRect(0, 0, this.side, this.side);

    life.forEach((column, x) => column.forEach((y) => this.drawPixel(x, y)))
  }
}