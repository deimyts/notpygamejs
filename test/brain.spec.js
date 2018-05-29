const expect = require('chai').expect;

const Brain = require('../src/Brain.js')

describe('an agent\'s brain', () => {
  let brain;

  beforeEach(() => {
    brain = new Brain();
  })

  test('it should exist', () => {
    expect(brain).to.be.an('object');
  })

  test('it should set the default properties', () => {
    expect(brain).to.have.property('size');
    expect(brain).to.have.property('density');
    expect(brain).to.have.property('mutationRate');
    expect(brain).to.have.property('mutationSeverity');
  })
})