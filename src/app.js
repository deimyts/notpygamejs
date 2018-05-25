const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');

window.WIDTH = window.WIDTH || 800;
window.HEIGHT = window.HEIGHT || 600;
const randf = npg.randf;
const randi = npg.randi;
const randn = npg.randn;
const drawCircle = npg.drawCircle;

var agents = [];
var food = [];

var eyesep= 0.6; //separate of eyes in a.radians
var eyelen= 30; //how many pixels away from body eyes are
var eyesens= 0.0005; //how sensitive is the eye? decrease for more sensitivity...
var eyemult= 0.5; //linear multiplier on strength of eye.
var foodloss= 0.002; //food loss per iteration
var repthr= 3; //what is the replication threshold? in amount of food
var foodgain= 0.5; //how much food and replication is gained when agent eats?
var mutrate= 0.1; //how common are mutations?
var mutrate2= 0.3; //how severe are they when they do occur?
var foodaddfreq= 10; //how often do we add food?
var foodlimit= 30; //how much food can there be total?
var boostcost=0.001;  //how much does use of boost cost in health

var brainsize= 20; //how many neurons does each brain have. Must be bigger than about 10
var braindensity= 3; //how dense are the brains? (number of synapses per neuron)

function Brain()
{
  
  //1D array of neuron activations
  this.act= new Array(brainsize);
  for (var i=0;i<brainsize;i++) {
    this.act[i]= 0;
  }
  
  //2D array of synapse weights and indexes of neurons they connect to
  this.w= new Array(brainsize);
  this.ix= new Array(brainsize);
  for (var i=0;i<brainsize;i++) {
    this.w[i]= new Array(braindensity);
    this.ix[i]= new Array(braindensity);
    for (var j=0;j<braindensity;j++) {
        this.w[i][j]= randf(-1.2, 1.2);
        this.ix[i][j]= randi(0, brainsize);
    }
  }
  
}

//feeds forward the brain. s1 and s2 are the two senses, both in [0,1]
//health is ... health
Brain.prototype = {
    
    //brain takes inputs and sets its outputs
    tick : function(s1, s2) {

        this.act[0]= s1; //set inputs
        this.act[1]= s2;
        this.act[3]= 1; //some bias neurons are always on
        this.act[4]= 1;
        this.act[5]= 1;
        this.act[6]= 1;
        
        for (var i=7;i<brainsize;i++) {
            var a=0;
            for (var j=0;j<braindensity;j++) {
                a+= this.w[i][j]*this.act[this.ix[i][j]]
            }
            this.act[i]= 1.0/(1.0 + Math.exp(-a));  //pass through sigmoid
        }
        
        //assume last 2 neurons are the outputs
        return {
            out0: this.act[brainsize-1] - 0.5, 
            out1: this.act[brainsize-2]
        };
    },
    
    //used during reproduction
    //copy over the brain with some mutation. crude. for now
    mutateFrom : function(brain) {
        
        //lossy copy of brain structure
        for (var i=0;i<brainsize;i++) {
          for (var j=0;j<braindensity;j++) {
            
            var m= brain.w[i][j];
            if(randf(0,1)<mutrate) m += randn(0,mutrate2);
            this.w[i][j]= m;
            
            m= brain.ix[i][j];
            if(randf(0,1)<mutrate) m = randi(0,brainsize);
            this.ix[i][j]= m;
          }
        }
    }
}

class Agent {
  constructor() {
    this.pos = new Vector2D(randf(0,WIDTH), randf(0,HEIGHT));
    this.dir = randf(0, 2*Math.PI);
    this.s1 = 0;  //food sense eye 1
    this.s2 = 0;  //food sense eye 2
    this.brain = new Brain();
    this.speed = 4.0;
    this.boost = 0.0; //boost, on top of speed
    this.health = 1.0;
    this.rep = 0.0; //replication counter
    this.selected = false;
    this.radius = 15;
  }
}

function myinit(){
    counter = 0;
    
    //cosmetics
    ctx.font = "12pt Arial";
    ctx.strokeStyle="black";
    ctx.lineWidth="1.5";
}

