const Vector2D = require('./include/vector2D')
const npg = require('./include/npgmain');

const Agent = require('./Agent');
const Brain = require('./Brain');

window.WIDTH = window.WIDTH || 800;
window.HEIGHT = window.HEIGHT || 600;
const randf = npg.randf;
const randi = npg.randi;


class Game {
  constructor() {
    this.agents = [];
    this.food = [];
    this.foodCounter = 0;
    this.foodLimit= 30; //how much food can there be total?
    this.foodAddFrequency= 10; //how often do we add food?
  }

  update() {
    this.incrementFoodCounter();

    this.agents.forEach(agent => agent.move(WIDTH, HEIGHT));

    this.handleDeaths()

    //agent collision detection and resolution
    this.handleCollisions();

    //check if any agent ate food
    //and while we're at it, compute input to sense
    this.handleEating();

    //feed forward the brain from senses to output
    this.processBrain();

    //spawn more food, maybe

    const foodBelowLimit = this.food.length < this.foodLimit;
    const counterIsTriggered = this.foodCounter % this.foodAddFrequency == 0;
    if (counterIsTriggered && foodBelowLimit) {
      spawnFood(this.food);
    }

    //handle births
    this.handleBirths();

    //spawn more agents if there are too few agents left
    const notEnoughAgents = this.agents.length < 10
    if (notEnoughAgents) {
      this.spawnAgent(this.agents);
    }
  }
  
  incrementFoodCounter() {
    this.foodCounter = this.foodCounter + 1;
  }

  spawnAgent() {
    this.agents.push(new Agent());
  }

  handleDeaths() {
    this.agents.forEach((agent, index) => {
      //agent gets more hungry
      agent.adjustHealth();
      if (agent.health < 0) {
        this.removeAgent(index);
      }
    })
  }

  removeAgent(index) {
    this.agents.splice(index, 1)
  }

  removeFood(index) {
    this.food.splice(index, 1)
  }

  handleEating() {
    this.agents.forEach(agent => {
      agent.s1=0; agent.s2=0;
      this.food.forEach((foodPellet, index) => {
        const distanceToFood = getDistance(agent.pos, foodPellet.pos);
        if(distanceToFood < agent.radius){
          agent.eat();
          this.removeFood(index)
        }
        agent.senseFood(distanceToFood, foodPellet);
      })
    })
  }

  mouseClick(x, y) {

    //select an agent with mouseclick
    var i;
    for(i in this.agents) {
      var a = this.agents[i];
      const clickPosition = { x, y }
      var d= getDistance(a.pos, clickPosition);
      if(d<3*a.radius) {
        console.log('Brain: ', a.brain)
        //that's a hit! Let's select this one and unselect all others
        var newset= !a.selected;
        var j;
        for(j in this.agents) { this.agents[j].selected= false; }
        a.selected= newset;

        return;
      }
    }
  }

  handleCollisions() {
    for (let i in this.agents) {
      var a = this.agents[i];
      for (let j in this.agents) {
        var a2 = this.agents[j];
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

  handleBirths() {
    var birthIndex = -1;
    for (let i in this.agents) {
      var a = this.agents[i];
      if (a.rep > a.repthr) {
        //this agent reproduces!
        birthIndex = i;
      }
    }

    if (birthIndex != -1) {
      var a = this.agents[birthIndex];
      a.rep = 0;

      var child = new Agent();
      child.pos = new Vector2D(a.pos.x + randf(-30, 30), a.pos.y + randf(-30, 30));
      child.brain.mutateFrom(a.brain);

      this.agents.push(child);
    }
  }

  processBrain() {
    for (let i in this.agents) {
      var a = this.agents[i];
      let res = a.brain.tick(a.s1, a.s2);

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


  static create() {
    return new Game();
  }
}

function init(){
  window.game = Game.create()
}

function update(){
  window.game.update();
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


function keyUp(key){
}
function keyDown(key){
}

module.exports = {
  createGame: Game.create,
  spawnFood,
  // spawnAgent,
  createFoodPellet,
  getDistance,
  // handleBirths,
  init,
  update,
  keyUp,
  keyDown,
  // mouseClick
}
