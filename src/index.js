const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');
const app = require('./app');

window.NPGinit = npg.NPGinit;
window.myinit = app.myinit;
window.update = app.update;
window.draw = app.draw;
window.keyUp = app.keyUp
window.keyDown = app.keyDown
window.mouseClick = app.mouseClick

function start() {
    npg.NPGinit(50);
}

window.onload = start;