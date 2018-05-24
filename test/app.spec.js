const expect = require('chai').expect;

const app = require('../src/index.js')
const Agent = app.Agent;

test('adds 1 + 2 to equal 3', () => {
  expect(2+2).to.equal(4);
});

describe('when creating an Agent', () => {
  test('it should set the default properties', () => {
    const agent = new Agent;

    expect(agent.pos).to.be.an('object');
    expect(agent.dir)
    expect(agent.s1)
    expect(agent.s2)
    expect(agent.brain)
    expect(agent.speed)
    expect(agent.boost)
    expect(agent.health)
    expect(agent.rep)
    expect(agent.selected)
  })
})
