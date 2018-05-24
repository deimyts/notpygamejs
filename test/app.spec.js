const expect = require('chai').expect;

const app = require('../src/index.js')
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
    expect(agent.selected).to.be.false;
  })
})

describe('when creating a food pellet', () => {
  test('it should be an object with an x and y position', () => {
    const foodPellet = app.createFoodPellet();
    expect(foodPellet).to.have.property('pos');
    expect(foodPellet.pos.x).to.be.a('number');
    expect(foodPellet.pos.x).not.to.be.NaN;
    expect(foodPellet.pos.y).to.be.a('number');
    expect(foodPellet.pos.y).not.to.be.NaN;
  })
})

describe('when calculating the distance between two points', () => {
  test('it should calculate the distance correctly', () => {
    testDistance({ x: 0, y: 0 }, { x: 0, y: 0 }, 0);
    testDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, 2);
    testDistance({ x: 0, y: 0 }, { x: 0, y: 2 }, 2);
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
    // x1: 0 + 30 * cos(0 - 0.6)
    // y1: 0 + 30 * sin(0 - 0.6)
    // y2: 0 + 30 * sin(0 + 0.6)
    // y2: 0 + 30 * sin(0 + 0.6)
    const { x1, y1, x2, y2 } = app.computeEyePosition(agent);
    expect(x1).to.equal(24.76006844729035);
    expect(y1).to.equal(-16.93927420185106);
    expect(x2).to.equal(24.76006844729035);
    expect(y2).to.equal(16.93927420185106);
  })
})

describe.skip('when an agent senses food', () => {
  const agent = new Agent();
  const food = app.createFoodPellet();
  const distance =  app.getDistance(agent.pos, food.pos);
})

function testDistance(pointA, pointB, expectedDistance) {
  const distance = app.getDistance(pointA, pointB);
  expect(distance).to.equal(expectedDistance);
}