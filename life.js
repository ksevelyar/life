import init, { Universe, Cell } from './docs/life_wasm.js'

async function run() {
  const canvas = document.querySelector('.universe')
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth

  const wasm = await init()
 
  const cell_size = 5
  const height = Math.floor(window.innerHeight / (cell_size + 1))
  const width = Math.floor(window.innerWidth / (cell_size + 1))

  canvas.height = height * 6 + 1
  canvas.width = width * 6 + 1

  const universe = Universe.new(width, height)

  const grid_color = '#d7d7d7'
  const dead_color = '#f2f2f2'
  const alive_color = '#222831'

  const ctx = canvas.getContext('2d')

  const drawCells = () => {
    const cellsPtr = universe.cells()
    const memory = wasm.memory
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

    ctx.beginPath()

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col)

        ctx.fillStyle = cells[idx] === Cell.Dead
          ? dead_color
          : alive_color

        ctx.fillRect(
          col * (cell_size + 1) + 1,
          row * (cell_size + 1) + 1,
          cell_size,
          cell_size
        )
      }
    }

    ctx.stroke()
  }

  const renderLoop = () => {
    universe.tick()

    drawGrid()
    drawCells()

    requestAnimationFrame(renderLoop)
  }

  const drawGrid = () => {
    ctx.beginPath()
    ctx.strokeStyle = grid_color

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (cell_size + 1) + 1, 0)
      ctx.lineTo(i * (cell_size + 1) + 1, (cell_size + 1) * height + 1)
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0,                           j * (cell_size + 1) + 1)
      ctx.lineTo((cell_size + 1) * width + 1, j * (cell_size + 1) + 1)
    }

    ctx.stroke()
  }

  requestAnimationFrame(renderLoop)

  const getIndex = (row, column) => {
    return row * width + column
  }
}

run()
