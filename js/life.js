import Universe from './universe.js'
import Drawer from './drawer.js'

document.addEventListener('DOMContentLoaded', () => {
  const drawer = new Drawer
  const universe = new Universe(drawer.dots())

  drawer.fill(universe.life)

  setInterval(function() {
    universe.iterate()
    drawer.fill(universe.life)
  }, 70)
})
