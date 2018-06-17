const expect = require('chai').expect;

const World = require('../src/world.js')

describe('when creating a world', () => {
  test('it should exist', () => {
    const world = new World;
    expect(world).not.to.be.undefined;
    expect(world).to.be.an('object');
  })
})

describe('when updating the world', () => {
  test('it should work', () => {
    // const world = new World
    // world.update();
  })
})
