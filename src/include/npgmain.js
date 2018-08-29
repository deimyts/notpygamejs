//Simple game engine
//Author: Andrej Karpathy
//License: BSD
//This function does all the boring canvas stuff. To use it, just create functions:
//update()          gets called every frame
//draw()            gets called every frame
//myinit()          gets called once in beginning
//mouseClick(x, y)  gets called on mouse click
//keyUp(keycode)    gets called when key is released
//keyDown(keycode)  gets called when key is pushed

const createCanvas = require('./npg-canvas.js');
var ctx;
var WIDTH;
var HEIGHT; 
var FPS;

//uniform distribution integer
function randi(s, e) {
  return Math.floor(Math.random()*(e-s) + s);
}

//uniform distribution
function randf(s, e) {
  return Math.random()*(e-s) + s;
}

//normal distribution random number
function randn(mean, variance) {
  var V1, V2, S;
  do {
    var U1 = Math.random();
    var U2 = Math.random();
    V1 = 2 * U1 - 1;
    V2 = 2 * U2 - 1;
    S = V1 * V1 + V2 * V2;
  } while (S > 1);
  X = Math.sqrt(-2 * Math.log(S) / S) * V1;
  X = mean + Math.sqrt(variance) * X;
  return X;
}

function eventClick(clickFn, canvas) {
  return function(e) {
    //get position of cursor relative to top left of canvas
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    } else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    clickFn(x, y)
  }
}

//event codes can be found here:
//http://www.aspdotnetfaq.com/Faq/What-is-the-list-of-KeyCodes-for-JavaScript-KeyDown-KeyPress-and-KeyUp-events.aspx
function eventKeyUp(cb) {
  return function(e) {
    var keycode = ('which' in e) ? e.which : e.keyCode;
    cb(keycode);
  }
}

function eventKeyDown(cb) {
  return function(e) {
    var keycode = ('which' in e) ? e.which : e.keyCode;
    cb(keycode);
  }
}

function NPGinit(options){
  console.log('NPGinit')
  //takes frames per secont to run at
  const canvas = createCanvas(options.canvas);  
  const click = eventClick(options.mouseClick, canvas);
  const keyUp = eventKeyUp(options.keyUp);
  const keyDown = eventKeyDown(options.keyDown);
  canvas.element.addEventListener('click', click, false);
  
  //canvas element cannot get focus by default. Requires to either set 
  //tabindex to 1 so that it's focusable, or we need to attach listeners
  //to the document. Here we do the latter
  document.addEventListener('keyup', eventKeyUp, true);
  document.addEventListener('keydown', eventKeyDown, true);

  const tick = NPGtick(options.update, options.draw, canvas);
  
  setInterval(tick, 1000/options.fps);
  
  options.myinit();
}

function NPGtick(update, draw, canvas) {
  return function() {
    update();
    draw(canvas);
  }
}

module.exports = {
  NPGinit,
  randf,
  randi,
  randn
}
