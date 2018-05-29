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

}

module.exports = Agent;