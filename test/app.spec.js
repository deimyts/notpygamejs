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

describe('when calculating the distance from an agent to a food pellet', () => {
  test('it should calculate the distance correctly', () => {
    const agent = new Agent();
    const food = app.createFoodPellet();

    testDistance(agent, food, 0, 0, 0, 0, 0);
    testDistance(agent, food, 0, 0, 2, 0, 2);
  })
})

describe.skip('when an agent senses food', () => {
  const agent = new Agent();
  const food = app.createFoodPellet();
  const d2 =  Math.sqrt(Math.pow(agent.pos.x-food.pos.x, 2) + Math.pow(agent.pos.y-food.pos.y, 2));
})

function testDistance(agent, food, x1, y1, x2, y2, expected) {
  agent.pos.x = x1;
  agent.pos.y = y1;
  food.pos.x = x2;
  food.pos.y = y2;
  const distance = app.getDistanceToFood(agent, food);
  expect(distance).to.equal(expected);
}

function setPostion(obj, x, y) {
  ob
}