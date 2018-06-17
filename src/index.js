const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');
const app = require('./app');
const canvas = require('./canvas');

window.myinit = function() {
  app.init();
    
  //cosmetics
  ctx.font = "12pt Arial";
  ctx.strokeStyle="black";
  ctx.lineWidth="1.5";
};

window.update = app.update;
window.draw = canvas.draw;
window.keyUp = app.keyUp
window.keyDown = app.keyDown
window.mouseClick = app.mouseClick

function start() {
    npg.NPGinit(50);
}

window.onload = start;
