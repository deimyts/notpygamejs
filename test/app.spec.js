const expect = require('chai').expect;

const app = require('../src/app.js')

describe('when initializing the app', () => {
  test('it should start without errors', () => {
    expect(app.init).not.to.throw();
  })
})

describe('when updating the world', () => {
  test('it should work', () => {
    app.update();
  })
})

describe('when creating a food pellet', () => {
  test('it should be an object with an x and y position', () => {
    const foodPellet = app.createFoodPellet();
    expect(foodPellet).to.have.property('pos');
    expect(foodPellet.pos.x).to.be.a('number');
    expect(foodPellet.pos.y).to.be.a('number');
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

describe('when spawning agents', () => {
  test('it should add an agent to the agents array', () => {
    const game = app.createGame();
    // const agents = [];
    expect(game.agents).to.have.lengthOf(0);
    game.spawnAgent();
    expect(game.agents).to.have.lengthOf(1);
    game.spawnAgent();
    expect(game.agents).to.have.lengthOf(2);
    game.spawnAgent();
    game.spawnAgent();
    expect(game.agents).to.have.lengthOf(4);
  })
})

describe('when calculating the distance between two points', () => {
  test('it should calculate the distance correctly', () => {
    testDistance({ x: 0, y: 0 }, { x: 0, y: 0 }, 0);
    testDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, 2);
    testDistance({ x: 0, y: 0 }, { x: 0, y: 2 }, 2);
  })
})

describe('when checking if any agent should reproduce', () => {
  describe('when no agents are above the reproduction threshold', () => {
    
    test('the number of agents should remain the same', () => {
        const game = createAgents();
        
        game.handleBirths();
        expect(game.agents.length).to.equal(3);
    })
  })
  
  describe('when one or more agents are above the reproduction threshold', () => {
    
    test('the number of agents should increase by one each time handleBirths() is called', () => {
        const game = createAgents();
        game.agents[0].rep = 3.1;
        game.agents[1].rep = 3.1;
        game.agents[2].rep = 3.1;
        game.handleBirths();
        expect(game.agents.length).to.equal(4);
        game.handleBirths();
        expect(game.agents.length).to.equal(5);
        game.handleBirths();
        expect(game.agents.length).to.equal(6);
        game.handleBirths();
        expect(game.agents.length).to.equal(6);
    })
  })
})

function createAgents() {
  const game = app.createGame();
  game.spawnAgent();
  game.spawnAgent();
  game.spawnAgent();

  return game;
}

function testDistance(pointA, pointB, expectedDistance) {
  const distance = app.getDistance(pointA, pointB);
  expect(distance).to.equal(expectedDistance);
}
