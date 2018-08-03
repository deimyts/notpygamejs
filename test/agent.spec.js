const expect = require('chai').expect;

const app = require('../src/app.js')
const Agent = require('../src/Agent');
const Vector2D = require('../src/include/vector2d');

describe('when creating an Agent', () => {
  test('it should set the default properties', () => {
    const agent = new Agent;

    expect(agent).to.have.property('pos');
    expect(agent).to.have.property('dir');
    expect(agent).to.have.property('s1');
    expect(agent).to.have.property('s2');
    expect(agent).to.have.property('brain');
    expect(agent).to.have.property('speed');
    expect(agent).to.have.property('boost');
    expect(agent).to.have.property('health');
    expect(agent).to.have.property('rep');
    expect(agent).to.have.property('foodloss');
    expect(agent).to.have.property('selected');
  })
})

describe('when an agent eats a piece of food', () => {
  test('the agent\'s replication counter should increase by the foodgain amount (.5)', () => {
    const agent = new Agent();
    agent.rep = 0.25;
    agent.eat()
    expect(agent.rep).to.equal(0.75);
    agent.eat()
    expect(agent.rep).to.equal(1.25);
  });
  test('the agent\'s health should increase by the foodgain amount (.5), up to a max value of 1', () => {
    const agent = new Agent();
    agent.health = 0.25;
    agent.eat();
    expect(agent.health).to.equal(0.75);
    agent.eat();
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
    const { eye1, eye2 } = agent.computeEyePosition();
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
      const result = agent.senseFood(distance, agent, food);
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

      const result = agent.getSenseInput(eye, food);
      expect(result).to.be.closeTo(0.2676307142594951, 0.000000000000001);
    })

    test('it should set the input values', () => {
      const agent = new Agent();
      const food = app.createFoodPellet();

      agent.pos.x = 0;
      agent.pos.y = 0;
      const distance = 15 * 10 - 1; // radius is 15 (for now)

      const result = agent.senseFood(distance, agent, food);
      expect(agent.s1).to.equal(0.3188140758108866);
      expect(agent.s2).to.equal(0.3188140758108866);
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

describe('moving an agent', () => {
  describe('getting an agent\'s velocity', () => {
    describe('if the move function is called without parameters', () => {
      test('it should throw an error', () => {
        const agent = new Agent;
        expect(agent.move.bind(agent)).to.throw();
      })
    })
    describe('when the agent is not moving', () => {
      test('it should have a velocity of 0', () => {
        const speed = 0;
        const direction = 0;
        testVelocity(speed, direction, { x: 0, y: 0 })
      })

      test('it should not change positions', () => {
        const agent = new Agent();
        agent.dir = 0;
        agent.pos = new Vector2D(0, 0);
        agent.move(500, 500);
        expect(agent.pos.x).to.equal(4);
        expect(agent.pos.y).to.equal(0);

      })
    })
    describe('when the agent is moving', () => {
      test('it should calculate the velocity correctly', () => {
        let direction = 0;
        testVelocity(1, direction, { x: 1, y: 0 })
        direction = Math.PI;
        testVelocity(1, direction, { x: -1, y: 1.2246467991473532e-16 })
        direction = Math.PI / 2;
        testVelocity(1, direction, { x: 6.123233995736766e-17, y: 1 })
        direction = Math.PI * 2;
        testVelocity(1, direction, { x: 1, y: -2.4492935982947064e-16 })
      })
    })

    describe('when the agent moves past the an edge', () => {
      test('the agent should move to the other side of the map', () => {
        let startPos = {}
        let expectedPos = {}

        startPos.x = 0;
        startPos.y = -1;
        expectedPos.x = 0;
        expectedPos.y = 100;
        testEdgeWrap(startPos, expectedPos)

        startPos.x = -1;
        startPos.y = 0;
        expectedPos.x = 100;
        expectedPos.y = 0;
        testEdgeWrap(startPos, expectedPos)

        startPos.x = 101;
        startPos.y = 0;
        expectedPos.x = 0;
        expectedPos.y = 0;
        testEdgeWrap(startPos, expectedPos)

        startPos.x = 0;
        startPos.y = 101;
        testEdgeWrap(startPos, expectedPos)
      })
    })
  })
})

function testEdgeWrap(startPosition, expectedPosition) {
  const agent = new Agent();
  const WIDTH = 100;
  const HEIGHT = 100;

  agent.speed = 0;
  agent.pos.x = startPosition.x;
  agent.pos.y = startPosition.y;
  agent.move(100, 100);
  expect(agent.pos.x).to.equal(expectedPosition.x);
  expect(agent.pos.y).to.equal(expectedPosition.y);
}

function testVelocity(speed, direction, expected) {
  const agent = new Agent();
  agent.speed = speed;
  agent.dir = direction;
  const velocity = agent.getVelocity();
  expect(velocity.x).to.equal(expected.x);
  expect(velocity.y).to.equal(expected.y);
}
