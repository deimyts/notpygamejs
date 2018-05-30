const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');
const app = require('./app');
const canvas = require('./canvas');

window.NPGinit = npg.NPGinit;
window.myinit = app.myinit;
window.update = app.update;
window.draw = canvas.draw;
window.keyUp = app.keyUp
window.keyDown = app.keyDown
window.mouseClick = app.mouseClick

function start() {
    npg.NPGinit(50);
}

window.onload = start;