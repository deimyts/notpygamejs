const expect = require('chai').expect;

const app = require('../src/app.js')
const Agent = app.Agent;
const senseFood = app.senseFood;

describe('when creating an Agent', () => {
  test('it should set the default properties', () => {
    const agent = new Agent;

    expect(agent.pos).to.be.an('object');
    expect(agent.dir).to.be.a('number');
    expect(agent.s1).to.equal(0);;
    expect(agent.s2).to.equal(0);
    expect(agent.brain).to.be.an('object');
    expect(agent.speed).to.equal(4);
    expect(agent.boost).to.equal(0);
    expect(agent.health).to.equal(1);
    expect(agent.rep).to.equal(0);
    expect(agent.foodloss).to.equal(0.002);
    expect(agent.selected).to.be.false;
  })
})

describe('when an agent eats a piece of food', () => {
  test('the agent\'s replication counter should increase by the foodgain amount (.5)', () => {
    const agent = new Agent();
    agent.rep = 0.25;
    app.eatFood(agent)
    expect(agent.rep).to.equal(0.75);
    app.eatFood(agent)
    expect(agent.rep).to.equal(1.25);
  });
  test('the agent\'s health should increase by the foodgain amount (.5), up to a max value of 1', () => {
    const agent = new Agent();
    agent.health = 0.25;
    app.eatFood(agent);
    expect(agent.health).to.equal(0.75);
    app.eatFood(agent);
    expect(agent.health).to.equal(1);
  });
});

describe('when computing the position of an agent\'s eyes', () => {
  test('it should be correct', () => {
    const agent = new Agent();
    agent.pos.x = 0;
    agent.pos.y = 0;
    agent.dir = 0;
    // eye.pos.x: 0 + 30 * cos(0 - 0.6)
    // eye.pos.y: 0 + 30 * sin(0 - 0.6)
    const { eye1, eye2 } = app.computeEyePosition(agent);
    expect(eye1.pos.x).to.equal(24.76006844729035);
    expect(eye1.pos.y).to.equal(-16.93927420185106);
    expect(eye2.pos.x).to.equal(24.76006844729035);
    expect(eye2.pos.y).to.equal(16.93927420185106);
  })
})

describe('when an agent senses food', () => {
  const agent = new Agent();
  const food = app.createFoodPellet();
  const distance =  app.getDistance(agent.pos, food.pos);

  describe('when the food is too far away to sense', () => {
  const agent = new Agent();
  const food = app.createFoodPellet();

  agent.pos.x = 0;
  agent.pos.y = 0;
  const distance =  15 * 10; // radius is 15 (for now)
    test('the sense function should return false', () => {
      const result = app.senseFood(distance, agent, food);
      expect(result).to.be.false;
    });
  });

  describe('when the food is close enough to be sensed', () => {
    test('it should calculate the input values correctly', () => {
      const eye = {
        pos: {
          x: 0,
          y: 0
        }
      };
      const food = app.createFoodPellet();
      food.pos.x = 25;
      food.pos.y = 25;

      const result = app.getSenseInput(eye, food);
      expect(result).to.equal(0.2676307142594951);
    })
  })
})

describe('updating an agent\'s health', () => {
  test('it should reduce the health by the foodloss amount', () => {
    const agent = new Agent();
    agent.adjustHealth();
    expect(agent.health).to.equal(1 - 0.002);
  })

  describe('when the agent is boosted', () => {
    test('it should reduce the health by the foodloss amount plus the boost amount', () => {
      const agent = new Agent();
      const boost = 0.5;
      agent.boost = boost;
      agent.adjustHealth();
      expect(agent.health).to.equal(1 - 0.002 - (0.001 * boost));
    })
  })
})