const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');

const Agent = require('./Agent');
const Brain = require('./Brain');

window.WIDTH = window.WIDTH || 800;
window.HEIGHT = window.HEIGHT || 600;
const randf = npg.randf;
const randi = npg.randi;
const randn = npg.randn;
const drawCircle = npg.drawCircle;

var agents = [];
var food = [];

var foodaddfreq= 10; //how often do we add food?
var foodlimit= 30; //how much food can there be total?

function myinit(){
    foodCounter = 0;
    
    //cosmetics
    ctx.font = "12pt Arial";
    ctx.strokeStyle="black";
    ctx.lineWidth="1.5";
}

function update(){
    foodCounter = foodCounter + 1;
    
    agents.forEach(agent => agent.move());

    handleDeaths()
    
    //agent collision detection and resolution
    handleCollisions();
    
    //check if any agent ate food
    //and while we're at it, compute input to sense
    handleEating();
    
    //feed forward the brain from senses to output
    processBrain();
     
    //spawn more food, maybe

    const foodBelowLimit = food.length < foodlimit;
    const counterIsTriggered = foodCounter % foodaddfreq == 0;
    if (counterIsTriggered && foodBelowLimit) {
      spawnFood(food);
    }
    
    //handle births
    handleBirths();
    
    //spawn more agents if there are too few agents left
    spawnAgent(agents);
}

function handleDeaths() {
    let killi=-1;
    for(i in agents) {
        var a = agents[i];
        
        //agent gets more hungry
        a.adjustHealth();
        if (a.health < 0) {
          killi = i;
      }
    }
    if(killi!=-1) agents.splice(killi, 1);
}

function handleEating() {
    let killi=-1;
    for(i in agents) {
        var a = agents[i];
        a.s1=0; a.s2=0;
        
        for(j in food) {
            var f = food[j];
            
            var d2= getDistance(a.pos, f.pos);
            if(d2 < a.radius){
                a.eat();
                killi = j;
            }
            
            a.senseFood(d2, f);
        }
    }
    if(killi!=-1) food.splice(killi, 1);
}
function handleCollisions() {
  for (i in agents) {
    var a = agents[i];
    for (j in agents) {
      var a2 = agents[j];
      if (i == j) continue;
      var d = getDistance(a.pos, a2.pos);
      var overlap = a.radius * 2 - d;
      if (overlap > 0 && d > 1) {
        //one agent pushes on another proportional to his boost. Higher boost wins
        var aggression = a2.boost / (a.boost + a2.boost);
        if (a.boost < 0.01 && a2.boost < 0.01) aggression = 0.5;
        var ff2 = (overlap * aggression) / d;
        var ff1 = (overlap * (1 - aggression)) / d;
        a2.pos.x += (a2.pos.x - a.pos.x) * ff2;
        a2.pos.y += (a2.pos.y - a.pos.y) * ff2;
        a.pos.x -= (a2.pos.x - a.pos.x) * ff1;
        a.pos.y -= (a2.pos.x - a.pos.x) * ff1;
      }
    }
  }
}

function handleBirths() {
  var birthIndex = -1;
  for (i in agents) {
    var a = agents[i];
    if (a.rep > a.repthr) {
      //this agent reproduces!
      birthIndex = i;
    }
  }

  if (birthIndex != -1) {
    var a = agents[birthIndex];
    a.rep = 0;

    var child = new Agent();
    child.pos = new Vector2D(a.pos.x + randf(-30, 30), a.pos.y + randf(-30, 30));
    child.brain.mutateFrom(a.brain);

    agents.push(child);
  }
}

function processBrain() {
  for (i in agents) {
    var a = agents[i];
    res = a.brain.tick(a.s1, a.s2);

    //apply output neuron 0: controls turning. Also cap it to a max of 0.3 rotation
    var des = res.out0;
    if (des > 0.8) des = 0.8;
    if (des < -0.8) des = -0.8;
    a.dir += des;

    //wrap direction around to keep it in range of [0, 2pi]
    if (a.dir > 2 * Math.PI) a.dir = a.dir - 2 * Math.PI;
    if (a.dir < 0) a.dir = 2 * Math.PI + a.dir;

    //apply output neuron 1: controls boost
    des = res.out1;
    if (des > 0) { a.boost = des; }
    else { a.boost = 0; }
  }
}

function spawnAgent(agents) {
  const notEnoughAgents = agents.length < 10
  if (notEnoughAgents) {
    agents.push(new Agent());
  }
}

