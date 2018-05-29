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

  describe('creating the array of neuron activations', () => {


    test('the neuron activation should be an array of length "brain.size"', () => {
      expect(brain.act).to.be.an('array'); 
      expect(brain.act).to.have.length(brain.size);
    })

    test('the neuron activations should all be set to 0', () => {
      brain.act.forEach(activation => {
        expect(activation).to.equal(0);
      })
    })
  })

  describe('creating the array of synapse weights', () => {
    test('the new function should do the same as the old one', () => {
      const currentWeights = brain.w;
      const currentIndex = brain.ix;
      const  weights = brain.synapseWeights(brain);
      const index = brain.neuronIndex(brain);
      expect(currentWeights).to.deep.equal(weights);
      expect(currentIndex).to.deep.equal(index);
    })
  })

    test('the synapse weights should be an array of length "brain.size"', () => {
      expect(brain.w).to.be.an('array'); 
      expect(brain.w).to.have.length(brain.size);

    })

    test('each element in the synapse array should be an array of length "brain.density"', () => {
      brain.w.forEach(weight => {
        expect(weight).to.be.an('array');
        expect(weight).to.have.length(brain.density);
      })
    })

    test('the neuron index should be an array of length "brain.size"', () => {
      expect(brain.ix).to.be.an('array'); 
      expect(brain.ix).to.have.length(brain.size);
    })

    test('each element in the synapse array should be an array of length "brain.density"', () => {
      brain.ix.forEach(index => {
        expect(index).to.be.an('array');
        expect(index).to.have.length(brain.density);
      })
    })


})