function update(){
    counter=counter+1;
    
    killi=-1;
    for(i in agents) {
        var a = agents[i];
        
        //move agent
        var vel= new Vector2D((a.boost+a.speed)*Math.cos(a.dir), (a.boost+a.speed)*Math.sin(a.dir));
        a.pos.plusEq(vel);
        
        //enforce boundary conditions: wrap around if necessary
        if(a.pos.x<0) a.pos.x= WIDTH;
        if(a.pos.x>WIDTH) a.pos.x= 0;
        if(a.pos.y<0) a.pos.y= HEIGHT;
        if(a.pos.y>HEIGHT) a.pos.y= 0;
        
        //agent gets more hungry
        a.health-= foodloss;
        a.health-= boostcost*a.boost; //boost costs health
        if(a.health<0) { killi= i; }
    }
    if(killi!=-1) agents.splice(killi, 1);
    
    //agent collision detection and resolution
    for(i in agents) {
        var a = agents[i];
        for(j in agents) {
            var a2 = agents[j];
            if(i==j) continue;
            var d= getDistance(a.pos, a2.pos);
            var overlap= a.radius*2-d;
            if(overlap>0 && d>1){
                //one agent pushes on another proportional to his boost. Higher boost wins
                var aggression= a2.boost/(a.boost+a2.boost);
                if(a.boost<0.01 && a2.boost<0.01) aggression=0.5;
                var ff2= (overlap*aggression)/d;
                var ff1= (overlap*(1-aggression))/d;
                a2.pos.x+= (a2.pos.x-a.pos.x)*ff2;
                a2.pos.y+= (a2.pos.y-a.pos.y)*ff2;
                a.pos.x-= (a2.pos.x-a.pos.x)*ff1;
                a.pos.y-= (a2.pos.x-a.pos.x)*ff1;
            }
        }
    }
    
    //check if any agent ate food
    //and while we're at it, compute input to sense
    killi=-1;
    for(i in agents) {
        var a = agents[i];
        a.s1=0; a.s2=0;
        
        for(j in food) {
            var f = food[j];
            
            var d2= getDistance(a.pos, f.pos);
            if(d2 < a.radius){
                eatFood(a);
                killi = j;
            }
            
            senseFood(d2, a, f);
        }
    }
    if(killi!=-1) food.splice(killi, 1);
    
    //feed forward the brain from senses to output
    for(i in agents) {
        var a = agents[i];
        res= a.brain.tick(a.s1, a.s2);
        
        //apply output neuron 0: controls turning. Also cap it to a max of 0.3 rotation
        var des= res.out0;
        if(des>0.8)des=0.8;
        if(des<-0.8)des=-0.8;
        a.dir += des;
        
        //wrap direction around to keep it in range of [0, 2pi]
        if(a.dir>2*Math.PI) a.dir= a.dir-2*Math.PI;
        if(a.dir<0)a.dir=2*Math.PI+a.dir;
        
        //apply output neuron 1: controls boost
        des= res.out1;
        if(des>0) {a.boost= des;}
        else {a.boost= 0;}
     }
     
    //spawn more food, maybe
    if(counter%foodaddfreq==0 && food.length<foodlimit) {
        var f = createFoodPellet();
        food.push(f);
    }
    
    //handle births
    var bi= -1;
    for(i in agents) {
        var a = agents[i];
        if(a.rep>repthr) {
            //this agent reproduces!
            bi= i;
        }
    }
    
    if(bi!=-1) {
        var a = agents[bi];
        a.rep= 0;
        
         var anew= new Agent();
         anew.pos=  new Vector2D(a.pos.x + randf(-30,30), a.pos.y + randf(-30,30));
         anew.brain.mutateFrom(a.brain);
        
        agents.push(anew);
    }
    
    //spawn more agents if there are too few agents left
    if(agents.length<10) {
        var anew= new Agent();
        agents.push(anew);
    }
}

function eatFood(a) {
    a.rep += foodgain;
    a.health += foodgain;
    if (a.health > 1)
        a.health = 1;
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

function senseFood(d2, a, f) {
    const inRange = d2 < a.radius * 10;
    //for efficiency, don't even bother if it's too far
    if (!inRange) { 
        return false;
    }
    //compute position of both eyes in world coordinates
    var { eye1, eye2 } = computeEyePosition(a);
    a.s1 += getSenseInput(eye1, f);
    a.s2 += getSenseInput(eye2, f);
}

function getSenseInput(eye, food) {
    const xDist = eye.pos.x - food.pos.x;
    const yDist = eye.pos.y - food.pos.y;
    const distanceSquared = Math.pow(xDist, 2) + Math.pow(yDist, 2)
    return eyemult * Math.exp(-eyesens * distanceSquared);
}

function computeEyePosition(agent) {
    const eye1 = {};
    const eye2 = {};
    eye1.pos = {};
    eye2.pos = {};
    
    eye1.pos.x = agent.pos.x + eyelen * Math.cos(agent.dir - eyesep);
    eye1.pos.y  = agent.pos.y + eyelen * Math.sin(agent.dir - eyesep);
    eye2.pos.x = agent.pos.x + eyelen * Math.cos(agent.dir + eyesep);
    eye2.pos.y = agent.pos.y + eyelen * Math.sin(agent.dir + eyesep);
    return { eye1, eye2 };
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
        var a1= -eyesep + Math.PI/2;
        var a2= eyesep + Math.PI/2;
        var x1= Math.cos(a1)*eyelen; var y1= Math.sin(a1)*eyelen;
        var x2= Math.cos(a2)*eyelen; var y2= Math.sin(a2)*eyelen;
        
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
        var d= Math.sqrt(Math.pow(a.pos.x-x,2) + Math.pow(a.pos.y-y,2));
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
  Agent,
  eatFood,
  senseFood,
  getSenseInput,
  computeEyePosition,
  createFoodPellet,
  getDistance,
  myinit,
  update,
  draw,
  keyUp,
  keyDown,
  mouseClick
}
