const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');
const app = require('./app');
const canvas = require('./canvas');

function init() {
  app.init();
    
  //cosmetics
  ctx.font = "12pt Arial";
  ctx.strokeStyle="black";
  ctx.lineWidth="1.5";
};

const npgOpts = {
  fps: 50,
  myinit: init,
  update: app.update,
  draw: canvas.draw,
  keyUp: app.keyUp,
  keyDown: app.keyDown,
  mouseClick: app.mouseClick,
  canvasId: 'NPGcanvas'
}

function start() {
  console.log('starting...')
    npg.NPGinit(npgOpts);
}

window.onload = start;
