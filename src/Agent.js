const Vector2D = require('./include/vector2D')
const Brain = require('./Brain');
const npg = require('./include/npgmain');

const randf = npg.randf;

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
    this.foodloss= 0.002; //food loss per iteration
    this.boostcost=0.001;  //how much does use of boost cost in health
    this.foodgain= 0.5; //how much food and replication is gained when agent eats?

    this.eyemult= 0.5; //linear multiplier on strength of eye.

    this.eyesens= 0.0005; //how sensitive is the eye? decrease for more sensitivity...
    this.eyelen= 30; //how many pixels away from body eyes are
    this.eyesep = 0.6; //separate of eyes in this.radians
    this.repthr= 3; //what is the replication threshold? in amount of food
  }

  calculateFoodLoss() {
    this.health -= this.foodloss;
  }

  adjustHealth() {
    this.calculateFoodLoss();
    this.health -= this.boostcost * this.boost; //boost costs health
  }

  eat() {
    this.rep += this.foodgain;
    this.health += this.foodgain;
    if (this.health > 1)
        this.health = 1;
  }

  getSenseInput(eye, food) {
      const xDist = eye.pos.x - food.pos.x;
      const yDist = eye.pos.y - food.pos.y;
      const distanceSquared = Math.pow(xDist, 2) + Math.pow(yDist, 2)
      return this.eyemult * Math.exp(-this.eyesens * distanceSquared);
  }

  computeEyePosition() {
      const eye1 = {};
      const eye2 = {};
      eye1.pos = {};
      eye2.pos = {};
      
      eye1.pos.x = this.pos.x + this.eyelen * Math.cos(this.dir - this.eyesep);
      eye1.pos.y  = this.pos.y + this.eyelen * Math.sin(this.dir - this.eyesep);
      eye2.pos.x = this.pos.x + this.eyelen * Math.cos(this.dir + this.eyesep);
      eye2.pos.y = this.pos.y + this.eyelen * Math.sin(this.dir + this.eyesep);
      return { eye1, eye2 };
  }

  senseFood(distance, f) {
    const inRange = distance < this.radius * 10;
    //for efficiency, don't even bother if it's too far
    if (!inRange) {
      return false;
    }
    //compute position of both eyes in world coordinates
    var { eye1, eye2 } = this.computeEyePosition();
    this.s1 += this.getSenseInput(eye1, f);
    this.s2 += this.getSenseInput(eye2, f);
  }

  move(WIDTH, HEIGHT) {
    const vel = this.getVelocity();
    this.pos.plusEq(vel);
    // force boundary conditions: wrap around if necessary
    if (this.pos.x < 0)
        this.pos.x = WIDTH;
    if (this.pos.x > WIDTH)
        this.pos.x = 0;
    if (this.pos.y < 0)
        this.pos.y = HEIGHT;
    if (this.pos.y > HEIGHT)
        this.pos.y = 0;
  }

  getVelocity() {
    const xVelocity = (this.boost + this.speed) * Math.cos(this.dir);
    const yVelocity = (this.boost + this.speed) * Math.sin(this.dir);
    return new Vector2D(xVelocity, yVelocity);
  }
}

module.exports = Agent;