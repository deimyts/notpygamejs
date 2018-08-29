const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');
const app = require('./app');
const canvas = require('./canvas');

const npgOpts = {
  fps: 50,
  myinit: app.init,
  update: app.update,
  draw: canvas.draw,
  keyUp: app.keyUp,
  keyDown: app.keyDown,
  mouseClick: app.mouseClick,
  canvas: {
    id: 'NPGcanvas',
    font: "12pt Arial",
    strokeStyle: "black",
    lineWidth: "1.5"
  }
}

function start() {
  console.log('starting...')
  npg.NPGinit(npgOpts);
}

window.onload = start;
