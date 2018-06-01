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
      expect(brain.neurons).to.be.an('array'); 
      expect(brain.neurons).to.have.length(brain.size);
    })

    test('the neuron activations should all be set to 0', () => {
      brain.neurons.forEach(activation => {
        expect(activation).to.equal(0);
      })
    })
  })

  describe('creating the array of synapse weights', () => {
    test('the synapse weights should be an array of length "brain.size"', () => {
      expect(brain.weights).to.be.an('array'); 
      expect(brain.weights).to.have.length(brain.size);
    })

    test('each element in the synapse array should be an array of length "brain.density"', () => {
      brain.weights.forEach(weight => {
        expect(weight).to.be.an('array');
        expect(weight).to.have.length(brain.density);
      })
    })

    test('each weight should be a number between -1.2 and 1.2', () => {
      brain.weights.forEach(weightGroup => {
        weightGroup.forEach(weight => {
          expect(weight).to.be.a('number');
          expect(weight).to.be.greaterThan(-1.2);
          expect(weight).to.be.lessThan(1.2);
        })
      }) 
    })
  })

  describe('creating the neuron index', () => {
    test('the neuron index should be an array of length "brain.size"', () => {
      expect(brain.index).to.be.an('array'); 
      expect(brain.index).to.have.length(brain.size);
    })

    test('each element in the synapse array should be an array of length "brain.density"', () => {
      brain.index.forEach(index => {
        expect(index).to.be.an('array');
        expect(index).to.have.length(brain.density);
      })
    })
  })

  describe('when mutating a brain', () => {
    describe('when no brain is given to mutate from', () => {
      it('the brain should throw an error', () => {
        const brain = new Brain();
        expect(brain.mutateFrom).to.throw();
        expect(mutateBrainWithParent).not.to.throw();
      })
    })
  })
})

function mutateBrainWithParent() {
  const childBrain = new Brain();
  const parentBrain = new Brain();
  childBrain.mutateFrom(parentBrain);
}