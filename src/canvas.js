const npg = require('./include/npgmain');

function draw(canvas){
    canvas.clear();
    drawFood(canvas);
    drawAgents(canvas);
    drawScore(canvas); 
}

function drawFood(canvas) {
  canvas.ctx.fillStyle = 'rgb(100,230,100)';
  for (i in food) {
    var f = food[i];
    canvas.drawCircle(f.pos.x, f.pos.y, 10);
  }
}

function drawAgents(canvas) {
  for(i in agents) {
    var a = agents[i];
    prepCanvas(a, canvas);
    drawEyes(a, canvas);
    drawBody(a, canvas);
    if (a.selected) {
        drawBrain(a, canvas);
    }
  }
}

function drawScore(canvas) {
  canvas.ctx.fillStyle = 'rgb(0,0,0)';
  canvas.ctx.fillText("Alive: " + agents.length, 10, 20);
}

function prepCanvas(a, canvas) {
    canvas.ctx.save();
    canvas.ctx.translate(a.pos.x, a.pos.y);
    canvas.ctx.rotate(a.dir - Math.PI / 2);
}

function drawBrain(a, canvas) {
  canvas.ctx.fillStyle = 'rgb(0,0,0)';
  canvas.ctx.beginPath();
  const radius = 100;
  const baseCircle = {
    radius: radius,
    center: {
      x: WIDTH - radius * 1.5,
      y: HEIGHT - radius * 1.5
    }
  }
  a.brain.weights.forEach((weightGroup, i) => {
    weightGroup.forEach((weight, j) => {
      const neuronIndex = a.brain.index[i][j];
      const angle1 = pointAngle(a.brain.size, i)
      const angle2 = pointAngle(a.brain.size, neuronIndex);
      drawSynapse(baseCircle, angle1, angle2);
    });
  })
  a.brain.neurons.forEach((neuron, index) => {
  setColor(neuron);
    const center = findNeuronCenter(index, a.brain.size, baseCircle);
    drawNeuron(neuron, center);
  })
}

function drawNeuron(neuron, center) {
  canvas.drawCircle(center.x, center.y, 10);
}

function findNeuronCenter(index, pointCount, circle) {
  const angle = pointAngle(pointCount, index);
  return findPointOnCircle(circle.radius, angle, circle.center)
}

function pointAngle(pointCount, pointIndex) {
  // find the angle to one point in a group of equidistant points on a circle
  const angleBetweenPoints = 2 * Math.PI / pointCount;
  return angleBetweenPoints * pointIndex;
}

function setColor(neuron, canvas) {
  var fillColor = Math.round(neuron * 255);
  canvas.ctx.fillStyle = 'rgb(' + fillColor + ',' + fillColor + ',' + fillColor + ')';
}

function drawSynapse(baseCircle, angle1, angle2) {
  const start = findPointOnCircle(baseCircle.radius, angle1, baseCircle.center);
  const end = findPointOnCircle(baseCircle.radius, angle2, baseCircle.center);
  drawLine(start, end);
}

function findPointOnCircle(radius, angle, center) {
 return {
    x: radius * Math.cos(angle) + center.x,
    y: radius * Math.sin(angle) + center.y
  }
}

function drawLine(start, end, canvas) {
  canvas.ctx.moveTo(start.x, start.y);
  canvas.ctx.lineTo(end.x, end.y);
  canvas.ctx.stroke();
}

function drawBody(a, canvas) {
  if (!a.selected) {
    canvas.ctx.fillStyle = 'rgb(' + Math.round(255.0 * a.health) + ',' + Math.round(255.0 * a.health) + ',0)';
  }
  else {
    canvas.ctx.fillStyle = 'rgb(0,' + Math.round(255.0 * a.health) + ',' + Math.round(255.0 * a.health) + ')';
  }
  canvas.drawCircle(0, 0, a.radius);
  canvas.ctx.restore();
}

function drawEyes(a, canvas) {
  var a1 = -a.eyesep + Math.PI / 2;
  var a2 = a.eyesep + Math.PI / 2;
  var x1 = Math.cos(a1) * a.eyelen;
  var y1 = Math.sin(a1) * a.eyelen;
  var x2 = Math.cos(a2) * a.eyelen;
  var y2 = Math.sin(a2) * a.eyelen;
  //draw the lines to eyes
  canvas.ctx.fillStyle = 'rgb(0,0,0)';
  canvas.ctx.beginPath();
  canvas.ctx.moveTo(0, 0);
  canvas.ctx.lineTo(x1, y1);
  canvas.ctx.moveTo(0, 0);
  canvas.ctx.lineTo(x2, y2);
  canvas.ctx.closePath();
  canvas.ctx.stroke();
  //draw the eyes, colored by how much food they sense
  var s = Math.round(a.s1 * 255.0);
  canvas.ctx.fillStyle = 'rgb(' + s + ',0,0)';
  canvas.drawCircle(x1, y1, 5);
  var s = Math.round(a.s2 * 255.0);
  if (s > 255)
    s = 255;
  canvas.ctx.fillStyle = 'rgb(' + s + ',0,0)';
  canvas.drawCircle(x2, y2, 5);
}

module.exports = { draw }
