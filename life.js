import Universe from './universe.js';
import Drawer from './drawer.js';

document.addEventListener('DOMContentLoaded', () => {
  window.drawer = new Drawer
  window.universe = new Universe(drawer.dots())

  drawer.fill(universe.life)

  setInterval(function() {
    universe.iterate()
    drawer.fill(universe.life)
  }, 70);
})
