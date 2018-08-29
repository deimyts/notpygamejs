'use strict';

class Canvas {
  constructor(options) {
    this.element = document.getElementById(options.id);
    this.width = this.element.width;
    this.height = this.element.height;
    this.ctx = this.element.getContext('2d');
    this.ctx.font = options.font;
    this.ctx.strokeStyle = options.strokeStyle;
    this.ctx.lineWidth = options.lineWidth;
  }

  drawBubble(x, y, w, h, radius) {
    var r = x + w;
    var b = y + h;
    this.ctx.beginPath();
    this.ctx.strokeStyle="black";
    this.ctx.lineWidth="2";
    this.ctx.moveTo(x+radius, y);
    this.ctx.lineTo(x+radius/2, y-10);
    this.ctx.lineTo(x+radius * 2, y);
    this.ctx.lineTo(r-radius, y);
    this.ctx.quadraticCurveTo(r, y, r, y+radius);
    this.ctx.lineTo(r, y+h-radius);
    this.ctx.quadraticCurveTo(r, b, r-radius, b);
    this.ctx.lineTo(x+radius, b);
    this.ctx.quadraticCurveTo(x, b, x, b-radius);
    this.ctx.lineTo(x, y+radius);
    this.ctx.quadraticCurveTo(x, y, x+radius, y);
    this.ctx.stroke();
  }

  drawRect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x,y,w,h);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawCircle(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI*2, true); 
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  }

  clear() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

}

module.exports = function canvas(id) {
  return new Canvas(id);
}

