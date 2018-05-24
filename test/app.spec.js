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

describe.skip('when an agent senses food', () => {
  const agent = new Agent();
  const food = app.createFoodPellet();
  const d2 =  Math.sqrt(Math.pow(agent.pos.x-food.pos.x, 2) + Math.pow(agent.pos.y-food.pos.y, 2));
})

function testDistance(pointA, pointB, expectedDistance) {
  const distance = app.getDistance(pointA, pointB);
  expect(distance).to.equal(expectedDistance);
}