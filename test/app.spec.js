const expect = require('chai').expect;

const app = require('../src/app.js')
const Agent = app.Agent;
const senseFood = app.senseFood;

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

describe('when spawning food', () => {
  test('it should add food to the food array', () => {
    const food = [];
    app.spawnFood(food);
    expect(food).to.have.lengthOf(1);
    app.spawnFood(food);
    expect(food).to.have.lengthOf(2);
    app.spawnFood(food);
    app.spawnFood(food);
    expect(food).to.have.lengthOf(4);
  })
})

describe('when calculating the distance between two points', () => {
  test('it should calculate the distance correctly', () => {
    testDistance({ x: 0, y: 0 }, { x: 0, y: 0 }, 0);
    testDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, 2);
    testDistance({ x: 0, y: 0 }, { x: 0, y: 2 }, 2);
  })
})

function testDistance(pointA, pointB, expectedDistance) {
  const distance = app.getDistance(pointA, pointB);
  expect(distance).to.equal(expectedDistance);
}