function spawnFood(food) {
  var f = createFoodPellet();
  return food.push(f);
}

function getDistance(a, b) {
    const xDistance = a.x - b.x;
    const yDistance = a.y - b.y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function createFoodPellet() {
    return {
        pos: new Vector2D(randf(0, WIDTH), randf(0, HEIGHT))
    };
}

function draw(){
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    
    //draw food
    ctx.fillStyle = 'rgb(100,230,100)';
    for(i in food) {
        var f = food[i];
        drawCircle(f.pos.x, f.pos.y, 10);
    }
    
    //draw all agents
    for(i in agents) {
        var a = agents[i];
        
        ctx.save();
        ctx.translate(a.pos.x, a.pos.y);
        ctx.rotate(a.dir - Math.PI/2);
        
        //draw its eyes
        //first compute their position
        var a1= -a.eyesep + Math.PI/2;
        var a2= a.eyesep + Math.PI/2;
        var x1= Math.cos(a1)*a.eyelen; var y1= Math.sin(a1)*a.eyelen;
        var x2= Math.cos(a2)*a.eyelen; var y2= Math.sin(a2)*a.eyelen;
        
        //draw the lines to eyes
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.moveTo(0, 0);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
        
        //draw the eyes, colored by how much food they sense
        var s= Math.round(a.s1*255.0);
        ctx.fillStyle = 'rgb('+s+',0,0)';
        drawCircle(x1, y1, 5)
        var s= Math.round(a.s2*255.0); if(s>255) s=255;
        ctx.fillStyle = 'rgb('+s+',0,0)';
        drawCircle(x2, y2, 5)
        
        //draw agent body and outline
        if (!a.selected){
            ctx.fillStyle = 'rgb('+Math.round(255.0*a.health)+','+Math.round(255.0*a.health)+',0)';
        } else {
            ctx.fillStyle = 'rgb(0,'+Math.round(255.0*a.health)+','+Math.round(255.0*a.health)+')';
        }
        drawCircle(0, 0, a.radius);
        ctx.restore();
        
        //draw brain of this agent, if it is selected
        if(a.selected) {
            
            //draw all the connections first
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.beginPath();
            var SS=100;
            for (var m=0;m<brainsize;m++) {
                var r1= 2*Math.PI*m/brainsize;
                for (var n=0;n<braindensity;n++) {
                    //this.w[i][j]*this.act[this.ix[i][j]]
                    var act= Math.round(a.brain.w[i][j]*120+120);
                    var r2= 2*Math.PI*a.brain.ix[m][n]/brainsize;
                    ctx.moveTo(SS*Math.cos(r1)+WIDTH-SS*1.5, SS*Math.sin(r1)+HEIGHT-SS*1.5);
                    ctx.lineTo(SS*Math.cos(r2)+WIDTH-SS*1.5, SS*Math.sin(r2)+HEIGHT-SS*1.5);
                }
            }
            ctx.stroke();
            
            for (var m=0;m<brainsize;m++) {
                //var act= 1.0/(1.0 + Math.exp(-a));  //pass through sigmoid
                var act= Math.round(a.brain.act[m]*255);
                ctx.fillStyle = 'rgb('+act+','+act+','+act+')';
                var r1= 2*Math.PI*m/brainsize;
                drawCircle(SS*Math.cos(r1)+WIDTH-SS*1.5, SS*Math.sin(r1)+HEIGHT-SS*1.5, 10);
            }
            
        }
    }
    
    //draw score
    //ctx.fillStyle = 'rgb(0,0,0)';
    //ctx.fillText("Alive: " + agents.length, 10, 20); 
}

function mouseClick(x, y){
    
    //select an agent with mouseclick
    var i;
    for(i in agents) {
        var a = agents[i];
        const clickPosition = { x, y }
        var d= getDistance(a.pos, clickPosition);
        if(d<3*a.radius) {
        
            //that's a hit! Let's select this one and unselect all others
            var newset= !a.selected;
            var j;
            for(j in agents) { agents[j].selected= false; }
            a.selected= newset;
            
            return;
        }
    }
}

function keyUp(key){
}
function keyDown(key){
}

module.exports = {
  spawnFood,
  spawnAgent,
  createFoodPellet,
  getDistance,
  myinit,
  update,
  draw,
  keyUp,
  keyDown,
  mouseClick
}
