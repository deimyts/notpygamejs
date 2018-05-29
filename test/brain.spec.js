const expect = require('chai').expect;

const Brain = require('../src/Brain.js')

describe('an agent\'s brain', () => {
  test('it should exist', () => {
    const brain = new Brain();
    expect(brain).to.not.be.undefined;
    expect(brain).to.be.an('object');
  })
})